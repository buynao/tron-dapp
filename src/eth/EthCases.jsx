import { Button, message } from 'antd';
import { useState } from 'react';
import RequestCopyButton, { CaseRequestScope } from '../RequestCopyButton';
import { getDryRunResponse, recordAppRequest } from '../requestCapture';
import { usePersistentOpenSections } from '../usePersistentOpenSections';

const ADDRESSES = {
  WETH: '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2',
  USDC: '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48',
  PERMIT2: '0x000000000022D473030F116dDEE9F6B43aC78BA3',
  BAYC: '0xBC4CA0EdA7647A8aB7C2061c2E118A18a936f13D',
  RECIPIENT: '0x000000000000000000000000000000000000dEaD',
  SPENDER: '0x1111111254EEB25477B68fb85Ed929f73A960582',
};

const UINT256_MAX =
  '0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff';
const ETH_CONTRACT_CALL_GAS = '0x249f0'; // 150,000
const ETH_CONTRACT_EXECUTION_GAS = ETH_CONTRACT_CALL_GAS;
const ETH_LEGACY_GAS_PRICE = '0x4a817c800'; // 20 gwei
const ETH_SECTION_STORAGE_KEY = 'imtoken.signatureFixtures.ethOpenSections.v1';
const MAINNET_CHAIN_ID = 1;
const DEFAULT_CHAIN_METADATA = {
  chainId: '0x1',
  network: 'Ethereum Mainnet',
  nativeSymbol: 'ETH',
};
const CHAIN_METADATA = {
  '0x1': DEFAULT_CHAIN_METADATA,
  '0xaa36a7': {
    chainId: '0xaa36a7',
    network: 'Ethereum Sepolia',
    nativeSymbol: 'ETH',
  },
  '0xc3': {
    chainId: '0xc3',
    network: 'X Layer Testnet',
    nativeSymbol: 'tOKB',
  },
  '0xc4': {
    chainId: '0xc4',
    network: 'X Layer Mainnet',
    nativeSymbol: 'OKB',
  },
};

const normalizeChainId = (chainId) => {
  if (chainId === null || chainId === undefined || chainId === '') {
    return DEFAULT_CHAIN_METADATA.chainId;
  }
  try {
    return `0x${BigInt(chainId).toString(16)}`;
  } catch (error) {
    return String(chainId).toLowerCase();
  }
};

const getChainMetadata = (chainId) => {
  const normalizedChainId = normalizeChainId(chainId);
  return (
    CHAIN_METADATA[normalizedChainId] || {
      chainId: normalizedChainId,
      network: `EVM chain ${normalizedChainId}`,
      nativeSymbol: DEFAULT_CHAIN_METADATA.nativeSymbol,
    }
  );
};

const formatChainText = (value, chainMetadata) =>
  String(value)
    .replaceAll('{network}', chainMetadata.network)
    .replaceAll('{nativeSymbol}', chainMetadata.nativeSymbol);

const networkRow = { label: 'Network', value: '{network}' };
const previewAction = (title, rows) => ({
  title,
  rows: [networkRow, ...rows],
});

const nativeTransferPreview = (amount) => [
  previewAction('Transfer', [
    { label: 'Asset', value: '{nativeSymbol}' },
    { label: 'Amount', value: amount },
    { label: 'Recipient', value: ADDRESSES.RECIPIENT },
  ]),
];

const usdcTransferPreview = [
  previewAction('Transfer', [
    { label: 'Token', value: 'USDC' },
    { label: 'Token contract', value: ADDRESSES.USDC },
    { label: 'Amount', value: '1 USDC (1,000,000 raw units)' },
    { label: 'Recipient', value: ADDRESSES.RECIPIENT },
  ]),
];

const erc721SafeTransferFallbackPreview = [
  previewAction('Current app fallback', [
    { label: 'Asset', value: '{nativeSymbol}' },
    { label: 'Amount', value: '0 {nativeSymbol}' },
    { label: 'Recipient', value: ADDRESSES.BAYC },
    { label: 'Raw selector', value: '0x42842e0e safeTransferFrom(address,address,uint256)' },
  ]),
];

const usdcApprovePreview = ({ title, method, amount }) => [
  previewAction(title, [
    { label: 'Token', value: 'USDC' },
    { label: 'Token contract', value: ADDRESSES.USDC },
    { label: 'Amount', value: amount },
    { label: 'Spender', value: ADDRESSES.SPENDER },
    { label: 'Method', value: method },
  ]),
];

const contractExecutionPreview = ({ title, contract, method, value }) => [
  previewAction(title, [
    { label: 'Contract', value: contract },
    { label: 'Method', value: method },
    { label: 'Value', value },
  ]),
];

const stripHexPrefix = (value) => String(value).replace(/^0x/i, '');
const padHex = (value) => stripHexPrefix(value).padStart(64, '0');
const encodeAddress = (address) => padHex(address.toLowerCase());
const encodeUint256 = (value) => padHex(value);
const toQuantity = (value) => `0x${BigInt(value).toString(16)}`;

const textToHex = (value) => {
  const bytes = new TextEncoder().encode(value);
  return `0x${Array.from(bytes, (byte) => byte.toString(16).padStart(2, '0')).join('')}`;
};

const encodeERC20Transfer = (to, amountHex) =>
  `0xa9059cbb${encodeAddress(to)}${encodeUint256(amountHex)}`;

const encodeERC20Approve = (spender, amountHex) =>
  `0x095ea7b3${encodeAddress(spender)}${encodeUint256(amountHex)}`;

const encodeERC20IncreaseAllowance = (spender, amountHex) =>
  `0x39509351${encodeAddress(spender)}${encodeUint256(amountHex)}`;

const encodeERC20DecreaseAllowance = (spender, amountHex) =>
  `0xa457c2d7${encodeAddress(spender)}${encodeUint256(amountHex)}`;

const encodeERC721SafeTransferFrom = (from, to, tokenIdHex) =>
  `0x42842e0e${encodeAddress(from)}${encodeAddress(to)}${encodeUint256(tokenIdHex)}`;

const buildTx = (from, overrides) => ({
  from,
  value: '0x0',
  ...overrides,
});

const buildContractCallTx = (from, overrides) =>
  buildTx(from, {
    gas: ETH_CONTRACT_CALL_GAS,
    gasPrice: ETH_LEGACY_GAS_PRICE,
    ...overrides,
  });

const buildContractExecutionTx = buildContractCallTx;

const normalizeError = (error) => ({
  name: error?.name,
  message: error?.message || String(error),
  code: error?.code,
  data: error?.data,
  stack: error?.stack?.split('\n').slice(0, 4).join('\n'),
});

const safeStringify = (value) => {
  try {
    return JSON.stringify(
      value,
      (_, item) => (typeof item === 'bigint' ? item.toString() : item),
      2,
    );
  } catch (e) {
    return String(value);
  }
};

const getEthereumProvider = () =>
  window.ethereum ||
  window.ethereumProvider ||
  window.web3?.currentProvider ||
  window.web3?.givenProvider ||
  window.web3?.eth?.givenProvider;

const callSendAsync = (provider, payload) =>
  new Promise((resolve, reject) => {
    provider.sendAsync(payload, (error, response) => {
      if (error) {
        reject(error);
        return;
      }
      if (response?.error) {
        reject(response.error);
        return;
      }
      resolve(response?.result ?? response);
    });
  });

const withTimeout = (promise, label, timeoutMs = 1500) =>
  new Promise((resolve, reject) => {
    const timer = window.setTimeout(() => {
      reject(new Error(`${label} timeout after ${timeoutMs}ms`));
    }, timeoutMs);

    Promise.resolve(promise)
      .then((result) => {
        window.clearTimeout(timer);
        resolve(result);
      })
      .catch((error) => {
        window.clearTimeout(timer);
        reject(error);
      });
  });

const getProviderChainIdSnapshot = () => {
  const provider = getEthereumProvider();
  return (
    provider?.chainId ||
    provider?.networkVersion ||
    window.web3?.currentProvider?.chainId ||
    window.web3?.version?.network
  );
};

const readProviderChainId = async () => {
  const provider = getEthereumProvider();

  if (provider?.request) {
    try {
      return await withTimeout(
        provider.request({ method: 'eth_chainId' }),
        'eth_chainId metadata',
        800,
      );
    } catch (error) {
      return getProviderChainIdSnapshot();
    }
  }

  if (provider?.sendAsync) {
    try {
      const payload = {
        jsonrpc: '2.0',
        id: Date.now(),
        method: 'eth_chainId',
        params: [],
      };
      return await withTimeout(
        callSendAsync(provider, payload),
        'eth_chainId metadata',
        800,
      );
    } catch (error) {
      return getProviderChainIdSnapshot();
    }
  }

  return getProviderChainIdSnapshot();
};

const getInjectedAddress = () => {
  const provider = getEthereumProvider();
  const web3Accounts = window.web3?.eth?.accounts;

  return (
    provider?.selectedAddress ||
    window.web3?.eth?.defaultAccount ||
    (Array.isArray(web3Accounts) ? web3Accounts[0] : null)
  );
};

const callImTokenBridge = async (method, params, log) => {
  if (!window.imToken?.callPromisifyAPI) {
    throw new Error('No imToken bridge callPromisifyAPI available');
  }

  const apiName = method === 'eth_requestAccounts' ? 'ethereum.enable' : 'ethereum.sendAsync';
  const payload =
    method === 'eth_requestAccounts'
      ? null
      : {
          jsonrpc: '2.0',
          id: Date.now(),
          method,
          params,
        };

  log('info', `bridge ${apiName}`, payload);
  const response = await window.imToken.callPromisifyAPI(apiName, payload);
  log('info', `bridge ${apiName} result`, response);
  return response?.result ?? response;
};

const requestEthereum = async (method, params, log) => {
  const provider = getEthereumProvider();
  const payload = { jsonrpc: '2.0', id: Date.now(), method, params };
  const requestPayload = {
    chain: 'Ethereum',
    transport: 'ethereum.provider',
    method,
    params,
    payload,
  };

  log('info', `request ${method}`, { params });
  recordAppRequest(requestPayload);
  const dryRunResponse = getDryRunResponse(requestPayload);
  if (dryRunResponse.active) {
    return dryRunResponse.response;
  }

  if (provider?.request) {
    const result = await provider.request({ method, params });
    log('info', `request ${method} result`, result);
    return result;
  }

  if (provider?.sendAsync) {
    const result = await callSendAsync(provider, payload);
    log('info', `sendAsync ${method} result`, result);
    return result;
  }

  if (provider?.send) {
    const result = await provider.send(method, params);
    log('info', `send ${method} result`, result);
    return result?.result ?? result;
  }

  return callImTokenBridge(method, params, log);
};

const requestAccount = async (log) => {
  const provider = getEthereumProvider();
  const injectedAddress = getInjectedAddress();
  if (injectedAddress) {
    log('info', 'using injected selected/default account', injectedAddress);
    return { from: injectedAddress };
  }

  const attempts = [
    {
      name: 'eth_accounts',
      run: () => withTimeout(requestEthereum('eth_accounts', [], log), 'eth_accounts'),
    },
    {
      name: 'eth_requestAccounts',
      run: () =>
        withTimeout(
          requestEthereum('eth_requestAccounts', [], log),
          'eth_requestAccounts',
        ),
    },
    {
      name: 'provider.enable',
      run: () => withTimeout(provider?.enable?.(), 'provider.enable'),
    },
    {
      name: 'bridge ethereum.enable',
      run: () =>
        withTimeout(
          callImTokenBridge('eth_requestAccounts', [], log),
          'bridge ethereum.enable',
        ),
    },
  ];

  for (const attempt of attempts) {
    try {
      if (!attempt.run) continue;
      log('info', `account attempt: ${attempt.name}`);
      const accounts = await attempt.run();
      log('info', `account attempt result: ${attempt.name}`, accounts);
      const from = Array.isArray(accounts) ? accounts[0] : accounts;
      if (from) {
        return { from };
      }
    } catch (error) {
      log('error', `account attempt failed: ${attempt.name}`, normalizeError(error));
    }
  }

  const from = getInjectedAddress();
  if (!from) {
    throw new Error('No ETH account available');
  }
  log('info', 'using selected/default account fallback', from);
  return { from };
};

const sendTransaction = async (testCase, log) => {
  const { from } = await requestAccount(log);
  const tx = testCase.buildTx(from);
  log('info', `tx payload for ${testCase.key}`, tx);
  return requestEthereum('eth_sendTransaction', [tx], log);
};

const signPersonalMessage = async (_, log) => {
  const { from } = await requestAccount(log);
  const params = [textToHex('imToken personal_sign plain text test'), from];
  log('info', 'personal_sign payload', params);
  return requestEthereum('personal_sign', params, log);
};

const signEthRawHash = async (_, log) => {
  const { from } = await requestAccount(log);
  const params = [from, '0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef'];
  log('info', 'eth_sign payload', params);
  return requestEthereum('eth_sign', params, log);
};

const signTypedData = async (typedDataBuilder, log) => {
  const { from } = await requestAccount(log);
  const typedData = typedDataBuilder(from);
  const params = [from, JSON.stringify(typedData)];
  log('info', 'eth_signTypedData_v4 payload', typedData);
  return requestEthereum('eth_signTypedData_v4', params, log);
};

const buildGenericTypedData = (from) => ({
  types: {
    EIP712Domain: [
      { name: 'name', type: 'string' },
      { name: 'version', type: 'string' },
      { name: 'chainId', type: 'uint256' },
      { name: 'verifyingContract', type: 'address' },
    ],
    Order: [
      { name: 'maker', type: 'address' },
      { name: 'taker', type: 'address' },
      { name: 'sellToken', type: 'address' },
      { name: 'buyToken', type: 'address' },
      { name: 'sellAmount', type: 'uint256' },
      { name: 'expiry', type: 'uint256' },
    ],
  },
  primaryType: 'Order',
  domain: {
    name: 'imToken SignData Fixture',
    version: '1',
    chainId: MAINNET_CHAIN_ID,
    verifyingContract: ADDRESSES.SPENDER,
  },
  message: {
    maker: from,
    taker: ADDRESSES.RECIPIENT,
    sellToken: ADDRESSES.USDC,
    buyToken: ADDRESSES.WETH,
    sellAmount: '1000000',
    expiry: '4102444800',
  },
});

const buildERC2612PermitTypedData = (from, value = '1000000') => ({
  types: {
    EIP712Domain: [
      { name: 'name', type: 'string' },
      { name: 'version', type: 'string' },
      { name: 'chainId', type: 'uint256' },
      { name: 'verifyingContract', type: 'address' },
    ],
    Permit: [
      { name: 'owner', type: 'address' },
      { name: 'spender', type: 'address' },
      { name: 'value', type: 'uint256' },
      { name: 'nonce', type: 'uint256' },
      { name: 'deadline', type: 'uint256' },
    ],
  },
  primaryType: 'Permit',
  domain: {
    name: 'USD Coin',
    version: '2',
    chainId: MAINNET_CHAIN_ID,
    verifyingContract: ADDRESSES.USDC,
  },
  message: {
    owner: from,
    spender: ADDRESSES.SPENDER,
    value,
    nonce: 0,
    deadline: 4102444800,
  },
});

const buildPermit2SingleTypedData = () => ({
  types: {
    EIP712Domain: [
      { name: 'name', type: 'string' },
      { name: 'chainId', type: 'uint256' },
      { name: 'verifyingContract', type: 'address' },
    ],
    PermitSingle: [
      { name: 'details', type: 'PermitDetails' },
      { name: 'spender', type: 'address' },
      { name: 'sigDeadline', type: 'uint256' },
    ],
    PermitDetails: [
      { name: 'token', type: 'address' },
      { name: 'amount', type: 'uint160' },
      { name: 'expiration', type: 'uint48' },
      { name: 'nonce', type: 'uint48' },
    ],
  },
  primaryType: 'PermitSingle',
  domain: {
    name: 'Permit2',
    chainId: MAINNET_CHAIN_ID,
    verifyingContract: ADDRESSES.PERMIT2,
  },
  message: {
    details: {
      token: ADDRESSES.USDC,
      amount: '1000000',
      expiration: 4102444800,
      nonce: 0,
    },
    spender: ADDRESSES.SPENDER,
    sigDeadline: 4102444800,
  },
});

const buildPermit2BatchTypedData = () => ({
  types: {
    EIP712Domain: [
      { name: 'name', type: 'string' },
      { name: 'chainId', type: 'uint256' },
      { name: 'verifyingContract', type: 'address' },
    ],
    PermitBatch: [
      { name: 'details', type: 'PermitDetails[]' },
      { name: 'spender', type: 'address' },
      { name: 'sigDeadline', type: 'uint256' },
    ],
    PermitDetails: [
      { name: 'token', type: 'address' },
      { name: 'amount', type: 'uint160' },
      { name: 'expiration', type: 'uint48' },
      { name: 'nonce', type: 'uint48' },
    ],
  },
  primaryType: 'PermitBatch',
  domain: {
    name: 'Permit2',
    chainId: MAINNET_CHAIN_ID,
    verifyingContract: ADDRESSES.PERMIT2,
  },
  message: {
    details: [
      {
        token: ADDRESSES.USDC,
        amount: '1000000',
        expiration: 4102444800,
        nonce: 0,
      },
      {
        token: ADDRESSES.WETH,
        amount: '1000000000000000',
        expiration: 4102444800,
        nonce: 0,
      },
    ],
    spender: ADDRESSES.SPENDER,
    sigDeadline: 4102444800,
  },
});

const sections = [
  {
    id: 'eth-transfer',
    title: 'ETH Transfer',
    cases: [
      {
        key: 'transfer-native-eth',
        title: 'Native {nativeSymbol} transfer',
        description: 'Expected: SignCase.Transfer with a native {nativeSymbol} transfer card on {network}; data is empty.',
        expectedPreview: nativeTransferPreview(
          '0.0001 {nativeSymbol} (100,000,000,000,000 wei)',
        ),
        run: sendTransaction,
        buildTx: (from) =>
          buildTx(from, {
            to: ADDRESSES.RECIPIENT,
            value: toQuantity(100000000000000n),
          }),
      },
      {
        key: 'transfer-erc20-usdc',
        title: 'ERC20 USDC transfer',
        description: 'Expected: SignCase.Transfer parsed from transfer(address,uint256).',
        expectedPreview: usdcTransferPreview,
        run: sendTransaction,
        buildTx: (from) =>
          buildContractCallTx(from, {
            to: ADDRESSES.USDC,
            data: encodeERC20Transfer(ADDRESSES.RECIPIENT, '0x0f4240'),
          }),
      },
      {
        key: 'transfer-erc721-safe-transfer',
        title: 'ERC721 safeTransferFrom',
        description: 'Expected: current app falls back to a 0 native transfer to the NFT contract instead of decoding the ERC721 token.',
        expectedPreview: erc721SafeTransferFallbackPreview,
        run: sendTransaction,
        buildTx: (from) =>
          buildContractCallTx(from, {
            to: ADDRESSES.BAYC,
            data: encodeERC721SafeTransferFrom(from, ADDRESSES.RECIPIENT, '0x01'),
          }),
      },
    ],
  },
  {
    id: 'eth-approve',
    title: 'ETH Approve',
    cases: [
      {
        key: 'approve-usdc-finite',
        title: 'ERC20 approve finite',
        description: 'Expected: SignCase.Approve with editable approve amount.',
        expectedPreview: usdcApprovePreview({
          title: 'Approve',
          method: '0x095ea7b3 approve(address,uint256)',
          amount: '1 USDC (1,000,000 raw units)',
        }),
        run: sendTransaction,
        buildTx: (from) =>
          buildContractCallTx(from, {
            to: ADDRESSES.USDC,
            data: encodeERC20Approve(ADDRESSES.SPENDER, '0x0f4240'),
          }),
      },
      {
        key: 'approve-usdc-unlimited',
        title: 'ERC20 approve unlimited',
        description: 'Expected: SignCase.Approve showing unlimited approval amount and risk.',
        expectedPreview: usdcApprovePreview({
          title: 'Approve',
          method: '0x095ea7b3 approve(address,uint256)',
          amount: 'uint256 max (unlimited)',
        }),
        run: sendTransaction,
        buildTx: (from) =>
          buildContractCallTx(from, {
            to: ADDRESSES.USDC,
            data: encodeERC20Approve(ADDRESSES.SPENDER, UINT256_MAX),
          }),
      },
      {
        key: 'approve-usdc-revoke',
        title: 'ERC20 revoke approve',
        description: 'Expected: SignCase.Approve showing revoked approval.',
        expectedPreview: usdcApprovePreview({
          title: 'Approve',
          method: '0x095ea7b3 approve(address,uint256)',
          amount: '0 USDC',
        }),
        run: sendTransaction,
        buildTx: (from) =>
          buildContractCallTx(from, {
            to: ADDRESSES.USDC,
            data: encodeERC20Approve(ADDRESSES.SPENDER, '0x0'),
          }),
      },
      {
        key: 'approve-usdc-increase-allowance',
        title: 'ERC20 increaseAllowance',
        description: 'Expected: SignCase.Approve through the increaseAllowance branch.',
        expectedPreview: usdcApprovePreview({
          title: 'Increase allowance',
          method: '0x39509351 increaseAllowance(address,uint256)',
          amount: '1 USDC (1,000,000 raw units)',
        }),
        run: sendTransaction,
        buildTx: (from) =>
          buildContractCallTx(from, {
            to: ADDRESSES.USDC,
            data: encodeERC20IncreaseAllowance(ADDRESSES.SPENDER, '0x0f4240'),
          }),
      },
      {
        key: 'approve-usdc-decrease-allowance',
        title: 'ERC20 decreaseAllowance',
        description: 'Expected: SignCase.Approve through the decreaseAllowance branch.',
        expectedPreview: usdcApprovePreview({
          title: 'Decrease allowance',
          method: '0xa457c2d7 decreaseAllowance(address,uint256)',
          amount: '1 USDC (1,000,000 raw units)',
        }),
        run: sendTransaction,
        buildTx: (from) =>
          buildContractCallTx(from, {
            to: ADDRESSES.USDC,
            data: encodeERC20DecreaseAllowance(ADDRESSES.SPENDER, '0x0f4240'),
          }),
      },
      {
        key: 'permit-erc2612-usdc',
        title: 'ERC2612 Permit typed data',
        description: 'Expected: eth_signTypedData_v4 recognized as Approve/PermitDetail.',
        expectedPreview: usdcApprovePreview({
          title: 'ERC2612 Permit',
          method: 'eth_signTypedData_v4 Permit',
          amount: '1 USDC (1,000,000 raw units)',
        }),
        run: (_, log) => signTypedData(buildERC2612PermitTypedData, log),
      },
      {
        key: 'permit2-single',
        title: 'Permit2 single typed data',
        description: 'Expected: eth_signTypedData_v4 recognized as Permit2 single approval.',
        expectedPreview: [
          previewAction('Permit2 approve', [
            { label: 'Token', value: 'USDC' },
            { label: 'Token contract', value: ADDRESSES.USDC },
            { label: 'Amount', value: '1 USDC (1,000,000 raw units)' },
            { label: 'Spender', value: ADDRESSES.SPENDER },
            { label: 'Verifying contract', value: ADDRESSES.PERMIT2 },
          ]),
        ],
        run: (_, log) => signTypedData(buildPermit2SingleTypedData, log),
      },
      {
        key: 'permit2-batch',
        title: 'Permit2 batch typed data',
        description: 'Expected: eth_signTypedData_v4 recognized as Permit2 batch approval.',
        expectedPreview: [
          previewAction('Permit2 batch approve', [
            { label: 'Token 1', value: `${ADDRESSES.USDC} / 1 USDC (1,000,000 raw units)` },
            { label: 'Token 2', value: `${ADDRESSES.WETH} / 0.001 WETH (1,000,000,000,000,000 wei)` },
            { label: 'Spender', value: ADDRESSES.SPENDER },
            { label: 'Verifying contract', value: ADDRESSES.PERMIT2 },
          ]),
        ],
        run: (_, log) => signTypedData(buildPermit2BatchTypedData, log),
      },
    ],
  },
  {
    id: 'eth-sign-data',
    title: 'ETH SignData',
    cases: [
      {
        key: 'sign-personal-plain-text',
        title: 'personal_sign plain text',
        description: 'Expected: SignCase.SignData showing plain text signing content.',
        expectedPreview: [
          previewAction('Sign data', [
            { label: 'Method', value: 'personal_sign' },
            { label: 'Payload', value: 'imToken personal_sign plain text test' },
          ]),
        ],
        run: signPersonalMessage,
      },
      {
        key: 'sign-eth-raw-hash',
        title: 'eth_sign raw hash',
        description: 'Expected: SignCase.SignData with the eth_sign warning mask.',
        expectedPreview: [
          previewAction('Sign data', [
            { label: 'Method', value: 'eth_sign' },
            { label: 'Hash', value: '0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef' },
          ]),
        ],
        run: signEthRawHash,
      },
      {
        key: 'sign-typed-data-generic',
        title: 'generic typed data',
        description: 'Expected: SignCase.SignData with Domain and Order shown in JSONView.',
        expectedPreview: [
          previewAction('Typed data', [
            { label: 'Domain', value: 'imToken SignData Fixture' },
            { label: 'Sell token', value: ADDRESSES.USDC },
            { label: 'Sell amount', value: '1 USDC (1,000,000 raw units)' },
            { label: 'Buy token', value: ADDRESSES.WETH },
          ]),
        ],
        run: (_, log) => signTypedData(buildGenericTypedData, log),
      },
    ],
  },
  {
    id: 'eth-contract-execution',
    title: 'ETH ContractExecution',
    cases: [
      {
        key: 'contract-weth-deposit-tokenflow',
        title: 'Known ABI with tokenFlow: WETH deposit',
        description: 'Expected: ContractExecution; deposit() ABI is known and has native -> WETH tokenFlow.',
        expectedPreview: contractExecutionPreview({
          title: 'Contract execution',
          contract: ADDRESSES.WETH,
          method: '0xd0e30db0 deposit()',
          value: '0.001 {nativeSymbol} (1,000,000,000,000,000 wei)',
        }),
        run: sendTransaction,
        buildTx: (from) =>
          buildContractExecutionTx(from, {
            to: ADDRESSES.WETH,
            value: toQuantity(1000000000000000n),
            data: '0xd0e30db0',
          }),
      },
      {
        key: 'contract-weth-withdraw-tokenflow',
        title: 'Known ABI with tokenFlow: WETH withdraw',
        description: 'Expected: ContractExecution; withdraw(uint256) ABI is known and has WETH -> native tokenFlow.',
        expectedPreview: contractExecutionPreview({
          title: 'Contract execution',
          contract: ADDRESSES.WETH,
          method: '0x2e1a7d4d withdraw(uint256)',
          value: '0 {nativeSymbol}',
        }),
        run: sendTransaction,
        buildTx: (from) =>
          buildContractExecutionTx(from, {
            to: ADDRESSES.WETH,
            data: `0x2e1a7d4d${encodeUint256('0x38d7ea4c68000')}`,
          }),
      },
      {
        key: 'contract-known-abi-no-tokenflow',
        title: 'Known ABI no tokenFlow',
        description: 'Expected: ContractExecution; totalSupply() uses ABI/JSON display and View raw data entry.',
        expectedPreview: contractExecutionPreview({
          title: 'Contract execution',
          contract: ADDRESSES.WETH,
          method: '0x18160ddd totalSupply()',
          value: '0 {nativeSymbol}',
        }),
        run: sendTransaction,
        buildTx: (from) =>
          buildContractExecutionTx(from, {
            to: ADDRESSES.WETH,
            data: '0x18160ddd',
          }),
      },
      {
        key: 'contract-unknown-selector-with-value',
        title: 'Unknown selector + value',
        description: 'Expected: unresolved mask; expanded view shows native value plus raw data.',
        expectedPreview: contractExecutionPreview({
          title: 'Unknown contract execution',
          contract: ADDRESSES.WETH,
          method: '0x12345678',
          value: '0.0001 {nativeSymbol} (100,000,000,000,000 wei)',
        }),
        run: sendTransaction,
        buildTx: (from) =>
          buildContractExecutionTx(from, {
            to: ADDRESSES.WETH,
            value: toQuantity(100000000000000n),
            data: '0x12345678',
          }),
      },
      {
        key: 'contract-unknown-selector-raw-only',
        title: 'Unknown selector raw only',
        description: 'Expected: unresolved mask; expanded view shows raw data only without tokenFlow/native value.',
        expectedPreview: contractExecutionPreview({
          title: 'Unknown contract execution',
          contract: ADDRESSES.WETH,
          method: '0x12345678',
          value: '0 {nativeSymbol}',
        }),
        run: sendTransaction,
        buildTx: (from) =>
          buildContractExecutionTx(from, {
            to: ADDRESSES.WETH,
            data: '0x12345678',
          }),
      },
      {
        key: 'contract-unknown-short-raw',
        title: 'Unknown short raw data',
        description: 'Expected: validates that ETH raw fallback handles short raw data.',
        expectedPreview: contractExecutionPreview({
          title: 'Unknown contract execution',
          contract: ADDRESSES.WETH,
          method: '0x12 short raw data',
          value: '0 {nativeSymbol}',
        }),
        run: sendTransaction,
        buildTx: (from) =>
          buildContractExecutionTx(from, {
            to: ADDRESSES.WETH,
            data: '0x12',
          }),
      },
    ],
  },
];

function ExpectedPreview({ chainMetadata, groups, title }) {
  if (!groups?.length) {
    return null;
  }

  const formattedTitle = formatChainText(title, chainMetadata);

  return (
    <section className="expected-preview" aria-label={`${formattedTitle} expected preview fields`}>
      <div className="expected-preview-heading">
        <span>Pre-sign check</span>
      </div>
      <div className="expected-preview-actions">
        {groups.map((group) => (
          <div className="expected-preview-action" key={group.title}>
            <h4>{formatChainText(group.title, chainMetadata)}</h4>
            <dl>
              {group.rows.map((row) => (
                <div key={`${group.title}-${row.label}`}>
                  <dt>{row.label}</dt>
                  <dd>{formatChainText(row.value, chainMetadata)}</dd>
                </div>
              ))}
            </dl>
          </div>
        ))}
      </div>
    </section>
  );
}

function EthCases() {
  const [loadingKey, setLoadingKey] = useState('');
  const [resultMap, setResultMap] = useState({});
  const [chainMetadata, setChainMetadata] = useState(() =>
    getChainMetadata(getProviderChainIdSnapshot()),
  );
  const { isSectionOpen, setSectionOpen } = usePersistentOpenSections(
    ETH_SECTION_STORAGE_KEY,
  );

  const appendLog = (level, messageText, payload = null) => {
    const consoleMethod = level === 'error' ? 'error' : level === 'warn' ? 'warn' : 'log';
    console[consoleMethod]('[ETH fixture]', messageText, payload);
  };

  const applyChainMetadata = (chainId) => {
    const nextMetadata = getChainMetadata(chainId);
    setChainMetadata((prev) =>
      prev.chainId === nextMetadata.chainId &&
      prev.network === nextMetadata.network &&
      prev.nativeSymbol === nextMetadata.nativeSymbol
        ? prev
        : nextMetadata,
    );
    return nextMetadata;
  };

  const refreshChainMetadata = async () => {
    const chainId = await readProviderChainId();
    return applyChainMetadata(chainId);
  };

  const runCase = async (testCase) => {
    try {
      message.info('Starting ETH case...');
      setLoadingKey(testCase.key);
      const runtimeChainMetadata = await refreshChainMetadata();
      appendLog('info', `start case: ${testCase.key}`, {
        title: formatChainText(testCase.title, runtimeChainMetadata),
        description: formatChainText(testCase.description, runtimeChainMetadata),
        chainMetadata: runtimeChainMetadata,
      });
      const result = await testCase.run(testCase, appendLog);
      appendLog('info', `case result: ${testCase.key}`, result);
      setResultMap((prev) => ({ ...prev, [testCase.key]: result }));
    } catch (e) {
      console.warn(e);
      appendLog('error', `case failed: ${testCase.key}`, normalizeError(e));
      setResultMap((prev) => ({ ...prev, [testCase.key]: e.message }));
    } finally {
      setLoadingKey('');
    }
  };

  return (
    <div className="eth-cases">
      <h3 className="eth-cases-title">ETH signing cases</h3>
      <p className="eth-cases-note">
        Mainnet-address fixtures covering token-v2 Transfer, Approve, SignData, and ContractExecution branches.
      </p>
      {sections.map((section) => (
        <details
          className="eth-case-section"
          key={section.title}
          onToggle={(event) => setSectionOpen(section.id, event.currentTarget.open)}
          open={isSectionOpen(section.id)}
        >
          <summary className="case-section-toggle eth-case-section-heading">
            <h4>{section.title}</h4>
            <span className="case-section-count">{section.cases.length} cases</span>
            <span className="case-section-toggle-icon" aria-hidden="true">v</span>
          </summary>
          <div className="eth-case-grid">
            {section.cases.map((testCase) => {
              const hasResult = Object.prototype.hasOwnProperty.call(
                resultMap,
                testCase.key,
              );

              return (
                <article className="eth-case-card" key={testCase.key}>
                  <div className="eth-case-header">
                    <div>
                      <h5>{formatChainText(testCase.title, chainMetadata)}</h5>
                    </div>
                  </div>
                  <ExpectedPreview
                    chainMetadata={chainMetadata}
                    groups={testCase.expectedPreview}
                    title={formatChainText(testCase.title, chainMetadata)}
                  />
                  <div className="eth-case-action">
                    <div className="case-action-heading">
                      <span>Sign action</span>
                    </div>
                    <div className="eth-case-action-controls">
                      <RequestCopyButton
                        caseKey={`ethereum:${testCase.key}`}
                        caseTitle={formatChainText(testCase.title, chainMetadata)}
                      />
                      <CaseRequestScope
                        caseKey={`ethereum:${testCase.key}`}
                        chain="Ethereum"
                        title={formatChainText(testCase.title, chainMetadata)}
                      >
                        <Button
                          loading={loadingKey === testCase.key}
                          onClick={() => runCase(testCase)}
                          type="primary"
                        >
                          {loadingKey === testCase.key ? 'Signing...' : 'Start signing'}
                        </Button>
                      </CaseRequestScope>
                    </div>
                    {hasResult && (
                      <pre className="eth-case-result">
                        {safeStringify(resultMap[testCase.key])}
                      </pre>
                    )}
                  </div>
                </article>
              );
            })}
          </div>
        </details>
      ))}
    </div>
  );
}

export default EthCases;

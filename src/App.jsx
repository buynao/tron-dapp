import eruda from 'eruda';
import { useCallback, useEffect, useState } from 'react';
import './App.css';
import EthCases from './eth/EthCases';
import RequestCopyButton, { CaseRequestScope } from './RequestCopyButton';
import { usePersistentOpenSections } from './usePersistentOpenSections';
// tron
import SendTrx from './tron/SendTrx';
import SendAsset from './tron/SendAsset';
import SendToken from './tron/SendToken';
import SignMessage from './tron/signMessage';
import SignMessageV2 from './tron/signMessageV2';
import SignTypedData from './tron/SignTypedData';
import MultiSign from './tron/muiltSign';
import MultiAction from './tron/MultiAction';
import MultiActionDecreaseApprove from './tron/MultiActionDecreaseApprove';
import MultiActionIncreaseApprove from './tron/MultiActionIncreaseApprove';
import MultiActionSmartContract from './tron/MultiActionSmartContract';
import MultiActionTrxUnfreeze from './tron/MultiActionTrxUnfreeze';
import MultiActionApproveTrx from './tron/MultiActionApproveTrx';
import MultiActionTokenUnfreeze from './tron/MultiActionTokenUnfreeze';
import MultiActionApproveEOA from './tron/MultiActionApproveEOA';
import MultiActionApproveContractUnknown from './tron/MultiActionApproveContractUnknown';
import TronAction from './tron/TronAction';
import TriggerSmartContract from './tron/TriggerSmartContract';
import Approve from './tron/Approve';
import FreezeBalance from './tron/FreezeBalance';
import FreezeBalanceV2 from './tron/FreezeBalanceV2';
import UnFreezeBalanceV2 from './tron/UnFreezeBalanceV2';
import UpdateAccountPermissions from './tron/UpdateAccountPermissions';
import SendNFT from './tron/SendNFT';
import ApproveUnimite from './tron/ApproveUnimite';
import ApproveRevoke from './tron/ApproveRevoke';
import DecreaseApprove from './tron/DecreaseApprove';
import IncreaseApprove from './tron/IncreaseApprove';
import MultiActionFreezeToken from './tron/MultiActionFreezeToken';
import MultiActionUnfreeze from './tron/MultiActionUnfreeze';
import MultiActionNormalABI from './tron/MultiActionNormalABI';
import MultiActionABITransfer from './tron/MultiActionABITransfer';
import MultiActionABIABI from './tron/MultiActionABIABI';
// cosmos
import Withdraw from './cosmos/Withdraw';
import Delegate from './cosmos/Delegate';
import ReinvestRewards from './cosmos/ReinvestRewards';
import Vote from './cosmos/Vote';
import UnDelegate from './cosmos/UnDelegate';
import Send from './cosmos/Send';
import Redelegate from './cosmos/Redelegate';
import CreateDeposit from './cosmos/CreateDeposit';
import CreateProposal from './cosmos/CreateProposal';
// tezos
import TezosDelegate from './tezos/Delegate';
import TezosUnDelegate from './tezos/UnDelegate';
// polkadot
import PolkadotSign from './polkadot/Sign';
import PolkadotSignRaw from './polkadot/SignRaw';
import PolkadotNominate from './polkadot/Nominate';
import PBond from './polkadot/Bond';
import PUnbond from './polkadot/UnBond';
import ExtraBond from './polkadot/ExtraBond';
import BatchBondNominate from './polkadot/BatchBondNominate';
import WithdrawUnbond from './polkadot/WithdrawUnbond';
import PayoutRewards from './polkadot/PayoutRewards';
import Second from './polkadot/Second';
import DemocracyVote from './polkadot/DemocracyVote';
import CouncilVote from './polkadot/CouncilVote';
// nervos
import NervosTransfer from './nervos/Transfer';
import NervosTransferNFT from './nervos/TransferNFT';
// bitcoin
import BTCTransfer from './bitcoin/Transfer';
// eos
import EOSVote from './eos/Vote';
import Powerup from './eos/Powerup';
import EOSSignMessage from './eos/SignMessage';
import EOSTransfer from './eos/Transfer';

const disabled = true;
const SIGNATURE_SECTION_STORAGE_KEY = 'imtoken.signatureFixtures.openSections.v1';
const ACCOUNT_SNAPSHOT_STORAGE_KEY = 'imtoken.signatureFixtures.accountSnapshot.v1';
const EMPTY_ACCOUNT_SNAPSHOT = {
  ethereum: '',
  tron: '',
  updatedAt: 0,
};

const CHAIN_MENU_ITEMS = [
  { id: 'ethereum', title: 'Ethereum' },
  { id: 'tron', title: 'Tron' },
  { id: 'cosmos', title: 'Cosmos' },
  { id: 'tezos', title: 'Tezos' },
  { id: 'polkadot', title: 'Polkadot' },
  { id: 'nervos', title: 'Nervos' },
  { id: 'bitcoin', title: 'Bitcoin' },
  { id: 'eos', title: 'EOS' },
];

const TRON_PREVIEW_FIXTURES = {
  staticOwner: 'TQ9HCtbF4w42BNhj4Cs4k2XENSGw6ryqRw',
  staticOwnerHex: '419b796e0e2412e4f0cabd922fb3ef9f8e99f5ad80',
  recipient: 'TNPeeaaFB7K9cmo4uQpcU32zGK8G1NYqeL',
  singleOwner: 'TNPeeaaFB7K9cmo4uQpcU32zGK8G1NYqeL',
  singleRecipient: 'TVDGpn4hCSzJ5nkHPLetk8KQBtwaTppnkr',
  trc10Owner: 'TNPeeaaFB7K9cmo4uQpcU32zGK8G1NYqeL',
  trc10Recipient: 'TVDGpn4hCSzJ5nkHPLetk8KQBtwaTppnkr',
  trc10Token: 'TRC10 #1002000',
  trc10TokenName: 'BitTorrent Old',
  trc10TokenSymbol: 'BTTOLD',
  trc10TokenId: '1002000',
  usdtToken: 'USDT (TRC20)',
  usdtTokenName: 'Tether USD',
  usdtSymbol: 'USDT',
  usdtContract: 'TR7NHqjeKQxGTCi8q8ZY4pL8otSzgjLj6t',
  usdtContractHex: '41a614f803b6fd780986a42c78ec9c7f77e6ded13c',
  sunSwapRouterName: 'SunSwap V2 Router',
  sunSwapRouter: 'TKzxdSv2FZKQrEqkKVgp5DcwEXBEKMg2Ax',
  sunSwapRouterHex: '416e0617948fe030a7e4970f8389d4ad295f249b7e',
  eoaSpender: 'TZ5VUwCDAUrF2Bp573R1u89SQ4bj5nk7Kw',
  unknownContract: '413c9e0ac33f138216c50638d71c344a299d0d1030',
  abiContract: '41ff7155b5df8008fbf3834922b2d52430b27874f5',
};

const tronTokenContractDisplay = (address, hex) => `${address} / ${hex}`;
const tronNamedAddressDisplay = (name, address, hex) => `${name} / ${address} / ${hex}`;

const previewAction = (title, rows) => ({ title, rows });

const readCachedAccountSnapshot = () => {
  if (typeof window === 'undefined') {
    return EMPTY_ACCOUNT_SNAPSHOT;
  }

  try {
    const cached = window.localStorage.getItem(ACCOUNT_SNAPSHOT_STORAGE_KEY);
    return cached ? { ...EMPTY_ACCOUNT_SNAPSHOT, ...JSON.parse(cached) } : EMPTY_ACCOUNT_SNAPSHOT;
  } catch (error) {
    return EMPTY_ACCOUNT_SNAPSHOT;
  }
};

const writeCachedAccountSnapshot = (snapshot) => {
  if (typeof window === 'undefined') {
    return;
  }

  try {
    window.localStorage.setItem(ACCOUNT_SNAPSHOT_STORAGE_KEY, JSON.stringify(snapshot));
  } catch (error) {
    // The account summary is still useful without persistent storage.
  }
};

const getEthereumProvider = () =>
  window.ethereum ||
  window.ethereumProvider ||
  window.web3?.currentProvider ||
  window.web3?.givenProvider ||
  window.web3?.eth?.givenProvider;

const readCurrentEthereumAccount = async () => {
  const provider = getEthereumProvider();
  const web3Accounts = window.web3?.eth?.accounts;
  const injectedAccount =
    provider?.selectedAddress ||
    window.web3?.eth?.defaultAccount ||
    (Array.isArray(web3Accounts) ? web3Accounts[0] : '');

  if (injectedAccount) {
    return injectedAccount;
  }

  if (!provider?.request) {
    return '';
  }

  try {
    const accounts = await provider.request({ method: 'eth_accounts' });
    return Array.isArray(accounts) ? accounts[0] || '' : '';
  } catch (error) {
    return '';
  }
};

const readCurrentTronAccount = () =>
  window.tronWeb?.defaultAddress?.base58 ||
  window.tronLink?.tronWeb?.defaultAddress?.base58 ||
  window.tronWeb?.defaultAddress?.hex ||
  window.tronLink?.tronWeb?.defaultAddress?.hex ||
  '';

const readCurrentAccountSnapshot = async () => ({
  ethereum: await readCurrentEthereumAccount(),
  tron: readCurrentTronAccount(),
  updatedAt: Date.now(),
});

const ACCOUNT_LABELS = {
  ethereum: 'Ethereum',
  tron: 'Tron',
};

const getConnectedAccountRows = (accountSnapshot) =>
  Object.entries(ACCOUNT_LABELS)
    .map(([key, label]) => ({ key, label, address: accountSnapshot[key] }))
    .filter(({ address }) => Boolean(address));

const formatShortAddress = (value) => {
  return value.length > 18 ? `${value.slice(0, 8)}...${value.slice(-6)}` : value;
};

const TRON_SELECTOR_METHODS = {
  cef95229: {
    method:
      'swapExactInput(address[],string[],uint256[],uint24[],(uint256,uint256,address,uint256))',
    source: '4byte.directory',
  },
  '7ff36ab5': {
    method: 'swapExactETHForTokens(uint256,address[],address,uint256)',
    source: '4byte.directory',
  },
  e8e33700: {
    method:
      'addLiquidity(address,address,uint256,uint256,uint256,uint256,address,uint256)',
    source: '4byte.directory',
  },
};

const selectorMethodRows = (selector) => {
  const normalizedSelector = selector.toLowerCase();
  const matchedMethod = TRON_SELECTOR_METHODS[normalizedSelector];

  if (matchedMethod) {
    return [
      { label: 'Method', value: matchedMethod.method },
      { label: 'Selector', value: `0x${normalizedSelector}` },
    ];
  }

  return [
    { label: 'Unknown selector', value: `0x${normalizedSelector}` },
  ];
};

const approvePreview = ({
  title = 'Approve',
  method = 'approve(address,uint256)',
  token = TRON_PREVIEW_FIXTURES.usdtToken,
  tokenName = TRON_PREVIEW_FIXTURES.usdtTokenName,
  symbol = TRON_PREVIEW_FIXTURES.usdtSymbol,
  contract = tronTokenContractDisplay(
    TRON_PREVIEW_FIXTURES.usdtContract,
    TRON_PREVIEW_FIXTURES.usdtContractHex,
  ),
  amount,
  spender = tronNamedAddressDisplay(
    TRON_PREVIEW_FIXTURES.sunSwapRouterName,
    TRON_PREVIEW_FIXTURES.sunSwapRouter,
    TRON_PREVIEW_FIXTURES.sunSwapRouterHex,
  ),
}) => [
  previewAction(title, [
    { label: 'Method', value: method },
    { label: 'Token', value: token },
    { label: 'Token name', value: tokenName },
    { label: 'Symbol', value: symbol },
    { label: 'Token contract', value: contract },
    { label: 'Amount', value: amount },
    { label: 'Spender', value: spender },
  ]),
];

const usdtApproveAction = ({ title = 'Action 1', method = 'approve(address,uint256)', amount, spender }) =>
  approvePreview({
    title,
    method,
    amount,
    spender,
  })[0];

const trxTransferAction = ({
  title = 'Transfer',
  amount,
  recipient = TRON_PREVIEW_FIXTURES.recipient,
}) =>
  previewAction(title, [
    { label: 'Asset', value: 'TRX' },
    { label: 'Amount', value: amount },
    { label: 'Recipient', value: recipient },
  ]);

const trc10TransferAction = ({
  title = 'Transfer',
  amount,
  recipient = TRON_PREVIEW_FIXTURES.trc10Recipient,
}) =>
  previewAction(title, [
    { label: 'Asset', value: TRON_PREVIEW_FIXTURES.trc10Token },
    { label: 'Token name', value: TRON_PREVIEW_FIXTURES.trc10TokenName },
    { label: 'Symbol', value: TRON_PREVIEW_FIXTURES.trc10TokenSymbol },
    { label: 'Token ID', value: TRON_PREVIEW_FIXTURES.trc10TokenId },
    { label: 'Amount', value: amount },
    { label: 'Recipient', value: recipient },
  ]);

const usdtTransferAction = ({ title = 'Transfer', amount }) =>
  previewAction(title, [
    { label: 'Method', value: 'transfer(address,uint256)' },
    { label: 'Token', value: TRON_PREVIEW_FIXTURES.usdtToken },
    { label: 'Token name', value: TRON_PREVIEW_FIXTURES.usdtTokenName },
    { label: 'Symbol', value: TRON_PREVIEW_FIXTURES.usdtSymbol },
    { label: 'Token contract', value: TRON_PREVIEW_FIXTURES.usdtContract },
    { label: 'Amount', value: amount },
    { label: 'Recipient', value: TRON_PREVIEW_FIXTURES.recipient },
  ]);

const freezeAction = ({ title = 'Freeze', amount, resource = 'BANDWIDTH' }) =>
  previewAction(title, [
    { label: 'Amount', value: amount },
    { label: 'Resource', value: resource },
  ]);

const unfreezeAction = ({ title = 'Unfreeze', amount = '1 TRX (1,000,000 sun)' }) =>
  previewAction(title, [
    { label: 'Amount', value: amount },
  ]);

const unknownContractAction = ({
  title = 'Contract execution',
  selector = 'cef95229',
  callValue = '32.314887 TRX (32,314,887 sun)',
}) =>
  previewAction(title, [
    ...selectorMethodRows(selector),
    { label: 'Contract', value: TRON_PREVIEW_FIXTURES.unknownContract },
    { label: 'Call value', value: callValue },
  ]);

const abiContractAction = ({ title, selector, contract, callValue }) =>
  previewAction(title, [
    ...selectorMethodRows(selector),
    { label: 'Contract', value: contract },
    { label: 'Call value', value: callValue },
  ]);

const APPROVE_PREVIEW = approvePreview({
  amount: '1,234,567,890 raw units',
});

const APPROVE_UNLIMITED_PREVIEW = approvePreview({
  amount: 'uint256 max (unlimited)',
});

const APPROVE_REVOKE_PREVIEW = approvePreview({
  amount: '0 raw units',
});

const INCREASE_APPROVE_PREVIEW = approvePreview({
  title: 'Increase approval',
  method: 'increaseApproval(address,uint256)',
  amount: '12 raw units',
});

const DECREASE_APPROVE_PREVIEW = approvePreview({
  title: 'Decrease approval',
  method: 'decreaseApproval(address,uint256)',
  amount: '123,456 raw units',
});

const USDT_100_APPROVE_ACTION = usdtApproveAction({
  amount: '100 USDT (100,000,000 raw units)',
});

const USDT_200_APPROVE_ACTION = usdtApproveAction({
  amount: '200 USDT (200,000,000 raw units)',
});

const USDT_50_DECREASE_ACTION = usdtApproveAction({
  method: 'decreaseApproval(address,uint256)',
  amount: '50 USDT (50,000,000 raw units)',
});

const TRON_CASE_GROUPS = [
  {
    id: 'message',
    title: 'Message signing',
    description: 'Covers the current app Tron message signing branch.',
    cases: [
      {
        title: 'SignMessage V1',
        Component: SignMessage,
        note: 'String payload uses formatTronTransaction(..., isHex=true); the header is produced by useTronHeader.',
      },
      {
        title: 'SignMessage V2',
        Component: SignMessageV2,
        note: 'formatTronSignMessageV2 encodes content with signParams.version = 2.',
      },
      {
        title: 'TIP-712 SignTypedData',
        Component: SignTypedData,
        note: 'signMethod = tron_signTypedData，header = TRON，signParams.version = 3。',
      },
    ],
  },
  {
    id: 'transfer',
    title: 'Transfers and assets',
    description: 'These cases build transactions through transactionBuilder before entering tron.signTransaction.',
    cases: [
      {
        title: 'TRX transfer',
        Component: SendTrx,
        note: 'TransferContract is classified as TRANSFER_TRX by getActionType.',
        expectedPreview: [
          trxTransferAction({
            amount: '0.0001 TRX (100 sun)',
            recipient: TRON_PREVIEW_FIXTURES.singleRecipient,
          }),
        ],
      },
      {
        title: 'TRC10 transfer',
        Component: SendAsset,
        note: 'TransferAssetContract is classified as TRANSFER_TRC10.',
        expectedPreview: [
          trc10TransferAction({
            amount: '100 raw units',
          }),
        ],
      },
      {
        title: 'TRC10 SendToken',
        Component: SendToken,
        note: 'The legacy SendToken name is kept; the app handles it as TransferAssetContract.',
        expectedPreview: [
          trc10TransferAction({
            amount: '100 raw units',
          }),
        ],
      },
      {
        title: 'NFT TransferFrom',
        Component: SendNFT,
        status: 'disabled',
        note: 'The button is currently disabled; triggerSmartContract + trx.sign would classify transferFrom as TRANSFER_FROM.',
        expectedPreview: [
          previewAction('Disabled transferFrom fixture', [
            { label: 'Method', value: 'transferFrom(address,address,uint256)' },
            { label: 'Status', value: 'disabled; no signing request is sent' },
          ]),
        ],
      },
    ],
  },
  {
    id: 'approve',
    title: 'Approvals',
    defaultCollapsed: true,
    description: 'approve / allowance selectors are routed to TronApprove by the current app.',
    cases: [
      {
        title: 'Approve fixed amount',
        Component: Approve,
        note: 'Selector 095ea7b3; spender and value are decoded by ApproveDetail.',
        expectedPreview: APPROVE_PREVIEW,
      },
      {
        title: 'Approve unlimited amount',
        Component: ApproveUnimite,
        note: 'Same approve selector with uint256 max as value.',
        expectedPreview: APPROVE_UNLIMITED_PREVIEW,
      },
      {
        title: 'Approve Revoke',
        Component: ApproveRevoke,
        note: 'approve value = 0 revokes the allowance.',
        expectedPreview: APPROVE_REVOKE_PREVIEW,
      },
      {
        title: 'IncreaseApprove',
        Component: IncreaseApprove,
        note: 'increaseAllowance / increaseApproval selectors hit the approval branch.',
        expectedPreview: INCREASE_APPROVE_PREVIEW,
      },
      {
        title: 'DecreaseApprove',
        Component: DecreaseApprove,
        note: 'decreaseAllowance / decreaseApproval selectors hit the approval branch.',
        expectedPreview: DECREASE_APPROVE_PREVIEW,
      },
    ],
  },
  {
    id: 'contract',
    title: 'Contract execution and permissions',
    description: 'Single-contract non-transfer/non-approval cases fall back to ContractExecution or legacy PreviewTronAction.',
    cases: [
      {
        title: 'swapExactInput TriggerSmartContract',
        Component: TriggerSmartContract,
        note: 'TriggerSmartContract data selector 0xcef95229 resolves to swapExactInput.',
        expectedPreview: [
          unknownContractAction({
            title: 'Contract execution',
          }),
        ],
      },
      {
        title: 'TronAction debug transaction',
        Component: TronAction,
        note: 'This case mutates raw_data display fields to validate preview tolerance for abnormal payloads.',
        expectedPreview: [
          previewAction('Debug payload', [
            { label: 'Base action', value: 'approve(address,uint256)' },
            { label: 'Token', value: TRON_PREVIEW_FIXTURES.usdtToken },
            { label: 'Amount', value: '100 USDT (100,000,000 raw units)' },
            { label: 'Mutation', value: 'contract[1].type/data/raw_data_hex are intentionally overwritten' },
          ]),
        ],
      },
      {
        title: 'UpdateAccountPermissions',
        Component: UpdateAccountPermissions,
        note: 'AccountPermissionUpdateContract is routed to the account permission update preview.',
        expectedPreview: [
          previewAction('Account permission update', [
            { label: 'Action', value: 'Account permission update' },
          ]),
        ],
      },
      {
        title: 'FreezeBalance',
        Component: FreezeBalance,
        note: 'Legacy staking contract types use the generic preview when not whitelisted as transfer/approve/contract execution.',
        expectedPreview: [
          freezeAction({
            title: 'Freeze legacy',
            amount: '1 TRX (1,000,000 sun)',
            resource: 'ENERGY',
          }),
        ],
      },
      {
        title: 'FreezeBalanceV2',
        Component: FreezeBalanceV2,
        note: 'V2 resource staking transaction for validating the generic Tron action preview.',
        expectedPreview: [
          freezeAction({
            title: 'Freeze V2',
            amount: '1 TRX (1,000,000 sun)',
          }),
        ],
      },
      {
        title: 'UnFreezeBalanceV2',
        Component: UnFreezeBalanceV2,
        note: 'V2 resource unfreeze transaction for validating the generic Tron action preview.',
        expectedPreview: [
          unfreezeAction({
            title: 'Unfreeze V2',
          }),
        ],
      },
      {
        title: 'MultiSign',
        Component: MultiSign,
        status: 'gap',
        note: 'multiSign currently does not trigger a signing request.',
        expectedPreview: [
          previewAction('Not covered', [
            { label: 'Reason', value: 'multiSign is not bridged by current injected provider' },
          ]),
        ],
      },
    ],
  },
  {
    id: 'multi',
    title: 'Multi-contract',
    description: 'When raw_data.contract.length > 1, the current app routes into TronMultiContract.',
    cases: [
      {
        title: 'Transfer + Approve',
        Component: MultiAction,
        note: 'Basic combination with one transfer contract and one approval contract.',
        expectedPreview: [
          USDT_100_APPROVE_ACTION,
          trc10TransferAction({
            title: 'Action 2',
            amount: '100 raw units',
            recipient: TRON_PREVIEW_FIXTURES.recipient,
          }),
        ],
      },
      {
        title: 'Freeze + Transfer',
        Component: MultiActionUnfreeze,
        note: 'Validates mixed staking contract and transfer display.',
        expectedPreview: [
          usdtTransferAction({
            title: 'Action 1',
            amount: '1 USDT (1,000,000 raw units)',
          }),
          freezeAction({
            title: 'Action 2',
            amount: '1 TRX (1,000,000 sun)',
          }),
        ],
      },
      {
        title: 'Freeze + SendToken',
        Component: MultiActionFreezeToken,
        note: 'Combination of staking and TRC10 transfer.',
        expectedPreview: [
          freezeAction({
            title: 'Action 1',
            amount: '200 TRX (200,000,000 sun)',
          }),
          trc10TransferAction({
            title: 'Action 2',
            amount: '1 raw unit',
            recipient: TRON_PREVIEW_FIXTURES.trc10Recipient,
          }),
        ],
      },
      {
        title: 'DecreaseApprove + SendToken',
        Component: MultiActionDecreaseApprove,
        note: 'Combination of approval change and transfer.',
        expectedPreview: [
          USDT_50_DECREASE_ACTION,
          trc10TransferAction({
            title: 'Action 2',
            amount: '100 raw units',
            recipient: TRON_PREVIEW_FIXTURES.recipient,
          }),
        ],
      },
      {
        title: 'IncreaseApprove + swapExactInput',
        Component: MultiActionIncreaseApprove,
        note: 'Validates approval plus 4byte-resolved contract call combination.',
        expectedPreview: [
          usdtApproveAction({
            title: 'Action 1',
            method: 'increaseApproval(address,uint256)',
            amount: '100 USDT (100,000,000 raw units)',
          }),
          unknownContractAction({
            title: 'Action 2',
          }),
        ],
      },
      {
        title: 'Approve + TRX Unfreeze',
        Component: MultiActionApproveTrx,
        note: 'Combination of approval and redemption.',
        expectedPreview: [
          USDT_200_APPROVE_ACTION,
          unfreezeAction({
            title: 'Action 2',
          }),
        ],
      },
      {
        title: 'Approve EOA + Redeem',
        Component: MultiActionApproveEOA,
        note: 'Validates multi-contract display when the approval target is an EOA.',
        expectedPreview: [
          usdtApproveAction({
            title: 'Action 1',
            amount: '200 USDT (200,000,000 raw units)',
            spender: TRON_PREVIEW_FIXTURES.eoaSpender,
          }),
          unfreezeAction({
            title: 'Action 2',
          }),
        ],
      },
      {
        title: 'Approve + Unknown Contract',
        Component: MultiActionApproveContractUnknown,
        note: 'Validates mixed display for approval plus unrecognized selector.',
        expectedPreview: [
          usdtApproveAction({
            title: 'Action 1',
            amount: '200 USDT (200,000,000 raw units)',
          }),
          unknownContractAction({
            title: 'Action 2',
            selector: 'cef95239',
          }),
        ],
      },
      {
        title: 'swapExactInput + TRX',
        Component: MultiActionSmartContract,
        note: 'Combination of swapExactInput contract call and TRX transfer.',
        expectedPreview: [
          unknownContractAction({
            title: 'Action 1',
          }),
          trxTransferAction({
            title: 'Action 2',
            amount: '1 TRX (1,000,000 sun)',
          }),
        ],
      },
      {
        title: 'approve + swapExactETHForTokens',
        Component: MultiActionNormalABI,
        note: 'Validates approve plus 4byte-resolved swapExactETHForTokens contract call.',
        expectedPreview: [
          usdtApproveAction({
            title: 'Action 1',
            amount: '50 USDT (50,000,000 raw units)',
          }),
          abiContractAction({
            title: 'Action 2',
            selector: '7ff36ab5',
            contract: TRON_PREVIEW_FIXTURES.abiContract,
            callValue: '1 TRX (1,000,000 sun)',
          }),
        ],
      },
      {
        title: 'addLiquidity + TRX',
        Component: MultiActionABITransfer,
        note: 'Validates 4byte-resolved addLiquidity contract call plus TRX transfer.',
        expectedPreview: [
          abiContractAction({
            title: 'Action 1',
            selector: 'e8e33700',
            contract: TRON_PREVIEW_FIXTURES.abiContract,
            callValue: '2 TRX (2,000,000 sun)',
          }),
          trxTransferAction({
            title: 'Action 2',
            amount: '1 TRX (1,000,000 sun)',
          }),
        ],
      },
      {
        title: 'swapExactETHForTokens + swapExactInput',
        Component: MultiActionABIABI,
        note: 'Validates combined display for two 4byte-resolved contract calls.',
        expectedPreview: [
          abiContractAction({
            title: 'Action 1',
            selector: '7ff36ab5',
            contract: TRON_PREVIEW_FIXTURES.abiContract,
            callValue: '1.5 TRX (1,500,000 sun)',
          }),
          abiContractAction({
            title: 'Action 2',
            selector: 'cef95229',
            contract: TRON_PREVIEW_FIXTURES.unknownContract,
            callValue: '3 TRX (3,000,000 sun)',
          }),
        ],
      },
      {
        title: 'TRX Transfer + Unfreeze',
        Component: MultiActionTrxUnfreeze,
        note: 'Combination of transfer and resource redemption.',
        expectedPreview: [
          trxTransferAction({
            title: 'Action 1',
            amount: '1 TRX (1,000,000 sun)',
          }),
          unfreezeAction({
            title: 'Action 2',
          }),
        ],
      },
      {
        title: 'swapExactInput + Redeem',
        Component: MultiActionTokenUnfreeze,
        note: 'Combination of swapExactInput contract call and redemption.',
        expectedPreview: [
          unknownContractAction({
            title: 'Action 1',
          }),
          unfreezeAction({
            title: 'Action 2',
          }),
        ],
      },
    ],
  },
];

const OTHER_CHAIN_GROUPS = [
  {
    id: 'cosmos',
    title: 'cosmos',
    note: 'imToken only',
    items: [
      Withdraw,
      Delegate,
      Redelegate,
      UnDelegate,
      ReinvestRewards,
      Vote,
      CreateDeposit,
      Send,
      CreateProposal,
    ],
  },
  {
    id: 'tezos',
    title: 'tezos',
    note: 'imToken only',
    items: [TezosDelegate, TezosUnDelegate],
  },
  {
    id: 'polkadot',
    title: 'polkadot / kusama',
    items: [
      PolkadotSign,
      PolkadotSignRaw,
      PolkadotNominate,
      PBond,
      PUnbond,
      ExtraBond,
      BatchBondNominate,
      WithdrawUnbond,
      PayoutRewards,
      Second,
      DemocracyVote,
      CouncilVote,
    ],
  },
  {
    id: 'nervos',
    title: 'nervos',
    items: [NervosTransfer, NervosTransferNFT],
  },
  {
    id: 'bitcoin',
    title: 'bitcoin',
    items: [BTCTransfer],
  },
  {
    id: 'eos',
    title: 'eos',
    items: [EOSVote, Powerup, EOSSignMessage, EOSTransfer],
  },
];

function ExpectedPreview({ groups, title }) {
  if (!groups?.length) {
    return null;
  }

  return (
    <section className="expected-preview" aria-label={`${title} expected token-v2 preview fields`}>
      <div className="expected-preview-heading">
        <span>Pre-sign check</span>
      </div>
      <div className="expected-preview-actions">
        {groups.map((group) => (
          <div className="expected-preview-action" key={group.title}>
            <h4>{group.title}</h4>
            <dl>
              {group.rows.map((row) => (
                <div key={`${group.title}-${row.label}`}>
                  <dt>{row.label}</dt>
                  <dd>{row.value}</dd>
                </div>
              ))}
            </dl>
          </div>
        ))}
      </div>
    </section>
  );
}

function CaseCard({ item }) {
  const Component = item.Component;
  const caseKey = `tron:${item.title}`;

  return (
    <article className="case-card">
      <div className="case-card-header">
        <div>
          <h3>{item.title}</h3>
        </div>
        {item.status && <span className={`status-pill ${item.status}`}>{item.status}</span>}
      </div>
      <ExpectedPreview groups={item.expectedPreview} title={item.title} />
      <div className="case-action-panel">
        <div className="case-action-heading">
          <span>Sign action</span>
        </div>
        <div className="case-runner">
          <RequestCopyButton caseKey={caseKey} caseTitle={item.title} />
          <CaseRequestScope caseKey={caseKey} chain="Tron" title={item.title}>
            <Component />
          </CaseRequestScope>
        </div>
      </div>
    </article>
  );
}

function AccountStatus({ accountSnapshot, onRefresh }) {
  const connectedAccountRows = getConnectedAccountRows(accountSnapshot);

  return (
    <aside className="account-status" aria-label="Current app account">
      <div className="account-status-heading">
        <span>Current app account</span>
        <button type="button" onClick={onRefresh}>
          Refresh
        </button>
      </div>
      {connectedAccountRows.length > 0 ? (
        <dl>
          {connectedAccountRows.map((row) => (
            <div key={row.key}>
              <dt>{row.label}</dt>
              <dd title={row.address}>{formatShortAddress(row.address)}</dd>
            </div>
          ))}
        </dl>
      ) : (
        <p className="account-status-empty">No connected account</p>
      )}
    </aside>
  );
}

function TronSection({ group, isSectionOpen, onToggle }) {
  return (
    <details
      className="case-section"
      id={group.id}
      onToggle={(event) => onToggle(group.id, event.currentTarget.open)}
      open={isSectionOpen(group.id)}
    >
      <summary className="case-section-toggle case-section-heading">
        <h4>{group.title}</h4>
        <span className="case-section-count">{group.cases.length} cases</span>
        <span className="case-section-toggle-icon" aria-hidden="true">v</span>
      </summary>
      <div className="case-grid">
        {group.cases.map((item) => (
          <CaseCard item={item} key={item.title} />
        ))}
      </div>
    </details>
  );
}

function OtherChainSection({ group }) {
  return (
    <section className="other-section" id={group.id}>
      <div className="section-heading compact">
        <h2>
          {group.title}
          {group.note && <span>{group.note}</span>}
        </h2>
      </div>
      <div className="other-grid">
        {group.items.map((Item) => (
          <div className="other-action" key={Item.name}>
            <RequestCopyButton
              caseKey={`${group.id}:${Item.name}`}
              caseTitle={Item.name}
            />
            <CaseRequestScope
              caseKey={`${group.id}:${Item.name}`}
              chain={group.title}
              title={Item.name}
            >
              <Item disabled={disabled} />
            </CaseRequestScope>
          </div>
        ))}
      </div>
    </section>
  );
}

function FixedChainMenu() {
  return (
    <nav className="fixed-chain-menu" aria-label="Chain sections">
      <span className="fixed-chain-menu-title">Chains</span>
      {CHAIN_MENU_ITEMS.map((item) => (
        <a href={`#${item.id}`} key={item.id}>
          {item.title}
        </a>
      ))}
    </nav>
  );
}

function App() {
  const [accountSnapshot, setAccountSnapshot] = useState(readCachedAccountSnapshot);
  const { isSectionOpen, setSectionOpen } = usePersistentOpenSections(
    SIGNATURE_SECTION_STORAGE_KEY,
  );

  const refreshAccountSnapshot = useCallback(async () => {
    const nextSnapshot = await readCurrentAccountSnapshot();
    setAccountSnapshot(nextSnapshot);
    writeCachedAccountSnapshot(nextSnapshot);
  }, []);

  useEffect(() => {
    refreshAccountSnapshot();

    const ethereumProvider = getEthereumProvider();
    const handleAccountsChanged = () => {
      refreshAccountSnapshot();
    };

    ethereumProvider?.on?.('accountsChanged', handleAccountsChanged);
    return () => {
      ethereumProvider?.removeListener?.('accountsChanged', handleAccountsChanged);
    };
  }, [refreshAccountSnapshot]);

  return (
    <main className="app-shell">
      <FixedChainMenu />

      <header className="app-header">
        <div className="app-header-copy">
          <p className="eyebrow">imToken fixtures</p>
          <h1>imToken Signature Fixtures</h1>
          <p className="app-header-disclaimer">
            These fixtures only simulate signature previews and results. They do not broadcast transactions on-chain.
          </p>
        </div>
        <AccountStatus
          accountSnapshot={accountSnapshot}
          onRefresh={refreshAccountSnapshot}
        />
      </header>

      <section className="eth-section" id="ethereum">
        <div className="section-heading">
          <p className="eyebrow">ethereum</p>
          <h2>Ethereum cases</h2>
        </div>
        <EthCases />
      </section>

      <div className="tron-chain-block" id="tron">
        <div className="chain-cases-intro">
          <h3 className="chain-cases-title">TRON signing cases</h3>
          <p className="chain-cases-note">
            Mainnet-address fixtures covering Tron message signing, transfers, approvals, contract execution, permissions, and multi-contract branches.
          </p>
        </div>
        {TRON_CASE_GROUPS.map((group) => (
          <TronSection
            group={group}
            isSectionOpen={isSectionOpen}
            key={group.id}
            onToggle={setSectionOpen}
          />
        ))}
      </div>

      <div className="secondary-chains">
        {OTHER_CHAIN_GROUPS.map((group) => (
          <OtherChainSection group={group} key={group.title} />
        ))}
      </div>
    </main>
  );
}

eruda.init();

export default App;

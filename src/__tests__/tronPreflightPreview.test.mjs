import assert from 'node:assert/strict';
import { readdirSync, readFileSync } from 'node:fs';
import test from 'node:test';

const appSource = readFileSync(new URL('../App.jsx', import.meta.url), 'utf8');
const triggerSmartContractSource = readFileSync(
  new URL('../tron/TriggerSmartContract.jsx', import.meta.url),
  'utf8',
);
const tokenUnfreezeSource = readFileSync(
  new URL('../tron/MultiActionTokenUnfreeze.jsx', import.meta.url),
  'utf8',
);
const abiTransferSource = readFileSync(
  new URL('../tron/MultiActionABITransfer.jsx', import.meta.url),
  'utf8',
);
const unknownSelectorSource = readFileSync(
  new URL('../tron/MultiActionApproveContractUnknown.jsx', import.meta.url),
  'utf8',
);
const smartContractSource = readFileSync(
  new URL('../tron/MultiActionSmartContract.jsx', import.meta.url),
  'utf8',
);
const normalAbiSource = readFileSync(
  new URL('../tron/MultiActionNormalABI.jsx', import.meta.url),
  'utf8',
);
const abiAbiSource = readFileSync(
  new URL('../tron/MultiActionABIABI.jsx', import.meta.url),
  'utf8',
);
const approveFixtureSource = [
  'Approve.jsx',
  'ApproveUnimite.jsx',
  'ApproveRevoke.jsx',
  'IncreaseApprove.jsx',
  'DecreaseApprove.jsx',
]
  .map((fileName) => readFileSync(new URL(`../tron/${fileName}`, import.meta.url), 'utf8'))
  .join('\n');

const tronDir = new URL('../tron/', import.meta.url);
const tronSources = readdirSync(tronDir)
  .filter((fileName) => fileName.endsWith('.jsx'))
  .map((fileName) => readFileSync(new URL(fileName, tronDir), 'utf8'));
const tronDataSelectors = [
  ...new Set(
    tronSources.flatMap((source) =>
      [...source.matchAll(/data:\s*['"]([0-9a-fA-F]{8})/g)].map((match) =>
        match[1].toLowerCase(),
      ),
    ),
  ),
].sort();

test('Tron case cards render token-v2 preflight preview metadata', () => {
  assert.match(appSource, /expectedPreview/);
  assert.match(appSource, /expected-preview/);
  assert.match(appSource, /Pre-sign check/);
});

test('approve cases expose token, amount, and spender before signing', () => {
  assert.match(appSource, /Approve fixed amount/);
  assert.match(appSource, /Tether USD/);
  assert.match(appSource, /USDT \(TRC20\)/);
  assert.match(appSource, /Token contract/);
  assert.match(appSource, /TR7NHqjeKQxGTCi8q8ZY4pL8otSzgjLj6t/);
  assert.match(appSource, /1,234,567,890 raw units/);
  assert.match(appSource, /Spender/);
  assert.match(appSource, /SunSwap V2 Router/);
  assert.match(appSource, /TKzxdSv2FZKQrEqkKVgp5DcwEXBEKMg2Ax/);
  assert.doesNotMatch(appSource, /TRC20 fixture token/);
  assert.doesNotMatch(appSource, /41eca9bc828a3005b9a3b909f2cc5c2a54794de05f/);
});

test('Tron preview omits noisy owner and selector-source fields', () => {
  assert.doesNotMatch(appSource, /label: 'Owner'/);
  assert.doesNotMatch(appSource, /label: 'Selector source'/);
  assert.doesNotMatch(appSource, /window\.tronWeb\.defaultAddress\.hex/);
});

test('static approve transactions use Tron mainnet USDT and SunSwap router', () => {
  assert.match(approveFixtureSource, /41a614f803b6fd780986a42c78ec9c7f77e6ded13c/);
  assert.match(approveFixtureSource, /6e0617948fe030a7e4970f8389d4ad295f249b7e/);
  assert.doesNotMatch(approveFixtureSource, /41eca9bc828a3005b9a3b909f2cc5c2a54794de05f/);
  assert.doesNotMatch(approveFixtureSource, /70082243784dcdf3042034e7b044d6d342a91360/);
});

test('dynamic approve transactions use the same mainnet spender as the preview', () => {
  assert.match(appSource, /SunSwap V2 Router/);
  assert.match(appSource, /TKzxdSv2FZKQrEqkKVgp5DcwEXBEKMg2Ax/);
  assert.doesNotMatch(tronSources.join('\n'), /TDgJmYStKqzawFQyMav8XxNp1pTpdhEWg9/);
});

test('transfer cases expose asset and amount before signing', () => {
  assert.match(appSource, /TRX transfer/);
  assert.match(appSource, /0\.0001 TRX/);
  assert.match(appSource, /TRC10 #1002000/);
  assert.match(appSource, /BitTorrent Old/);
  assert.match(appSource, /BTTOLD/);
  assert.match(appSource, /Token ID/);
  assert.match(appSource, /100 raw units/);
  assert.match(appSource, /Recipient/);
});

test('multi-contract cases expose each child action before signing', () => {
  assert.match(appSource, /Transfer \+ Approve/);
  assert.match(appSource, /Action 1/);
  assert.match(appSource, /Action 2/);
  assert.match(appSource, /Approve \+ Unknown Contract/);
  assert.match(appSource, /Unknown selector/);
});

test('contract execution previews expose resolved method names for known selectors', () => {
  assert.match(appSource, /swapExactInput\(address\[\],string\[\],uint256\[\],uint24\[\],\(uint256,uint256,address,uint256\)\)/);
  assert.match(appSource, /swapExactETHForTokens\(uint256,address\[\],address,uint256\)/);
  assert.match(appSource, /addLiquidity\(address,address,uint256,uint256,uint256,uint256,address,uint256\)/);
});

test('Tron fixture labels use resolved method names where available', () => {
  assert.match(triggerSmartContractSource, /swapExactInput/);
  assert.doesNotMatch(triggerSmartContractSource, /未知合约/);
  assert.match(tokenUnfreezeSource, /swapExactInput \+ redeem/);
  assert.match(smartContractSource, /swapExactInput \+ TRXtransfer/);
  assert.match(abiTransferSource, /addLiquidity/);
  assert.doesNotMatch(abiTransferSource, /addLiquidityETH/);
  assert.match(normalAbiSource, /approve \+ swapExactETHForTokens/);
  assert.match(abiAbiSource, /swapExactETHForTokens \+ swapExactInput/);
});

test('Tron fixture data selectors are accounted for by method previews', () => {
  assert.deepEqual(tronDataSelectors, [
    '095ea7b3',
    '7ff36ab5',
    'cef95229',
    'cef95239',
    'e8e33700',
  ]);
  assert.match(appSource, /approve\(address,uint256\)/);
  assert.match(appSource, /swapExactInput\(address\[\],string\[\],uint256\[\],uint24\[\],\(uint256,uint256,address,uint256\)\)/);
  assert.match(appSource, /swapExactETHForTokens\(uint256,address\[\],address,uint256\)/);
  assert.match(appSource, /addLiquidity\(address,address,uint256,uint256,uint256,uint256,address,uint256\)/);
});

test('method-resolved fixture UI avoids ambiguous contract labels', () => {
  const combinedSource = [
    appSource,
    normalAbiSource,
    abiTransferSource,
    abiAbiSource,
  ].join('\n');

  assert.doesNotMatch(combinedSource, /普通合约 \+ ABI 合约/);
  assert.doesNotMatch(combinedSource, /ABI 合约 \+ TRX/);
  assert.doesNotMatch(combinedSource, /ABI 合约 \+ ABI 合约/);
  assert.doesNotMatch(combinedSource, /双 ABI 合约/);
  assert.doesNotMatch(combinedSource, /复杂流动性管理/);
});

test('unknown selector fixture keeps data and labels aligned', () => {
  assert.match(unknownSelectorSource, /cef95239/);
  assert.doesNotMatch(unknownSelectorSource, /未知合约签名（cef95229）/);
  assert.match(unknownSelectorSource, /f228408cef95239/);
});

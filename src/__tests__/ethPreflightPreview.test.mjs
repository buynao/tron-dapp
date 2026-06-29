import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';

const ethSource = readFileSync(new URL('../eth/EthCases.jsx', import.meta.url), 'utf8');

test('Ethereum case rows render pre-sign preview metadata', () => {
  assert.match(ethSource, /expectedPreview/);
  assert.match(ethSource, /Pre-sign check/);
  assert.match(ethSource, /Network/);
  assert.match(ethSource, /CHAIN_METADATA/);
  assert.match(ethSource, /Ethereum Mainnet/);
  assert.match(ethSource, /nativeSymbol: 'ETH'/);
  assert.match(ethSource, /X Layer Testnet/);
  assert.match(ethSource, /nativeSymbol: 'tOKB'/);
  assert.doesNotMatch(ethSource, /ETH 环境诊断/);
  assert.doesNotMatch(ethSource, /ETH Debug Logs/);
  assert.doesNotMatch(ethSource, /runDiagnostics/);
  assert.doesNotMatch(ethSource, /chainChanged/);
  assert.doesNotMatch(ethSource, /getEnvironmentSnapshot/);
  assert.doesNotMatch(ethSource, /const EVM_TX_NETWORK_LABEL =/);
  assert.doesNotMatch(ethSource, /const EVM_NATIVE_SYMBOL =/);
});

test('Ethereum preview omits noisy ownership and token-flow fields', () => {
  assert.doesNotMatch(ethSource, /label: 'From'/);
  assert.doesNotMatch(ethSource, /label: 'Owner'/);
  assert.doesNotMatch(ethSource, /label: 'Signer'/);
  assert.doesNotMatch(ethSource, /label: 'Token flow'/);
  assert.doesNotMatch(ethSource, /CONNECTED_WALLET/);
});

test('Ethereum transfer cases expose token and amount before signing', () => {
  assert.match(ethSource, /Native \{nativeSymbol\} transfer/);
  assert.match(ethSource, /0\.0001 \{nativeSymbol\}/);
  assert.match(ethSource, /formatChainText/);
  assert.match(ethSource, /ERC20 USDC transfer/);
  assert.match(ethSource, /USDC/);
  assert.match(ethSource, /1 USDC \(1,000,000 raw units\)/);
  assert.match(ethSource, /ERC721 safeTransferFrom/);
  assert.match(ethSource, /Current app fallback/);
  assert.match(ethSource, /0 \{nativeSymbol\}/);
  assert.doesNotMatch(ethSource, /BAYC #1/);
});

test('Ethereum approve and contract cases expose spender, contract, and value', () => {
  assert.match(ethSource, /ERC20 approve finite/);
  assert.match(ethSource, /Spender/);
  assert.match(ethSource, /0x1111111254EEB25477B68fb85Ed929f73A960582/);
  assert.match(ethSource, /Known ABI with tokenFlow: WETH deposit/);
  assert.match(ethSource, /Known ABI with tokenFlow: WETH withdraw/);
  assert.match(ethSource, /Known ABI no tokenFlow/);
  assert.doesNotMatch(ethSource, /0\.001 \{nativeSymbol\} -> 0\.001 wrapped native/);
  assert.match(ethSource, /Unknown selector \+ value/);
  assert.match(ethSource, /0x12345678/);
});

test('Ethereum contract execution transactions include gas fields to avoid wallet gas lookup timeouts', () => {
  assert.match(ethSource, /ETH_CONTRACT_EXECUTION_GAS/);
  assert.match(ethSource, /ETH_LEGACY_GAS_PRICE/);
  assert.match(ethSource, /buildContractExecutionTx/);
  assert.equal(
    [...ethSource.matchAll(/buildContractExecutionTx\(from/g)].length,
    6,
  );
});

test('Ethereum token transfer and approve transactions include gas fields to avoid wallet gas fee timeouts', () => {
  assert.match(ethSource, /ETH_CONTRACT_CALL_GAS/);
  assert.match(ethSource, /buildContractCallTx/);
  assert.match(
    ethSource,
    /key: 'transfer-erc20-usdc'[\s\S]*buildTx: \(from\) =>\s*buildContractCallTx\(from,/,
  );
  assert.match(
    ethSource,
    /key: 'transfer-erc721-safe-transfer'[\s\S]*buildTx: \(from\) =>\s*buildContractCallTx\(from,/,
  );
  assert.match(
    ethSource,
    /key: 'approve-usdc-finite'[\s\S]*buildTx: \(from\) =>\s*buildContractCallTx\(from,/,
  );
});

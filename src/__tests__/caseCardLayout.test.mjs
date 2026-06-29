import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';

const appSource = readFileSync(new URL('../App.jsx', import.meta.url), 'utf8');
const ethSource = readFileSync(new URL('../eth/EthCases.jsx', import.meta.url), 'utf8');
const cssSource = readFileSync(new URL('../App.css', import.meta.url), 'utf8');
const persistentSectionsSource = readFileSync(
  new URL('../usePersistentOpenSections.js', import.meta.url),
  'utf8',
);

test('Tron case cards group preview and signing controls in one action panel', () => {
  assert.match(appSource, /className="case-action-panel"/);
  assert.match(appSource, /Sign action/);
  assert.match(appSource, /<div className="case-runner">[\s\S]*<Component \/>[\s\S]*<\/div>/);
  assert.match(cssSource, /\.case-action-panel/);
  assert.match(cssSource, /\.case-action-heading/);
});

test('signature case cards do not render bridge mapping metadata', () => {
  assert.doesNotMatch(appSource, /className="mapping-list"/);
  assert.doesNotMatch(appSource, />DApp</);
  assert.doesNotMatch(appSource, />app action</);
  assert.doesNotMatch(appSource, />SignFlow</);
  assert.doesNotMatch(appSource, />preview</);
  assert.doesNotMatch(appSource, /每个 Tron 用例都标注了 DApp 调用/);
  assert.doesNotMatch(cssSource, /\.mapping-list/);
});

test('Tron duplicate bridge reference cards are not rendered', () => {
  assert.doesNotMatch(appSource, /APP_TRON_SIGNATURE_FLOW/);
  assert.doesNotMatch(appSource, /SignatureFlowReference/);
  assert.doesNotMatch(appSource, /当前 app Tron 签名桥对照/);
  assert.doesNotMatch(cssSource, /\.reference-grid/);
  assert.doesNotMatch(cssSource, /\.reference-item/);
});

test('Ethereum cases render as complete cards instead of loose button rows', () => {
  assert.match(ethSource, /className="eth-case-grid"/);
  assert.match(ethSource, /className="eth-case-card"/);
  assert.match(ethSource, /className="eth-case-header"/);
  assert.match(ethSource, /className="eth-case-action"/);
  assert.match(ethSource, /className="eth-case-result"/);
  assert.doesNotMatch(ethSource, /style=\{\{ marginTop: 10 \}\}/);
  assert.match(cssSource, /\.eth-case-card/);
  assert.match(cssSource, /\.eth-case-action/);
  assert.match(cssSource, /\.eth-case-result/);
});

test('approve-heavy sections are collapsed by default', () => {
  assert.match(appSource, /className="[^"]*case-section-toggle/);
  assert.match(ethSource, /className="[^"]*case-section-toggle/);
  assert.match(cssSource, /\.case-section-toggle/);
  assert.match(cssSource, /\.case-section-toggle-icon/);
});

test('page title and account summary describe multi-chain fixtures', () => {
  assert.match(appSource, /imToken Signature Fixtures/);
  assert.match(appSource, /only simulate signature previews and results/);
  assert.match(appSource, /do not broadcast transactions on-chain/);
  assert.doesNotMatch(appSource, /Tron signature matrix/);
  assert.match(appSource, /Current app account/);
  assert.match(appSource, /AccountStatus/);
  assert.match(cssSource, /\.account-status/);
});

test('account summary only renders connected account rows', () => {
  assert.match(appSource, /getConnectedAccountRows/);
  assert.match(appSource, /No connected account/);
  assert.doesNotMatch(appSource, /Not connected/);
});

test('case sections default collapsed and persist open state locally', () => {
  assert.match(appSource, /SIGNATURE_SECTION_STORAGE_KEY/);
  assert.match(ethSource, /ETH_SECTION_STORAGE_KEY/);
  assert.match(appSource, /usePersistentOpenSections/);
  assert.match(ethSource, /usePersistentOpenSections/);
  assert.match(persistentSectionsSource, /localStorage/);
  assert.match(appSource, /open=\{isSectionOpen\(group\.id\)\}/);
  assert.match(ethSource, /open=\{isSectionOpen\(section\.id\)\}/);
  assert.doesNotMatch(appSource, /open=\{!group\.defaultCollapsed\}/);
  assert.doesNotMatch(ethSource, /open=\{!section\.defaultCollapsed\}/);
});

test('Tron section summaries use the same compact heading structure as Ethereum', () => {
  assert.match(appSource, /<h3 className="chain-cases-title">TRON signing cases<\/h3>/);
  assert.match(appSource, /Mainnet-address fixtures covering Tron message signing/);
  assert.match(appSource, /<summary className="case-section-toggle case-section-heading">[\s\S]*<h4>\{group\.title\}<\/h4>/);
  assert.doesNotMatch(appSource, /<summary className="case-section-toggle section-heading">[\s\S]*<h2>\{group\.title\}<\/h2>/);
  assert.doesNotMatch(appSource, /<p className="eyebrow">tron<\/p>[\s\S]*<h2>\{group\.title\}<\/h2>/);
  assert.match(cssSource, /\.chain-cases-title/);
  assert.match(cssSource, /\.chain-cases-note/);
});

test('primary fixture UI source uses English copy', () => {
  assert.doesNotMatch(appSource, /[\p{Script=Han}]/u);
  assert.doesNotMatch(ethSource, /[\p{Script=Han}]/u);
});

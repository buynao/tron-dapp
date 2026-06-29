import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';
import test from 'node:test';

const appSource = readFileSync(new URL('../App.jsx', import.meta.url), 'utf8');
const ethSource = readFileSync(new URL('../eth/EthCases.jsx', import.meta.url), 'utf8');
const polkadotSdkSource = readFileSync(new URL('../polkadot/sdk.js', import.meta.url), 'utf8');
const signRawSource = readFileSync(new URL('../polkadot/SignRaw.jsx', import.meta.url), 'utf8');

const requestCaptureUrl = new URL('../requestCapture.js', import.meta.url);
const requestCopyButtonUrl = new URL('../RequestCopyButton.jsx', import.meta.url);
const requestCaptureSource = existsSync(requestCaptureUrl)
  ? readFileSync(requestCaptureUrl, 'utf8')
  : '';
const requestCopyButtonSource = existsSync(requestCopyButtonUrl)
  ? readFileSync(requestCopyButtonUrl, 'utf8')
  : '';

test('shared request copy utilities exist and expose capture primitives', () => {
  assert.ok(existsSync(requestCaptureUrl), 'requestCapture.js should exist');
  assert.ok(existsSync(requestCopyButtonUrl), 'RequestCopyButton.jsx should exist');
  assert.match(requestCaptureSource, /startCaseRequestCapture/);
  assert.match(requestCaptureSource, /runCaseRequestDryRun/);
  assert.match(requestCaptureSource, /recordAppRequest/);
  assert.match(requestCaptureSource, /installRequestCapture/);
  assert.match(requestCopyButtonSource, /navigator\.clipboard\.writeText/);
});

test('copy button can capture request parameters before the case has been run', () => {
  assert.match(requestCopyButtonSource, /runCaseRequestDryRun/);
  assert.match(requestCopyButtonSource, /querySelector\('\.case-request-scope/);
  assert.doesNotMatch(
    requestCopyButtonSource,
    /Run this case once to capture request parameters/,
  );
});

test('copy button label does not show captured request count suffix', () => {
  assert.match(requestCopyButtonSource, />\s*Copy request\s*</);
  assert.doesNotMatch(requestCopyButtonSource, /latestRequest\.requests\.length/);
  assert.doesNotMatch(requestCopyButtonSource, /\(\$\{latestRequest\.requests\.length\}\)/);
});

test('Tron and secondary chain cases render copy controls before action components', () => {
  assert.match(appSource, /RequestCopyButton/);
  assert.match(appSource, /CaseRequestScope/);
  assert.match(
    appSource,
    /<RequestCopyButton[\s\S]*?<CaseRequestScope[\s\S]*?<Component \/>/,
  );
  assert.match(
    appSource,
    /<RequestCopyButton[\s\S]*?<CaseRequestScope[\s\S]*?<Item disabled=\{disabled\} \/>/,
  );
});

test('Ethereum cases render copy controls and record provider request payloads', () => {
  assert.match(ethSource, /RequestCopyButton/);
  assert.match(ethSource, /CaseRequestScope/);
  assert.match(ethSource, /const requestPayload = \{[\s\S]*method,[\s\S]*params,/);
  assert.match(ethSource, /recordAppRequest\(requestPayload\)/);
  assert.match(ethSource, /getDryRunResponse\(requestPayload\)/);
  assert.match(
    ethSource,
    /<RequestCopyButton[\s\S]*?<CaseRequestScope[\s\S]*?<Button[\s\S]*Start signing/,
  );
});

test('request capture covers bridge, Tron, Scatter, and Polkadot signing calls', () => {
  assert.match(requestCaptureSource, /callPromisifyAPI/);
  assert.match(requestCaptureSource, /tronWeb\.trx\.sign/);
  assert.match(requestCaptureSource, /getArbitrarySignature/);
  assert.match(requestCaptureSource, /getPublicKey/);
  assert.match(polkadotSdkSource, /recordAppRequest/);
  assert.match(signRawSource, /recordAppRequest/);
});

const STORAGE_KEY = 'imtoken.signatureFixtures.caseRequestCapture.v1';
export const CASE_REQUEST_CAPTURED_EVENT = 'imtoken:case-request-captured';

const functionPatchMark = '__imtokenCaseRequestCapturePatched';
const DRY_RUN_CAPTURED_MESSAGE = 'Request parameters captured for copy.';
let activeCase = null;

const getWindow = () => (typeof window === 'undefined' ? null : window);

const createDryRunCapturedError = () => {
  const error = new Error(DRY_RUN_CAPTURED_MESSAGE);
  error.name = 'CaseRequestDryRunCaptured';
  error.isCaseRequestDryRunCaptured = true;
  return error;
};

export const isCaseRequestDryRunCaptured = (error) =>
  Boolean(error?.isCaseRequestDryRunCaptured || error?.name === 'CaseRequestDryRunCaptured');

const toSerializable = (value, seen = new WeakSet()) => {
  if (value === null || value === undefined) {
    return value;
  }

  if (typeof value === 'bigint') {
    return value.toString();
  }

  if (typeof value === 'function') {
    return `[Function ${value.name || 'anonymous'}]`;
  }

  if (typeof value !== 'object') {
    return value;
  }

  if (seen.has(value)) {
    return '[Circular]';
  }
  seen.add(value);

  if (value instanceof Error) {
    return {
      name: value.name,
      message: value.message,
      code: value.code,
      data: toSerializable(value.data, seen),
      stack: value.stack?.split('\n').slice(0, 4).join('\n'),
    };
  }

  if (Array.isArray(value)) {
    return value.map((item) => toSerializable(item, seen));
  }

  if (ArrayBuffer.isView(value)) {
    return Array.from(value);
  }

  const output = {};
  Object.entries(value).forEach(([key, item]) => {
    output[key] = toSerializable(item, seen);
  });
  return output;
};

export const safeStringify = (value) => {
  try {
    return JSON.stringify(toSerializable(value), null, 2);
  } catch (error) {
    return String(value);
  }
};

const readCaptureMap = () => {
  const currentWindow = getWindow();
  if (!currentWindow?.localStorage) {
    return {};
  }

  try {
    const stored = currentWindow.localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : {};
  } catch (error) {
    return {};
  }
};

const writeCaptureMap = (captureMap) => {
  const currentWindow = getWindow();
  if (!currentWindow?.localStorage) {
    return;
  }

  try {
    currentWindow.localStorage.setItem(STORAGE_KEY, JSON.stringify(captureMap));
  } catch (error) {
    // Capturing remains useful for the current session even without storage.
  }
};

export const getLatestCaseRequest = (caseKey) => {
  if (!caseKey) {
    return null;
  }

  return readCaptureMap()[caseKey] || null;
};

const dispatchCapturedEvent = (capture) => {
  const currentWindow = getWindow();
  if (!currentWindow?.dispatchEvent || typeof currentWindow.CustomEvent !== 'function') {
    return;
  }

  currentWindow.dispatchEvent(
    new currentWindow.CustomEvent(CASE_REQUEST_CAPTURED_EVENT, {
      detail: capture,
    }),
  );
};

export const subscribeToCaseRequestCapture = (callback) => {
  const currentWindow = getWindow();
  if (!currentWindow?.addEventListener) {
    return () => {};
  }

  const handleCaptured = (event) => callback(event.detail);
  currentWindow.addEventListener(CASE_REQUEST_CAPTURED_EVENT, handleCaptured);
  return () => currentWindow.removeEventListener(CASE_REQUEST_CAPTURED_EVENT, handleCaptured);
};

export const recordAppRequest = (request) => {
  if (!activeCase?.caseKey) {
    return null;
  }

  const capturedRequest = {
    index: activeCase.requests.length + 1,
    capturedAt: new Date().toISOString(),
    ...toSerializable(request),
  };

  activeCase = {
    ...activeCase,
    updatedAt: capturedRequest.capturedAt,
    requests: [...activeCase.requests, capturedRequest],
  };

  const captureMap = readCaptureMap();
  captureMap[activeCase.caseKey] = activeCase;
  writeCaptureMap(captureMap);
  dispatchCapturedEvent(activeCase);
  return activeCase;
};

export const getDryRunResponse = (request) => {
  if (!activeCase?.dryRun) {
    return { active: false };
  }

  const apiName = request?.apiName || '';
  const method = request?.method || request?.payload?.method || '';

  if (
    apiName.endsWith('.getAccounts') ||
    apiName === 'ethereum.enable' ||
    method === 'eth_accounts' ||
    method === 'eth_requestAccounts'
  ) {
    return {
      active: true,
      response: Promise.resolve(['0x0000000000000000000000000000000000000000']),
    };
  }

  if (apiName.endsWith('.getProvider')) {
    return {
      active: true,
      response: Promise.resolve('[current provider]'),
    };
  }

  if (apiName === 'eos.getPublicKey') {
    return {
      active: true,
      response: Promise.resolve('[current EOS public key]'),
    };
  }

  return {
    active: true,
    response: Promise.reject(createDryRunCapturedError()),
  };
};

const waitForDryRunCapture = (caseKey, timeoutMs = 5000, idleMs = 250) =>
  new Promise((resolve) => {
    let latestCapture = getLatestCaseRequest(caseKey);
    let idleTimer = null;

    const finish = () => {
      cleanup();
      resolve(latestCapture);
    };

    const cleanup = () => {
      window.clearTimeout(timeoutTimer);
      window.clearTimeout(idleTimer);
      unsubscribe();
    };

    const scheduleFinish = () => {
      window.clearTimeout(idleTimer);
      idleTimer = window.setTimeout(finish, idleMs);
    };

    const unsubscribe = subscribeToCaseRequestCapture((capture) => {
      if (capture?.caseKey !== caseKey) {
        return;
      }

      latestCapture = capture;
      if (capture.requests?.length) {
        scheduleFinish();
      }
    });

    const timeoutTimer = window.setTimeout(finish, timeoutMs);

    if (latestCapture?.requests?.length) {
      scheduleFinish();
    }
  });

const wrapObjectMethod = (target, methodName, buildRequest) => {
  if (!target || typeof target[methodName] !== 'function' || target[methodName][functionPatchMark]) {
    return;
  }

  const original = target[methodName];
  const wrapped = function wrappedCaseRequestCapture(...args) {
    const request = buildRequest(args);
    recordAppRequest(request);
    const dryRunResponse = getDryRunResponse(request);
    if (dryRunResponse.active) {
      return dryRunResponse.response;
    }

    return original.apply(this, args);
  };
  wrapped[functionPatchMark] = true;
  wrapped.__original = original;
  target[methodName] = wrapped;
};

const patchImTokenBridge = () => {
  const currentWindow = getWindow();
  const imToken = currentWindow?.imToken;

  wrapObjectMethod(imToken, 'callPromisifyAPI', ([apiName, payload]) => ({
    transport: 'imToken.callPromisifyAPI',
    apiName,
    payload,
  }));
};

const patchTronWeb = () => {
  const currentWindow = getWindow();
  const tronWeb = currentWindow?.tronWeb || currentWindow?.tronLink?.tronWeb;
  const tronTrx = tronWeb?.trx;

  // Capture tronWeb.trx.sign requests before they enter the injected app bridge.
  wrapObjectMethod(tronTrx, 'sign', ([payload, ...options]) => ({
    transport: 'tronWeb.trx.sign',
    apiName: 'tron.signTransaction',
    payload,
    options,
  }));
  wrapObjectMethod(tronTrx, 'signMessageV2', ([message, ...options]) => ({
    transport: 'tronWeb.trx.signMessageV2',
    apiName: 'tron.signMessageV2',
    payload: { message },
    options,
  }));
};

const patchScatter = () => {
  const currentWindow = getWindow();
  const scatter = currentWindow?.scatter;

  wrapObjectMethod(scatter, 'getPublicKey', (args) => ({
    transport: 'scatter.getPublicKey',
    apiName: 'eos.getPublicKey',
    payload: { args },
  }));
  wrapObjectMethod(scatter, 'getArbitrarySignature', ([publicKey, data]) => ({
    transport: 'scatter.getArbitrarySignature',
    apiName: 'eos.signMessage',
    payload: {
      publicKey,
      data,
    },
  }));
};

export const installRequestCapture = () => {
  patchImTokenBridge();
  patchTronWeb();
  patchScatter();
};

export const startCaseRequestCapture = (caseInfo) => {
  installRequestCapture();
  activeCase = {
    caseKey: caseInfo.caseKey,
    chain: caseInfo.chain,
    title: caseInfo.title,
    dryRun: Boolean(caseInfo.dryRun),
    startedAt: new Date().toISOString(),
    updatedAt: '',
    requests: [],
  };
};

export const runCaseRequestDryRun = async (caseInfo, triggerCase) => {
  startCaseRequestCapture({ ...caseInfo, dryRun: true });

  try {
    triggerCase();
  } catch (error) {
    if (!isCaseRequestDryRunCaptured(error)) {
      throw error;
    }
  }

  return waitForDryRunCapture(caseInfo.caseKey);
};

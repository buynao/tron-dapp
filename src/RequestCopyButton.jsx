import { Button, message } from 'antd';
import { useEffect, useState } from 'react';
import {
  getLatestCaseRequest,
  runCaseRequestDryRun,
  safeStringify,
  startCaseRequestCapture,
  subscribeToCaseRequestCapture,
} from './requestCapture';

const writeClipboardText = async (text) => {
  if (navigator.clipboard?.writeText) {
    await navigator.clipboard.writeText(text);
    return;
  }

  const textarea = document.createElement('textarea');
  textarea.value = text;
  textarea.setAttribute('readonly', 'readonly');
  textarea.style.position = 'fixed';
  textarea.style.top = '-9999px';
  document.body.appendChild(textarea);
  textarea.select();
  document.execCommand('copy');
  document.body.removeChild(textarea);
};

export function CaseRequestScope({ caseKey, chain, title, children }) {
  const beginCapture = () => {
    startCaseRequestCapture({ caseKey, chain, title });
  };

  const beginKeyboardCapture = (event) => {
    if (event.key === 'Enter' || event.key === ' ') {
      beginCapture();
    }
  };

  return (
    <div
      className="case-request-scope"
      onKeyDownCapture={beginKeyboardCapture}
      onPointerDownCapture={beginCapture}
    >
      {children}
    </div>
  );
}

function RequestCopyButton({ caseKey, caseTitle }) {
  const [latestRequest, setLatestRequest] = useState(() => getLatestCaseRequest(caseKey));

  useEffect(() => {
    setLatestRequest(getLatestCaseRequest(caseKey));
    return subscribeToCaseRequestCapture((capture) => {
      if (capture?.caseKey === caseKey) {
        setLatestRequest(capture);
      }
    });
  }, [caseKey]);

  const copyRequest = async (event) => {
    const actionButton =
      event.currentTarget.parentElement?.querySelector('.case-request-scope button');
    const capturedRequest = actionButton
      ? await runCaseRequestDryRun(
          { caseKey, chain: '', title: caseTitle },
          () => actionButton.click(),
        )
      : null;
    const request = capturedRequest || getLatestCaseRequest(caseKey) || latestRequest;

    if (!request?.requests?.length) {
      message.warning('Unable to capture request parameters for this case.');
      return;
    }

    await writeClipboardText(safeStringify(request));
    message.success('Request parameters copied.');
  };

  return (
    <Button
      className="case-copy-button"
      onClick={copyRequest}
      size="small"
      title="Copy the latest app request parameters captured for this case"
    >
      Copy request
      <span className="sr-only"> for {caseTitle}</span>
    </Button>
  );
}

export default RequestCopyButton;

import { Button, message } from 'antd';
import { useState } from 'react';

const domain = {
  name: 'GasFree',
  version: '1',
  chainId: 728126428,
  verifyingContract: 'TY2uroBeZ5trA9QT96aEWj32XLkAAhQ9R2',
};

const types = {
  PermitTransfer: [
    { name: 'token', type: 'address' },
    { name: 'amount', type: 'uint256' },
    { name: 'nonce', type: 'uint256' },
    { name: 'deadline', type: 'uint256' },
  ],
};

const value = {
  token: 'TY2uroBeZ5trA9QT96aEWj32XLkAAhQ9R2',
  amount: '1000000',
  nonce: '0',
  deadline: '1700000000',
};

function SignTypedData() {
  const [msg, setMsg] = useState('');
  const [loadingMethod, setLoadingMethod] = useState('');

  const sign = async (methodName) => {
    setLoadingMethod(methodName);
    setMsg('');

    try {
      const tronWeb = window.tronWeb;
      const signTypedData = tronWeb?.trx?.[methodName];

      if (typeof signTypedData !== 'function') {
        throw new Error(`${methodName} is unavailable`);
      }

      message.info('Starting TIP-712 signing...');
      const signature = await signTypedData(domain, types, value);
      setMsg(signature);
    } catch (e) {
      setMsg(e.message || String(e));
    } finally {
      setLoadingMethod('');
    }
  };

  return (
    <div className="button-stack">
      <Button
        loading={loadingMethod === 'signTypedData'}
        onClick={() => sign('signTypedData')}
      >
        signTypedData
      </Button>
      <Button
        loading={loadingMethod === '_signTypedData'}
        onClick={() => sign('_signTypedData')}
      >
        _signTypedData
      </Button>
      {msg && <pre className="inline-result">{msg}</pre>}
    </div>
  );
}

export default SignTypedData;

import { useState } from 'react';
import { Button, message, Input } from 'antd';
import { imToken } from '../sdk';
import ecc from 'eosjs-ecc';
function Powerup() {
  const [msg, setMsg] = useState('');
  const [pubkey, setPubkey] = useState('');
  const [loading, setLoading] = useState(false);
  return (
    <div>
      <Button
        loading={loading}
        onClick={async () => {
          try {
            message.info('发起交易中...');
            setLoading(true);
            console.log(scatter);
            const pubkey = await scatter.getPublicKey();
            console.log('>>>>>pubkey', pubkey);
            setPubkey(pubkey);
            const result = await scatter.getArbitrarySignature(
              pubkey,
              'test data',
              'test',
              false,
            );
            console.log('>>>>>result', result);
            setLoading(false);
            setMsg(result);
          } catch (e) {
            console.warn(e);
            setLoading(false);
            setMsg(e.message);
          }
        }}
      >
        SignMessage
      </Button>
      {msg && <Input value={msg} disabled={true} />}
      {msg && (
        <Button
          onClick={() => {
            const recoverPublickey = ecc.recover(msg, 'test data');
            console.log('>>>>>>>>>>recoverPublickey', recoverPublickey);
            if (recoverResult) {
              message.success('签名结果匹配');
              return;
            }
            message.error(`签名结果不匹配...${recoverPublickey}`);
          }}
        >
          verify signMessage
        </Button>
      )}
    </div>
  );
}

export default Powerup;

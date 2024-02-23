import { Button, message, Input } from 'antd';
import { useState } from 'react';

function SignMessage() {
  const [msg, setMsg] = useState('');
  const [loading, setLoading] = useState(false);
  const tronWeb = window.tronWeb;
  const str = 'helloworld';
  const hexStrWithout0x = tronWeb?.toHex?.(str).replace?.(/^0x/, '');
  const byteArray = tronWeb?.utils?.code?.hexStr2byteArray?.(hexStrWithout0x);
  const strHash = tronWeb?.sha3(byteArray)?.replace?.(/^0x/, '');
  const defaultAddress = tronWeb?.defaultAddress.base58;

  return (
    <div>
      <Button
        loading={loading}
        onClick={async () => {
          try {
            message.info('发起交易中...');
            setLoading(true);
            setMsg('');
            const signature = await tronWeb.trx.sign(strHash);
            console.log('>>>>>>>>>signature', signature);
            let signedStr = signature.replace(/^0x/, '');
            let tail = signedStr.substring(128, 130);
            if (tail == '01') {
              signedStr = signedStr.substring(0, 128) + '1c';
            } else if (tail == '00') {
              signedStr = signedStr.substring(0, 128) + '1b';
            }
            console.log('>>>>>>>>>signedStr', signedStr);

            setMsg(signedStr);
            setLoading(false);
          } catch (e) {
            setMsg('');
            setLoading(false);
          }
        }}
      >
        SignMessage
      </Button>
      {msg && <Input value={msg} disabled={true} />}
      {msg && (
        <Button
          onClick={async () => {
            try {
              console.log('>>>>>>>>>>strHash', strHash);
              console.log('>>>>>>>>>>msg', msg);
              console.log('>>>>>>>>>>defaultAddress', defaultAddress);
              const res = await tronWeb.trx.verifyMessage(
                strHash,
                msg,
                defaultAddress,
              );
              console.log('>>>>>>>>>>res', res);
              if (res) {
                message.success('签名结果匹配');
                return;
              }
            } catch (error) {
              console.log('>>>>>>>>>>error', error);
              message.error(error);
            }
          }}
        >
          verify
        </Button>
      )}
    </div>
  );
}

export default SignMessage;

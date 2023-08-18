import { Button } from 'antd';
import { useState } from 'react';

function SendAsset() {
  const [msg, setMsg] = useState('')
  return (
    <div>
      <Button onClick={async () => {
        const tronWeb = window.tronWeb;
        try {
          const transaction = await tronWeb.transactionBuilder.sendAsset("TVDGpn4hCSzJ5nkHPLetk8KQBtwaTppnkr", 100, "1002000", "TNPeeaaFB7K9cmo4uQpcU32zGK8G1NYqeL");
          const signedTransaction = await tronWeb.trx.sign(transaction);
          setMsg(signedTransaction)
        } catch(e) {
          setMsg(e.message)
        }
      }}>SendAsset(TRC10):{msg}</Button>
    </div>
  )
}

export default SendAsset

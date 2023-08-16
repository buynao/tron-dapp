import { Button } from 'antd';
import { useState } from 'react';

function SendAsset() {
  const [msg, setMsg] = useState('')
  return (
    <div>
      <Button onClick={async () => {
        const tronWeb = window.tronWeb;
        try {
          const transaction = await tronWeb.transactionBuilder.sendAsset("TVDGpn4hCSzJ5nkHPLetk8KQBtwaTppnkr", 100, "1000086", "TNPeeaaFB7K9cmo4uQpcU32zGK8G1NYqeL");
          const signedTransaction = tronWeb.trx.sign(transaction);
          tronWeb.trx.sendTransaction(signedTransaction);
        } catch(e) {
          setMsg(e.message)
        }
      }}>SendAsset:{msg}</Button>
    </div>
  )
}

export default SendAsset

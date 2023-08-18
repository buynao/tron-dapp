import { useState } from 'react'
import { Button } from 'antd';
function SendTrx() {
  const [msg, setMsg] = useState('')
  return (
    <div>
      <Button onClick={async () => {
        try {
          const tronWeb = window.tronWeb;
          const transaction = await tronWeb.transactionBuilder.sendTrx("TVDGpn4hCSzJ5nkHPLetk8KQBtwaTppnkr", 100, "TNPeeaaFB7K9cmo4uQpcU32zGK8G1NYqeL");
          const signedTransaction = await tronWeb.trx.sign(transaction);
          setMsg(signedTransaction)
        } catch(e) {
          setMsg(e.message)
        }
      }}>SendTrx:{msg}</Button>
    </div>
  )
}

export default SendTrx

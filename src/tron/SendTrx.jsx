import { useState } from 'react'
import { Button, message } from 'antd';
function SendTrx() {
  const [msg, setMsg] = useState('')
  const [loading, setLoading] = useState(false)
  return (
    <div>
      <Button loading={loading}  onClick={async () => {
        try {
          message.info("发起交易中...")
          setLoading(true)
          const tronWeb = window.tronWeb;
          const transaction = await tronWeb.transactionBuilder.sendTrx("TVDGpn4hCSzJ5nkHPLetk8KQBtwaTppnkr", 100, "TNPeeaaFB7K9cmo4uQpcU32zGK8G1NYqeL");
          const signedTransaction = await tronWeb.trx.sign(transaction);
          setMsg(signedTransaction)
          setLoading(false)
        } catch(e) {
          setMsg(e.message)
          setLoading(false)
        }
      }}>SendTrx:{msg}</Button>
    </div>
  )
}

export default SendTrx

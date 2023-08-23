import { Button, message } from 'antd';
import { useState } from 'react';

function SendAsset() {
  const [msg, setMsg] = useState('')
  const [loading, setLoading] = useState(false)
  return (
    <div>
      <Button loading={loading}  onClick={async () => {
        const tronWeb = window.tronWeb;
        try {
          message.info("发起交易中...")
          setLoading(true)
          const transaction = await tronWeb.transactionBuilder.sendAsset("TVDGpn4hCSzJ5nkHPLetk8KQBtwaTppnkr", 100, "1002000", "TNPeeaaFB7K9cmo4uQpcU32zGK8G1NYqeL");
          const signedTransaction = await tronWeb.trx.sign(transaction);
          setMsg(signedTransaction)
          setLoading(false)
        } catch(e) {
          setMsg(e.message)
          setLoading(false)
        }
      }}>SendAsset(TRC10):{msg}</Button>
    </div>
  )
}

export default SendAsset

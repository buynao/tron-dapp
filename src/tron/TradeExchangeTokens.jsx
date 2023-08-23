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
          const transaction = await tronWeb.transactionBuilder.tradeExchangeTokens(1, "1000003",1000,1000,"410ca7c49aa44d26aabfe7f594c645cf9f17a4ff70",1)
          const signedTransaction = tronWeb.trx.sign(transaction);
          setMsg(signedTransaction)
          setLoading(false)
        } catch(e) {
          setMsg(e.message)
          setLoading(false)
        }
      }}>SendAsset:{msg}</Button>
    </div>
  )
}

export default SendAsset

import { Button } from 'antd';
import { useState } from 'react';

function SendAsset() {
  const [msg, setMsg] = useState('')
  return (
    <div>
      <Button onClick={async () => {
        const tronWeb = window.tronWeb;
        try {
          const transaction = await tronWeb.transactionBuilder.tradeExchangeTokens(1, "1000003",1000,1000,"410ca7c49aa44d26aabfe7f594c645cf9f17a4ff70",1)
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

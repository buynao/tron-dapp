import { Button, message } from 'antd';
import { useState } from 'react';

function FreezeBalance() {
  const [msg, setMsg] = useState('')
  const [loading, setLoading] = useState(false)
  return (
    <div>
      <Button loading={loading}  onClick={async () => {
        const tronWeb = window.tronWeb;
        try {
          message.info("发起交易中...")
          setLoading(true)
          console.log(">>>>>>>window.tronWeb.defaultAddress", window.tronWeb.defaultAddress.hex)
          const balance = await tronWeb.trx.getBalance(window.tronWeb.defaultAddress.hex)
          console.log(">>>>>>>balance", balance)
          const tradeobj = await tronWeb.transactionBuilder.freezeBalance(tronWeb.toSun(1),
            3,
            "ENERGY",
            window.tronWeb.defaultAddress.hex,
            1
          )
         
        console.log(">>>>>>>>tradeobj", tradeobj)
          const signature = await tronWeb.trx.sign(tradeobj);
        console.log(">>>>>>>>signature", signature)
            setMsg(signature)
            setLoading(false)
        } catch(e) {
        console.log(">>>>>>>>e", e)
          setMsg(e.message)
          setLoading(false)
        }
      }}>FreezeBalance:{msg}</Button>
    </div>
  )
}

export default FreezeBalance

import { Button } from 'antd';
import { useState } from 'react';

function FreezeBalance() {
  const [msg, setMsg] = useState('')
  return (
    <div>
      <Button onClick={async () => {
        const tronWeb = window.tronWeb;
        try {
          console.log(">>>>>>>window.tronWeb.defaultAddress", window.tronWeb.defaultAddress.hex)
          const balance = await tronWeb.trx.getBalance(window.tronWeb.defaultAddress.hex)
          console.log(">>>>>>>balance", balance)
          const tradeobj = await tronWeb.transactionBuilder.freezeBalance(tronWeb.toSun(1),
            3,
            "ENERGY",
            window.tronWeb.defaultAddress.hex,
            window.tronWeb.defaultAddress.hex,
            1
          )
         
        console.log(">>>>>>>>tradeobj", tradeobj)
          const signature = await tronWeb.trx.sign(tradeobj);
        console.log(">>>>>>>>signature", signature)
         setMsg(signature)
        } catch(e) {
        console.log(">>>>>>>>e", e)
          setMsg(e.message)
        }
      }}>FreezeBalance:{msg}</Button>
    </div>
  )
}

export default FreezeBalance

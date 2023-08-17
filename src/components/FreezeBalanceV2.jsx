import { Button } from 'antd';
import { useState } from 'react';

function FreezeBalanceV2() {
  const [msg, setMsg] = useState('')
  return (
    <div>
      <Button onClick={async () => {
        const tronWeb = window.tronWeb;
        try {
          const balance = await tronWeb.trx.getBalance(window.tronWeb.defaultAddress.hex)
          const tradeobj = await tronWeb.transactionBuilder.freezeBalanceV2(tronWeb.toSun(1),
            'BANDWIDTH',
            window.tronWeb.defaultAddress.hex,
            1
          )
         
          const signature = await tronWeb.trx.sign(tradeobj);
         setMsg(signature)
        } catch(e) {
          setMsg(e.message)
        }
      }}>FreezeBalanceV2:{msg}</Button>
    </div>
  )
}

export default FreezeBalanceV2

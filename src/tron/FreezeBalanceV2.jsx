import { Button, message } from 'antd';
import { useState } from 'react';

function FreezeBalanceV2() {
  const [msg, setMsg] = useState('')
  const [loading, setLoading] = useState(false)
  return (
    <div>
      <Button loading={loading}  onClick={async () => {
        const tronWeb = window.tronWeb;
        try {
          message.info("发起交易中...")
          setLoading(true)
          console.log(">>>>window.tronWeb.defaultAddress.hex", window.tronWeb.defaultAddress.hex)
          const tradeobj = await tronWeb.transactionBuilder.freezeBalanceV2(tronWeb.toSun(1),
            'BANDWIDTH',
            window.tronWeb.defaultAddress.hex,
            1
          )
          console.log(">>>>tradeobj", tradeobj)
          const signature = await tronWeb.trx.sign(tradeobj);
          setMsg(signature)
          setLoading(false)
        } catch(e) {
          console.log(">>>>e", e)
          setMsg(e.message)
          setLoading(false)
        }
      }}>FreezeBalanceV2:{msg}</Button>
    </div>
  )
}

export default FreezeBalanceV2

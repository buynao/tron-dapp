import { Button, message } from 'antd';
import { useState } from 'react';

function MultiSign() {
  const [msg, setMsg] = useState('')
  const [loading, setLoading] = useState(false)
  return (
    <div>
      <Button loading={loading}  onClick={async () => {
        const tronWeb = window.tronWeb;
        try {
          message.info("发起交易中...")
          setLoading(true)
          const tradeobj = await tronWeb.transactionBuilder.freezeBalance(tronWeb.toSun(100), 3, "ENERGY", "415d73f56d93a9380a100d2a340dd30dc3df6e0746", "415d73f56d93a9380a100d2a340dd30dc3df6e0746", 0);
          const signature = await tronWeb.trx.multiSign(tradeobj) || '';
          console.log(">>>>>>>>signature", signature)
          setMsg(signature)
          setLoading(false)
        } catch(e) {
          setMsg(e.message)
          setLoading(false)
        }
      }}>MultiSign:{msg}</Button>
    </div>
  )
}

export default MultiSign

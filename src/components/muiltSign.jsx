import { Button } from 'antd';
import { useState } from 'react';

function SignMessage() {
  const [msg, setMsg] = useState('')
  return (
    <div>
      <Button onClick={async () => {
        const tronWeb = window.tronWeb;
        try {
          const tradeobj = await tronWeb.transactionBuilder.freezeBalance(tronWeb.toSun(100), 3, "ENERGY", "415d73f56d93a9380a100d2a340dd30dc3df6e0746", "415d73f56d93a9380a100d2a340dd30dc3df6e0746", 0);
         const signature = await tronWeb.trx.multiSign(tradeobj) || '';
         setMsg(signature)
        } catch(e) {
          setMsg(e.message)
        }
      }}>signMessageV2:{msg}</Button>
    </div>
  )
}

export default SignMessage

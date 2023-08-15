import { Button } from 'antd';
import { useState } from 'react';

function SignMessage() {
  const [msg, setMsg] = useState('')
  return (
    <div>
      <Button onClick={async () => {
        const tronWeb = window.tronWeb;
        try {
         const signature = await tronWeb.trx.signMessageV2('Hello Word V2') || '';
         setMsg(signature)
        } catch(e) {
          setMsg(e.message)
        }
      }}>signMessageV2:{msg}</Button>
    </div>
  )
}

export default SignMessage

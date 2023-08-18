import { Button } from 'antd';
import { useState } from 'react';

function SignMessage() {
  const [msg, setMsg] = useState('')
  return (
    <div>
      <Button onClick={async () => {
        const tronWeb = window.tronWeb;
        try {
         const signature = await tronWeb.trx.sign('Hello Word');
         setMsg(signature)
        } catch(e) {
          setMsg(e.message)
        }
      }}>SignMessage:{msg}</Button>
    </div>
  )
}

export default SignMessage

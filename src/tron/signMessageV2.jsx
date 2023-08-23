import { Button, message } from 'antd';
import { useState } from 'react';

function SignMessage() {
  const [msg, setMsg] = useState('')
  const [loading, setLoading] = useState(false)
  return (
    <div>
      <Button loading={loading}  onClick={async () => {
        const tronWeb = window.tronWeb;
        try {
          message.info("发起交易中...")
          setLoading(true)
         const signature = await tronWeb.trx.signMessageV2('Hello Word V2');
         setMsg(signature)
        setLoading(false)
        } catch(e) {
          setMsg(e.message)
          setLoading(false)
        }
      }}>SignMessageV2:{msg}</Button>
    </div>
  )
}

export default SignMessage

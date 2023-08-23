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
          const signature = await tronWeb.trx.sign('Hello Word');
          setMsg(signature)
          setLoading(false)
        } catch(e) {
          setMsg(e.message)
          setLoading(false)
        }
      }}>SignMessage:{msg}</Button>
    </div>
  )
}

export default SignMessage

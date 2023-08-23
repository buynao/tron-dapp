import { useState } from 'react'
import { Button, message } from 'antd';
import { imToken } from '../sdk'

function Powerup() {
  const [msg, setMsg] = useState('')
  const [loading, setLoading] = useState(false)
  return (
    <div>
      <Button loading={loading} onClick={async () => {
        try {
          message.info("发起交易中...")
          setLoading(true)
          console.log(scatter)
          const pubkey = await scatter.getPublicKey()
          console.log(">>>>>pubkey", pubkey)
          const result = await scatter.getArbitrarySignature(pubkey, 'test data', 'test', false)
          console.log(">>>>>result", result)
          setLoading(false)
          setMsg(result)
        } catch(e) {
          console.warn(e)
          setLoading(false)
          setMsg(e.message)
        }
      }}>getArbitrarySignature: {msg}</Button>
    </div>
  )
}

export default Powerup

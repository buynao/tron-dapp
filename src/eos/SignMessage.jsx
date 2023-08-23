import { useState } from 'react'
import { Button } from 'antd';
import { imToken } from '../sdk'

function Powerup() {
  const [msg, setMsg] = useState('')
  return (
    <div>
      <Button onClick={async () => {
        try {
          console.log(scatter)
          const pubkey = await scatter.getPublicKey()
          console.log(">>>>>pubkey", pubkey)
          const result = await scatter.getArbitrarySignature(pubkey, 'test data', 'test', false)
          console.log(">>>>>result", result)
        } catch(e) {
          console.warn(e)
          setMsg(e.message)
        }
      }}>getArbitrarySignature: {msg}</Button>
    </div>
  )
}

export default Powerup

import { useState } from 'react'
import { Button, message } from 'antd';
import { sendTransaction, getAccounts } from './sdk'
const payload = {
    "amount": "100",
    "fee": "100",
    "operationBytes": "123",
    "input": ['123'],
    "messageHeader": {
      "name": "delegation",
      "fee": "123 XTZ"      
    },
    "messages": [{
      "type": "delegationName",
      "value": "xxx"
    }, {
      "type": "delegationAddress",
      "value": "ssss"
    }, {
      "type": "amount",
      "value": "234 XTZ"
    }]
}
function Delegate() {
  const [msg, setMsg] = useState('')
  const [loading, setLoading] = useState(false)
  return (
    <div>
      <Button loading={loading} onClick={async () => {
        try {
          message.info("发起交易中...")
          setLoading(true)
          const account = await getAccounts()
          console.log(account)
          payload.from = account[0]
          console.log(payload)
          const result = await sendTransaction(payload);
          setMsg(result)
          setLoading(false)
        } catch(e) {
          console.warn(e)
          setMsg(e.message)
          setLoading(false)
        }
      }}>Delegate: {msg}</Button>
    </div>
  )
}

export default Delegate

import { useState } from 'react'
import { Button, message } from 'antd';
import { sendTransaction, getAccounts } from './sdk'
const payload = {
    "chainType": "COSMOS",
    "fee": {
        "amount": [
            {
                "amount": "500",
                "denom": "uatom"
            }
        ],
        "gas": "166813"
    },
    "msgs": [
        {
            "typeUrl": "/cosmos.bank.v1beta1.MsgSend",
            "value": {
                "fromAddress": "cosmos1lpu7yewjfjkngymha8xlze8hr0avqemtffdvly",
                "toAddress": "cosmosvaloper1c4k24jzduc365kywrsvf5ujz4ya6mwympnc4en",
                "amount": {
                    "amount": "100000",
                    "denom": "uatom"
                }
            }
        }
    ],
    "memo": "imToken-DeFiApi"
}
function UnDelegate() {
  const [msg, setMsg] = useState('')
  const [loading, setLoading] = useState(false)
  return (
      <Button loading={loading} onClick={async () => {
        try {
          message.info("发起交易中...")
          setLoading(true)
          const account = await getAccounts()
          payload.from = account[0]
          payload.msgs[0].value.fromAddress = account[0]
          const result = await sendTransaction(payload);
          setMsg(result)
          setLoading(false)
        } catch(e) {
          console.warn(e)
          setLoading(false)
          setMsg(e.message)
        }
      }}>Send: {msg}</Button>
  )
}

export default UnDelegate

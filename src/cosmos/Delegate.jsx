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
            "typeUrl": "/cosmos.staking.v1beta1.MsgDelegate",
            "value": {
                "delegatorAddress": "cosmos1lpu7yewjfjkngymha8xlze8hr0avqemtffdvly",
                "validatorAddress": "cosmosvaloper1c4k24jzduc365kywrsvf5ujz4ya6mwympnc4en",
                "amount": {
                    "amount": "100000",
                    "denom": "uatom"
                }
            }
        }
    ],
    "memo": "imToken-DeFiApi"
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

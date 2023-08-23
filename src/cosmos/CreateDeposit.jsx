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
            "typeUrl": "/cosmos.gov.v1beta1.MsgDeposit",
            "value": {
                "proposalId": "test xxx",
                "amount": [{
                  "amount": "500",
                  "denom": "uatom"
                }],
                "depositor": 'xxx'
            }
        }
    ],
    "memo": "imToken-DeFiApi"
}
function CreateDeposit() {
  const [msg, setMsg] = useState('')
  const [loading, setLoading] = useState(false)
  return (
      <Button loading={loading} onClick={async () => {
        try {
          message.info("发起交易中...")
          setLoading(true)
          const account = await getAccounts()
          console.log(account)
          payload.from = account[0]
          payload.msgs[0].value.depositor = account[0]
          const result = await sendTransaction(payload);
          setMsg(result)
          setLoading(false)
        } catch(e) {
          console.warn(e)
          setMsg(e.message)
          setLoading(false)
        }
      }}>CreateDeposit: {msg}</Button>
  )
}

export default CreateDeposit

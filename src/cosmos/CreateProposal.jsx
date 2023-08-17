import { useState } from 'react'
import { Button } from 'antd';
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
            "typeUrl": "/cosmos.gov.v1beta1.MsgSubmitProposal",
            "value": {
                "content": {
                  "typeUrl": "/cosmos.gov.v1beta1.TextProposal",
                  "value": {
                    "title": "create title",
                    "description": "description..."
                  }
                },
                "initialDeposit": [{
                  "amount": "500",
                  "denom": "uatom"
                }],
                "proposer": 'xxx'
            }
        }
    ],
    "memo": "imToken-DeFiApi"
}
function CreateProposal() {
  const [msg, setMsg] = useState('')
  return (
    <div>
      <Button onClick={async () => {
        try {
          const account = await getAccounts()
          console.log(account)
          payload.from = account[0]
          payload.msgs[0].value.proposer = account[0]
          const result = await sendTransaction(payload);
          setMsg(result)
        } catch(e) {
          console.warn(e)
          setMsg(e.message)
        }
      }}>CreateProposal: {msg}</Button>
    </div>
  )
}

export default CreateProposal

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
            "typeUrl": "/cosmos.gov.v1beta1.MsgVote",
            "value": {
                "voter": "cosmos1lpu7yewjfjkngymha8xlze8hr0avqemtffdvly",
                "proposalId": "test proposalId",
                "option": 1
            }
        }
    ],
    "memo": "imToken-DeFiApi"
}
function Vote() {
  const [msg, setMsg] = useState('')
  return (
    <div>
      <Button onClick={async () => {
        try {
          const account = await getAccounts()
          console.log(account)
          payload.from = account[0]
          payload.msgs[0].value.voter = account[0]
          const result = await sendTransaction(payload);
          setMsg(result)
        } catch(e) {
          console.warn(e)
          setMsg(e.message)
        }
      }}>Vote: {msg}</Button>
    </div>
  )
}

export default Vote

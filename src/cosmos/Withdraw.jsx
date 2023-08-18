import { useState } from 'react'
import { Button } from 'antd';
import { sendTransaction, getAccounts } from './sdk'
const payload = {
    "chainType": "COSMOS",
    "fee": {
        "amount": [
            {
                "amount": "667",
                "denom": "uatom"
            }
        ],
        "gas": "222450"
    },
    "msgs": [
        {
            "typeUrl": "/cosmos.distribution.v1beta1.MsgWithdrawDelegatorReward",
            "value": {
                "delegatorAddress": "cosmos1lpu7yewjfjkngymha8xlze8hr0avqemtffdvly",
                "validatorAddress": "cosmosvaloper1sjllsnramtg3ewxqwwrwjxfgc4n4ef9u2lcnj0"
            }
        }
    ],
    "memo": "withdraw rewards from imToken"
}
function Withdraw() {
  const [msg, setMsg] = useState('')
  return (
    <div>
      <Button onClick={async () => {
        try {
          const account = await getAccounts()
          console.log(account)
          payload.from = account[0]
          const result = await sendTransaction(payload);
          setMsg(result)
        } catch(e) {
          console.warn(e)
          setMsg(e.message)
        }
      }}>Withdraw: {msg}</Button>
    </div>
  )
}

export default Withdraw
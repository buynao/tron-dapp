import { useState } from 'react'
import { Button, message } from 'antd';
import { sendTransaction, getAccounts } from './sdk'
const payload = {
    "chainType": "COSMOS",
    "fee": {
        "amount": [
            {
                "amount": "1254",
                "denom": "uatom"
            }
        ],
        "gas": "418128"
    },
    "msgs": [
        {
            "typeUrl": "/cosmos.distribution.v1beta1.MsgWithdrawDelegatorReward",
            "value": {
                "delegatorAddress": "cosmos1lpu7yewjfjkngymha8xlze8hr0avqemtffdvly",
                "validatorAddress": "cosmosvaloper1sjllsnramtg3ewxqwwrwjxfgc4n4ef9u2lcnj0"
            }
        },
        {
            "typeUrl": "/cosmos.staking.v1beta1.MsgDelegate",
            "value": {
                "delegatorAddress": "cosmos1lpu7yewjfjkngymha8xlze8hr0avqemtffdvly",
                "validatorAddress": "cosmosvaloper1sjllsnramtg3ewxqwwrwjxfgc4n4ef9u2lcnj0",
                "amount": {
                    "amount": "41",
                    "denom": "uatom"
                }
            }
        }
    ],
    "memo": "Reinvest rewards from imToken"
}
function ReinvestRewards() {
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
      }}>ReinvestRewards: {msg}</Button>
    </div>
  )
}

export default ReinvestRewards

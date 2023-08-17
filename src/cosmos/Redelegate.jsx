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
            "typeUrl": "/cosmos.staking.v1beta1.MsgBeginRedelegate",
            "value": {
                "delegatorAddress": "cosmos1lpu7yewjfjkngymha8xlze8hr0avqemtffdvly",
                "validatorSrcAddress": "cosmosvaloper1c4k24jzduc365kywrsvf5ujz4ya6mwympnc4en",
                "validatorDstAddress": "cosmosvaloper1c4k24jzduc365kywrsvf5ujz4ya6mwympnc4en",
                "amount": {
                    "amount": "100000",
                    "denom": "uatom"
                }
            }
        }
    ],
    "memo": "imToken-DeFiApi"
}
function Redelegate() {
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
      }}>Redelegate: {msg}</Button>
    </div>
  )
}

export default Redelegate

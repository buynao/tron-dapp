import { useState } from 'react'
import { Button, message } from 'antd';
import { imToken } from '../sdk'
const payload = {
    "version": "0x0",
    "cell_deps": [
        {
            "out_point": {
                "tx_hash": "0x5dce8acab1750d4790059f22284870216db086cb32ba118ee5e08b97dc21d471",
                "index": "0x2"
            },
            "dep_type": "code"
        },
        {
            "out_point": {
                "tx_hash": "0x71a7ba8fc96349fea0ed3a5c47992e3b4084b031a42264a018e0072e8172e46c",
                "index": "0x0"
            },
            "dep_type": "dep_group"
        }
    ],
    "header_deps": [],
    "inputs": [
        {
            "since": "0x0",
            "previous_output": {
                "tx_hash": "0x4681eab785d5d189765f195fd6fbd53f58ed349951b5f37f829172882dd20e44",
                "index": "0x0"
            }
        }
    ],
    "outputs": [
        {
            "capacity": "0x31eb2f828",
            "lock": {
                "code_hash": "0x9bd7e06f3ecf4be0f2fcd2188b23f1b9fcc88e5d4b65a8637b17723bbda3cce8",
                "hash_type": "type",
                "args": "0x4e3ec132dd91e24e2060cd9ab25b9a6a49956597"
            },
            "type": {
                "code_hash": "0x2b24f0d644ccbdd77bbf86b27c8cca02efa0ad051e447c212636d9ee7acaaec9",
                "hash_type": "type",
                "args": "0x520adc2e6a1211b822f866e13b1009a1862225a10000000100000041"
            }
        }
    ],
    "outputs_data": [
        "0x000000000000000000c000"
    ],
    "witnesses": [
        "0x55000000100000005500000055000000410000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000"
    ]
}
function TransferNFT() {
  const [msg, setMsg] = useState('')
  const [loading, setLoading] = useState(false)
  return (
    <div>
      <Button loading={loading} onClick={async () => {
        try {
          message.info("发起交易中...")
          setLoading(true)
          console.log(imToken)
          const result = await imToken.callPromisifyAPI('nervos.signTransaction',  payload)
        setMsg(result)
          setLoading(false)
        } catch(e) {
          console.warn(e)
          setMsg(e.message)
          setLoading(false)
        }
      }}>TransferNFT: {msg}</Button>
    </div>
  )
}

export default TransferNFT

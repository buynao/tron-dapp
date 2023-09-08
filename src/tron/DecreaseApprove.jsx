import { Button, message } from 'antd';
import { useState } from 'react';
const tx = {
    "visible": false,
    "txID": "9a11cc0da27659b3e2d273ded8c2632264da9e47f26722ace029f5cd78ac8ef5",
    "raw_data": {
        "contract": [
            {
                "parameter": {
                    "value": {
                        "data": "6618846300000000000000000000000070082243784dcdf3042034e7b044d6d342a91360000000000000000000000000000000000000000000000000000000000001e240",
                        "owner_address": "419b796e0e2412e4f0cabd922fb3ef9f8e99f5ad80",
                        "contract_address": "41eca9bc828a3005b9a3b909f2cc5c2a54794de05f"
                    },
                    "type_url": "type.googleapis.com/protocol.TriggerSmartContract"
                },
                "type": "TriggerSmartContract"
            }
        ],
        "ref_block_bytes": "95f4",
        "ref_block_hash": "59fc6b197f09070f",
        "expiration": 1694068953000,
        "fee_limit": 15000000000,
        "timestamp": 1694068894233
    },
    "raw_data_hex": "0a0295f4220859fc6b197f09070f40a89f83f3a6315aae01081f12a9010a31747970652e676f6f676c65617069732e636f6d2f70726f746f636f6c2e54726967676572536d617274436f6e747261637412740a15419b796e0e2412e4f0cabd922fb3ef9f8e99f5ad80121541eca9bc828a3005b9a3b909f2cc5c2a54794de05f22446618846300000000000000000000000070082243784dcdf3042034e7b044d6d342a91360000000000000000000000000000000000000000000000000000000000001e2407099d4fff2a631900180acc7f037"
}
function Approve() {
  const [msg, setMsg] = useState('')
  const [loading, setLoading] = useState(false)
  return (
    <div>
      <Button loading={loading}  onClick={async () => {
        const tronWeb = window.tronWeb;
        try {
          message.info("发起交易中...")
          setLoading(true)
         const signature = await tronWeb.trx.sign(tx);
         setMsg(signature)
        setLoading(false)
        } catch(e) {
          setMsg(e.message)
          setLoading(false)
        }
      }}>DecreaseApprove:{msg}</Button>
    </div>
  )
}

export default Approve

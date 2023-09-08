import { Button, message } from 'antd';
import { useState } from 'react';
const tx = {
    "visible": false,
    "txID": "bb4f9b9b4eef8f796f55e81a3ed07084584cedafd12c09133a1bbac16ba23a7b",
    "raw_data": {
        "contract": [
            {
                "parameter": {
                    "value": {
                        "data": "d73dd62300000000000000000000000070082243784dcdf3042034e7b044d6d342a91360000000000000000000000000000000000000000000000000000000000000000c",
                        "owner_address": "419b796e0e2412e4f0cabd922fb3ef9f8e99f5ad80",
                        "contract_address": "41eca9bc828a3005b9a3b909f2cc5c2a54794de05f"
                    },
                    "type_url": "type.googleapis.com/protocol.TriggerSmartContract"
                },
                "type": "TriggerSmartContract"
            }
        ],
        "ref_block_bytes": "962c",
        "ref_block_hash": "63277f3b3a450798",
        "expiration": 1694069127000,
        "fee_limit": 15000000000,
        "timestamp": 1694069069216
    },
    "raw_data_hex": "0a02962c220863277f3b3a45079840d8ee8df3a6315aae01081f12a9010a31747970652e676f6f676c65617069732e636f6d2f70726f746f636f6c2e54726967676572536d617274436f6e747261637412740a15419b796e0e2412e4f0cabd922fb3ef9f8e99f5ad80121541eca9bc828a3005b9a3b909f2cc5c2a54794de05f2244d73dd62300000000000000000000000070082243784dcdf3042034e7b044d6d342a91360000000000000000000000000000000000000000000000000000000000000000c70a0ab8af3a631900180acc7f037"
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
      }}>IncreaseApprove:{msg}</Button>
    </div>
  )
}

export default Approve

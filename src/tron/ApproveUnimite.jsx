import { Button, message } from 'antd';
import { useState } from 'react';
const tx = {
    "visible": false,
    "txID": "3b71d0344e54786916544293f606d3cf1f58251c4e6a70f80143695e8c6fa129",
    "raw_data": {
        "contract": [
            {
                "parameter": {
                    "value": {
                        "data": "095ea7b300000000000000000000000070082243784dcdf3042034e7b044d6d342a91360ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff",
                        "owner_address": "419b796e0e2412e4f0cabd922fb3ef9f8e99f5ad80",
                        "contract_address": "41eca9bc828a3005b9a3b909f2cc5c2a54794de05f"
                    },
                    "type_url": "type.googleapis.com/protocol.TriggerSmartContract"
                },
                "type": "TriggerSmartContract"
            }
        ],
        "ref_block_bytes": "95c8",
        "ref_block_hash": "7b424c257a2d6ab9",
        "expiration": 1694068809000,
        "fee_limit": 15000000000,
        "timestamp": 1694068753544
    },
    "raw_data_hex": "0a0295c822087b424c257a2d6ab940a8bafaf2a6315aae01081f12a9010a31747970652e676f6f676c65617069732e636f6d2f70726f746f636f6c2e54726967676572536d617274436f6e747261637412740a15419b796e0e2412e4f0cabd922fb3ef9f8e99f5ad80121541eca9bc828a3005b9a3b909f2cc5c2a54794de05f2244095ea7b300000000000000000000000070082243784dcdf3042034e7b044d6d342a91360ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff708889f7f2a631900180acc7f037"
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
      }}>Approve 无限:{msg}</Button>
    </div>
  )
}

export default Approve

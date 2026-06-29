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
                        "data": "095ea7b30000000000000000000000006e0617948fe030a7e4970f8389d4ad295f249b7effffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff",
                        "owner_address": "419b796e0e2412e4f0cabd922fb3ef9f8e99f5ad80",
                        "contract_address": "41a614f803b6fd780986a42c78ec9c7f77e6ded13c"
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
    "raw_data_hex": "0a0295c822087b424c257a2d6ab940a8bafaf2a6315aae01081f12a9010a31747970652e676f6f676c65617069732e636f6d2f70726f746f636f6c2e54726967676572536d617274436f6e747261637412740a15419b796e0e2412e4f0cabd922fb3ef9f8e99f5ad80121541a614f803b6fd780986a42c78ec9c7f77e6ded13c2244095ea7b30000000000000000000000006e0617948fe030a7e4970f8389d4ad295f249b7effffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff708889f7f2a631900180acc7f037"
}
function Approve() {
  const [msg, setMsg] = useState('')
  const [loading, setLoading] = useState(false)
  return (
    <div>
      <Button loading={loading}  onClick={async () => {
        const tronWeb = window.tronWeb;
        try {
          message.info("Starting request...")
          setLoading(true)
          const signature = await tronWeb.trx.sign(tx);
          setMsg(signature)
          setLoading(false)
        } catch(e) {
          setMsg(e.message)
          setLoading(false)
        }
      }}>Approve unlimited:{msg}</Button>
    </div>
  )
}

export default Approve

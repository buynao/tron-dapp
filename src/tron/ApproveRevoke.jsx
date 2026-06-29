import { Button, message } from 'antd';
import { useState } from 'react';
const tx = {
    "visible": false,
    "txID": "044612c3ea554dc4318fcdaa5a76809e06ac3c6282c668ce08d49ac43631f592",
    "raw_data": {
        "contract": [
            {
                "parameter": {
                    "value": {
                        "data": "095ea7b30000000000000000000000006e0617948fe030a7e4970f8389d4ad295f249b7e0000000000000000000000000000000000000000000000000000000000000000",
                        "owner_address": "419b796e0e2412e4f0cabd922fb3ef9f8e99f5ad80",
                        "contract_address": "41a614f803b6fd780986a42c78ec9c7f77e6ded13c"
                    },
                    "type_url": "type.googleapis.com/protocol.TriggerSmartContract"
                },
                "type": "TriggerSmartContract"
            }
        ],
        "ref_block_bytes": "9561",
        "ref_block_hash": "3fe6994462cc0a48",
        "expiration": 1694068491000,
        "fee_limit": 104000000,
        "timestamp": 1694068433993
    },
    "raw_data_hex": "0a02956122083fe6994462cc0a4840f885e7f2a6315aae01081f12a9010a31747970652e676f6f676c65617069732e636f6d2f70726f746f636f6c2e54726967676572536d617274436f6e747261637412740a15419b796e0e2412e4f0cabd922fb3ef9f8e99f5ad80121541a614f803b6fd780986a42c78ec9c7f77e6ded13c2244095ea7b30000000000000000000000006e0617948fe030a7e4970f8389d4ad295f249b7e000000000000000000000000000000000000000000000000000000000000000070c9c8e3f2a631900180d4cb31"
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
      }}>RevokeApprove:{msg}</Button>
    </div>
  )
}

export default Approve

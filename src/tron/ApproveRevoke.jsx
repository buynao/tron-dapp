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
                        "data": "095ea7b300000000000000000000000070082243784dcdf3042034e7b044d6d342a913600000000000000000000000000000000000000000000000000000000000000000",
                        "owner_address": "419b796e0e2412e4f0cabd922fb3ef9f8e99f5ad80",
                        "contract_address": "41eca9bc828a3005b9a3b909f2cc5c2a54794de05f"
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
    "raw_data_hex": "0a02956122083fe6994462cc0a4840f885e7f2a6315aae01081f12a9010a31747970652e676f6f676c65617069732e636f6d2f70726f746f636f6c2e54726967676572536d617274436f6e747261637412740a15419b796e0e2412e4f0cabd922fb3ef9f8e99f5ad80121541eca9bc828a3005b9a3b909f2cc5c2a54794de05f2244095ea7b300000000000000000000000070082243784dcdf3042034e7b044d6d342a91360000000000000000000000000000000000000000000000000000000000000000070c9c8e3f2a631900180d4cb31"
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
      }}>RevokeApprove:{msg}</Button>
    </div>
  )
}

export default Approve

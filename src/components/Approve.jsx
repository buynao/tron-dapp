import { Button } from 'antd';
import { useState } from 'react';

function Approve() {
  const [msg, setMsg] = useState('')
  return (
    <div>
      <Button onClick={async () => {
        const tronWeb = window.tronWeb;
        try {
         const signature = await tronWeb.trx.sign({
    "visible": false,
    "txID": "da3684a5f38f5c0e6b1fedb3405195485ffe73b03783517948f1d74a5a993dfc",
    "raw_data": {
        "contract": [
            {
                "parameter": {
                    "value": {
                        "data": "095ea7b30000000000000000000000003c9e0ac33f138216c50638d71c344a299d0d1030ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff",
                        "owner_address": "419b796e0e2412e4f0cabd922fb3ef9f8e99f5ad80",
                        "contract_address": "41a614f803b6fd780986a42c78ec9c7f77e6ded13c"
                    },
                    "type_url": "type.googleapis.com/protocol.TriggerSmartContract"
                },
                "type": "TriggerSmartContract"
            }
        ],
        "ref_block_bytes": "1cf0",
        "ref_block_hash": "a1cbe4b90d72177e",
        "expiration": 1692256812000,
        "fee_limit": 250000000,
        "timestamp": 1692256753689
    },
    "raw_data_hex": "0a021cf02208a1cbe4b90d72177e40e0f7f692a0315aae01081f12a9010a31747970652e676f6f676c65617069732e636f6d2f70726f746f636f6c2e54726967676572536d617274436f6e747261637412740a15419b796e0e2412e4f0cabd922fb3ef9f8e99f5ad80121541a614f803b6fd780986a42c78ec9c7f77e6ded13c2244095ea7b30000000000000000000000003c9e0ac33f138216c50638d71c344a299d0d1030ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff7099b0f392a031900180e59a77"
});
         setMsg(signature)
        } catch(e) {
          setMsg(e.message)
        }
      }}>Approve:{msg}</Button>
    </div>
  )
}

export default Approve

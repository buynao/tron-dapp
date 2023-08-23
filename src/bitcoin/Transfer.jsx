import { useState } from 'react'
import { Button, message } from 'antd';
import { imToken } from '../sdk'

function Transfer() {
  const [msg, setMsg] = useState('')
  return (
    <div>
      <Button onClick={async () => {
        try {
          console.log(imToken)
          imToken.callPromisifyAPI('bitcoin.sendTransaction', {
            "address": "2N7R4njpS5Tk1bMN9RMNsppxn3Pft2PRPq3",
            "to": "385TcENhpu2QnSSSNDHzMMSsFCQDjHiZPk",
            "amount": "1000000",
            "outputs": [
                {
                    "txHash": "4dd8150a3cde99465d648346c99a4688110dacaac364c38c9014fe8b23c6cab0",
                    "vout": 0,
                    "scriptPubKey": "76a9143d2291d4394e529431fac1f7fab2c5a47a5e0a9f88ac",
                    "scriptType": "pubkeyhash",
                    "amount": "1000001",
                    "address": "2N7R4njpS5Tk1bMN9RMNsppxn3Pft2PRPq3",
                    "blockNumber": 0,
                    "derivedPath": "0/0"
                },
                {
                    "txHash": "02f7c277276fc9e62bed1db9410cae572e5f4b4b6f74851b0e89d8e053392c8f",
                    "vout": 0,
                    "scriptPubKey": "76a9143d2291d4394e529431fac1f7fab2c5a47a5e0a9f88ac",
                    "scriptType": "pubkeyhash",
                    "amount": "1000000",
                    "address": "2N7R4njpS5Tk1bMN9RMNsppxn3Pft2PRPq3",
                    "blockNumber": 0,
                    "derivedPath": "0/0"
                }
            ],
            "fee": "766",
            "internalUsed": 0,
            "network": "MAINNET",
            "changeAddress": "2N7R4njpS5Tk1bMN9RMNsppxn3Pft2PRPq3",
            "segWit": "NONE",
            "from": "2N7R4njpS5Tk1bMN9RMNsppxn3Pft2PRPq3",
            "contractAddress": "ADDRESS_BCH",
            "decimal": 8,
            "memo": "",
            "feeSize": "383",
            "feePrice": "2",
            "symbol": "BTC",
            "speed": "AVERAGE"
        })
        } catch(e) {
          console.warn(e)
          setMsg(e.message)
        }
      }}>Transfer: {msg}</Button>
    </div>
  )
}

export default Transfer

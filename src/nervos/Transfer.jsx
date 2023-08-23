import { useState } from 'react'
import { Button } from 'antd';
import { imToken } from '../sdk'

function Transfer() {
  const [msg, setMsg] = useState('')
  return (
    <div>
      <Button onClick={async () => {
        try {
          console.log(imToken)
          imToken.callPromisifyAPI('nervos.signTransaction', {
            "version": "0x0",
            "inputs": [
                {
                    "since": "0x0",
                    "previousOutput": {
                        "txHash": "0x7d3c5fc2d2f73be7da65f884456682001f7b7f22476c332f5164f3d46860bf29",
                        "index": "0x1"
                    }
                },
                {
                    "since": "0x0",
                    "previousOutput": {
                        "txHash": "0xb797c9ace8c154771eda67862d8dc4167d7c24e0e523cee33746fa2353c10c1e",
                        "index": "0x0"
                    }
                }
            ],
            "outputs": [
                {
                    "capacity": "0x28fa6ae00",
                    "lock": {
                        "args": "0x4e3ec132dd91e24e2060cd9ab25b9a6a49956597",
                        "codeHash": "0x9bd7e06f3ecf4be0f2fcd2188b23f1b9fcc88e5d4b65a8637b17723bbda3cce8",
                        "hashType": "type"
                    }
                },
                {
                    "capacity": "0x73284d7a4",
                    "lock": {
                        "args": "0xe37930baf2cd08bba00a5b89d98b6a3285f7aaaa",
                        "codeHash": "0x9bd7e06f3ecf4be0f2fcd2188b23f1b9fcc88e5d4b65a8637b17723bbda3cce8",
                        "hashType": "type"
                    }
                }
            ],
            "cellDeps": [
                {
                    "outPoint": {
                        "txHash": "0x71a7ba8fc96349fea0ed3a5c47992e3b4084b031a42264a018e0072e8172e46c",
                        "index": "0x0"
                    },
                    "depType": "depGroup"
                }
            ],
            "headerDeps": [],
            "outputsData": [
                "0x",
                "0x"
            ],
            "witnesses": []
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

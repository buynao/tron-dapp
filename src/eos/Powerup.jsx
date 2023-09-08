import { useState } from 'react'
import { Button, message } from 'antd';
import { imToken } from '../sdk'

function Powerup() {
  const [msg, setMsg] = useState('')
  const [loading, setLoading] = useState(false)
  return (
    <div>
      <Button loading={loading} onClick={async () => {
        try {
          message.info("发起交易中...")
          setLoading(true)
          const result = await imToken.callPromisifyAPI('eos.signTransaction', {
            "signargs": {
                "chainId": "aca376f206b8fc25a6ed44dbdc66547c36c6c33e3a119ffbeaef943642f0e906",
                "requiredKeys": [
                    "PUB_K1_5YHwuU7Z3YudKmFZ4FENAUDNja5euxSTtnumordU7roCyyqWMr"
                ],
                "serializedTransaction": {
                    "0": 187,
                    "1": 126,
                    "2": 228,
                    "3": 100,
                    "4": 20,
                    "5": 223,
                    "6": 122,
                    "7": 9,
                    "8": 139,
                    "9": 76,
                    "10": 0,
                    "11": 0,
                    "12": 0,
                    "13": 0,
                    "14": 1,
                    "15": 0,
                    "16": 0,
                    "17": 0,
                    "18": 0,
                    "19": 0,
                    "20": 234,
                    "21": 48,
                    "22": 85,
                    "23": 0,
                    "24": 0,
                    "25": 0,
                    "26": 160,
                    "27": 234,
                    "28": 171,
                    "29": 56,
                    "30": 173,
                    "31": 1,
                    "32": 48,
                    "33": 6,
                    "34": 155,
                    "35": 52,
                    "36": 178,
                    "37": 169,
                    "38": 164,
                    "39": 139,
                    "40": 0,
                    "41": 0,
                    "42": 0,
                    "43": 0,
                    "44": 168,
                    "45": 237,
                    "46": 50,
                    "47": 50,
                    "48": 52,
                    "49": 48,
                    "50": 6,
                    "51": 155,
                    "52": 52,
                    "53": 178,
                    "54": 169,
                    "55": 164,
                    "56": 139,
                    "57": 48,
                    "58": 6,
                    "59": 155,
                    "60": 52,
                    "61": 178,
                    "62": 169,
                    "63": 164,
                    "64": 139,
                    "65": 1,
                    "66": 0,
                    "67": 0,
                    "68": 0,
                    "69": 59,
                    "70": 153,
                    "71": 1,
                    "72": 0,
                    "73": 0,
                    "74": 0,
                    "75": 0,
                    "76": 0,
                    "77": 79,
                    "78": 102,
                    "79": 0,
                    "80": 0,
                    "81": 0,
                    "82": 0,
                    "83": 0,
                    "84": 0,
                    "85": 2,
                    "86": 0,
                    "87": 0,
                    "88": 0,
                    "89": 0,
                    "90": 0,
                    "91": 0,
                    "92": 0,
                    "93": 4,
                    "94": 69,
                    "95": 79,
                    "96": 83,
                    "97": 0,
                    "98": 0,
                    "99": 0,
                    "100": 0,
                    "101": 0
                },
                "serializedContextFreeData": null,
            },
            "txObject": {},
            "chainId": "aca376f206b8fc25a6ed44dbdc66547c36c6c33e3a119ffbeaef943642f0e906",
            "broadcast": false
        })
          setMsg(result)
          setLoading(false)
        } catch(e) {
          setLoading(false)
          console.warn(e)
          setMsg(e.message)
        }
      }}>Powerup: {msg}</Button>
    </div>
  )
}

export default Powerup

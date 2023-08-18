import { useState } from 'react'

import { Button } from 'antd';
function SendToken() {
  const [msg, setMsg] = useState('')

  return (
    <div>
      <Button onClick={async () => {
        try {
        const tronWeb = window.tronWeb;
        const transaction = await tronWeb.transactionBuilder.sendToken("TVDGpn4hCSzJ5nkHPLetk8KQBtwaTppnkr", 100, "1002000", "TNPeeaaFB7K9cmo4uQpcU32zGK8G1NYqeL");
        const signedTransaction = tronWeb.trx.sign(transaction);
        setMsg(signedTransaction)
        } catch(e) {
          console.warn(e)
          setMsg(e.message)
        }
      }}>SendToken(TRC10):{msg}</Button>
    </div>
  )
}

export default SendToken

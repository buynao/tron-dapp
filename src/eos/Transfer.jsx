import { useState } from 'react'
import { Button, message } from 'antd';
import { imToken } from '../sdk'
import { Api, JsonRpc, RpcError } from 'eosjs';
import { JsSignatureProvider } from 'eosjs/dist/eosjs-jssig';           // development only

function EOSTransfer() {
  const [msg, setMsg] = useState('')
  const [loading, setLoading] = useState(false)
  return (
    <div>
      <Button loading={loading} onClick={async () => {
        try {
          message.info("发起交易中...")
          setLoading(true)
          console.log(">>>>>>scatter", scatter)
          const pubkey = await scatter.getPublicKey()
          console.log(">>>>>>pubkey", pubkey)
          const signatureProvider = new JsSignatureProvider([pubkey]);
          console.log(">>>>>>signatureProvider", signatureProvider)
          const rpc = new JsonRpc('http://127.0.0.1:8888')
          console.log(">>>>>>rpc", rpc)
          const api = new Api({ rpc, signatureProvider });
          console.log(">>>>>>api", api)
          const result = await api.transact({
            actions: [{
              account: 'eosio.token',
              name: 'transfer',
              data: {
                from: 'useraaaaaaaa',
                to: 'useraaaaaaab',
                quantity: '0.0001 SYS',
                memo: '',
              },
            }]
          }, {
            blocksBehind: 3,
            expireSeconds: 30,
          });
          setMsg(result)
          setLoading(false)
        } catch(e) {
          console.warn(e)
          setLoading(false)
          setMsg(e.message)
        }
      }}>EOSTransfer: {msg}</Button>
    </div>
  )
}

export default EOSTransfer

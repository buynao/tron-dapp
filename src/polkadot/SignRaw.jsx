// Import
import { Button, message } from 'antd';
import { useState, useEffect } from 'react'
import { web3Accounts, web3Enable, web3FromSource } from '@polkadot/extension-dapp';
import { stringToHex } from "@polkadot/util";
const SignRaw = () => {
  const [msg, setMsg] = useState('')
  const [loading, setLoading] = useState(false)

  return <div><Button loading={loading}  onClick={async () => {
          message.info("发起交易中...")
          setLoading(true)
    try {
        web3Enable('init')
      const allAccounts = await web3Accounts();
      const account = allAccounts[0];
      const injector = await web3FromSource(account.meta.source);
      const signRaw = injector?.signer?.signRaw;
      console.log(">>>>>>>injector", injector)
           if (!!signRaw) {
          // after making sure that signRaw is defined
          // we can use it to sign our message
          const { signature } = await signRaw({
              address: account.address,
              data: stringToHex('message to sign'),
              type: 'bytes'
          });
          setMsg(signature)
          setLoading(false)
      }
          setLoading(true)   
    } catch (error) {
          setMsg(error.message)
          setLoading(false)
    }
  }}>SignRaw{msg}</Button></div>
}

export default SignRaw
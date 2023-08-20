// Import
import { Button } from 'antd';
import { useState } from 'react'
import { web3Accounts, web3Enable, web3FromSource } from '@polkadot/extension-dapp';
import { stringToHex } from "@polkadot/util";

const SignRaw = () => {
  const [msg, setMsg] = useState('')
  console.log(api.genesisHash.toHex());

  return <Button onClick={async () => {
      const allInjected = await web3Enable('my cool dapp');
      const allAccounts = await web3Accounts();
      console.log(">>>>>>>allAccounts", allAccounts)
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
      }
  }}>SignRaw:{msg}</Button>
}

export default SignRaw
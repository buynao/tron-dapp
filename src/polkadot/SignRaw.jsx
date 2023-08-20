// Import
import { ApiPromise, WsProvider } from '@polkadot/api';
import { Button } from 'antd';
import { useState, useEffect } from 'react'
import { web3Accounts, web3Enable, web3FromSource } from '@polkadot/extension-dapp';
import { stringToHex } from "@polkadot/util";

// Construct
const wsProvider = new WsProvider('wss://rpc.polkadot.io');
const api = await ApiPromise.create({ provider: wsProvider });


const SignRaw = () => {
  const [msg, setMsg] = useState('')
  console.log(api.genesisHash.toHex());
  useEffect(() => {
    // const init = async() => {

    //   const allInjected = await web3Enable('my cool dapp');
    //   const allAccounts = await web3Accounts();
    //   console.log(">>>>>>>allAccounts", allAccounts)
    //   const SENDER = '5DTestUPts3kjeXSTMyerHihn1uwMfLj8vU8sqF7qYrFabHE';
    //   const injector = await web3FromAddress(SENDER);
    //   api.tx.balances
    //     .transfer('5C5555yEXUcmEJ5kkcCMvdZjUo7NGJiQJMS7vZXEeoMhj3VQ', 123456)
    //     .signAndSend(SENDER, { signer: injector.signer }, (status) => { 
    //       console.log(">>>>>>>Status", status)
    //      });
    // }
    // init()
  }, [])
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
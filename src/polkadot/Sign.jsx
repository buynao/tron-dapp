// Import
import { ApiPromise, WsProvider } from '@polkadot/api';
import { Button } from 'antd';
import { useState, useEffect } from 'react'
import { web3Accounts, web3Enable, web3FromAddress } from '@polkadot/extension-dapp';


const Sign = () => {
  const [msg, setMsg] = useState('')

  return <Button onClick={async () => {
      const wsProvider = new WsProvider('wss://rpc.polkadot.io');
      const api = await ApiPromise.create({ provider: wsProvider });
      const allInjected = await web3Enable('my cool dapp');
      const allAccounts = await web3Accounts();
      console.log(">>>>>>>allAccounts", allAccounts)
      const SENDER = allAccounts[0].address;
      const injector = await web3FromAddress(SENDER);
      api.tx.balances
        .transfer('5C5555yEXUcmEJ5kkcCMvdZjUo7NGJiQJMS7vZXEeoMhj3VQ', 123456)
        .signAndSend(SENDER, { signer: injector.signer }, (status) => { 
          console.log(">>>>>>>Status", status)
          
         });
  }}>Sign</Button>
}

export default Sign
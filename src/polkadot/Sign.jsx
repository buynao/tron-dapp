// Import
import { Button } from 'antd';
import { useState } from 'react'
import { web3Accounts, web3FromAddress } from '@polkadot/extension-dapp';


const Sign = () => {
  const [msg, setMsg] = useState('')
  return <Button onClick={async () => {
      const allAccounts = await web3Accounts();
      const SENDER = allAccounts[0].address;
      const injector = await web3FromAddress(SENDER);
      api.tx.balances
        .transfer('5C5555yEXUcmEJ5kkcCMvdZjUo7NGJiQJMS7vZXEeoMhj3VQ', 123456)
        .signAndSend(SENDER, { signer: injector.signer }, (status) => { 
          console.log(">>>>>>>Status", status)
          setMsg(status)
         });
  }}>Sign:{msg}</Button>
}

export default Sign
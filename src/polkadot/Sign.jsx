// Import
import { Button, message } from 'antd';
import { useState, useEffect } from 'react'
import { web3Accounts, web3Enable, web3FromAddress } from '@polkadot/extension-dapp';
import { getAPI, signAndSend } from './sdk';

const Sign = ({ disabled }) => {
  const [msg, setMsg] = useState('')
  return <div><Button disabled={disabled} onClick={async () => {
      const api = getAPI()
      if (api) {
      message.loading('发起App请求...')
      const tx = api.tx.balances
        .transfer('5C5555yEXUcmEJ5kkcCMvdZjUo7NGJiQJMS7vZXEeoMhj3VQ', 123456)
      signAndSend(tx)
    } else {
        message.error('api not ready...')
    }
  }}>SignTransfer</Button></div>
}

export default Sign
// Import
import { Button, message } from 'antd';
import { useState, useEffect } from 'react'
import { getAPI, signAndSend } from './sdk';
import { web3Accounts, web3Enable, web3FromSource } from '@polkadot/extension-dapp'

const PayoutRewards = ({ disabled }) => {
  const [msg, setMsg] = useState('')
  return <Button disabled={true} onClick={async () => {
      const api = getAPI()
      message.loading('发起App请求...')
      if (api) {
        await web3Enable('init')
        const allAccounts = await web3Accounts();
        const account = allAccounts[0];
        const lastEra = await api.derive.session.indexes()
        console.log(">>>>>>>lastEra", lastEra)

        console.log(">>>>>>>txs", account)
        const batchTx = api.tx.utility.batch(['5C5555yEXUcmEJ5kkcCMvdZjUo7NGJiQJMS7vZXEeoMhj3VQ'])
        signAndSend(batchTx)
      } else {
        message.error('api not ready...')
      }
  }}>PayoutRewards</Button>
}

export default PayoutRewards
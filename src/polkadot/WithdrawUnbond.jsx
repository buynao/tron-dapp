// Import
import { Button, message } from 'antd';
import { useState, useEffect } from 'react'
import { getAPI, signAndSend } from './sdk';
import BN from 'bn.js'

const WithdrawUnbond = ({ disabled }) => {
  const [msg, setMsg] = useState('')
  return <div><Button disabled={disabled} onClick={async () => {
      const api = getAPI()
      message.loading('发起App请求...')
      if (api) {
        const bondTx = api.tx.staking.withdrawUnbonded(1)
        signAndSend(bondTx)
      } else {
        message.error('api not ready...')
      }
  }}>WithdrawUnbond</Button></div>
}

export default WithdrawUnbond
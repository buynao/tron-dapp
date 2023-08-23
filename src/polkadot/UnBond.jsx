// Import
import { Button, message } from 'antd';
import { useState, useEffect } from 'react'
import { getAPI, signAndSend } from './sdk';
import BN from 'bn.js'

const UnBond = ({ disabled }) => {
  const [msg, setMsg] = useState('')
  return <div><Button disabled={disabled} onClick={async () => {
      const api = getAPI()
      message.loading('发起App请求...')
      if (api) {
        const unbondTx = api.tx.staking.unbond(new BN(1))
        signAndSend(unbondTx)
      } else {
        message.error('api not ready...')
      }
  }}>UnBond</Button></div>
}

export default UnBond
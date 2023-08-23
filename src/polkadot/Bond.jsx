// Import
import { Button, message } from 'antd';
import { useState, useEffect } from 'react'
import { getAPI, signAndSend } from './sdk';
import BN from 'bn.js'

const Bond = ({ disabled }) => {
  const [msg, setMsg] = useState('')
  return <Button disabled={disabled} onClick={async () => {
      const api = getAPI()
      message.loading('发起App请求...')
      if (api) {
        const BondTx = api.tx.staking.bond(new BN(1), 'Stash')
        signAndSend(BondTx)
      } else {
        message.error('api not ready...')
      }
  }}>Bond</Button>
}

export default Bond
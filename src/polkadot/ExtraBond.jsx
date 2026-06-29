// Import
import { Button, message } from 'antd';
import { useState, useEffect } from 'react'
import { getAPI, signAndSend } from './sdk';
import BN from 'bn.js'

const ExtraBond = ({ disabled }) => {
  const [msg, setMsg] = useState('')
  return <div><Button disabled={disabled} onClick={async () => {
      const api = getAPI()
      message.loading('Starting app request...')
      if (api) {
        const BondTx = api.tx.staking.bondExtra(new BN(1))
        signAndSend(BondTx)
      } else {
        message.error('api not ready...')
      }
  }}>ExtraBond</Button></div>
}

export default ExtraBond
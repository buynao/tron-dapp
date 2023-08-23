// Import
import { Button, message } from 'antd';
import { useState, useEffect } from 'react'
import { getAPI, signAndSend } from './sdk';
import BN from 'bn.js'

const BatchBondNominate = ({ disabled }) => {
  const [msg, setMsg] = useState('')
  return <Button disabled={disabled} onClick={async () => {
      const api = getAPI()
      message.loading('发起App请求...')
      if (api) {
        const bondTx = api.tx.staking.bond(new BN(1), 'Stash')
        const nominateTx = api.tx.staking.nominate(['5C5555yEXUcmEJ5kkcCMvdZjUo7NGJiQJMS7vZXEeoMhj3VQ'])
        const batchTx = api.tx.utility.batch([bondTx, nominateTx])
        signAndSend(batchTx)
      } else {
        message.error('api not ready...')
      }
  }}>BatchBondNominate</Button>
}

export default BatchBondNominate
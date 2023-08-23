// Import
import { Button, message } from 'antd';
import { useState, useEffect } from 'react'
import { getAPI, signAndSend } from './sdk';

const Second = ({ disabled }) => {
  const [msg, setMsg] = useState('')
  return <Button disabled={disabled} onClick={async () => {
      const api = getAPI()
      message.loading('发起App请求...')
      if (api) {
      const secondTx = api.tx.democracy.second(1)
      signAndSend(secondTx)
      } else {
        message.error('api not ready...')
      }
  }}>Second</Button>
}

export default Second
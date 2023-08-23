// Import
import { Button, message } from 'antd';
import { useState, useEffect } from 'react'
import { getAPI, signAndSend } from './sdk';

const Nominate = ({ disabled }) => {
  const [msg, setMsg] = useState('')
  return <div><Button disabled={disabled} onClick={async () => {
      const api = getAPI()
      message.loading('发起App请求...')
      if (api) {
      const nominateTx = api.tx.staking.nominate(['5C5555yEXUcmEJ5kkcCMvdZjUo7NGJiQJMS7vZXEeoMhj3VQ'])
      signAndSend(nominateTx)
      } else {
        message.error('api not ready...')
      }
  }}>Nominate</Button></div>
}

export default Nominate
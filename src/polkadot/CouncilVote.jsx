// Import
import { Button, message } from 'antd';
import { useState, useEffect } from 'react'
import { getAPI, signAndSend } from './sdk';

const CouncilVote = ({ disabled }) => {
  const [msg, setMsg] = useState('')
  return <div><Button disabled={disabled} onClick={async () => {
      const api = getAPI()
      message.loading('发起App请求...')
      if (api) {
      const vote = api.tx.council.vote('0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef', 1, true)
      signAndSend(vote)
      } else {
        message.error('api not ready...')
      }
  }}>CouncilVote</Button></div>
}

export default CouncilVote
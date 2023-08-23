// Import
import { Button, message } from 'antd';
import { useState, useEffect } from 'react'
import { getAPI, signAndSend } from './sdk';
import BN from 'bn.js'

const democracy = ({ disabled }) => {
  const [msg, setMsg] = useState('')
  return <div><Button disabled={disabled} onClick={async () => {
      const api = getAPI()
      message.loading('发起App请求...')
      if (api) {
      const vote = api.tx.democracy.vote(1, 
                       {
                        Standard: {
                          balance: 456,
                          vote: { aye: false, conviction: 1 },
                        },
                      },)
      signAndSend(vote)
      } else {
        message.error('api not ready...')
      }
  }}>DemocracyVote</Button></div>
}

export default democracy
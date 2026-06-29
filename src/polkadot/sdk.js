import { ApiPromise, WsProvider } from '@polkadot/api'
import { web3Accounts, web3Enable, web3FromSource } from '@polkadot/extension-dapp'
import { Button, message } from 'antd';
import { getDryRunResponse, recordAppRequest } from '../requestCapture';

let ready = false

let _api

export const getAPI = () => _api


export const track = eventLabel => {
  console.log('ga track:', eventLabel)
    ; (window).ga &&
      (window).ga('send', {
        hitType: 'event',
        eventCategory: 'staking',
        eventAction: 'click',
        eventLabel: eventLabel,
      })
}

export const initClient = async (toggleDisabled) => {
  const endpoint = 'wss://polkadot-mainnet.token.im/ws'
  const provider = new WsProvider(endpoint)

  const addressType = 'MultiAddress'
  const api = await ApiPromise.create({
    provider,
    types: {
      Address: addressType,
      LookupSource: addressType,
    },
  })
  toggleDisabled && toggleDisabled(false)
  api.rpc.chain
    .subscribeNewHeads(header => {
    })
    .catch(error => {
      alert(error.message)
    })

  _api = api

  return api
}
export const signAndSend = async (tx) => {
  await web3Enable('init')
  const allAccounts = await web3Accounts();
  const account = allAccounts[0];
  const injected = await web3FromSource(account.meta.source)
  _api.setSigner(injected.signer)
  const requestPayload = {
    chain: 'Polkadot',
    transport: 'polkadot.signAndSend',
    apiName: 'polkadot.signAndSend',
    payload: {
      address: account.address,
      source: account.meta.source,
      method: tx.method?.toHuman?.() || tx.method?.toString?.(),
      callHex: tx.method?.toHex?.(),
    },
  };
  recordAppRequest(requestPayload);
  const dryRunResponse = getDryRunResponse(requestPayload);
  if (dryRunResponse.active) {
    return dryRunResponse.response;
  }
  return tx.signAndSend(account.address, result => {
    const { status, events } = result
    message.info(status)
  })
}

window['imToken'] = window['imToken'] || {
  callAPI: () => {
    console.error('当前不是 imToken 环境')
  },
  callPromisifyAPI: (apiName, payload) => {
    switch (apiName) {
      case 'cosmos.getAccounts':
        if (window.location.search.indexOf('address') !== -1) {
          const address = new window.URLSearchParams(window.location.search.slice(1)).get('address')
          localStorage.setItem('account', address)
          return Promise.resolve([address])
        } else if (localStorage.getItem('account')) {
          return Promise.resolve([localStorage.getItem('account')])
        }
        return Promise.resolve([])
      case 'cosmos.getProvider':
        return Promise.resolve('https://cosmosapi-mainnet.tokenlon.im')
      case 'cosmos.sendTransaction':
        console.log(payload)
        return Promise.reject(new Error('当前不是 imToken 环境'))
      default:
        console.log(apiName, payload)
        return Promise.reject(new Error('当前不是 imToken 环境'))
    }
  }
}

const imToken = window['imToken']
/**
 * ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ rn api requests ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
 */

export function getAccounts() {
  // return Promise.resolve(['cosmos1zt57jwmlfl77k9urjha2xupgpk2j90axd9pxss'])
  return imToken.callPromisifyAPI('tezos.getAccounts')
}

export function getProvider() {
  return imToken.callPromisifyAPI('cosmos.getProvider')
}

export function routeTo(payload) {
  return imToken.callPromisifyAPI('navigator.routeTo', payload).catch(err => console.warn(err))
}

export function navigatorConfigure(payload) {
  return imToken.callPromisifyAPI('navigator.configure', payload).catch(err => console.warn(err))
}

export function sendTransaction(payload) {
  return imToken.callPromisifyAPI('tezos.sendTransaction', payload)
}

export function setTitle(title) {
  document.title = title
  imToken.callAPI('navigator.setTitle', title)
}

export function goTokenlon(props) {
  const { exchangeToken, account } = props
  if (exchangeToken && exchangeToken.makerToken && exchangeToken.takerToken) {
    routeTo({
      screen: 'Tokenlon',
      passProps: {
        ...exchangeToken,
        xChainReceiver: account.address,
      }
    })
  } else {
    alert('cant_exchange_now')
  }
}

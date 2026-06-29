window['imToken'] = window['imToken'] || {
  callAPI: () => {
    console.error('Not running in imToken')
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
        return Promise.reject(new Error('Not running in imToken'))
      default:
        console.log(apiName, payload)
        return Promise.reject(new Error('Not running in imToken'))
    }
  }
}

export const imToken = window['imToken']
/**
 * ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ rn api requests ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
 */

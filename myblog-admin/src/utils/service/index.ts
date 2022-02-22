import YHRequest from './request/request'

const yhRequest = new YHRequest({
  baseURL: 'http://121.5.70.94:8060',
  // baseURL: '/api',
  timeout: 5000,
  interceptors: {
    requestInterceptor: (config) => {
      let token
      if (window.localStorage.getItem('token')) {
        token = JSON.parse(window.localStorage.getItem('token') as string)
      }
      if (token && config.headers) {
        config.headers[token.tokenName] = token.tokenValue
      }
      return config
    }
  }
})

export default yhRequest

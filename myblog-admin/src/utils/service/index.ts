import YHRequest from './request/request'

const yhRequest = new YHRequest({
  // baseURL: 'http://121.5.70.94:8060',
  baseURL: '/api',
  timeout: 5000,
  interceptors: {
    requestInterceptor: (config) => {
      const token = window.sessionStorage.getItem('token')
      if (token && config.headers) {
        config.headers.Authorization = 'Bearer ' + token
      }
      return config
    }
  }
})

export default yhRequest

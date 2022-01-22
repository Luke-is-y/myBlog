import type { AxiosRequestConfig, AxiosResponse } from 'axios'

export interface YhRequestInterceptor {
  requestInterceptor?: (config: AxiosRequestConfig) => AxiosRequestConfig
  requestInterceptorErr?: (error: any) => any
  responseInterceptor?: (res: AxiosResponse) => AxiosResponse
  responseInterceptorErr?: (error: any) => any
}

export interface YhRequestConfig extends AxiosRequestConfig {
  interceptors?: YhRequestInterceptor
  showLoading?: boolean
}

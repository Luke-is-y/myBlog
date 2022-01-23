import axios, { AxiosInstance, AxiosResponse } from 'axios'
import type { YhRequestInterceptor, YhRequestConfig } from './type'
import { ElLoading, ElMessage } from 'element-plus'
import { LoadingInstance } from 'element-plus/lib/components/loading/src/loading'

const DEFAULT_LOADING = false

export default class YHRequest {
  instance: AxiosInstance
  interceptors?: YhRequestInterceptor
  showLoading: boolean
  loading?: LoadingInstance
  constructor(config: YhRequestConfig) {
    this.instance = axios.create(config)
    this.interceptors = config.interceptors
    this.showLoading = config.showLoading ?? DEFAULT_LOADING

    // 拦截器先添加的后执行，先添加的先响应
    // 每个实例独有的拦截器
    this.instance.interceptors.request.use(
      this.interceptors?.requestInterceptor,
      this.interceptors?.requestInterceptorErr
    )
    this.instance.interceptors.response.use(
      this.interceptors?.responseInterceptor,
      this.interceptors?.responseInterceptorErr
    )

    // 所有实例都有的拦截器
    this.instance.interceptors.request.use(
      (config) => {
        // 对请求配置处理
        if (this.showLoading) {
          // 请求时展示请求中
          this.loading = ElLoading.service({
            lock: true,
            text: '请求中...'
          })
        }

        return config
      },
      (err) => {
        // 处理错误信息
        return err
      }
    )
    this.instance.interceptors.response.use(
      (res) => {
        // 对结果处理
        setTimeout(() => {
          this.loading?.close()
        }, 3000)
        if (res.data.success && res.data.msg) {
          ElMessage({
            message: res.data.msg,
            type: 'success'
          })
        }
        return res
      },
      (err) => {
        // 处理错误信息
        return err
      }
    )
  }

  request(config: YhRequestConfig): Promise<AxiosResponse> {
    return new Promise<AxiosResponse>((resolve, reject) => {
      // 对单个请求做拦截，在配置中定制拦截器函数
      if (config.interceptors?.requestInterceptor) {
        config = config.interceptors.requestInterceptor(config)
      }

      // 判断是否需要展示loading
      if (config.showLoading) {
        this.showLoading = config.showLoading
      }

      this.instance
        .request(config)
        .then((res) => {
          if (config.interceptors?.responseInterceptor) {
            res = config.interceptors.responseInterceptor(res)
          }

          this.showLoading = DEFAULT_LOADING
          resolve(res)
        })
        .catch((err) => {
          this.showLoading = DEFAULT_LOADING
          reject(err)
        })
    })
  }
  get(config: YhRequestConfig): Promise<AxiosResponse> {
    return this.request({ ...config, method: 'GET' })
  }

  post(config: YhRequestConfig): Promise<AxiosResponse> {
    return this.request({ ...config, method: 'POST' })
  }

  put(config: YhRequestConfig): Promise<AxiosResponse> {
    return this.request({ ...config, method: 'PUT' })
  }

  delete(config: YhRequestConfig): Promise<AxiosResponse> {
    return this.request({ ...config, method: 'DELETE' })
  }

  patch(config: YhRequestConfig): Promise<AxiosResponse> {
    return this.request({ ...config, method: 'PATCH' })
  }
}

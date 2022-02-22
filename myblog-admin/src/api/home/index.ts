import yhRequest from '@/utils/service'
import { AxiosResponse } from 'axios'

export function getHomeData(): Promise<AxiosResponse<any, any>> {
  return yhRequest.request({
    url: '/admin',
    method: 'GET'
  })
}

export function getUserAreaData(type: number): Promise<AxiosResponse<any, any>> {
  return yhRequest.request({
    url: '/admin/users/area',
    method: 'GET',
    params: {
      type
    }
  })
}

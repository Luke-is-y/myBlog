import yhRequest from '@/utils/service'
import { AxiosResponse } from 'axios'

interface getTagsParams {
  current?: number
  size?: number
  keywords?: string
}

export function publishArticle(data: getTagsParams): Promise<AxiosResponse<any, any>> {
  return yhRequest.request({
    url: '/admin/articles',
    method: 'POST',
    data
  })
}

export function getArticleContent(articleId: number): Promise<AxiosResponse<any, any>> {
  return yhRequest.request({
    url: `/admin/articles/${articleId}`,
    method: 'GET'
  })
}

export function uploadImg(formdata: any): Promise<AxiosResponse<any, any>> {
  return yhRequest.request({
    url: 'http://upload-cn-east-2.qiniup.com',
    method: 'POST',
    data: formdata,
    headers: { 'Content-Type': 'multipart/form-data' }
  })
}

import yhRequest from '@/utils/service'
import { AxiosResponse } from 'axios'

// 发布或修改文章相关接口

export function publishArticle(data: any): Promise<AxiosResponse<any, any>> {
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

// 文章列表相关接口

interface ArticleListParams {
  current: number
  size: number
  keywords: string
  tagId?: number
  categoryId?: number
}

export function getArticleList(params: ArticleListParams): Promise<AxiosResponse<any, any>> {
  return yhRequest.request({
    url: '/admin/articles',
    method: 'GET',
    params
  })
}

export function updateIsTopStatus(article: any): Promise<AxiosResponse<any, any>> {
  return yhRequest.request({
    url: '/admin/articles/top',
    method: 'PUT',
    data: {
      id: article.id,
      isTop: article.isTop
    }
  })
}

export function deleteArticlesApi(data: any): Promise<AxiosResponse<any, any>> {
  return yhRequest.request({
    url: '/admin/articles',
    method: 'PUT',
    data
  })
}

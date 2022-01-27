import yhRequest from '@/utils/service'

interface getCategoriesParams {
  current?: number
  size?: number
  keywords?: string
}

export function getCategories(params: getCategoriesParams) {
  return yhRequest.request({
    url: '/admin/categories',
    method: 'GET',
    params
  })
}

export function updateCategories(data: any) {
  return yhRequest.request({
    url: '/admin/categories',
    method: 'POST',
    data
  })
}

export function delCategories(data: number[]) {
  return yhRequest.request({
    url: '/admin/categories',
    method: 'DELETE',
    data
  })
}

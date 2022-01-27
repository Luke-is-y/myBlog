import yhRequest from '@/utils/service'

interface getTagsParams {
  current?: number
  size?: number
  keywords?: string
}

export function getTags(params: getTagsParams) {
  return yhRequest.request({
    url: '/admin/tags',
    method: 'GET',
    params
  })
}

export function delTags(data: number[]) {
  return yhRequest.request({
    url: '/admin/tags',
    method: 'DELETE',
    data
  })
}

export function updateTags(data: any) {
  return yhRequest.request({
    url: '/admin/tags',
    method: 'POST',
    data
  })
}

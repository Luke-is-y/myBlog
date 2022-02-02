import yhRequest from '@/utils/service'

interface ResourcesType {
  id: number
  isAnonymous: number
  requestMethod: string
  resourceName: string
  url: string
}

export function updateResources(data: ResourcesType) {
  return yhRequest.request({
    url: '/admin/resources',
    method: 'POST',
    data
  })
}

export function delResources(id: number) {
  return yhRequest.request({
    url: '/admin/resources/' + id,
    method: 'DELETE'
  })
}

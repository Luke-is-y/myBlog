import yhRequest from '@/utils/service'

export function getQiniuToken() {
  return yhRequest.request({
    url: '/getQiniuCloudUpToken',
    method: 'GET'
  })
}

export function getWebAllConfig() {
  return yhRequest.request({
    url: '/allWebConfig',
    method: 'GET'
  })
}

export function updateWebConfig(data: any) {
  return yhRequest.request({
    url: '/webConfig',
    method: 'POST',
    data
  })
}

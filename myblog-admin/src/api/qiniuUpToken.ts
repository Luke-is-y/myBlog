import yhRequest from '@/utils/service'

export function getQiNiuToken() {
  return yhRequest.request({
    url: '/getQiniuCloudUpToken',
    method: 'GET'
  })
}

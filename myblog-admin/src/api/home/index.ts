import yhRequest from '@/utils/service'

export function getHomeData() {
  return yhRequest.request({
    url: '/admin',
    method: 'GET'
  })
}

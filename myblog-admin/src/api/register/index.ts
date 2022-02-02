import yhRequest from '@/utils/service'

export function userRegister(data: any) {
  return yhRequest.request({
    url: '/register',
    method: 'POST',
    data
  })
}

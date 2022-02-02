import yhRequest from '@/utils/service'
interface loginParams {
  username: string
  password: string
  isRemember: boolean
}

export function Login(data: loginParams) {
  return yhRequest.request({
    url: '/login',
    method: 'POST',
    data
  })
}

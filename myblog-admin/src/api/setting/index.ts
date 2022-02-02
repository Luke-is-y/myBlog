import yhRequest from '@/utils/service'

interface UserInfo {
  nickname: string
  info: string
  webSite: string
  avatar: string
}

export function updateUserInfo(data: UserInfo) {
  return yhRequest.request({
    url: '/user/info',
    method: 'POST',
    data
  })
}

interface UserPassword {
  newPassword: string
  oldPassword: string
}

export function updateUserPassword(data: UserPassword) {
  return yhRequest.request({
    url: '/admin/users/password',
    method: 'PUT',
    data
  })
}

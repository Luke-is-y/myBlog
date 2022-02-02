import yhRequest from '@/utils/service'

interface getTagsParams {
  current?: number
  size?: number
  keywords?: string
}

export function getUserRoles() {
  return yhRequest.request({
    url: '/admin/users/role',
    method: 'GET'
  })
}

interface UserInfo {
  nickname: string
  userInfoId: number
  roleIdList: number[]
}
export function updateUserInfo(data: UserInfo) {
  return yhRequest.request({
    url: '/admin/users/role',
    method: 'PUT',
    data
  })
}

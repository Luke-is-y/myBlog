import yhRequest from '@/utils/service'
import type { RoleForm } from '@/views/permission/role/config/type'

export function updateRoleMenu(data: RoleForm) {
  return yhRequest.request({
    url: '/admin/role',
    method: 'POST',
    data
  })
}

export function delRoles(data: number[] | undefined) {
  return yhRequest.request({
    url: '/admin/roles',
    method: 'DELETE',
    data
  })
}

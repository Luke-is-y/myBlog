import yhRequest from '@/utils/service'

export function updateMenu(data: any) {
  return yhRequest.request({
    url: '/admin/menus',
    method: 'POST',
    data
  })
}

export function delMenu(id: number) {
  return yhRequest.request({
    url: '/admin/menus/' + id,
    method: 'delete'
  })
}

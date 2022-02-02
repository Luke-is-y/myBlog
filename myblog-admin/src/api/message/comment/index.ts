import yhRequest from '@/utils/service'

export function updateCommentsStatus(data: { isPublished: number | null; idList: number[] }) {
  return yhRequest.request({
    url: '/admin/comments/review',
    method: 'PUT',
    data
  })
}

export function delComments(data: number[]) {
  return yhRequest.request({
    url: '/admin/comments',
    method: 'DELETE',
    data
  })
}

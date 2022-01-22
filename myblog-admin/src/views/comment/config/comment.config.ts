import { ITable } from '@/components/common/table/types'
export const tableConfig: ITable = {
  isShowSelection: true,
  isShowIndex: false,
  isShowDeleteBtn: true,
  isShowSearchBtn: true,
  isShowAddBtn: true,
  searchBtnPlaceholder: '请输入搜索条件',
  propList: [
    { prop: 'avatar', label: '头像', minWidth: '100' },
    { prop: 'nickname', label: '评论人', minWidth: '100' },
    { prop: 'replyNickname', label: '回复人', minWidth: '180' },
    { prop: 'articleTitle', label: '文章标题', minWidth: '180' },
    { prop: 'commentContent', label: '评论内容', minWidth: '180' },
    { prop: 'createTime', label: '评论时间', minWidth: '180' },
    { prop: 'status', label: '状态', minWidth: '180' },
    { prop: 'ip', label: '来源', minWidth: '180' }
  ]
}

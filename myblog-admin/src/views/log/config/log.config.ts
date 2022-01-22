import { ITable } from '@/components/common/table/types'
export const tableConfig: ITable = {
  isShowSelection: true,
  isShowIndex: false,
  isShowDeleteBtn: true,
  isShowSearchBtn: true,
  searchBtnPlaceholder: '请输入搜索条件',
  propList: [
    { prop: 'optModule', label: '系统模块', minWidth: '100' },
    { prop: 'optType', label: '操作类型', minWidth: '100' },
    { prop: 'optDesc', label: '操作描述', minWidth: '180' },
    { prop: 'requestMethod', label: '请求方式', minWidth: '180' },
    { prop: 'nickname', label: '操作人员', minWidth: '180' },
    { prop: 'ipAddress', label: '登录ip', minWidth: '180' },
    { prop: 'ipSource', label: '登录地址', minWidth: '180' },
    { prop: 'createTime', label: '操作日期', minWidth: '180' }
  ]
}

import { ITable } from '@/components/common/table/types'
export const tableConfig: ITable = {
  isShowSelection: false,
  isShowAddBtn: true,
  isShowDeleteBtn: false,
  isShowSearchBtn: true,
  searchBtnPlaceholder: '请输入搜索条件',
  propList: [
    {
      prop: 'resourceName',
      label: '资源名',
      minWidth: '180',
      align: 'left'
    },
    {
      prop: 'url',
      label: '资源路径',
      minWidth: '180'
    },
    {
      prop: 'requestMethod',
      label: '请求方式',
      minWidth: '180'
    },
    {
      prop: 'isAnonymous',
      label: '匿名访问',
      minWidth: '180'
    },
    {
      prop: 'createTime',
      label: '创建时间',
      minWidth: '180'
    }
  ]
}

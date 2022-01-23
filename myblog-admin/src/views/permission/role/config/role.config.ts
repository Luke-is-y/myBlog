import { ITable } from '@/components/common/table/types'
export const tableConfig: ITable = {
  isShowSelection: true,
  isShowAddBtn: true,
  isShowDeleteBtn: true,
  isShowSearchBtn: true,
  searchBtnPlaceholder: '请输入搜索条件',
  propList: [
    {
      prop: 'roleName',
      label: '角色名',
      minWidth: '180'
    },
    {
      prop: 'roleDescription',
      label: '权限描述',
      minWidth: '180'
    },
    {
      prop: 'isDisable',
      label: '禁用',
      minWidth: '180'
    },
    {
      prop: 'createTime',
      label: '创建时间',
      minWidth: '180'
    }
  ]
}

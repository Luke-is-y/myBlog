import { ITable } from '@/components/common/table/types'
export const tableConfig: ITable = {
  isShowSelection: false,
  isShowIndex: false,
  isShowAddBtn: true,
  isShowSearchBtn: true,
  searchBtnPlaceholder: '请输入搜索条件',
  propList: [
    {
      prop: 'name',
      label: '菜单名称',
      minWidth: '180'
    },
    {
      prop: 'icon',
      label: '图标',
      minWidth: '180'
    },
    {
      prop: 'orderNum',
      label: '排序',
      minWidth: '180'
    },
    {
      prop: 'path',
      label: '访问路径',
      minWidth: '180'
    },
    {
      prop: 'component',
      label: '组件路径',
      minWidth: '180'
    },
    {
      prop: 'isHidden',
      label: '隐藏',
      minWidth: '180'
    },
    {
      prop: 'createTime',
      label: '创建时间',
      minWidth: '180'
    }
  ]
}

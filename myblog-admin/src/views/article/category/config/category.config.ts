import { ITable } from '@/components/common/table/types'
export const tableConfig: ITable = {
  isShowAddBtn: true,
  isShowDeleteBtn: true,
  isShowSelection: true,
  isShowSearchBtn: true,
  searchBtnPlaceholder: '请输入分类名',
  propList: [
    {
      prop: 'id',
      label: 'id',
      minWidth: '180'
    },
    {
      prop: 'categoryName',
      label: '分类名',
      minWidth: '180'
    },
    {
      prop: 'createTime',
      label: '发表时间',
      minWidth: '180'
    }
  ]
}

import { ITable } from '@/components/common/table/types'
export const tableConfig: ITable = {
  isShowAddBtn: true,
  isShowDeleteBtn: true,
  isShowSelection: true,
  isShowSearchBtn: true,
  searchBtnPlaceholder: '请输入标签名',
  propList: [
    {
      prop: 'id',
      label: 'id',
      minWidth: '180'
    },
    {
      prop: 'tagName',
      label: '标签名',
      minWidth: '180'
    },
    {
      prop: 'createTime',
      label: '发表时间',
      minWidth: '180'
    }
  ]
}

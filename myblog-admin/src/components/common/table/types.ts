export interface ITableColumn {
  prop: string
  label: string
  minWidth?: string
  align?: string
}

export interface ITable {
  isShowSelection?: boolean
  isShowIndex?: boolean
  isShowAddBtn?: boolean
  isShowDeleteBtn?: boolean
  isShowSearchBtn?: boolean
  searchBtnPlaceholder?: string
  propList: ITableColumn[]
}

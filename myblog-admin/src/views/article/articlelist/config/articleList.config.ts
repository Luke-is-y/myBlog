import { ITable } from '@/components/common/table/types'
export const tableConfig: ITable = {
  isShowSelection: true,
  isShowDeleteBtn: true,
  isShowSearchBtn: true,
  propList: [
    {
      prop: 'articleCover',
      label: '文章封面',
      minWidth: '180'
    },
    {
      prop: 'articleTitle',
      label: '标题',
      minWidth: '180'
    },
    {
      prop: 'categoryName',
      label: '分类',
      minWidth: '180'
    },
    {
      prop: 'tagDTOList',
      label: '标签',
      minWidth: '180'
    },
    {
      prop: 'viewCount',
      label: '浏览量',
      minWidth: '180'
    },
    {
      prop: 'createTime',
      label: '发表时间',
      minWidth: '180'
    },
    {
      prop: 'isTop',
      label: '置顶',
      minWidth: '180'
    }
  ]
}

import { ITable } from '@/components/common/table/types'
export const tableConfig: ITable = {
  isShowSearchBtn: true,
  searchBtnPlaceholder: '请输入搜索条件',
  propList: [
    {
      prop: 'linkAvatar',
      label: '头像',
      minWidth: '180'
    },
    {
      prop: 'nickname',
      label: '昵称',
      minWidth: '180'
    },
    {
      prop: 'loginType',
      label: '登录方式',
      minWidth: '180'
    },
    {
      prop: 'roleList',
      label: '用户角色',
      minWidth: '180'
    },
    // {
    //   prop: 'isDisable',
    //   label: '禁用',
    //   minWidth: '180'
    // },
    {
      prop: 'ipAddr',
      label: '登录ip',
      minWidth: '180'
    },
    {
      prop: 'ipSource',
      label: '登录地址',
      minWidth: '180'
    },
    {
      prop: 'createTime',
      label: '创建时间',
      minWidth: '180'
    },
    {
      prop: 'recentLogin',
      label: '上次登录时间',
      minWidth: '180'
    }
  ]
}

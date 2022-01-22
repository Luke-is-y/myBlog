import { IForm } from './types'

export const formConfig: IForm = {
  formItems: [
    {
      field: 'email',
      type: 'email',
      label: '邮箱',
      placeholder: 'ss',
      rules: [{ required: true, message: '请输入邮箱！', trigger: 'blur' }]
    },
    {
      field: 'content',
      type: 'textarea',
      label: '内容',
      placeholder: '请输入内容'
    },
    {
      field: 'username',
      type: 'input',
      label: '用户名',
      placeholder: 'ss'
    },
    {
      field: 'category',
      type: 'select',
      label: '分类',
      placeholder: '请选择分类',
      selectOptions: [
        {
          label: '分类1',
          value: '1'
        },
        {
          label: '分类2',
          value: '2'
        }
      ]
    },
    {
      field: 'date1',
      type: 'datepicker',
      label: '选择日期',
      dateOptions: {
        startPlaceholder: '开始时间',
        endPlaceholder: '结束时间',
        type: 'daterange'
      }
    },
    {
      field: 'date2',
      type: 'datepicker',
      label: '选择日期',
      placeholder: '请选择日期',
      dateOptions: {
        type: 'date'
      }
    }
  ],

  labelWidth: '120px',

  colLayout: {
    xs: 24,
    sm: 12,
    md: 8,
    lg: 6,
    xl: 4
  }
}

type IFormType = 'input' | 'select' | 'password' | 'email' | 'datepicker' | 'textarea'

export interface IFormItem {
  field: string
  type: IFormType
  label: string
  rules?: any[] // 验证规则
  placeholder?: any
  // 针对select
  selectOptions?: any[]
  // 针对日期选择器
  dateOptions?: any
}

export interface IForm {
  formItems: IFormItem[]
  labelWidth: string
  colLayout: any
}

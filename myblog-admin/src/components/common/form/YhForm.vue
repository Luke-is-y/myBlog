<template>
  <div class="yh-form">
    <div class="header">
      <slot name="header"></slot>
    </div>
    <el-form :labelWidth="labelWidth">
      <el-row>
        <template v-for="item in formItems" :key="item">
          <el-col v-bind="colLayout">
            <el-form-item :label="item.label" :rules="item.rules">
              <template
                v-if="
                  item.type === 'input' ||
                  item.type === 'password' ||
                  item.type === 'email' ||
                  item.type === 'textarea'
                "
              >
                <el-input
                  :show-password="item.type === 'password'"
                  :autosize="item.type === 'textarea'"
                  :type="item.type"
                  v-model="form[item.field]"
                />
              </template>
              <template v-else-if="item.type === 'select'">
                <el-select
                  :placeholder="item.placeholder"
                  style="width: 100%"
                  v-model="form[item.field]"
                >
                  <el-option
                    v-for="option in item.selectOptions"
                    :key="option"
                    :label="option.label"
                    :value="option.value"
                  ></el-option>
                </el-select>
              </template>
              <template v-else-if="item.type === 'datepicker'">
                <el-date-picker
                  style="width: 100%"
                  v-bind="item.dateOptions"
                  :placeholder="item.placeholder ?? ''"
                  v-model="form[item.field]"
                ></el-date-picker>
              </template>
            </el-form-item>
          </el-col>
        </template>
      </el-row>
    </el-form>
    <div class="footer">
      <slot name="footer"></slot>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType, ref, watch } from 'vue'
import { IFormItem } from './types'
export default defineComponent({
  props: {
    modelValue: {
      type: Object,
      required: true
    },
    formItems: {
      type: Array as PropType<IFormItem[]>,
      default: () => []
    },
    labelWidth: {
      type: String,
      default: '100px'
    },
    colLayout: {
      type: Object,
      default: () => ({
        xs: 24,
        sm: 12,
        md: 8,
        lg: 6,
        xl: 4
      })
    }
  },
  emits: ['update:modelValue'],
  setup(props, { emit }) {
    const form = ref({ ...props.modelValue })

    watch(
      form,
      (newValue) => {
        emit('update:modelValue', newValue)
      },
      { deep: true }
    )

    return { form }
  }
})
</script>

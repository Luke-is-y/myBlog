<template>
  <div class="page-form">
    <yh-form v-bind="formConfig" v-model="formData">
      <template #header>
        <div>查询</div>
      </template>
      <template #footer>
        <div class="form-btns">
          <el-button type="primary">重置</el-button>
          <el-button>查询</el-button>
        </div>
      </template>
    </yh-form>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import YhForm from '@/components/common/form/YhForm.vue'

export default defineComponent({
  components: {
    YhForm
  },
  props: {
    formConfig: {
      type: Object,
      required: true
    }
  },
  setup() {
    const formData = {}
    return {
      formData
    }
  }
})
</script>

<style lang="less" scoped>
.form-btns {
  text-align: right;
}
</style>

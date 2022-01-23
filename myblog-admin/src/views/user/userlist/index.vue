<template>
  <el-card>
    <page-table :tableConfig="tableConfig"></page-table>
  </el-card>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import PageTable from './config/PageTable.vue'
import { tableConfig } from './config/user.config'
export default defineComponent({
  components: {
    PageTable
  },
  setup() {
    return {
      tableConfig
    }
  }
})
</script>

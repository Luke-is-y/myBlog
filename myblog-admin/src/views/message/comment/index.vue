<template>
  <el-card class="main-card">
    <page-table :table-config="tableConfig" />
  </el-card>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

import PageTable from './config/PageTable.vue'
import { tableConfig } from './config/comment.config'

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

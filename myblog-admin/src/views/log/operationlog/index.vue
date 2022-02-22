<template>
  <el-card>
    <yh-table
      :Data="logList"
      v-bind="tableConfig"
      @search-btn="searchLog"
      @selection="getSelectionData"
      @del-btn="isDelete = true"
      @update:page="handlePageStatus"
      :page="pageConfig"
      :page-count="logCount"
    >
      <template #header>
        <div class="base-page-title">
          {{ route.name }}
        </div>
      </template>
      <template #requestMethod="scope">
        <el-tag v-if="scope.row.requestMethod" :type="tagType(scope.row.requestMethod)">
          {{ scope.row.requestMethod }}
        </el-tag>
      </template>
      <template #time="scope"> {{ scope.row.time + 'ms' }} </template>
      <template #createTime="scope">
        {{ dateFormat(scope.row.createTime) }}
      </template>
      <template #edit="scope">
        <el-button type="text" size="mini" icon="view" @click="check(scope.row)"> 查看 </el-button>
        <el-popconfirm
          title="确定删除吗？"
          style="margin-left: 10px"
          @confirm="deleteLog(scope.row.id)"
        >
          <template #reference>
            <el-button size="mini" type="text" icon="delete"> 删除 </el-button>
          </template>
        </el-popconfirm>
      </template>
    </yh-table>
    <el-dialog v-model="isCheck" width="40%">
      <template #title>
        <div class="dialog-title-container">详细信息</div>
      </template>

      <el-form ref="form" :model="optLog" label-width="100px" size="mini">
        <el-form-item label="操作模块：">
          {{ optLog.optModule }}
        </el-form-item>
        <el-form-item label="请求地址：">
          {{ optLog.optUrl }}
        </el-form-item>
        <el-form-item label="请求方式：">
          <el-tag :type="tagType(optLog.requestMethod)">
            {{ optLog.requestMethod }}
          </el-tag>
        </el-form-item>
        <el-form-item label="操作方法：">
          {{ optLog.optMethod }}
        </el-form-item>
        <el-form-item label="请求参数：">
          {{ optLog.requestParam.slice(1, optLog.requestParam.length - 1) }}
        </el-form-item>
        <el-form-item label="操作人员：">
          {{ optLog.username }}
        </el-form-item>
        <el-form-item label="浏览器：">
          {{ optLog.browser }}
        </el-form-item>
      </el-form>
    </el-dialog>
    <!-- 批量删除对话框 -->
    <el-dialog v-model="isDelete" width="30%">
      <template #title>
        <div class="dialog-title-container">提示</div>
      </template>

      <div style="font-size: 1rem">是否删除选中项？</div>
      <template #footer>
        <el-button @click="isDelete = false">取 消</el-button>
        <el-button type="primary" @click="deleteLog()"> 确 定 </el-button>
      </template>
    </el-dialog>
  </el-card>
</template>

<script lang="ts">
import { defineComponent, computed, ref, onMounted } from 'vue'
import { useStore } from 'vuex'
import { useRoute } from 'vue-router'

import yhRequest from '@/utils/service'

import YhTable from '@/components/common/table/YhTable.vue'
import { tableConfig } from './config/log.config'
import { dateFormat } from '@/utils/filter'

export default defineComponent({
  components: {
    YhTable
  },
  setup() {
    const route = useRoute()
    const store = useStore()

    onMounted(() => {
      listLogs()
    })

    const pageConfig = ref({
      current: 1,
      size: 10
    })

    const logList = computed(() => store.state.logModule.logList)
    const logCount = computed(() => store.state.logModule.logCount)
    const listLogs = () => {
      store.dispatch('logModule/getLogList', {
        keywords: keywords.value,
        size: pageConfig.value.size,
        current: pageConfig.value.current
      })
    }

    const isCheck = ref(false)
    const optLog = ref({
      optModule: '',
      optUrl: '',
      requestMethod: '',
      optMethod: '',
      requestParam: '',
      responseData: '',
      username: '',
      browser: ''
    })
    const check = (Log: any) => {
      optLog.value = JSON.parse(JSON.stringify(Log))
      isCheck.value = true
    }

    const isDelete = ref(false)
    const logIdList = ref({})
    const deleteLog = (id?: number) => {
      if (id) {
        logIdList.value = [id]
      }
      yhRequest
        .request({
          url: '/admin/operation/logs',
          method: 'DELETE',
          data: logIdList.value
        })
        .then((res: any) => {
          if (res.data.code) {
            listLogs()
          }
          isDelete.value = false
        })
    }

    const tagType = computed(() => {
      return function (type: string) {
        switch (type) {
          case 'GET':
            return ''
          case 'POST':
            return 'success'
          case 'PUT':
            return 'warning'
          case 'DELETE':
            return 'danger'
        }
      }
    })
    const keywords = ref('')
    const searchLog = (key: string) => {
      keywords.value = key
      listLogs()
    }
    const getSelectionData = (selection: any[]) => {
      logIdList.value = selection.map((item: any) => item.id)
    }

    const handlePageStatus = (page: { current: number; size: number }) => {
      pageConfig.value = { ...page }
      listLogs()
    }
    return {
      route,
      tableConfig,
      logList,
      tagType,
      isCheck,
      isDelete,
      deleteLog,
      optLog,
      check,
      searchLog,
      getSelectionData,
      handlePageStatus,
      pageConfig,
      logCount,
      dateFormat
    }
  }
})
</script>

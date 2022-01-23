<template>
  <yh-table
    @add-btn="openModel"
    @search-btn="listResources"
    :Data="resourceList"
    v-bind="tableConfig"
  >
    <template #header>
      <div class="title">
        {{ route.name }}
      </div>
    </template>
    <template #requestMethod="scope">
      <el-tag v-if="scope.row.requestMethod" :type="tagType(scope.row.requestMethod)">
        {{ scope.row.requestMethod }}
      </el-tag>
    </template>
    <template #isAnonymous="scope">
      <el-switch
        v-if="!scope.row.children"
        v-model="scope.row.isAnonymous"
        :active-value="1"
        :inactive-value="0"
        active-color="#13ce66"
        @change="changeResource(scope.row)"
      />
      <span v-else></span>
    </template>
    <template #createTime="scope">
      {{ dateFormat(scope.row.createTime) }}
    </template>
    <template #edit="scope">
      <el-button
        type="text"
        size="mini"
        icon="plus"
        v-if="scope.row.children"
        @click="openAddResourceModel(scope.row)"
      >
        新增
      </el-button>
      <el-button type="text" size="mini" icon="edit" @click="openEditResourceModel(scope.row)">
        修改
      </el-button>
      <el-popconfirm
        title="确定删除吗？"
        style="margin-left: 10px"
        @confirm="deleteResource(scope.row.id)"
      >
        <template #reference>
          <el-button size="mini" type="text" icon="delete"> 删除 </el-button>
        </template>
      </el-popconfirm>
    </template>
  </yh-table>

  <el-dialog v-model="addModule" width="30%">
    <template #title>
      <div class="dialog-title-container" ref="moduleTitle" />
    </template>
    <el-form label-width="80px" size="medium" :model="resourceForm">
      <el-form-item label="模块名">
        <el-input v-model="resourceForm.resourceName" style="width: 220px" />
      </el-form-item>
    </el-form>
    <template #footer class="dialog-footer">
      <el-button @click="addModule = false">取 消</el-button>
      <el-button type="primary" @click="addOrEditResource"> 确 定 </el-button>
    </template>
  </el-dialog>
  <!-- 新增模态框 -->
  <el-dialog v-model="addResource" width="30%">
    <template #title>
      <div class="dialog-title-container" ref="resourceTitle" />
    </template>

    <el-form label-width="80px" size="medium" :model="resourceForm">
      <el-form-item label="资源名">
        <el-input v-model="resourceForm.resourceName" style="width: 220px" />
      </el-form-item>
      <el-form-item label="资源路径">
        <el-input v-model="resourceForm.url" style="width: 220px" />
      </el-form-item>
      <el-form-item label="请求方式">
        <el-radio-group v-model="resourceForm.requestMethod">
          <el-radio :label="'GET'">GET</el-radio>
          <el-radio :label="'POST'">POST</el-radio>
          <el-radio :label="'PUT'">PUT</el-radio>
          <el-radio :label="'DELETE'">DELETE</el-radio>
        </el-radio-group>
      </el-form-item>
    </el-form>
    <template #footer class="dialog-footer">
      <el-button @click="addResource = false">取 消</el-button>
      <el-button type="primary" @click="addOrEditResource"> 确 定 </el-button>
    </template>
  </el-dialog>
</template>

<script lang="ts">
import { defineComponent, onMounted, PropType, computed, ref } from 'vue'
import { useStore } from 'vuex'
import { useRoute } from 'vue-router'
import YhTable from '@/components/common/table/YhTable.vue'
import { ITable } from '@/components/common/table/types'

import yhRequest from '@/utils/service'

import { ElMessage } from 'element-plus'

import { dateFormat } from '@/utils/filter/index'
export default defineComponent({
  components: {
    YhTable
  },
  props: {
    tableConfig: {
      type: Object as PropType<ITable>,
      default: () => ({})
    }
  },
  setup() {
    const store = useStore()
    const route = useRoute()

    onMounted(() => {
      getList()
    })

    const resourceList = computed(() => store.state.resourceModule.resourceList)

    const getList = () => {
      store.dispatch('resourceModule/getResourceList', { keywords: keywords.value })
    }

    const keywords = ref('')

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

    const moduleTitle = ref()
    const openModel = (resource: any) => {
      if (resource) {
        resourceForm.value = JSON.parse(JSON.stringify(resource))
        moduleTitle.value.innerHTML = '修改模块'
      } else {
        resourceForm.value = {}
        moduleTitle.value.innerHTML = '添加模块'
      }
      addModule.value = true
    }

    const listResources = (key: string) => {
      keywords.value = key
      getList()
    }

    const changeResource = (resource: any) => {
      if (!resource.id) {
        return
      }
      const temp = {
        id: resource.id,
        isAnonymous: resource.isAnonymous,
        requestMethod: resource.requestMethod,
        resourceName: resource.resourceName,
        url: resource.url
      }
      yhRequest
        .request({
          url: '/admin/resources',
          method: 'POST',
          data: temp
        })
        .then((res) => {
          if (res.data.code) {
            getList()
          }
        })
    }

    const resourceTitle = ref()
    const openAddResourceModel = (resource: any) => {
      resourceForm.value = {}
      resourceForm.value.parentId = resource.id
      resourceTitle.value.innerHTML = '添加资源'
      addResource.value = true
    }

    const openEditResourceModel = (resource: any) => {
      if (resource.url == null) {
        openModel(resource)
        return false
      }
      resourceForm.value = JSON.parse(JSON.stringify(resource))
      resourceTitle.value.innerHTML = '修改资源'
      addResource.value = true
    }

    const deleteResource = (id: number) => {
      yhRequest
        .request({
          url: '/admin/resources/' + id,
          method: 'DELETE'
        })
        .then((res) => {
          if (res.data.code) {
            getList()
          }
        })
    }

    const addModule = ref(false)

    const addResource = ref(false)

    const resourceForm = ref()

    const addOrEditResource = () => {
      if (resourceForm.value.resourceName.trim() == '') {
        ElMessage({
          message: '资源名不能为空',
          type: 'error'
        })
        return false
      }
      yhRequest
        .request({
          url: '/admin/resources',
          method: 'POST',
          data: resourceForm.value
        })
        .then((res) => {
          if (res.data.code) {
            getList()
          }
          addModule.value = false
          addResource.value = false
        })
    }

    return {
      route,
      resourceList,
      dateFormat,
      tagType,
      moduleTitle,
      openModel,
      openAddResourceModel,
      resourceTitle,
      openEditResourceModel,
      deleteResource,
      listResources,

      changeResource,

      addModule,

      addResource,

      resourceForm,

      addOrEditResource
    }
  }
})
</script>

<style>
.title {
  font-size: 16px;
  font-weight: 700;
  color: #202a34;
}
.title:before {
  content: '';
  width: 24px;
  height: 16px;
  border-left: 3px solid #0081ff;
  margin-right: 20px;
}
</style>

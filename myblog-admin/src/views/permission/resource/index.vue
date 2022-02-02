<template>
  <yh-table
    :Data="resourceList"
    v-bind="tableConfig"
    @add-btn="addModal"
    @search-btn="searchResources"
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
    <template #isAnonymous="scope">
      <el-switch
        v-if="!scope.row.children"
        v-model="scope.row.isAnonymous"
        :active-value="1"
        :inactive-value="0"
        active-color="#13ce66"
        @change="changeAnonymousStatus(scope.row)"
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

  <el-dialog v-model="addModuleModal" width="30%" :title="moduleTitle">
    <el-form label-width="80px" size="medium" :model="resourceForm">
      <el-form-item label="模块名">
        <el-input v-model="resourceForm.resourceName" style="width: 220px" />
      </el-form-item>
    </el-form>
    <template #footer class="dialog-footer">
      <el-button @click="addModuleModal = false">取 消</el-button>
      <el-button type="primary" @click="addEditResource"> 确 定 </el-button>
    </template>
  </el-dialog>

  <el-dialog v-model="addResourceModal" width="30%" :title="resourceTitle">
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
      <el-button @click="addResourceModal = false">取 消</el-button>
      <el-button type="primary" @click="addEditResource"> 确 定 </el-button>
    </template>
  </el-dialog>
</template>

<script lang="ts">
import { defineComponent, onMounted, computed, ref } from 'vue'
import { useStore } from 'vuex'
import { useRoute } from 'vue-router'
import { tableConfig } from './config/resource.config'
import { updateResources, delResources } from '@/api/permission/resources'
import { ElMessage } from 'element-plus'
import { dateFormat } from '@/utils/filter/index'
import YhTable from '@/components/common/table/YhTable.vue'

export default defineComponent({
  components: {
    YhTable
  },
  setup() {
    const store = useStore()
    const route = useRoute()

    onMounted(() => {
      listResources()
    })

    const listResources = () => {
      store.dispatch('resourceModule/getResourceList', {
        ...pageConfig.value,
        keywords: keywords.value
      })
    }
    const resourceList = computed(() => store.state.resourceModule.resourceList)
    const resourceCount = computed(() => store.state.resourceModule.resourceCount)
    const pageConfig = ref({
      current: 1,
      size: 10
    })
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

    const changeAnonymousStatus = (resource: any) => {
      if (!resource.id) {
        return
      }
      updateResources({
        id: resource.id,
        isAnonymous: resource.isAnonymous,
        requestMethod: resource.requestMethod,
        resourceName: resource.resourceName,
        url: resource.url
      }).then((res) => {
        if (res.data.code) {
          listResources()
        }
      })
    }

    const openAddResourceModel = (resource: any) => {
      resourceForm.value = {}
      resourceForm.value.parentId = resource.id
      resourceTitle.value = '添加资源'
      addResourceModal.value = true
    }

    const openEditResourceModel = (resource: any) => {
      if (resource.url == null) {
        addModal(resource)
        return false
      }
      resourceForm.value = JSON.parse(JSON.stringify(resource))
      resourceTitle.value = '修改资源'
      addResourceModal.value = true
    }

    // 公共
    const addModal = (resource: any) => {
      if (resource) {
        resourceForm.value = JSON.parse(JSON.stringify(resource))
        moduleTitle.value = '修改模块'
      } else {
        resourceForm.value = {}
        moduleTitle.value = '添加模块'
      }
      addModuleModal.value = true
    }
    const searchResources = (key: string) => {
      keywords.value = key
      listResources()
    }

    // 添加模块
    const moduleTitle = ref()
    const addModuleModal = ref(false)

    // 修改资源
    const resourceTitle = ref()
    const addResourceModal = ref(false)

    // 添加模块和修改资源共用
    const resourceForm = ref()
    const addEditResource = () => {
      if (resourceForm.value.resourceName.trim() == '') {
        ElMessage({
          message: '资源名不能为空',
          type: 'error'
        })
        return false
      }
      updateResources(resourceForm.value).then((res) => {
        if (res.data.code) {
          listResources()
        }
        addModuleModal.value = false
        addResourceModal.value = false
      })
    }

    // 删除资源
    const deleteResource = (id: number) => {
      delResources(id).then((res) => {
        if (res.data.code) {
          listResources()
        }
      })
    }

    return {
      route,
      tableConfig,
      pageConfig,
      resourceList,
      resourceCount,
      searchResources,
      tagType,
      changeAnonymousStatus,
      openAddResourceModel,
      openEditResourceModel,

      addModuleModal,
      moduleTitle,

      addResourceModal,
      resourceTitle,

      addModal,
      resourceForm,
      addEditResource,

      deleteResource,
      dateFormat
    }
  }
})
</script>

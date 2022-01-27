<template>
  <el-card class="main-card">
    <yh-table
      :Data="tagList"
      v-bind="tableConfig"
      @add-btn="addEditBtn(null)"
      @del-btn="delModal = true"
      @search-btn="searchTag"
      @selection="selectChange"
      :page="pageConfig"
      :page-count="tagCount"
      @update:page="handlePageStatus"
    >
      <template #header>
        <div class="base-page-title">
          {{ route.name }}
        </div>
      </template>
      <template #createTime="scope">
        {{ dateFormat(scope.row.createTime) }}
      </template>
      <template #edit="scope">
        <el-button type="primary" size="mini" @click="addEditBtn(scope.row)"> 编辑 </el-button>
        <el-popconfirm
          title="确定删除吗？"
          style="margin-left: 1rem"
          @confirm="deleteTag(scope.row.id)"
        >
          <template #reference> <el-button size="mini" type="danger"> 删除 </el-button> </template>>
        </el-popconfirm>
      </template>
    </yh-table>
    <!-- 批量删除对话框 -->
    <el-dialog v-model="delModal" width="30%" title="提示">
      <div style="font-size: 1rem">是否删除选中项？</div>
      <template #footer>
        <div>
          <el-button @click="delModal = false">取 消</el-button>
          <el-button type="primary" @click="deleteTag(null)"> 确 定 </el-button>
        </div>
      </template>
    </el-dialog>
    <!-- 添加编辑对话框 -->
    <el-dialog v-model="addEditModal" width="30%" :title="tagTitle">
      <el-form label-width="80px" size="medium" :model="tagForm">
        <el-form-item label="标签名">
          <el-input v-model="tagForm.tagName" style="width: 220px" />
        </el-form-item>
      </el-form>
      <template #footer>
        <div>
          <el-button @click="addEditModal = false">取 消</el-button>
          <el-button type="primary" @click="confirmAddEditTag"> 确 定 </el-button>
        </div>
      </template>
    </el-dialog>
  </el-card>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted, computed } from 'vue'
import { useRoute } from 'vue-router'
import { useStore } from 'vuex'
import { tableConfig } from './config/tag.config'
import { delTags, updateTags } from '@/api/article/tag'
import { ElMessage } from 'element-plus'
import { dateFormat } from '@/utils/filter'
import YhTable from '@/components/common/table/YhTable.vue'
export default defineComponent({
  components: {
    YhTable
  },
  setup() {
    const route = useRoute()
    const store = useStore()

    onMounted(() => {
      listTags()
    })

    const tagList = computed(() => store.state.tagModule.tagList)
    const tagCount = computed(() => store.state.tagModule.tagCount)
    const keywords = ref('')
    const pageConfig = ref({
      current: 1,
      size: 10
    })
    const listTags = () => {
      store.dispatch('tagModule/getTagList', {
        current: pageConfig.value.current,
        size: pageConfig.value.size,
        keywords: keywords.value
      })
    }

    const searchTag = (key: string) => {
      keywords.value = key
      listTags()
    }

    const addEditModal = ref(false)
    const tagForm = ref({
      id: null,
      tagName: ''
    })
    const tagTitle = ref('')
    const tagIdList = ref()

    const addEditBtn = (tag: any) => {
      if (tag != null) {
        tagForm.value = { ...tag }
        tagTitle.value = '修改标签'
      } else {
        tagForm.value.id = null
        tagForm.value.tagName = ''
        tagTitle.value = '添加标签'
      }
      addEditModal.value = true
    }

    const confirmAddEditTag = () => {
      if (tagForm.value.tagName.trim() == '') {
        ElMessage({
          message: '标签名不能为空',
          type: 'error'
        })
        return false
      }
      updateTags(tagForm.value).then((res) => {
        if (res.data.code) {
          listTags()
        }
        addEditModal.value = false
      })
    }

    const delModal = ref(false)
    const selectChange = (selection: any) => {
      tagIdList.value = []
      selection.forEach((item: any) => {
        tagIdList.value.push(item.id)
      })
    }
    const deleteTag = (id: number | null) => {
      if (id) {
        tagIdList.value = [id]
      }
      delTags(tagIdList.value).then((res) => {
        if (res.data.code) {
          listTags()
        }
        delModal.value = false
      })
    }

    // 分页处理
    const handlePageStatus = (page: { current: number; size: number }) => {
      pageConfig.value = { ...page }
      listTags()
    }

    return {
      route,
      tableConfig,
      tagList,
      tagCount,
      searchTag,
      addEditModal,
      tagTitle,
      tagForm,
      addEditBtn,
      confirmAddEditTag,
      delModal,
      selectChange,
      deleteTag,
      pageConfig,
      handlePageStatus,
      dateFormat
    }
  }
})
</script>

<template>
  <el-card class="main-card">
    <yh-table
      :Data="categoryList"
      v-bind="tableConfig"
      @add-btn="addEditBtn(null)"
      @del-btn="delModal = true"
      @search-btn="searchCategory"
      @selection="selectChange"
      :page="pageConfig"
      :page-count="categoryCount"
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
          @confirm="deleteCategory(scope.row.id)"
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
          <el-button type="primary" @click="deleteCategory(null)"> 确 定 </el-button>
        </div>
      </template>
    </el-dialog>
    <!-- 添加编辑对话框 -->
    <el-dialog v-model="addEditModal" width="30%" :title="categoryTitle">
      <el-form label-width="80px" size="medium" :model="categoryForm">
        <el-form-item label="分类名">
          <el-input v-model="categoryForm.categoryName" style="width: 220px" />
        </el-form-item>
      </el-form>
      <template #footer>
        <div>
          <el-button @click="addEditModal = false">取 消</el-button>
          <el-button type="primary" @click="confirmAddEditCategory"> 确 定 </el-button>
        </div>
      </template>
    </el-dialog>
  </el-card>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted, computed } from 'vue'
import { useRoute } from 'vue-router'
import { useStore } from 'vuex'
import { tableConfig } from './config/category.config'
import { delCategories, updateCategories } from '@/api/article/category'
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
      listCategories()
    })

    const categoryList = computed(() => store.state.categoryModule.categoryList)
    const categoryCount = computed(() => store.state.categoryModule.categoryCount)
    const keywords = ref('')
    const pageConfig = ref({
      current: 1,
      size: 10
    })
    const listCategories = () => {
      store.dispatch('categoryModule/getCategoryList', {
        current: pageConfig.value.current,
        size: pageConfig.value.size,
        keywords: keywords.value
      })
    }

    const searchCategory = (key: string) => {
      keywords.value = key
      listCategories()
    }

    const addEditModal = ref(false)
    const categoryForm = ref({
      id: null,
      categoryName: ''
    })
    const categoryTitle = ref('')
    const categoryIdList = ref()

    const addEditBtn = (category: any) => {
      if (category != null) {
        categoryForm.value = { ...category }
        categoryTitle.value = '修改分类'
      } else {
        categoryForm.value.id = null
        categoryForm.value.categoryName = ''
        categoryTitle.value = '添加分类'
      }
      addEditModal.value = true
    }

    const confirmAddEditCategory = () => {
      if (categoryForm.value.categoryName.trim() == '') {
        ElMessage({
          message: '分类名不能为空',
          type: 'error'
        })
        return false
      }
      updateCategories(categoryForm.value).then((res) => {
        if (res.data.code) {
          listCategories()
        }
        addEditModal.value = false
      })
    }

    const delModal = ref(false)
    const selectChange = (selection: any) => {
      categoryIdList.value = []
      selection.forEach((item: any) => {
        categoryIdList.value.push(item.id)
      })
    }
    const deleteCategory = (id: number | null) => {
      if (id) {
        categoryIdList.value = [id]
      }
      delCategories(categoryIdList.value).then((res) => {
        if (res.data.code) {
          listCategories()
        }
        delModal.value = false
      })
    }

    // 分页处理
    const handlePageStatus = (page: { current: number; size: number }) => {
      pageConfig.value = { ...page }
      listCategories()
    }

    return {
      route,
      tableConfig,
      categoryList,
      categoryCount,
      searchCategory,
      addEditModal,
      categoryTitle,
      categoryForm,
      addEditBtn,
      confirmAddEditCategory,
      delModal,
      selectChange,
      deleteCategory,
      pageConfig,
      handlePageStatus,
      dateFormat
    }
  }
})
</script>

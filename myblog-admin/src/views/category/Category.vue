<template>
  <el-card class="main-card">
    <div class="title">{{ route.name }}</div>
    <!-- 表格操作 -->
    <div class="operation-container">
      <el-button type="primary" size="small" @click="openModel(null)"> 新增 </el-button>
      <el-button
        type="danger"
        size="small"
        :disabled="categoryIdList.length == 0"
        @click="isDelete = true"
      >
        批量删除
      </el-button>
      <div style="margin-left: auto">
        <el-input
          v-model="keywords"
          prefix-icon="el-icon-search"
          size="small"
          placeholder="请输入分类名"
          style="width: 200px"
          @keyup.enter="searchCategories"
        />
        <el-button type="primary" size="small" style="margin-left: 1rem" @click="searchCategories">
          搜索
        </el-button>
      </div>
    </div>
    <!-- 表格展示 -->
    <el-table border :data="categoryList" @selection-change="selectionChange" v-loading="loading">
      <!-- 表格列 -->
      <el-table-column type="selection" width="55" />
      <el-table-column prop="id" label="id" width="320" />

      <!-- 分类名 -->
      <el-table-column prop="categoryName" label="分类名" width="420" />
      <!-- 分类创建时间 -->
      <el-table-column prop="createTime" label="创建时间" width="520" />
      <!-- <template #default="scope">
          <i class="el-icon-time" style="margin-right: 5px" />
          {{ scope.row.createTime }}
        </template>
      </el-table-column> -->
      <!-- 列操作 -->
      <el-table-column label="操作" align="center">
        <template #default="scope">
          <el-button type="primary" size="mini" @click="openModel(scope.row)"> 编辑 </el-button>
          <el-popconfirm
            title="确定删除吗？"
            style="margin-left: 1rem"
            @confirm="deleteCategory(scope.row.id)"
          >
            <template v-slot:reference>
              <el-button size="mini" type="danger"> 删除 </el-button> </template
            >>
          </el-popconfirm>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页 -->
    <el-pagination
      class="pagination-container"
      background
      @size-change="sizeChange"
      @current-change="currentChange"
      :current-page="current"
      :page-size="size"
      :total="count"
      :page-sizes="[10, 20]"
      layout="total, sizes, prev, pager, next, jumper"
    />
    <!-- 批量删除对话框 -->
    <el-dialog v-model="isDelete" width="30%">
      <template v-slot:title>
        <div class="dialog-title-container">
          <i class="el-icon-warning" style="color: #ff9900" />提示
        </div>
      </template>

      <div style="font-size: 1rem">是否删除选中项？</div>
      <template v-slot:footer>
        <div>
          <el-button @click="isDelete = false">取 消</el-button>
          <el-button type="primary" @click="deleteCategory(null)"> 确 定 </el-button>
        </div>
      </template>
    </el-dialog>
    <!-- 添加编辑对话框 -->
    <el-dialog v-model="addOrEdit" width="30%">
      <template v-slot:title><div class="dialog-title-container" ref="categoryTitle" /></template>
      <el-form label-width="80px" size="medium" :model="categoryForm">
        <el-form-item label="分类名">
          <el-input v-model="categoryForm.categoryName" style="width: 220px" />
        </el-form-item>
      </el-form>
      <template v-slot:footer>
        <div>
          <el-button @click="addOrEdit = false">取 消</el-button>
          <el-button type="primary" @click="addOrEditCategory"> 确 定 </el-button>
        </div>
      </template>
    </el-dialog>
  </el-card>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'

import { ElNotification, ElMessage } from 'element-plus'

import yhRequest from '@/utils/request/index'

export default defineComponent({
  setup() {
    const route = useRoute()
    onMounted(() => {
      listCategories()
    })
    const isDelete = ref(false)
    const loading = ref(true)
    const addOrEdit = ref(false)
    const keywords = ref(null)
    const categoryIdList: any = ref([])
    const categoryList = ref([])
    const categoryForm = ref({
      id: null,
      categoryName: ''
    })
    const current = ref(1)
    const size = ref(10)
    const count = ref(0)
    const categoryTitle: any = ref(null)

    const listCategories = () => {
      yhRequest
        .request({
          url: '/admin/categories',
          method: 'GET',
          params: {
            current: current.value,
            size: size.value,
            keywords: keywords.value
          }
        })
        .then((res: any) => {
          categoryList.value = res.data.data.recordList
          count.value = res.data.data.count
          console.log(count.value)

          loading.value = false
        })
    }

    const selectionChange = (list: any) => {
      categoryIdList.value = []
      list.forEach((item: any) => {
        categoryIdList.value.push(item.id)
      })
    }

    const searchCategories = () => {
      current.value = 1
      listCategories()
    }

    const sizeChange = (newSize: number) => {
      size.value = newSize
      listCategories()
    }

    const currentChange = (cur: number) => {
      current.value = cur
      listCategories()
    }

    const deleteCategory = (id: any) => {
      let data = {}

      if (id == null) {
        data = categoryIdList.value
      } else {
        data = [id]
      }
      yhRequest
        .request({
          url: '/admin/categories',
          method: 'DELETE',
          data
        })
        .then((res: any) => {
          console.log(res)

          if (res.data.code) {
            ElNotification({
              title: '成功',
              message: res.data.message,
              type: 'success'
            })
            listCategories()
          } else {
            ElNotification({
              title: '失败',
              message: res.data.message,
              type: 'error'
            })
          }
          isDelete.value = false
        })
    }

    const openModel = (category: any) => {
      console.log(category)

      if (category != null) {
        categoryForm.value = JSON.parse(JSON.stringify(category))
        console.log(categoryForm)

        if (categoryTitle.value) {
          categoryTitle.value.innerHTML = '修改分类'
        }
      } else {
        categoryForm.value.id = null
        categoryForm.value.categoryName = ''
        if (categoryTitle.value) {
          categoryTitle.value.innerHTML = '添加分类'
        }
      }
      addOrEdit.value = true
    }

    const addOrEditCategory = () => {
      if (categoryForm.value.categoryName.trim() == '') {
        ElMessage({
          message: '分类名不能为空',
          type: 'error'
        })
        return false
      }
      console.log(categoryForm.value)

      yhRequest
        .request({
          url: '/admin/categories',
          method: 'POST',
          data: categoryForm.value
        })
        .then((res: any) => {
          console.log(res)

          if (res.data.code) {
            ElNotification({
              title: '成功',
              message: res.data.message,
              type: 'success'
            })
            listCategories()
          } else {
            ElNotification({
              title: '失败',
              message: res.data.message,
              type: 'error'
            })
          }
          addOrEdit.value = false
        })
    }

    return {
      route,
      isDelete,
      loading,
      addOrEdit,
      keywords,
      categoryIdList,
      categoryList,
      categoryForm,
      current,
      size,
      count,
      categoryTitle,

      selectionChange,
      searchCategories,
      sizeChange,
      currentChange,
      deleteCategory,
      openModel,
      addOrEditCategory
    }
  }
})
</script>

<style lang="less" scoped>
.main-card {
  min-height: calc(100vh - 126px);
  .title {
    position: absolute;
    left: 0;
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
  .operation-container {
    display: flex;
    align-items: center;
    margin-bottom: 1.25rem;
    margin-top: 2.25rem;
  }
  .pagination-container {
    float: right;
    margin-top: 1.25rem;
    margin-bottom: 1.25rem;
  }
  .dialog-title-container {
    display: flex;
    align-items: center;
    font-weight: 700;
  }
}
</style>

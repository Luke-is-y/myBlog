<template>
  <el-card class="main-card">
    <div class="title">{{ route.name }}</div>
    <!-- 表格操作 -->
    <div class="operation-container">
      <el-button type="primary" size="small" @click="openModel(null)"> 新增 </el-button>
      <el-button
        type="danger"
        size="small"
        :disabled="tagIdList.length == 0"
        @click="isDelete = true"
      >
        批量删除
      </el-button>
      <div style="margin-left: auto">
        <el-input
          v-model="keywords"
          prefix-icon="el-icon-search"
          size="small"
          placeholder="请输入标签名"
          style="width: 200px"
          @keyup.enter="searchTags"
        />
        <el-button type="primary" size="small" style="margin-left: 1rem" @click="searchTags">
          搜索
        </el-button>
      </div>
    </div>
    <!-- 表格展示 -->
    <el-table border :data="tagList" @selection-change="selectionChange" v-loading="loading">
      <!-- 表格列 -->
      <el-table-column type="selection" width="55" />
      <el-table-column prop="id" label="id" width="320" />

      <!-- 分类名 -->
      <el-table-column prop="tagName" label="标签名" width="420" />
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
            @confirm="deleteTag(scope.row.id)"
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
          <el-button type="primary" @click="deleteTag(null)"> 确 定 </el-button>
        </div>
      </template>
    </el-dialog>
    <!-- 添加编辑对话框 -->
    <el-dialog v-model="addOrEdit" width="30%">
      <template v-slot:title><div class="dialog-title-container" ref="tagTitle" /></template>
      <el-form label-width="80px" size="medium" :model="tagForm">
        <el-form-item label="标签名">
          <el-input v-model="tagForm.tagName" style="width: 220px" />
        </el-form-item>
      </el-form>
      <template v-slot:footer>
        <div>
          <el-button @click="addOrEdit = false">取 消</el-button>
          <el-button type="primary" @click="addOrEditTag"> 确 定 </el-button>
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
      listTags()
    })

    const isDelete = ref(false)
    const loading = ref(true)
    const addOrEdit = ref(false)
    const keywords = ref(null)
    const tagIdList: any = ref([])
    const tagList = ref([])
    const tagForm = ref({
      id: null,
      tagName: ''
    })
    const current = ref(1)
    const size = ref(10)
    const count = ref(0)
    const tagTitle: any = ref(null)

    const listTags = () => {
      yhRequest
        .request({
          url: '/admin/tags',
          method: 'GET',
          params: {
            current: current.value,
            size: size.value,
            keywords: keywords.value
          }
        })
        .then((res: any) => {
          console.log(res)

          tagList.value = res.data.data.recordList
          count.value = res.data.data.count
          console.log(count.value)

          loading.value = false
        })
    }

    const selectionChange = (list: any) => {
      tagIdList.value = []
      list.forEach((item: any) => {
        tagIdList.value.push(item.id)
      })
    }

    const searchTags = () => {
      current.value = 1
      listTags()
    }

    const sizeChange = (newSize: number) => {
      size.value = newSize
      listTags()
    }

    const currentChange = (cur: number) => {
      current.value = cur
      listTags()
    }

    const deleteTag = (id: any) => {
      let data = {}

      if (id == null) {
        data = tagIdList.value
      } else {
        data = [id]
      }
      yhRequest
        .request({
          url: '/admin/tags',
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
            listTags()
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

    const openModel = (tag: any) => {
      console.log(tag)

      if (tag != null) {
        tagForm.value = JSON.parse(JSON.stringify(tag))
        console.log(tagForm)

        if (tagTitle.value) {
          tagTitle.value.innerHTML = '修改标签'
        }
      } else {
        tagForm.value.id = null
        tagForm.value.tagName = ''
        if (tagTitle.value) {
          tagTitle.value.innerHTML = '添加标签'
        }
      }
      addOrEdit.value = true
    }

    const addOrEditTag = () => {
      if (tagForm.value.tagName.trim() == '') {
        ElMessage({
          message: '分类名不能为空',
          type: 'error'
        })
        return false
      }
      console.log(tagForm.value)

      yhRequest
        .request({
          url: '/admin/tags',
          method: 'POST',
          data: tagForm.value
        })
        .then((res: any) => {
          console.log(res)

          if (res.data.code) {
            ElNotification({
              title: '成功',
              message: res.data.message,
              type: 'success'
            })
            listTags()
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
      tagIdList,
      tagList,
      tagForm,
      current,
      size,
      count,
      tagTitle,

      selectionChange,
      searchTags,
      sizeChange,
      currentChange,
      deleteTag,
      openModel,
      addOrEditTag
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

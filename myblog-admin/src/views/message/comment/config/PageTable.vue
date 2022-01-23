<template>
  <el-card class="main-card">
    <!-- 表格展示 -->
    <yh-table
      :Data="commentList"
      v-bind="tableConfig"
      @search-btn="getSelectionData"
      @del-btn="remove = true"
    >
      <template #header>
        <div class="title">
          {{ route.name }}
        </div>
        <div class="review-menu">
          <span>状态</span>
          <span @click="changeStatus(null)" :class="status == null ? 'active-review' : 'review'">
            全部
          </span>
          <span @click="changeStatus(1)" :class="status == 1 ? 'active-review' : 'review'">
            正常
          </span>
          <span @click="changeStatus(0)" :class="status == 0 ? 'active-review' : 'review'">
            审核中
          </span>
        </div>
      </template>
      <template #add>
        <el-button type="success" size="small" @click="updateCommentStatus" icon="plus"
          >批量通过</el-button
        >
      </template>
      <template #avatar="scope">
        <el-image :src="scope.row.avatar" fit="fill"></el-image>
      </template>
      <template #edit="scope">
        <el-button
          v-if="scope.row.status == 0"
          size="mini"
          type="success"
          @click="updateCommentStatus(scope.row.id)"
        >
          通过
        </el-button>
        <el-popconfirm
          style="margin-left: 10px"
          title="确定删除吗？"
          @confirm="deleteComments(scope.row.id)"
        >
          <template v-slot:reference>
            <el-button size="mini" type="danger"> 删除 </el-button>
          </template>
        </el-popconfirm>
      </template>
    </yh-table>
    <!-- 批量彻底删除对话框 -->
    <el-dialog v-model="remove" width="30%">
      <template #title>
        <div class="dialog-title-container">
          <i class="el-icon-warning" style="color: #ff9900" />提示
        </div>
      </template>

      <div style="font-size: 1rem">是否彻底删除选中项？</div>
      <template #footer>
        <el-button @click="remove = false">取 消</el-button>
        <el-button type="primary" @click="deleteComments()"> 确 定 </el-button>
      </template>
    </el-dialog>
  </el-card>
</template>

<script lang="ts">
import { defineComponent, onMounted, ref, watch, computed, PropType } from 'vue'
import { useRoute } from 'vue-router'
import { useStore } from 'vuex'

import yhRequest from '@/utils/service'

import YhTable from '@/components/common/table/YhTable.vue'
import { ITable } from '@/components/common/table/types'

export default defineComponent({
  components: {
    YhTable
  },
  props: {
    tableConfig: {
      type: Object as PropType<ITable>,
      required: true
    }
  },
  setup() {
    const route = useRoute()
    const store = useStore()

    onMounted(() => {
      listComments()
    })
    const commentList = computed(() => store.state.commentModule.commentList)

    const remove = ref(false)

    const commentIdList = ref({})
    const type = ref(0)
    const keywords = ref('')
    const status = ref(null)
    const current = ref(1)
    const size = ref(10)
    const listComments = () => {
      store.dispatch('commentModule/getCommentList', {
        keywords: keywords.value,
        type: type.value,
        status: status.value,
        size: size.value,
        current: current.value
      })
    }

    const getSelectionData = (selection: any[]) => {
      commentIdList.value = selection.map((item: any) => item.id)
    }
    const changeStatus = (review: any) => {
      status.value = review
    }

    const updateCommentStatus = (id?: number) => {
      if (id) {
        commentIdList.value = [id]
      }

      yhRequest
        .request({
          url: '/admin/comments/review',
          method: 'PUT',
          data: {
            status: status.value,
            commentIdList: commentIdList.value
          }
        })
        .then((res) => {
          if (res.data.code) {
            listComments()
          }
        })
    }

    const deleteComments = (id?: any) => {
      if (id) {
        commentIdList.value = [id]
      }
      yhRequest
        .request({
          url: '/admin/comments',
          method: 'DELETE',
          data: commentIdList.value
        })
        .then((res) => {
          if (res.data.code) {
            listComments()
          }
          remove.value = false
        })
    }

    watch(status, () => {
      current.value = 1
      listComments()
    })

    watch(type, () => {
      current.value = 1
      listComments()
    })

    return {
      route,
      remove,
      commentList,
      status,

      getSelectionData,
      changeStatus,
      updateCommentStatus,
      deleteComments
    }
  }
})
</script>

<style scoped>
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
.comment-content {
  display: inline-block;
}
.operation-container {
  margin-top: 1.5rem;
}
.review-menu {
  font-size: 14px;
  margin-top: 40px;
  margin-left: 20px;
  color: #999;
}
.review-menu span {
  margin-right: 24px;
}
.review {
  cursor: pointer;
}
.active-review {
  cursor: pointer;
  color: #333;
  font-weight: bold;
}
</style>

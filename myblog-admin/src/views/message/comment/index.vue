<template>
  <el-card class="main-card">
    <yh-table
      :Data="commentList"
      v-bind="tableConfig"
      @search-btn="searchComment"
      @selection="selectChange"
      @del-btn="removeModal = true"
      @update:page="handlePageStatus"
      :page="pageConfig"
      :page-count="commentCount"
    >
      <template #header>
        <div class="base-page-title">
          {{ route.name }}
        </div>
        <div class="comment__review-menu">
          <span>状态</span>
          <span
            @click="changeStatus(null)"
            :class="isPublished == null ? 'comment__active-review' : 'comment__review'"
          >
            全部
          </span>
          <span
            @click="changeStatus(1)"
            :class="isPublished == 1 ? 'comment__active-review' : 'comment__review'"
          >
            正常
          </span>
          <span
            @click="changeStatus(0)"
            :class="isPublished == 0 ? 'comment__active-review' : 'comment__review'"
          >
            审核中
          </span>
        </div>
      </template>
      <template #add>
        <el-button type="success" size="small" @click="changeCommentStatus" icon="plus"
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
          @click="changeCommentStatus(scope.row.id)"
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
    <el-dialog v-model="removeModal" width="30%">
      <template #title>
        <div class="dialog-title-container">
          <i class="el-icon-warning" style="color: #ff9900" />提示
        </div>
      </template>

      <div style="font-size: 1rem">是否彻底删除选中项？</div>
      <template #footer>
        <el-button @click="removeModal = false">取 消</el-button>
        <el-button type="primary" @click="deleteComments()"> 确 定 </el-button>
      </template>
    </el-dialog>
  </el-card>
</template>

<script lang="ts">
import { defineComponent, onMounted, ref, computed } from 'vue'
import { useRoute } from 'vue-router'
import { useStore } from 'vuex'
import { updateCommentsStatus, delComments } from '@/api/message/comment'
import { tableConfig } from './config/comment.config'
import YhTable from '@/components/common/table/YhTable.vue'

export default defineComponent({
  components: {
    YhTable
  },
  setup() {
    const route = useRoute()
    const store = useStore()

    onMounted(() => {
      listComments()
    })

    const pageConfig = ref({
      current: 1,
      size: 10
    })
    const keywords = ref('')
    const commentList = computed(() => store.state.commentModule.commentList)
    const commentCount = computed(() => store.state.commentModule.commentCount)

    const listComments = () => {
      store.dispatch('commentModule/getCommentList', {
        keywords: keywords.value,
        isPublished: isPublished.value,
        size: pageConfig.value.size,
        current: pageConfig.value.current
      })
    }

    const commentIdList = ref()
    const isPublished = ref<number | null>(null)

    const searchComment = (key: string) => {
      keywords.value = key
      listComments()
    }
    const selectChange = (selection: any) => {
      commentIdList.value = selection.map((item: any) => item.id)
    }

    const changeStatus = (review: number | null) => {
      isPublished.value = review
      pageConfig.value.current = 1
      listComments()
    }

    const changeCommentStatus = (id?: number) => {
      if (id) {
        commentIdList.value = [id]
      }
      isPublished.value = 1
      updateCommentsStatus({
        isPublished: isPublished.value,
        idList: commentIdList.value
      }).then((res) => {
        if (res.data.code) {
          listComments()
        }
      })
    }
    const removeModal = ref(false)
    const deleteComments = (id?: number) => {
      if (id) {
        commentIdList.value = [id]
      }
      delComments(commentIdList.value).then((res) => {
        if (res.data.code) {
          listComments()
        }
        removeModal.value = false
      })
    }

    const handlePageStatus = (page: { current: number; size: number }) => {
      pageConfig.value = { ...page }
      listComments()
    }

    return {
      route,
      pageConfig,
      handlePageStatus,
      commentCount,
      tableConfig,
      isPublished,
      commentList,
      searchComment,
      selectChange,
      changeStatus,
      changeCommentStatus,
      removeModal,
      deleteComments
    }
  }
})
</script>

<style scoped>
.comment__review-menu {
  font-size: 14px;
  margin-top: 40px;
  margin-left: 20px;
  color: #999;
}
.comment__review-menu span {
  margin-right: 24px;
}
.comment__review {
  cursor: pointer;
}
.comment__active-review {
  cursor: pointer;
  color: #333;
  font-weight: bold;
}
</style>

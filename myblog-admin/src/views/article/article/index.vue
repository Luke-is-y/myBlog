<template>
  <el-card class="article-card">
    <div class="page-base-title">{{ route.name }}</div>
    <!-- 文章标题 -->
    <div class="article-card__header">
      <el-input v-model="article.articleTitle" size="medium" placeholder="输入文章标题" />
      <el-button type="danger" size="medium" @click="openModel" style="margin-left: 10px">
        发布文章
      </el-button>
    </div>

    <mavon-editor
      ref="mavon"
      v-model="article.articleContent"
      style="height: calc(100vh - 260px)"
      @imgAdd="handleImgAdd"
    />
    <modal
      :article-data="article"
      :show-modal="showModal"
      @change-modal-status="changeModalStatus"
    />
  </el-card>
</template>

<script lang="ts">
import { defineComponent, onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'
import { ElMessage } from 'element-plus'
import { getArticleContent, uploadImg } from '@/api/article/article'
import modal from './components/modal.vue'

export default defineComponent({
  components: {
    modal
  },

  setup() {
    const route = useRoute()

    onMounted(() => {
      const arr = route.path.split('/')
      const articleId = parseInt(arr[2])
      if (articleId) {
        getArticleContent(articleId).then((res) => {
          article.value = res.data.data
        })
      } else {
        const art = sessionStorage.getItem('article')
        if (art) {
          article.value = JSON.parse(art)
        }
      }
    })
    const showModal = ref(false)
    const token = ref('')

    const article = ref({
      id: null,
      articleTitle: '',
      articleContent: '',
      articleCover: '',
      categoryName: null,
      tagNameList: [],
      isTop: false,
      status: 1,
      isCommentEnabled: false,
      isAppreciation: false
    })
    const openModel = () => {
      if (article.value.articleTitle.trim() == '') {
        ElMessage({
          message: '文章标题不能为空',
          type: 'error'
        })
        return false
      }
      if (article.value.articleContent.trim() == '') {
        ElMessage({
          message: '文章内容不能为空',
          type: 'error'
        })
        return false
      }
      showModal.value = true
    }

    const mavon = ref()
    const handleImgAdd = (filenames: string, file: any) => {
      const formdata = new FormData()
      formdata.append('file', file)
      formdata.append('token', token.value)
      uploadImg(formdata).then((res) => {
        mavon.value.$img2Url(filenames, res.data.fileUrl)
      })
    }

    const changeModalStatus = (status: boolean) => {
      showModal.value = status
    }

    return {
      route,
      showModal,
      article,
      openModel,
      handleImgAdd,
      mavon,
      changeModalStatus
    }
  }
})
</script>

<style scoped>
.page-base-title {
  position: absolute;
  left: 0;
  font-size: 16px;
  font-weight: 700;
  color: #202a34;
}

.page-base-title:before {
  content: '';
  width: 24px;
  height: 16px;
  border-left: 3px solid #0081ff;
  margin-right: 20px;
}

.article-card__header {
  display: flex;
  align-items: center;
  margin-bottom: 1.25rem;
  margin-top: 2.25rem;
}
.article-card__header-save-btn {
  margin-left: 0.75rem;
  background: #fff;
  color: #f56c6c;
}
</style>

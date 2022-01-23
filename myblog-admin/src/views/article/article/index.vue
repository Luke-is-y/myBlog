<template>
  <el-card class="main-card">
    <div class="title">{{ route.name }}</div>
    <!-- 文章标题 -->
    <div class="article-title-container">
      <el-input v-model="article.articleTitle" size="medium" placeholder="输入文章标题" />
      <el-button
        type="danger"
        size="medium"
        class="save-btn"
        @click="saveArticleDraft"
        v-if="article.id == null || article.status == 3"
      >
        保存草稿
      </el-button>
      <el-button type="danger" size="medium" @click="openModel" style="margin-left: 10px">
        发布文章
      </el-button>
    </div>
    <!-- 文章内容 -->
    <!-- @imgAdd="uploadImg" -->

    <mavon-editor
      ref="mavon"
      v-model="article.articleContent"
      style="height: calc(100vh - 260px)"
      @imgAdd="handleImgAdd"
    />
    <!-- 添加文章对话框 -->
    <el-dialog v-model="addOrEdit" width="40%" top="3vh">
      <template #title>
        <div class="dialog-title-container">发布文章</div>
      </template>

      <!-- 文章数据 -->
      <el-form label-width="80px" size="medium" :model="article" class="form-style">
        <!-- 文章分类 -->
        <el-form-item label="文章分类">
          <el-tag
            type="success"
            v-show="article.categoryName"
            style="margin: 0 1rem 0 0"
            :closable="true"
            @close="removeCategory"
          >
            {{ article.categoryName }}
          </el-tag>
          <!-- 分类选项 -->
          <el-popover
            placement="bottom-start"
            :width="460"
            trigger="click"
            v-if="!article.categoryName"
          >
            <div class="popover-title">分类</div>
            <!-- 搜索框 -->
            <el-autocomplete
              style="width: 100%"
              v-model="categoryName"
              :fetch-suggestions="searchCategories"
              placeholder="请输入分类名搜索，enter可添加自定义分类"
              :trigger-on-focus="false"
              @keyup.enter="saveCategory"
              @select="handleSelectCategories"
            >
              <template #default="{ item }">
                <div>{{ item.categoryName }}</div>
              </template>
            </el-autocomplete>
            <!-- 分类 -->
            <div class="popover-container">
              <div
                v-for="item of categoryList"
                :key="item['id']"
                class="category-item"
                @click="addCategory(item)"
              >
                {{ item['categoryName'] }}
              </div>
            </div>
            <template #reference>
              <el-button type="success" plain size="small"> 添加分类 </el-button>
            </template>
          </el-popover>
        </el-form-item>
        <!-- 文章标签 -->
        <el-form-item label="文章标签">
          <el-tag
            v-for="(item, index) of article.tagNameList"
            :key="index"
            style="margin: 0 1rem 0 0"
            :closable="true"
            @close="removeTag(item)"
          >
            {{ item }}
          </el-tag>
          <!-- 标签选项 -->
          <el-popover
            placement="bottom-start"
            width="460"
            trigger="click"
            v-if="article.tagNameList.length < 3"
          >
            <div class="popover-title">标签</div>
            <!-- 搜索框 -->
            <el-autocomplete
              style="width: 100%"
              v-model="tagName"
              :fetch-suggestions="searchTags"
              placeholder="请输入标签名搜索，enter可添加自定义标签"
              :trigger-on-focus="false"
              @keyup.enter="saveTag"
              @select="handleSelectTag"
            >
              <template #default="{ item }">
                <div>{{ item.tagName }}</div>
              </template>
            </el-autocomplete>
            <!-- 标签 -->
            <div class="popover-container">
              <div style="margin-bottom: 1rem">添加标签</div>
              <el-tag
                v-for="(item, index) of tagList"
                :key="index"
                :class="tagClass(item)"
                @click="addTag(item)"
              >
                {{ item['tagName'] }}
              </el-tag>
            </div>
            <template #reference>
              <el-button type="primary" plain size="small"> 添加标签 </el-button>
            </template>
          </el-popover>
        </el-form-item>
        <el-form-item label="上传封面">
          <el-upload
            class="upload-demo"
            drag
            action="http://upload-cn-east-2.qiniup.com"
            :data="{ token }"
            multiple
            :on-success="uploadCover"
            :before-upload="uploadBefore"
          >
            <!-- <el-icon class="el-icon--upload"><UploadFilled /></el-icon> -->
            <!-- </template> -->
            <div class="el-upload__text" v-if="article.articleCover == ''">
              将文件拖到此次，或<em>点击上传</em>
            </div>
            <img v-else :src="article.articleCover" width="360" height="180" alt="" />
          </el-upload>
        </el-form-item>
        <el-form-item label="评论">
          <el-switch
            v-model="article.isCommentEnabled"
            active-color="#13ce66"
            inactive-color="#F4F4F5"
            :active-value="true"
            :inactive-value="false"
          />
        </el-form-item>
        <el-form-item label="赞赏">
          <el-switch
            v-model="article.isAppreciation"
            active-color="#13ce66"
            inactive-color="#F4F4F5"
            :active-value="true"
            :inactive-value="false"
          />
        </el-form-item>
        <el-form-item label="置顶">
          <el-switch
            v-model="article.isTop"
            active-color="#13ce66"
            inactive-color="#F4F4F5"
            :active-value="true"
            :inactive-value="false"
          />
        </el-form-item>
        <el-form-item label="发布形式">
          <el-radio-group v-model="article.status">
            <el-radio :label="1">公开</el-radio>
            <el-radio :label="2">私密</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="私密密码" v-if="article.status == 2" style="width: 300px">
          <el-input v-model="article.password"></el-input>
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="addOrEdit = false">取 消</el-button>
        <el-button type="danger" @click="saveOrUpdateArticle"> 发 表 </el-button>
      </template>
    </el-dialog>
  </el-card>
</template>

<script lang="ts">
import { defineComponent, onMounted, ref, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'

import { ElMessage } from 'element-plus'
import axios from 'axios'
import yhRequest from '@/utils/service'

// import { mavonEditor } from 'mavon-editor'

export default defineComponent({
  setup() {
    const route = useRoute()
    const router = useRouter()

    onMounted(() => {
      const arr = route.path.split('/')
      const articleId = arr[2]
      if (articleId) {
        yhRequest
          .request({
            url: `/articles/${articleId}`,
            method: 'GET'
          })
          .then((res) => {
            article.value = res.data.data
          })
      } else {
        const art = sessionStorage.getItem('article')
        if (art) {
          article.value = JSON.parse(art)
        }
      }
      yhRequest
        .request({
          url: '/getQiniuCloudUpToken',
          method: 'GET'
        })
        .then((res) => {
          console.log(res)
          token.value = res.data.data
        })
    })
    const md = ref(null)
    const addOrEdit = ref(false)
    const autoSave = ref(true)
    const categoryName = ref('')
    const tagName = ref('')
    const categoryList = ref([])
    const tagList = ref([])
    const current = ref(1)
    const size = ref(10)
    const token = ref('')

    const article = ref({
      id: null,
      // this.$moment(new Date()).format('YYYY-MM-DD'),
      articleTitle: '',
      articleContent: '',
      articleCover: '',
      categoryName: null,
      categoryId: null,
      tagNameList: [],
      tagIdList: [],
      isTop: false,
      status: 1,
      password: '', // 密码保护
      isCommentEnabled: false,
      isAppreciation: false
    })

    const listCategories = () => {
      yhRequest
        .request({
          url: '/admin/categories',
          method: 'GET',
          params: {
            current: current.value,
            size: size.value
          }
        })
        .then((res) => {
          console.log(res, 'categories')

          categoryList.value = res.data.data.recordList
        })
    }
    const listTags = () => {
      yhRequest
        .request({
          url: '/admin/tags',
          method: 'GET',
          params: {
            current: current.value,
            size: size.value
          }
        })
        .then((res) => {
          console.log(res, 'tag')

          tagList.value = res.data.data.recordList
        })
    }
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
      listCategories()
      listTags()
      addOrEdit.value = true
    }
    const uploadCover = (response: any) => {
      console.log(response.fileUrl)

      article.value.articleCover = response.fileUrl
    }
    const saveArticleDraft = () => {
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
      article.value.status = 3
      yhRequest
        .request({
          url: '/admin/articles',
          method: 'POST',
          data: article.value
        })
        .then((res) => {
          console.log(res)
        })
      //关闭自动保存功能
      autoSave.value = false
    }
    const uploadBefore = () => {
      console.log(token.value)
    }
    const saveOrUpdateArticle = () => {
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
      if (article.value.categoryId == null) {
        ElMessage({
          message: '文章分类不能为空',
          type: 'error'
        })
        return false
      }
      if (article.value.tagNameList.length == 0) {
        ElMessage({
          message: '文章标签不能为空',
          type: 'error'
        })
        return false
      }
      if (article.value.articleCover.trim() == '') {
        ElMessage({
          message: '文章封面不能为空',
          type: 'error'
        })
        return false
      }
      const {
        articleTitle,
        articleContent,
        articleCover,
        categoryName,
        tagNameList,
        isTop,
        status,
        password,
        isCommentEnabled,
        isAppreciation
      } = article.value

      const obj = {
        articleTitle,
        articleContent,
        articleCover,
        categoryName,
        tagNameList,
        isTop,
        status,
        password,
        isCommentEnabled,
        isAppreciation
      }
      console.log(JSON.stringify(obj))

      yhRequest
        .request({
          url: '/admin/articles',
          method: 'POST',
          data: article.value
        })
        .then((res) => {
          addOrEdit.value = false
          router.push('/article-list')
        })
      //关闭自动保存功能
      autoSave.value = false
    }

    const autoSaveArticle = () => {
      // 自动上传文章
      if (
        autoSave.value &&
        article.value.articleTitle.trim() != '' &&
        article.value.articleContent.trim() != '' &&
        article.value.id != null
      ) {
        yhRequest
          .request({
            url: '/admin/articles',
            method: 'POST',
            data: article.value
          })
          .then((res) => {
            console.log(res)
          })
      }
      // 保存本地文章记录
      // if (autoSave.value && article.value.id == null) {
      //   sessionStorage.setItem('article', JSON.stringify(article.value))
      // }
    }
    const searchCategories = (keywords: any, cb: any) => {
      yhRequest
        .request({
          url: '/admin/categories',
          method: 'GET',
          params: {
            keywords: keywords
          }
        })
        .then((res) => {
          cb(res.data.data)
        })
    }
    const handleSelectCategories = (item: any) => {
      addCategory({
        categoryName: item.categoryName
      })
    }

    const saveCategory = () => {
      if (categoryName.value.trim() != '') {
        addCategory({
          categoryName: categoryName.value
        })
        categoryName.value = ''
      }
    }
    const addCategory = (item: any) => {
      article.value.categoryName = item.categoryName
      article.value.categoryId = item.id
    }
    const removeCategory = () => {
      article.value.categoryName = null
      article.value.categoryId = null
    }
    const searchTags = (keywords: any, cb: any) => {
      yhRequest
        .request({
          url: '/admin/tags',
          method: 'GET',
          params: {
            keywords: keywords
          }
        })
        .then((res) => {
          cb(res.data.data)
        })
    }
    const handleSelectTag = (item: any) => {
      addTag({
        tagName: item.tagName
      })
    }
    const saveTag = () => {
      if (tagName.value.trim() != '') {
        addTag({
          tagName: tagName.value
        })
        tagName.value = ''
      }
    }
    const addTag = (item: any) => {
      if (article.value.tagNameList.indexOf(item.tagName as never) == -1) {
        article.value.tagIdList.push(item.id as never)
        article.value.tagNameList.push(item.tagName as never)
      }
    }
    const removeTag = (item: string) => {
      const index = article.value.tagNameList.indexOf(item as never)
      article.value.tagNameList.splice(index, 1)
      article.value.tagIdList.splice(index, 1)
    }

    const tagClass = computed(() => {
      return function (item: any) {
        const index = article.value.tagNameList.indexOf(item.tagName as never)
        return index != -1 ? 'tag-item-select' : 'tag-item'
      }
    })

    const mavon = ref()
    const handleImgAdd = (filenames: string, file: any) => {
      const formdata = new FormData()
      formdata.append('file', file)
      formdata.append('token', token.value)
      axios({
        url: 'http://upload-cn-east-2.qiniup.com',
        method: 'POST',
        data: formdata,
        headers: { 'Content-Type': 'multipart/form-data' }
      }).then((res) => {
        mavon.value.$img2Url(filenames, res.data.fileUrl)
      })
    }

    return {
      route,
      md,
      addOrEdit,
      autoSave,
      categoryName,
      tagName,
      categoryList,
      tagList,
      article,
      token,

      listCategories,
      listTags,
      openModel,
      uploadCover,
      // beforeUpload,
      // uploadImg
      saveArticleDraft,
      saveOrUpdateArticle,
      autoSaveArticle,
      searchCategories,
      handleSelectCategories,
      saveCategory,
      addCategory,
      removeCategory,
      searchTags,
      handleSelectTag,
      saveTag,
      addTag,
      removeTag,
      tagClass,
      uploadBefore,
      handleImgAdd,
      mavon
    }
  }
  // destroyed() {
  //   //文章自动保存功能
  //   this.autoSaveArticle()
  // }
})
</script>

<style scoped>
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

.form-style > .el-form-item /deep/ .el-form-item__content {
  text-align: left;
}
.article-title-container {
  display: flex;
  align-items: center;
  margin-bottom: 1.25rem;
  margin-top: 2.25rem;
}
.save-btn {
  margin-left: 0.75rem;
  background: #fff;
  color: #f56c6c;
}
.tag-item {
  margin-right: 1rem;
  margin-bottom: 1rem;
  cursor: pointer;
}
.tag-item-select {
  margin-right: 1rem;
  margin-bottom: 1rem;
  cursor: not-allowed;
  color: #ccccd8 !important;
}
.category-item {
  cursor: pointer;
  padding: 0.6rem 0.5rem;
}
.category-item:hover {
  background-color: #f0f9eb;
  color: #67c23a;
}
.popover-title {
  margin-bottom: 1rem;
  text-align: center;
}
.popover-container {
  margin-top: 1rem;
  height: 260px;
  overflow-y: auto;
}

.dialog-title-container {
  display: flex;
  align-items: center;
  font-weight: 700;
}
</style>

<template>
  <!-- 添加文章对话框 -->
  <el-dialog :model-value="showModal" width="40%" top="3vh" @close="closeDialog">
    <template #title>
      <div class="article-dialog_title">发布文章</div>
    </template>

    <!-- 文章数据 -->
    <el-form label-width="80px" size="medium" :model="article" class="article-dialog_form">
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
          <div class="article-dialog_popover-title">分类</div>
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
          <div class="article-dialog_popover-container">
            <div
              v-for="item of categoryList"
              :key="item['id']"
              class="article-dialog_form-category"
              @click="addCategory(item['categoryName'])"
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
          <div class="article-dialog_popover-title">标签</div>
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
          <div class="article-dialog_popover-container">
            <div style="margin-bottom: 1rem">添加标签</div>
            <el-tag
              v-for="(item, index) of tagList"
              :key="index"
              :class="tagClass(item)"
              @click="addTag(item['tagName'])"
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
          drag
          action="http://upload-cn-east-2.qiniup.com"
          :data="{ token }"
          multiple
          :on-success="uploadCover"
        >
          <el-icon class="el-icon--upload"><UploadFilled /></el-icon>
          <div v-if="article.articleCover == ''">将文件拖到此次，或<em>点击上传</em></div>
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
      <el-button @click="hideModal">取 消</el-button>
      <el-button type="danger" @click="updateArticle"> 发 表 </el-button>
    </template>
  </el-dialog>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted, computed, watch } from 'vue'
import { useRouter } from 'vue-router'
import { publishArticle } from '@/api/article/article'
import { getCategories } from '@/api/article/category'
import { getTags } from '@/api/article/tag'
import { getQiniuToken } from '@/api/system/website'
import { ElMessage } from 'element-plus'

export default defineComponent({
  emits: ['changeModalStatus'],
  props: {
    articleData: {
      type: Object,
      default: () => ({})
    },

    showModal: {
      type: Boolean,
      default: false
    }
  },

  setup(props, { emit }) {
    const router = useRouter()
    onMounted(() => {
      getCategoriesList()
      getTagsList()
      getToken()
    })

    const article = ref(JSON.parse(JSON.stringify(props.articleData)))
    const categoryName = ref('')
    const categoryList = ref([])
    const tagName = ref('')
    const tagList = ref([])
    const current = ref(1)
    const size = ref(10)
    const token = ref('')

    watch(
      () => props.articleData,
      (newData) => {
        article.value = JSON.parse(JSON.stringify(newData))
      },
      {
        deep: true
      }
    )

    // 获取分类列表
    const getCategoriesList = () => {
      getCategories({
        current: current.value,
        size: size.value
      }).then((res) => {
        categoryList.value = res.data.data.recordList
      })
    }

    const removeCategory = () => {
      article.value.categoryName = null
    }

    const searchCategories = (keywords: string, cb: any) => {
      getCategories({
        keywords: keywords,
        current: current.value,
        size: size.value
      }).then((res) => {
        cb(res.data.data.recordList)
      })
    }

    const saveCategory = () => {
      if (categoryName.value.trim() != '') {
        addCategory(categoryName.value)
        categoryName.value = ''
      }
    }

    const handleSelectCategories = (item: any) => {
      addCategory(item.categoryName)
    }

    const addCategory = (categoryName: string) => {
      article.value.categoryName = categoryName
    }

    const getTagsList = () => {
      getTags({
        current: current.value,
        size: size.value
      }).then((res) => {
        tagList.value = res.data.data.recordList
      })
    }

    const removeTag = (item: string) => {
      const index = article.value.tagNameList.indexOf(item as never)
      article.value.tagNameList.splice(index, 1)
    }

    const searchTags = (keywords: any, cb: any) => {
      getTags({
        keywords: keywords.value
      }).then((res) => {
        cb(res.data.data)
      })
    }

    const saveTag = () => {
      if (tagName.value.trim() != '') {
        addTag(tagName.value)
        tagName.value = ''
      }
    }

    const handleSelectTag = (item: any) => {
      addTag(item.tagName)
    }

    const addTag = (tagName: string) => {
      if (article.value.tagNameList.indexOf(tagName) == -1) {
        article.value.tagNameList.push(tagName)
      }
    }

    const tagClass = computed(() => {
      return function (item: any) {
        const index = article.value.tagNameList.indexOf(item.tagName)
        return index != -1 ? 'article-dialog_tag-item-select' : 'article-dialog_tag-item'
      }
    })

    const getToken = () => {
      getQiniuToken().then((res) => {
        token.value = res.data.data
      })
    }

    const uploadCover = (response: any) => {
      article.value.articleCover = response.fileUrl
    }

    const hideModal = () => {
      emit('changeModalStatus', false)
    }

    const updateArticle = () => {
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

      if (article.value.categoryName == '') {
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
      publishArticle(article.value).then((res) => {
        if (res.data.success) {
          emit('changeModalStatus', false)
          router.push('/article-list')
        }
      })
    }

    const closeDialog = () => {
      emit('changeModalStatus', false)
    }

    return {
      article,
      categoryName,
      categoryList,
      removeCategory,
      searchCategories,
      saveCategory,
      handleSelectCategories,
      addCategory,

      tagName,
      tagList,
      removeTag,
      searchTags,
      saveTag,
      handleSelectTag,
      addTag,
      tagClass,

      token,
      uploadCover,

      hideModal,
      updateArticle,
      closeDialog
    }
  }
})
</script>

<style lang="less">
.article-dialog_title {
  display: flex;
  align-items: center;
  font-weight: 700;
}

.article-dialog_form > .el-form-item /deep/ .el-form-item__content {
  text-align: left;
}

.article-dialog_form-category {
  cursor: pointer;
  padding: 0.6rem 0.5rem;
}
.article-dialog_form-category:hover {
  background-color: #f0f9eb;
  color: #67c23a;
}

.article-dialog_tag-item {
  margin-right: 1rem;
  margin-bottom: 1rem;
  cursor: pointer;
}
.article-dialog_tag-item-select {
  margin-right: 1rem;
  margin-bottom: 1rem;
  cursor: not-allowed;
  color: #ccccd8 !important;
}
.article-dialog_popover-title {
  margin-bottom: 1rem;
  text-align: center;
}
.article-dialog_popover-container {
  margin-top: 1rem;
  height: 260px;
  overflow-y: auto;
}
</style>

<template>
  <el-card class="main-card">
    <yh-table
      :Data="articleList"
      v-bind="tableConfig"
      :page="pageConfig"
      :page-count="articleCount"
      @del-btn="changeModalStatus"
      @selection="changeSelectData"
      @update:page="handlePageStatus"
    >
      <template #header>
        <div class="base-page-title">
          {{ route.name }}
        </div>
        <div class="articleList__article-status-menu">
          <span>状态</span>
          <span @click="changeStauts(null)" :class="isActive(null)">全部</span>
          <span @click="changeStauts(1)" :class="isActive(1)"> 公开 </span>
        </div>
      </template>
      <template #search>
        <div>
          <!-- 分类 -->
          <el-select
            clearable
            size="small"
            v-model="searchConfig.categoryId"
            filterable
            placeholder="请选择分类"
            style="margin-right: 1rem"
          >
            <el-option
              v-for="item in categoryList"
              :key="item['id']"
              :label="item['categoryName']"
              :value="item['id']"
            />
          </el-select>
          <!-- 标签 -->
          <el-select
            clearable
            size="small"
            v-model="searchConfig.tagId"
            filterable
            placeholder="请选择标签"
            style="margin-right: 1rem"
          >
            <el-option
              v-for="item in tagList"
              :key="item['id']"
              :label="item['tagName']"
              :value="item['id']"
              class="infinite-list-item"
            />
          </el-select>
          <!-- 文章名 -->
          <el-input
            clearable
            v-model="searchConfig.keywords"
            prefix-icon="el-icon-search"
            size="small"
            placeholder="请输入文章名"
            style="width: 200px"
            @keyup.enter="searchArticles"
          />
          <el-button type="primary" size="small" style="margin-left: 1rem" @click="searchArticles">
            搜索
          </el-button>
        </div>
      </template>
      <template #articleCover="scope">
        <el-image class="articleList__article-cover" :src="scope.row.articleCover" />
      </template>
      <template #tagDTOList="scope">
        <el-tag
          v-for="item of scope.row.tagDTOList"
          :key="item.tagId"
          style="margin-right: 0.2rem; margin-top: 0.2rem"
        >
          {{ item.tagName }}
        </el-tag>
      </template>
      <template #viewCount="scope">
        <span v-if="scope.row.viewCount">
          {{ scope.row.viewCount }}
        </span>
        <span v-else>0</span>
      </template>
      <template #createTime="scope">
        {{ dateFormat(scope.row.createTime) }}
      </template>
      <template #isTop="scope">
        <el-switch
          v-model="scope.row.isTop"
          active-color="#13ce66"
          inactive-color="#F4F4F5"
          :active-value="true"
          :inactive-value="false"
          @change="changeTop(scope.row)"
        />
      </template>
      <template #edit="scope">
        <el-button type="primary" size="mini" @click="editArticle(scope.row.id)"> 编辑 </el-button>
        <el-popconfirm
          title="确定删除吗？"
          style="margin-left: 10px"
          @confirm="deleteArticles(scope.row.id)"
        >
          <template #reference>
            <el-button size="mini" type="danger"> 删除 </el-button>
          </template>
        </el-popconfirm>
      </template>
    </yh-table>
    <!-- 批量逻辑删除对话框 -->
    <el-dialog v-model="showModal" width="30%" title="提示">
      <div class="articleList__dialog-content">是否删除选中项？</div>
      <template #footer>
        <el-button @click="showModal = false">取 消</el-button>
        <el-button type="primary" @click="deleteArticles(null)"> 确 定 </el-button>
      </template>
    </el-dialog>
  </el-card>
</template>

<script lang="ts">
import { defineComponent, computed, ref, onMounted, watch } from 'vue'
import { useStore } from 'vuex'
import { useRoute, useRouter } from 'vue-router'

import YhTable from '@/components/common/table/YhTable.vue'
import { tableConfig } from './config/articleList.config'

import { updateIsTopStatus, deleteArticlesApi } from '@/api/article/article'

import { dateFormat } from '@/utils/filter'
import * as _ from 'lodash'

export default defineComponent({
  components: {
    YhTable
  },
  setup() {
    const store = useStore()
    const route = useRoute()
    const router = useRouter()

    onMounted(() => {
      listArticles()
      listCategories()
      listTags()
    })

    const articleList = computed(() => store.state.articleModule.articleList)
    const articleCount = computed(() => store.state.articleModule.articleCount)
    const pageConfig = ref({
      current: 1,
      size: 10
    })
    const categoryList = computed(() => store.state.categoryModule.categoryList)
    const pageCategoryConfig = ref({
      current: 1,
      size: 10
    })
    const tagList = computed(() => store.state.tagModule.tagList)
    const pageTagConfig = ref({
      current: 1,
      size: 10
    })
    const keywords = ref('')

    const searchConfig = ref({
      categoryId: null,
      tagId: null,
      keywords: ''
    })

    watch(searchConfig.value, () => {
      listArticles()
    })

    // 获取文章列表数据
    const listArticles = () => {
      store.dispatch('articleModule/getArticleList', {
        current: pageConfig.value.current,
        size: pageConfig.value.size,
        keywords: searchConfig.value.keywords,
        categoryId: searchConfig.value.categoryId,
        tagId: searchConfig.value.tagId,
        status: articleStatus.value
      })
    }

    const listCategories = () => {
      store.dispatch('categoryModule/getCategoryList', {
        current: pageCategoryConfig.value.current,
        size: pageCategoryConfig.value.size,
        keywords: keywords.value
      })
    }

    const listTags = () => {
      store.dispatch('tagModule/getTagList', {
        current: pageTagConfig.value.current,
        size: pageTagConfig.value.size,
        keywords: keywords.value
      })
    }

    const articleStatus = ref<number | null>(null)
    const changeStauts = (statusId: number | null) => {
      articleStatus.value = statusId
      listArticles()
    }

    const isActive = (statusId: number | null) => {
      return articleStatus.value === statusId ? 'articleList__active-status' : 'articleList__status'
    }

    // 改变置顶状态
    const changeTop = (article: any) => {
      updateIsTopStatus(article)
    }

    // 查询文章
    const searchArticles = () => {
      listArticles()
    }

    // 操作
    const showModal = ref(false)
    const isDelete = ref(1)
    const articleIdList: any = ref([])
    const editArticle = (id: any) => {
      router.push({ path: '/articles/' + id })
    }
    const deleteArticles = (id: any) => {
      if (id) {
        articleIdList.value = [id]
      }

      deleteArticlesApi({
        idList: articleIdList.value,
        isDelete: isDelete.value
      }).then((res: any) => {
        if (res.data.code) {
          articleStatus.value = null
          listArticles()
        }
        showModal.value = false
      })
    }

    const changeSelectData = (data: any) => {
      articleIdList.value = data.map((item: any) => item.id)
    }

    // 处理分页
    const handlePageStatus = (page: { current: number; size: number }) => {
      pageConfig.value = { ...page }
      listArticles()
    }

    // 控制弹窗
    const changeModalStatus = () => {
      showModal.value = true
    }

    return {
      route,
      tableConfig,
      pageConfig,
      articleList,
      articleCount,
      categoryList,
      tagList,
      searchConfig,
      changeStauts,
      isActive,
      changeTop,
      searchArticles,
      showModal,
      editArticle,
      deleteArticles,
      changeSelectData,
      changeModalStatus,
      handlePageStatus,
      dateFormat
    }
  }
})
</script>

<style>
.articleList__article-status-menu {
  font-size: 14px;
  text-align: left;
  margin: 20px 0 0 20px;
  color: #999;
}

.articleList__article-status-menu > * {
  margin-right: 24px;
}

.articleList__active-status {
  cursor: pointer;
  color: #333;
  font-weight: bold;
}

.articleList__status {
  cursor: pointer;
}

.articleList__article-cover {
  width: 50px;
}

.articleList__dialog-content {
  font-size: 1rem;
}

.infinite-list {
  height: 300px;
  padding: 0;
  margin: 0;
  list-style: none;
}

.infinite-list .infinite-list-item {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 50px;
  margin: 10px;
}
</style>

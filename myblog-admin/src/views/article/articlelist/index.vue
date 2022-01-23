<template>
  <el-card class="main-card">
    <div class="title">{{ route.name }}</div>
    <!-- 文章状态 -->
    <div class="article-status-menu">
      <span>状态</span>
      <span @click="changeStauts('all')" :class="isActive('all')">全部</span>
      <span @click="changeStauts('public')" :class="isActive('public')"> 公开 </span>
      <span @click="changeStauts('secret')" :class="isActive('secret')"> 私密 </span>
      <span @click="changeStauts('draft')" :class="isActive('draft')"> 草稿箱 </span>
      <span @click="changeStauts('delete')" :class="isActive('delete')"> 回收站 </span>
    </div>
    <!-- 表格操作 -->
    <div class="operation-container">
      <el-button
        v-if="isDelete == 0"
        type="danger"
        size="small"
        :disabled="articleIdList.length == 0"
        @click="updateIsDelete = true"
      >
        批量删除
      </el-button>
      <el-button
        v-else
        type="danger"
        size="small"
        :disabled="articleIdList.length == 0"
        @click="remove = true"
      >
        批量删除
      </el-button>
      <!-- 条件筛选 -->
      <div style="margin-left: auto">
        <!-- 文章类型 -->
        <el-select
          clearable
          v-model="type"
          placeholder="请选择文章类型"
          size="small"
          style="margin-right: 1rem"
        >
          <el-option
            v-for="item in typeList"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
        <!-- 分类 -->
        <el-select
          clearable
          size="small"
          v-model="categoryId"
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
          v-model="tagId"
          filterable
          placeholder="请选择标签"
          style="margin-right: 1rem"
        >
          <el-option
            v-for="item in tagList"
            :key="item['id']"
            :label="item['tagName']"
            :value="item['id']"
          />
        </el-select>
        <!-- 文章名 -->
        <el-input
          clearable
          v-model="keywords"
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
    </div>
    <!-- 表格展示 -->
    <el-table border :data="articleList" @selection-change="selectionChange" v-loading="loading">
      <!-- 表格列 -->
      <el-table-column type="selection" width="55" />
      <!-- 文章修改时间 -->
      <el-table-column prop="articleCover" label="文章封面" width="180" align="center">
        <template #default="scope">
          <el-image
            class="article-cover"
            :src="
              scope.row.articleCover
                ? scope.row.articleCover
                : 'https://www.static.talkxj.com/articles/c5cc2b2561bd0e3060a500198a4ad37d.png'
            "
          />
          <i v-if="scope.row.status == 1" class="iconfont el-icon-mygongkai article-status-icon" />
          <i v-if="scope.row.status == 2" class="iconfont el-icon-mymima article-status-icon" />
          <i
            v-if="scope.row.status == 3"
            class="iconfont el-icon-mycaogaoxiang article-status-icon"
          />
        </template>
      </el-table-column>
      <!-- 文章标题 -->
      <el-table-column prop="articleTitle" label="标题" align="center" width="170" />
      <!-- 文章分类 -->
      <el-table-column prop="categoryName" label="分类" width="110" align="center" />
      <!-- 文章标签 -->
      <el-table-column prop="tagDTOList" label="标签" width="270" align="center">
        <template #default="scope">
          <el-tag
            v-for="item of scope.row.tagDTOList"
            :key="item.tagId"
            style="margin-right: 0.2rem; margin-top: 0.2rem"
          >
            {{ item.tagName }}
          </el-tag>
        </template>
      </el-table-column>
      <!-- 文章浏览量 -->
      <el-table-column prop="viewsCount" label="浏览量" width="110" align="center">
        <template #default="scope">
          <span v-if="scope.row.viewsCount">
            {{ scope.row.viewsCount }}
          </span>
          <span v-else>0</span>
        </template>
      </el-table-column>
      <!-- 文章点赞量 -->
      <el-table-column prop="likeCount" label="点赞量" width="110" align="center">
        <template #default="scope">
          <span v-if="scope.row.likeCount">
            {{ scope.row.likeCount }}
          </span>
          <span v-else>0</span>
        </template>
      </el-table-column>
      <!-- 文章发表时间 -->
      <el-table-column prop="createTime" label="发表时间" width="370" align="center" />
      <!-- 文章置顶 -->
      <el-table-column prop="isTop" label="置顶" width="80" align="center">
        <template #default="scope">
          <el-switch
            v-model="scope.row.isTop"
            active-color="#13ce66"
            inactive-color="#F4F4F5"
            :disabled="scope.row.isDelete == 1"
            :active-value="1"
            :inactive-value="0"
            @change="changeTop(scope.row)"
          />
        </template>
      </el-table-column>
      <!-- 列操作 -->
      <el-table-column label="操作" align="center">
        <template #default="scope">
          <el-button type="primary" size="mini" @click="editArticle(scope.row.id)">
            编辑
          </el-button>
          <el-popconfirm
            title="确定删除吗？"
            style="margin-left: 10px"
            @confirm="updateArticleDelete(scope.row.id)"
          >
            <template #reference>
              <el-button size="mini" type="danger"> 删除 </el-button>
            </template>
          </el-popconfirm>
          <!-- <el-popconfirm
            title="确定恢复吗？"
            v-if="scope.row.isDelete == 1"
            @confirm="updateArticleDelete(scope.row.id)"
          >
            <el-button size="mini" type="success"> 恢复 </el-button>
          </el-popconfirm>
          <el-popconfirm
            style="margin-left: 10px"
            v-if="scope.row.isDelete == 1"
            title="确定彻底删除吗？"
            @confirm="deleteArticles(scope.row.id)"
          >
            <el-button size="mini" type="danger"> 删除 </el-button>
          </el-popconfirm> -->
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
    <!-- 批量逻辑删除对话框 -->
    <el-dialog v-model="updateIsDelete" width="30%">
      <div class="dialog-title-container">
        <i class="el-icon-warning" style="color: #ff9900" />提示
      </div>
      <div style="font-size: 1rem">是否删除选中项？</div>
      <div>
        <el-button @click="updateIsDelete = false">取 消</el-button>
        <el-button type="primary" @click="updateArticleDelete(null)"> 确 定 </el-button>
      </div>
    </el-dialog>
    <!-- 批量彻底删除对话框 -->
    <el-dialog v-model="remove" width="30%">
      <div class="dialog-title-container">
        <i class="el-icon-warning" style="color: #ff9900" />提示
      </div>
      <div style="font-size: 1rem">是否彻底删除选中项？</div>
      <div>
        <el-button @click="remove = false">取 消</el-button>
        <el-button type="primary" @click="deleteArticles(null)"> 确 定 </el-button>
      </div>
    </el-dialog>
  </el-card>
</template>

<script lang="ts">
import { defineComponent, onMounted, ref, computed, watch } from 'vue'
import { useRouter, useRoute } from 'vue-router'

import { ElNotification } from 'element-plus'

import yhRequest from '@/utils/service'

export default defineComponent({
  setup() {
    const router = useRouter()
    const route = useRoute()
    onMounted(() => {
      listArticles()
      listCategories()
      listTags()
    })

    const loading = ref(true)
    const updateIsDelete = ref(false)
    const remove = ref(false)
    const typeList = ref([
      {
        value: 1,
        label: '原创'
      },
      {
        value: 2,
        label: '转载'
      },
      {
        value: 3,
        label: '翻译'
      }
    ])
    const activeStatus = ref('')
    const articleList = ref([])
    const articleIdList: any = ref([])
    const categoryList = ref([])
    const tagList = ref([])
    const keywords = ref('')
    const type = ref(null)
    const categoryId = ref(null)
    const tagId = ref(null)
    const isDelete = ref(1)
    const status = ref(0)
    const current = ref(1)
    const size = ref(10)
    const count = ref(0)

    const listArticles = () => {
      yhRequest
        .request({
          url: '/admin/articles',
          method: 'GET',
          params: {
            current: current.value,
            size: size.value,
            keywords: keywords.value
          }
        })
        .then((res: any) => {
          console.log(res)

          articleList.value = res.data.data.recordList
          console.log(articleList.value, ' 222')

          count.value = res.data.data.count
          loading.value = false
        })
    }
    //     categoryId: categoryId.value,
    // status: status.value,
    // tagId: tagId.value,
    // type: type.value,
    // isDelete: isDelete.value

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
            size: size.value,
            keywords: keywords.value
          }
        })
        .then((res) => {
          console.log(res, 'tag')
          tagList.value = res.data.data.recordList
        })
    }

    const selectionChange = () => {
      articleIdList.value = []
      articleList.value.forEach((item: any) => {
        articleIdList.value.push(item.id)
      })
    }

    const searchArticles = () => {
      current.value = 1
      listArticles()
    }

    const editArticle = (id: any) => {
      router.push({ path: '/articles/' + id })
    }

    const updateArticleDelete = (id: any) => {
      let idList: any = []
      let tempIsDelete = isDelete.value == 0 ? 1 : 0
      if (id != null) {
        idList.push(id)
      } else {
        idList = articleIdList.value
      }
      yhRequest
        .request({
          url: '/admin/articles',
          method: 'POST',
          data: {
            idList,
            tempIsDelete
          }
        })
        .then((res: any) => {
          if (res.data.code) {
            listArticles()
          }
          updateIsDelete.value = false
        })
    }

    const deleteArticles = (id: any) => {
      let data = {}
      if (id == null) {
        data = articleIdList.value
      } else {
        data = [id]
      }
      yhRequest
        .request({
          url: '/admin/articles',
          method: 'DELETE',
          data
        })
        .then((res: any) => {
          if (res.data.code) {
            listArticles()
          }
          remove.value = false
        })
    }

    const sizeChange = (newSize: any) => {
      size.value = newSize
      listArticles()
    }

    const currentChange = (cur: any) => {
      current.value = cur
      listArticles()
    }

    const changeStauts = (newStatus: any) => {
      switch (newStatus) {
        case 'all':
          isDelete.value = 0
          status.value = 0
          break
        case 'public':
          isDelete.value = 0
          status.value = 1
          break
        case 'secret':
          isDelete.value = 0
          status.value = 2
          break
        case 'draft':
          isDelete.value = 0
          status.value = 3
          break
        case 'delete':
          isDelete.value = 1
          status.value = 0
          break
      }
      activeStatus.value = newStatus
    }

    const changeTop = (article: any) => {
      yhRequest
        .request({
          url: '/admin/articles',
          method: 'POST',
          data: {
            id: article.id,
            isTop: article.isTop
          }
        })
        .then((res) => {
          if (res.data.code) {
            ElNotification({
              title: '成功',
              message: '置顶成功',
              type: 'success'
            })
          }
          remove.value = false
        })
    }

    const articleType = computed(() => {
      return function (type: any) {
        var tagType = ''
        var name = ''
        switch (type) {
          case 1:
            tagType = 'danger'
            name = '原创'
            break
          case 2:
            tagType = 'success'
            name = '转载'
            break
          case 3:
            tagType = 'primary'
            name = '翻译'
            break
        }
        return {
          tagType: tagType,
          name: name
        }
      }
    })

    const isActive = computed(() => {
      return function (status: any) {
        return activeStatus.value == status ? 'active-status' : 'status'
      }
    })

    watch(type, () => {
      current.value = 1
      listArticles()
    })

    watch(categoryId, () => {
      current.value = 1
      listArticles()
    })
    watch(tagId, () => {
      current.value = 1
      listArticles()
    })
    watch(status, () => {
      current.value = 1
      listArticles()
    })
    watch(isDelete, () => {
      current.value = 1
      listArticles()
    })

    return {
      route,
      loading,
      updateIsDelete,
      remove,
      typeList,
      articleList,
      articleIdList,
      categoryList,
      tagList,
      keywords,
      type,
      categoryId,
      tagId,
      isDelete,
      current,
      size,
      count,

      selectionChange,
      searchArticles,
      editArticle,
      updateArticleDelete,
      deleteArticles,
      sizeChange,
      currentChange,
      changeStauts,
      changeTop,
      articleType,
      isActive
    }
  }
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
.operation-container {
  display: flex;
  align-items: center;
  margin-bottom: 1.25rem;
  margin-top: 1.5rem;
}
.article-status-menu {
  font-size: 14px;
  text-align: left;
  margin-top: 40px;
  color: #999;
}
.article-status-menu span {
  margin-right: 24px;
}
.status {
  cursor: pointer;
}
.active-status {
  cursor: pointer;
  color: #333;
  font-weight: bold;
}
.article-cover {
  position: relative;
  width: 100%;
  height: 90px;
  border-radius: 4px;
}
.article-cover::after {
  content: '';
  background: rgba(0, 0, 0, 0.3);
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
}
.article-status-icon {
  color: #fff;
  font-size: 1.5rem;
  position: absolute;
  right: 1rem;
  bottom: 1.4rem;
}
</style>

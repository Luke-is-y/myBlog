<template>
  <div class="page-table">
    <yh-table :Data="userData" v-bind="tableConfig" v-model:page="pageInfo" :pageCount="pageCount">
      <template #icon="scope">
        <el-icon>
          <component :is="scope.row.icon"></component>
        </el-icon>
      </template>
      <template #edit>
        <div class="table-btns">
          <el-button type="primary" size="small">编辑</el-button>
          <el-button type="danger" size="small">删除</el-button>
        </div>
      </template>
    </yh-table>
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType, ref } from 'vue'
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
    const userData = [
      {
        id: 1,
        name: '首页',
        path: '/',
        component: '/home/Home.vue',
        icon: 'homeFilled',
        createTime: '2021-01-26T09:06:51.000+00:00',
        orderNum: 1,
        isDisable: null,
        isHidden: 0,
        children: []
      },
      {
        id: 2,
        name: '文章管理',
        path: '/article-submenu',
        component: 'Layout',
        icon: 'document',
        createTime: '2021-01-25T12:43:07.000+00:00',
        orderNum: 2,
        isDisable: null,
        isHidden: 0,
        children: [
          {
            id: 6,
            name: '发布文章',
            path: '/articles',
            component: '/article/Article.vue',
            icon: 'el-icon-myfabiaowenzhang',
            createTime: '2021-01-26T06:30:48.000+00:00',
            orderNum: 1,
            isDisable: null,
            isHidden: 0,
            children: null
          },
          {
            id: 7,
            name: '修改文章',
            path: '/articles/*',
            component: '/article/Article.vue',
            icon: 'el-icon-myfabiaowenzhang',
            createTime: '2021-01-26T06:31:32.000+00:00',
            orderNum: 2,
            isDisable: null,
            isHidden: 1,
            children: null
          },
          {
            id: 8,
            name: '文章列表',
            path: '/article-list',
            component: '/article/ArticleList.vue',
            icon: 'el-icon-mywenzhangliebiao',
            createTime: '2021-01-26T06:32:13.000+00:00',
            orderNum: 3,
            isDisable: null,
            isHidden: 0,
            children: null
          },
          {
            id: 9,
            name: '分类管理',
            path: '/categories',
            component: '/category/Category.vue',
            icon: 'el-icon-myfenlei',
            createTime: '2021-01-26T06:33:42.000+00:00',
            orderNum: 4,
            isDisable: null,
            isHidden: 0,
            children: null
          },
          {
            id: 10,
            name: '标签管理',
            path: '/tags',
            component: '/tag/Tag.vue',
            icon: 'el-icon-myicontag',
            createTime: '2021-01-26T06:34:33.000+00:00',
            orderNum: 5,
            isDisable: null,
            isHidden: 0,
            children: null
          }
        ]
      },
      {
        id: 3,
        name: '消息管理',
        path: '/message-submenu',
        component: 'Layout',
        icon: 'el-icon-myxiaoxi',
        createTime: '2021-01-25T12:44:17.000+00:00',
        orderNum: 3,
        isDisable: null,
        isHidden: 0,
        children: [
          {
            id: 11,
            name: '评论管理',
            path: '/comments',
            component: '/comment/Comment.vue',
            icon: 'el-icon-mypinglunzu',
            createTime: '2021-01-26T06:35:31.000+00:00',
            orderNum: 1,
            isDisable: null,
            isHidden: 0,
            children: null
          },
          {
            id: 12,
            name: '留言管理',
            path: '/messages',
            component: '/message/Message.vue',
            icon: 'el-icon-myliuyan',
            createTime: '2021-01-26T06:36:09.000+00:00',
            orderNum: 2,
            isDisable: null,
            isHidden: 0,
            children: null
          }
        ]
      },
      {
        id: 202,
        name: '用户管理',
        path: '/users-submenu',
        component: 'Layout',
        icon: 'el-icon-myyonghuliebiao',
        createTime: '2021-02-06T15:44:59.000+00:00',
        orderNum: 4,
        isDisable: null,
        isHidden: 0,
        children: [
          {
            id: 13,
            name: '用户列表',
            path: '/users',
            component: '/user/User.vue',
            icon: 'el-icon-myyonghuliebiao',
            createTime: '2021-01-26T06:38:09.000+00:00',
            orderNum: 1,
            isDisable: null,
            isHidden: 0,
            children: null
          },
          {
            id: 201,
            name: '在线用户',
            path: '/online/users',
            component: '/user/Online.vue',
            icon: 'el-icon-myyonghuliebiao',
            createTime: '2021-02-05T06:59:51.000+00:00',
            orderNum: 7,
            isDisable: null,
            isHidden: 0,
            children: null
          }
        ]
      },
      {
        id: 213,
        name: '权限管理',
        path: '/permission-submenu',
        component: 'Layout',
        icon: 'el-icon-mydaohanglantubiao_quanxianguanli',
        createTime: '2021-08-07T11:56:55.000+00:00',
        orderNum: 4,
        isDisable: null,
        isHidden: 0,
        children: [
          {
            id: 14,
            name: '角色管理',
            path: '/roles',
            component: '/role/Role.vue',
            icon: 'el-icon-myjiaoseliebiao',
            createTime: '2021-01-26T06:39:01.000+00:00',
            orderNum: 2,
            isDisable: null,
            isHidden: 0,
            children: null
          },
          {
            id: 15,
            name: '接口管理',
            path: '/resources',
            component: '/resource/Resource.vue',
            icon: 'el-icon-myjiekouguanli',
            createTime: '2021-01-26T06:40:14.000+00:00',
            orderNum: 2,
            isDisable: null,
            isHidden: 0,
            children: null
          },
          {
            id: 16,
            name: '菜单管理',
            path: '/menus',
            component: '/menu/Menu.vue',
            icon: 'el-icon-mycaidan',
            createTime: '2021-01-26T06:40:54.000+00:00',
            orderNum: 2,
            isDisable: null,
            isHidden: 0,
            children: null
          }
        ]
      },
      {
        id: 4,
        name: '系统管理',
        path: '/system-submenu',
        component: 'Layout',
        icon: 'el-icon-myshezhi',
        createTime: '2021-01-25T12:45:57.000+00:00',
        orderNum: 5,
        isDisable: null,
        isHidden: 0,
        children: [
          {
            id: 214,
            name: '网站管理',
            path: '/website',
            component: '/website/Website.vue',
            icon: 'el-icon-myxitong',
            createTime: '2021-08-07T12:06:41.000+00:00',
            orderNum: 1,
            isDisable: null,
            isHidden: 0,
            children: null
          },
          {
            id: 209,
            name: '页面管理',
            path: '/pages',
            component: '/page/Page.vue',
            icon: 'el-icon-myyemianpeizhi',
            createTime: '2021-08-04T03:36:27.000+00:00',
            orderNum: 2,
            isDisable: null,
            isHidden: 0,
            children: null
          },
          {
            id: 17,
            name: '友链管理',
            path: '/links',
            component: '/friendLink/FriendLink.vue',
            icon: 'el-icon-mydashujukeshihuaico-',
            createTime: '2021-01-26T06:41:35.000+00:00',
            orderNum: 3,
            isDisable: null,
            isHidden: 0,
            children: null
          },
          {
            id: 18,
            name: '关于我',
            path: '/about',
            component: '/about/About.vue',
            icon: 'el-icon-myguanyuwo',
            createTime: '2021-01-26T06:42:05.000+00:00',
            orderNum: 4,
            isDisable: null,
            isHidden: 0,
            children: null
          }
        ]
      },
      {
        id: 205,
        name: '相册管理',
        path: '/album-submenu',
        component: 'Layout',
        icon: 'el-icon-myimage-fill',
        createTime: '2021-08-03T07:10:54.000+00:00',
        orderNum: 5,
        isDisable: null,
        isHidden: 0,
        children: [
          {
            id: 206,
            name: '相册列表',
            path: '/albums',
            component: '/album/Album.vue',
            icon: 'el-icon-myzhaopian',
            createTime: '2021-08-03T12:29:19.000+00:00',
            orderNum: 1,
            isDisable: null,
            isHidden: 0,
            children: null
          },
          {
            id: 208,
            name: '照片管理',
            path: '/albums/:albumId',
            component: '/album/Photo.vue',
            icon: 'el-icon-myzhaopian',
            createTime: '2021-08-03T13:37:47.000+00:00',
            orderNum: 1,
            isDisable: null,
            isHidden: 1,
            children: null
          },
          {
            id: 210,
            name: '照片回收站',
            path: '/photos/delete',
            component: '/album/Delete.vue',
            icon: 'el-icon-myhuishouzhan',
            createTime: '2021-08-05T05:55:19.000+00:00',
            orderNum: 3,
            isDisable: null,
            isHidden: 1,
            children: null
          }
        ]
      },
      {
        id: 19,
        name: '日志管理',
        path: '/log-submenu',
        component: 'Layout',
        icon: 'el-icon-myguanyuwo',
        createTime: '2021-01-31T13:33:56.000+00:00',
        orderNum: 6,
        isDisable: null,
        isHidden: 0,
        children: [
          {
            id: 20,
            name: '操作日志',
            path: '/operation/log',
            component: '/log/Operation.vue',
            icon: 'el-icon-myguanyuwo',
            createTime: '2021-01-31T07:53:21.000+00:00',
            orderNum: 1,
            isDisable: null,
            isHidden: 0,
            children: null
          }
        ]
      },
      {
        id: 5,
        name: '个人中心',
        path: '/setting',
        component: '/setting/Setting.vue',
        icon: 'el-icon-myuser',
        createTime: '2021-01-26T09:22:38.000+00:00',
        orderNum: 7,
        isDisable: null,
        isHidden: 0,
        children: []
      }
    ]
    const pageInfo = ref({
      currentPage: 1,
      size: 10
    })
    const pageCount = ref(10)
    return {
      userData,
      pageInfo,
      pageCount
    }
  }
})
</script>

<style lang="less" scoped>
.table-btns {
  text-align: center;
}
</style>

export const allRoutes = [
  {
    path: '/',
    name: '首页',
    component: () => import('@/views/home/index.vue')
  },
  {
    path: '/articles',
    component: () => import('@/views/article/article/index.vue')
  },
  {
    path: '/articles/:id',
    component: () => import('@/views/article/article/index.vue')
  },
  {
    path: '/article-list',
    component: () => import('@/views/article/articlelist/index.vue')
  },
  {
    path: '/categories',
    component: () => import('@/views/article/category/index.vue')
  },
  {
    path: '/tags',
    component: () => import('@/views/article/tag/index.vue')
  },
  {
    path: '/comments',
    component: () => import('@/views/message/comment/index.vue')
  },
  {
    path: '/messages',
    component: () => import('@/views/message/leavemessage/index.vue')
  },
  {
    path: '/users',
    component: () => import('@/views/user/userlist/index.vue')
  },
  {
    path: '/roles',
    component: () => import('@/views/permission/role/index.vue')
  },
  {
    path: '/resources',
    component: () => import('@/views/permission/resource/index.vue')
  },
  {
    path: '/menus',
    component: () => import('@/views/permission/menu/index.vue')
  },
  {
    path: '/website',
    component: () => import('@/views/system/website/index.vue')
  },
  {
    path: '/pages',
    component: () => import('@/views/system/page/index.vue')
  },
  {
    path: '/links',
    component: () => import('@/views/system/friendLink/index.vue')
  },
  {
    path: '/about',
    component: () => import('@/views/system/about/index.vue')
  },
  {
    path: '/albums',
    component: () => import('@/views/album/Album.vue')
  },
  {
    path: '/albums/:albumId',
    component: () => import('@/views/album/Photo.vue')
  },
  {
    path: '/photos/delete',
    component: () => import('@/views/album/Delete.vue')
  },
  {
    path: '/operation/log',
    component: () => import('@/views/log/operationlog/index.vue')
  },
  {
    path: '/operation/errlog',
    component: () => import('@/views/log/errorlog/index.vue')
  },
  {
    path: '/setting',
    name: '个人中心',
    component: () => import('@/views/setting/index.vue')
  }
]

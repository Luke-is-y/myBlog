import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router'

const routes: Array<RouteRecordRaw> = [
  {
    path: '/login',
    component: () => import('@/views/login/Login.vue')
  },
  {
    path: '/register',
    component: () => import('@/views/register/index.vue')
  },
  {
    path: '/index',
    name: 'index',
    component: () => import('@/layout/index.vue'),
    children: []
  }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

router.beforeEach((to, from, next) => {
  if (to.path == '/login' || to.path == '/register') {
    next()
  } else if (window.localStorage.getItem('token')) {
    next()
  } else {
    next('/login')
  }
})

export default router

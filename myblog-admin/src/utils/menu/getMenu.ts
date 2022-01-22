import store from '@/store/index'
import router from '@/router/index'

import yhRequest from '@/utils/request'

import Layout from '@/layout/index.vue'

export async function generaMenu(): Promise<any> {
  return new Promise((resolve) => {
    // 查询用户菜单
    yhRequest
      .request({
        url: '/admin/user/menus',
        method: 'GET'
      })
      .then((res) => {
        if (res.data.code) {
          const userMenuList = res.data.data
          userMenuList.forEach((item: any) => {
            if (item.icon != null) {
              item.icon = 'iconfont ' + item.icon
            }
            if (item.component == 'Layout') {
              item.component = Layout
            }
            if (item.children && item.children.length > 0) {
              item.children.forEach((route: any) => {
                route.icon = 'iconfont ' + route.icon
                const url = route.component
                route.component = () => require(`@/views${url}`).default // 直接使用route.component会报错
              })
            }
            // 添加菜单到路由
            router.addRoute(item)
          })
          // 添加侧边栏菜单
          store.commit('saveUserMenuList', userMenuList)
          resolve(userMenuList)
        } else {
          // Vue.prototype.$message.error(data.message)
          router.push({ path: '/login' })
        }
      })
  })
}

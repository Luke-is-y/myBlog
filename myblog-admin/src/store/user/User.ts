import { Module } from 'vuex'
import { IRootState } from '../types'
import { IUserState } from './type'

import router from '@/router/index'
import { allRoutes } from '@/router/allroutes'

import yhRequest from '@/utils/service'

const userModule: Module<IUserState, IRootState> = {
  namespaced: true,
  state() {
    return {
      id: 0,
      username: '',
      userMenuList: [],
      userList: []
    }
  },
  mutations: {
    login(state, user) {
      state.id = user.id
      state.username = user.username
    },
    saveUserList(state, userList) {
      state.userList = userList
    },
    saveUserMenuList(state, userMenuList) {
      state.userMenuList = userMenuList
      // 添加菜单到路由
      userMenuList.forEach((item: any) => {
        if (item.icon != null) {
          item.icon = 'iconfont ' + item.icon
        }
        item.component = allRoutes.find((val) => {
          return item.path === val.path
        })?.component

        if (item.children && item.children.length > 0) {
          item.children.forEach((route: any) => {
            route.icon = 'iconfont ' + route.icon
            route.component = allRoutes.find((item) => {
              return route.path ? item.path === route.path : item.name === route.name
            })?.component
          })
        }
        router.addRoute(item)
      })
    },
    logout(state) {
      state.id = 0
      state.username = ''
      state.userMenuList = []
    },
    updateUserInfo(state, user) {
      state.username = user.username
    }
  },
  actions: {
    async generaMenu({ commit }) {
      // 查询用户菜单
      const res = await yhRequest.request({
        url: '/admin/user/menus',
        method: 'GET'
      })
      window.sessionStorage.setItem('userMenu', JSON.stringify(res.data.data))
      // 添加侧边栏菜单
      console.log(res.data.data)

      commit('saveUserMenuList', res.data.data)
    },

    async getUserList({ commit }) {
      const res = await yhRequest.request({
        url: '/admin/users',
        method: 'GET'
      })

      commit('saveUserList', res.data.data.recordList)
    }
  }
}

export default userModule

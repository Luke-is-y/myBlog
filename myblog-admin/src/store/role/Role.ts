import { Module } from 'vuex'

import { IRole } from './types'
import { IRootState } from '../types'

import yhRequest from '@/utils/request'

const roleModule: Module<IRole, IRootState> = {
  namespaced: true,
  state() {
    return {
      roleList: [],
      roleListCount: 0,
      resourceList: [],
      menuList: []
    }
  },
  mutations: {
    changeRoleList(state, payload) {
      state.roleList = payload
    },
    changeRoleListCount(state, payload) {
      state.roleListCount = payload
    },
    changeResourceList(state, payload) {
      state.resourceList = payload
    },
    changeMenuList(state, payload) {
      state.menuList = payload
    }
  },
  actions: {
    async getRoleList({ commit }, payload) {
      const res = await yhRequest.request({
        url: '/admin/roles',
        method: 'GET',
        params: payload
      })

      commit('changeRoleList', res.data.data.recordList)
      commit('changeRoleListCount', res.data.data.count)
    },
    async getResourceList({ commit }, payload) {
      const res = await yhRequest.request({
        url: '/admin/role/resources',
        method: 'GET',
        params: payload
      })

      commit('changeResourceList', res.data.data)
    },
    async getMenuList({ commit }, payload) {
      const res = await yhRequest.request({
        url: '/admin/role/menus',
        method: 'GET',
        params: payload
      })
      commit('changeMenuList', res.data.data)
    }
  }
}

export default roleModule

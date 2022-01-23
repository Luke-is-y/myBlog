import { Module } from 'vuex'

import { IMenu } from './types'
import { IRootState } from '../types'

import yhRequest from '@/utils/service'

const menuModule: Module<IMenu, IRootState> = {
  namespaced: true,
  state() {
    return { menuList: [] }
  },
  mutations: {
    changeMenuList(state, payload) {
      state.menuList = payload
    }
  },
  actions: {
    async getMenuList({ commit }, payload) {
      const res = await yhRequest.request({
        url: '/admin/menus',
        method: 'GET',
        params: payload
      })
      commit('changeMenuList', res.data.data)
    }
  }
}

export default menuModule

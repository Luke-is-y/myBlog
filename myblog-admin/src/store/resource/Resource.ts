import { Module } from 'vuex'
import { IResource } from './types'
import { IRootState } from '../types'

import yhRequest from '@/utils/service'

const resourceModule: Module<IResource, IRootState> = {
  namespaced: true,
  state() {
    return {
      resourceList: []
    }
  },
  mutations: {
    changeResourceList(state, payload) {
      state.resourceList = payload
    }
  },
  actions: {
    async getResourceList({ commit }, payload) {
      const res = await yhRequest.request({
        url: '/admin/resources',
        method: 'GET',
        params: payload
      })
      commit('changeResourceList', res.data.data)
    }
  }
}

export default resourceModule

import { Module } from 'vuex'

import { ILog } from './types'
import { IRootState } from '../types'

import yhRequest from '@/utils/service'

const logModule: Module<ILog, IRootState> = {
  namespaced: true,
  state() {
    return {
      logList: [],
      logCount: 0
    }
  },
  mutations: {
    saveLogList(state, payload) {
      state.logList = payload.recordList
      state.logCount = payload.count
    }
  },
  actions: {
    async getLogList({ commit }, payload) {
      const res = await yhRequest.request({
        url: '/admin/operation/logs',
        method: 'GET',
        params: payload
      })
      commit('saveLogList', res.data.data)
    }
  }
}

export default logModule

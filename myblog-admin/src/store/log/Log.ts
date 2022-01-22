import { Module } from 'vuex'

import { ILog } from './types'
import { IRootState } from '../types'

import yhRequest from '@/utils/request'

const logModule: Module<ILog, IRootState> = {
  namespaced: true,
  state() {
    return { logList: [] }
  },
  mutations: {
    saveLogList(state, payload) {
      console.log(payload)

      state.logList = payload
    }
  },
  actions: {
    async getLogList({ commit }, payload) {
      const res = await yhRequest.request({
        url: '/admin/operation/logs',
        method: 'GET',
        params: payload
      })
      console.log(res.data)

      commit('saveLogList', res.data.data.recordList)
    }
  }
}

export default logModule

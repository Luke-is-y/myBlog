import { Module } from 'vuex'

import { IErrLog } from './types'
import { IRootState } from '../types'

import yhRequest from '@/utils/service'

const errlogModule: Module<IErrLog, IRootState> = {
  namespaced: true,
  state() {
    return {
      errlogList: [],
      errlogCount: 0
    }
  },
  mutations: {
    saveErrlogList(state, payload) {
      state.errlogList = payload.recordList
      state.errlogCount = payload.count
    }
  },
  actions: {
    async getErrlogList({ commit }, payload) {
      const res = await yhRequest.request({
        url: '/admin/operation/errLogs',
        method: 'GET',
        params: payload
      })
      commit('saveErrlogList', res.data.data)
    }
  }
}

export default errlogModule

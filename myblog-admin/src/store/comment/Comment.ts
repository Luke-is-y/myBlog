import { Module } from 'vuex'

import { IComment } from './types'
import { IRootState } from '../types'

import yhRequest from '@/utils/service'

const commentModule: Module<IComment, IRootState> = {
  namespaced: true,
  state() {
    return { commentList: [] }
  },
  mutations: {
    saveCommentList(state, payload) {
      state.commentList = payload
    }
  },
  actions: {
    async getCommentList({ commit }, payload) {
      console.log(payload)

      const res = await yhRequest.request({
        url: '/admin/comments',
        method: 'GET',
        params: payload
      })
      commit('saveCommentList', res.data.data.recordList)
    }
  }
}

export default commentModule

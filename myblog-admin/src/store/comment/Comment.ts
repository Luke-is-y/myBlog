import { Module } from 'vuex'

import { IComment } from './types'
import { IRootState } from '../types'

import yhRequest from '@/utils/service'

const commentModule: Module<IComment, IRootState> = {
  namespaced: true,
  state() {
    return {
      commentList: [],
      commentCount: 0
    }
  },
  mutations: {
    saveCommentList(state, payload) {
      ;(state.commentList = payload.recordList), (state.commentCount = payload.count)
    }
  },
  actions: {
    async getCommentList({ commit }, payload) {
      const res = await yhRequest.request({
        url: '/admin/comments',
        method: 'GET',
        params: payload
      })
      commit('saveCommentList', res.data.data)
    }
  }
}

export default commentModule

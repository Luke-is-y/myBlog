import { Module } from 'vuex'

import { ITag } from './types'
import { IRootState } from '../types'

import { getTags } from '@/api/article/tag/index'

const tagModule: Module<ITag, IRootState> = {
  namespaced: true,
  state() {
    return {
      tagList: [],
      tagCount: 0
    }
  },
  mutations: {
    saveTagList(state, payload) {
      state.tagList = payload.recordList
      state.tagCount = payload.count
    }
  },
  actions: {
    async getTagList({ commit }, payload) {
      const res = await getTags(payload)
      commit('saveTagList', res.data.data)
    }
  }
}

export default tagModule

import { Module } from 'vuex'

import { IArticle } from './types'
import { IRootState } from '../types'

import { getArticleList } from '@/api/article/article/index'

const articleModule: Module<IArticle, IRootState> = {
  namespaced: true,
  state() {
    return {
      articleList: [],
      articleCount: 0
    }
  },
  mutations: {
    saveArticleList(state, payload) {
      state.articleList = payload.recordList
      state.articleCount = payload.count
    }
  },
  actions: {
    async getArticleList({ commit }, payload) {
      const res = await getArticleList(payload)
      commit('saveArticleList', res.data.data)
    }
  }
}

export default articleModule

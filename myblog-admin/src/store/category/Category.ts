import { Module } from 'vuex'

import { ICategory } from './types'
import { IRootState } from '../types'

import { getCategories } from '@/api/article/category/index'

const categoryModule: Module<ICategory, IRootState> = {
  namespaced: true,
  state() {
    return {
      categoryList: [],
      categoryCount: 0
    }
  },
  mutations: {
    saveCategoryList(state, payload) {
      state.categoryList = payload.recordList
      state.categoryCount = payload.count
    }
  },
  actions: {
    async getCategoryList({ commit }, payload) {
      const res = await getCategories(payload)
      commit('saveCategoryList', res.data.data)
    }
  }
}

export default categoryModule

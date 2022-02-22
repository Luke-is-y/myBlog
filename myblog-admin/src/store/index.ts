import { createStore } from 'vuex'
import VuexPersistence from 'vuex-persist'

import userModule from './user/User'
import articleModule from './article/Article'
import categoryModule from './category/Category'
import tagModule from './tag/Tag'
import menuModule from './menu/Menu'
import roleModule from './role/Role'
import resourceModule from './resource/Resource'
import logModule from './log/Log'
import errlogModule from './errlog/Errlog'
import commentModule from './comment/Comment'
import { IRootState } from './types'

const vuexLocal = new VuexPersistence({
  storage: window.localStorage
})
export default createStore<IRootState>({
  state: {
    collapse: false,
    tabList: [{ name: '首页', path: '/' }],
    roleList: []
  },
  mutations: {
    saveTab(state, tab) {
      if (state.tabList.findIndex((item) => item.path === tab.path) == -1) {
        state.tabList.push({ name: tab.name, path: tab.path })
      }
    },
    removeTab(state, tab) {
      const index = state.tabList.findIndex((item) => item.name === tab.name)
      state.tabList.splice(index, 1)
    },
    resetTab(state) {
      state.tabList = [{ name: '首页', path: '/' }]
    },
    changeIsFold(state) {
      state.collapse = !state.collapse
    }
  },
  actions: {},
  modules: {
    userModule,
    articleModule,
    categoryModule,
    tagModule,
    menuModule,
    roleModule,
    resourceModule,
    logModule,
    errlogModule,
    commentModule
  },
  plugins: [vuexLocal.plugin]
})

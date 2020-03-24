import Vue from 'vue'
import Vuex from './kvuex.js'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    count: 1
  },
  mutations: {
    SET_COUNT (state, value) {
      state.count = value
    }
  },
  actions: {
    ASYNC_COUNT (state, value) {
      setTimeout(() => {
        state.count = value
      }, 2000)
    }
  },
  getters: {
    GET_COUNT (state) {
      return state.count
    }
  }
})
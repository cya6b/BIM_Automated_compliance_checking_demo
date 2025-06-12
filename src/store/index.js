import Vue from 'vue'
import Vuex from 'vuex'
import state from './state.js'
import mutations from './mutations.js'
import actions from './actions.js'
import getters from './getters.js'

Vue.use(Vuex)
const myPlugin = (store) => {
  // 当 store 初始化后调用
  store.subscribe((mutation, state) => {
    // 每次 mutation 之后调用
    // mutation 的格式为 { type, payload }
    if (location.href.indexOf('/login') === -1) {
      sessionStorage.setItem('store', JSON.stringify(state));
    }
  })
}
const store = new Vuex.Store({
  state,
  mutations,
  actions,
  getters,
  modules: {},
  plugins: [myPlugin]
})

export default store

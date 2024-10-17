import { createStore } from 'vuex'

export default createStore({
  state: {
    id: ""
  },
  getters: {
  },
  mutations: {
    login(state, id) {
      state.id = id
    }
  },
  actions: {
    login({commit}, id) {
      commit("login", id);
    }
  },
  modules: {
  }
})

import { createStore } from 'vuex'
import axios from 'axios';
import category from './category';

export default createStore({
  state: {
    id: "" || sessionStorage.getItem("id")
  },
  getters: {
  },
  mutations: {
    login(state, id) {
      state.id = id;
      sessionStorage.setItem("id", id);
    }
  },
  actions: {
    async login({commit}, formData) {
      try {
        const response = await axios.post("http://localhost:8181/loginProcess", formData);
        if(response.status === 200) {
          commit("login", response.data);
        }
      } catch (error) {
        console.log("로그인 에러 : ", error);
      }
    }
  },
  modules: {
    category:category
  }
  
})

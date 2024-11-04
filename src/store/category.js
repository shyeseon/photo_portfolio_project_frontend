import axios from "axios";

export default{
    namespaced:true,
    state: {
     categories:[]

    },
    getters: {
       getCategories(state){
        return state.categories;
       },
    },

    mutations: {
        setCategories(state,categories){
            state.categories=categories;
        },

    },
    actions: {
       async getAllCategories({commit},params) {

            try{
            //vuex에서 params 객체 안에 파라미터를 넣어줍니다
            const response = await axios.get('/get/categories',{params});
                commit('setCategories', response.data);
                return response.data;
            } catch (error) {
                console.error("카테고리 저장 실패:", error);
            }
        },
       

    }
}
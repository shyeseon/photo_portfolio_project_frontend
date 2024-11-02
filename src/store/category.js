import axios from "axios";

export default{
    namespaced:true,
    state: {
     categories:[],

    },
    getters: {
       getCategories(state){
        return state.categories;
       }

    },
    mutations: {
        setCategories(state,categories){
            state.categories=categories;
        }

    },
    actions: {
       async getAllCategories({commit}) {
            try{
            const response = await axios.get('/get/categories');
                commit('setCategories', response.data);
                
            } catch (error) {
                console.error("카테고리 저장 실패:", error);
            }
        },
       

    }
}
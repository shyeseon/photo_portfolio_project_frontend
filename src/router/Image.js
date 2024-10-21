const routes = [
    {
        path: '/PhotoListPage/PhotoList.vue',
        name: "photoList",
        component: () =>  import(/* webpackChunkName: "Image" */ '@/views/PhotoListPage/PhotoList.vue')
      },
    {         
        path: '/PhotoListPage/DetailList.vue',
        name: 'DetailList',
        component: () =>  import(/* webpackChunkName: "Image" */ '@/views/PhotoListPage/DetailList.vue')
    },

  
]
export default routes;
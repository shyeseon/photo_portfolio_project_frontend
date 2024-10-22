const routes = [
    {
        path: '/PhotoListPage/PhotoList/:categoryId/:subCategoryId?',
        name: "photoList",
        component: () =>  import(/* webpackChunkName: "Image" */ '@/views/PhotoListPage/PhotoList.vue')
      },
    {         
        path: '/PhotoListPage/DetailList/:projectId',
        name: 'DetailList',
        component: () =>  import(/* webpackChunkName: "Image" */ '@/views/PhotoListPage/DetailList.vue')
    },

  
]
export default routes;
const routes = [
    {
        path: '/photoListPage/photoList/:categoryId/:subCategoryId?',
        name: "photoList",
        component: () =>  import(/* webpackChunkName: "Image" */ '@/views/PhotoListPage/PhotoList.vue')
      },
    {         
        path: '/photoListPage/detailList/:projectId',
        name: 'detailList',
        component: () =>  import(/* webpackChunkName: "Image" */ '@/views/PhotoListPage/DetailList.vue')
    },

  
]
export default routes;
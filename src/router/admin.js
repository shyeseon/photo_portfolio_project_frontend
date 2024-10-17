const routes = [
    {
        path: '/Admin/AdminUpload',
        component: () => import (/* webpackChunkName: "Admin" */ '@/views/Admin/AdminUpload')
    },

    // {
    //   path: "/Admin/Login",
    //   component: () =>
    //     import(/* webpackChunkName: "Admin" */ "@/views/Admin/Login"),
    // },
    {
      path: "/Admin/ManageCategory",
      component: () =>
        import(/* webpackChunkName: "Admin" */ "@/views/Admin/ManageCategory"),
    },
    {
      path: "/Admin/ManageImages",
      component: () =>
        import(/* webpackChunkName: "Admin" */ "@/views/Admin/ManageImages"),
    },
];

export default routes;
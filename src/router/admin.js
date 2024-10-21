const routes = [
    {
        path: '/Admin/AdminUpload/:id?', 
        component: () => import (/* webpackChunkName: "Admin" */ '@/views/Admin/AdminUpload'),
        meta: { requiresAuth: true }
    },

    {
      path: "/Admin/Login",
      component: () =>
        import(/* webpackChunkName: "Admin" */ "@/views/Admin/Login"),
    },
    {
      path: "/Admin/ManageCategory",
      component: () =>
        import(/* webpackChunkName: "Admin" */ "@/views/Admin/ManageCategory"),
      meta: { requiresAuth: true }
    },
    {
      path: "/Admin/ManageImages",
      component: () =>
        import(/* webpackChunkName: "Admin" */ "@/views/Admin/ManageImages"),
      meta: { requiresAuth: true }
    },
];

export default routes;
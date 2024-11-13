const routes = [
    {
        path: '/admin/adminUpload/:id?', 
        component: () => import (/* webpackChunkName: "admin" */ '@/views/Admin/AdminUpload'),
        meta: { requiresAuth: true }
    },

    {
      path: "/admin/login",
      component: () =>
        import(/* webpackChunkName: "admin" */ "@/views/Admin/Login"),
    },
    {
      path: "/admin/manageCategory",
      component: () =>
        import(/* webpackChunkName: "admin" */ "@/views/Admin/ManageCategory"),
      meta: { requiresAuth: true }
    },
    { 
      path: "/admin/manageImages",
      component: () =>
        import(/* webpackChunkName: "admin" */ "@/views/Admin/ManageImages"),
      meta: { requiresAuth: true }
    },
];

export default routes;
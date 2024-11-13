import NotFound from "@/views/NotFound.vue";
const routes = [
  {
    path: "/Admin/AdminUpload/:id?",
    component: () =>
      import(/* webpackChunkName: "Admin" */ "@/views/Admin/AdminUpload"),
    meta: { requiresAuth: true },
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
    meta: { requiresAuth: true },
  },
  {
    path: "/Admin/ManageImages",
    component: () =>
      import(/* webpackChunkName: "Admin" */ "@/views/Admin/ManageImages"),
    meta: { requiresAuth: true },
  },
  {
    path: "/Admin*", // /Admin으로 시작하지만 정의되지 않은 모든 경로
    component: NotFound,
  },
  {
    path: "*", // 모든 경로에 대한 catch-all (일반적인 404 페이지)
    component: NotFound,
  },
];

export default routes;

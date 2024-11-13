import HomeView from '../views/HomeView.vue'
import admin from './admin';
import { createRouter, createWebHistory } from "vue-router";
import store from '@/store';
import Image from "./Image"
import NotFound from "@/views/NotFound.vue";

const routes = [
  {
    path: "/",
    name: "Home",
    component: HomeView,
  },
  {
    path: "/About",
    name: "About",
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.

    component: () => import(/* webpackChunkName: "about" */ '../views/AboutView.vue')
  },
  ...admin,

  {
    path: "/Contact",
    name: "Contact",
    // route level code-splitting
    // this generates a separate chunk (contact.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () =>
      import(/* webpackChunkName: "contact" */ "../views/ContactView.vue"),
  },
...Image,
{
  path: "*", // 모든 경로에 대한 catch-all (일반적인 404 페이지)
  component: NotFound,
},
];


const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

router.beforeEach((to, from, next) => {

  if(to.matched.some(record => record.meta.requiresAuth) && !store.state.id) {
      next({
        path: "/Admin/Login",
        query: { redirect: to.fullPath }
      })
  } else {
    // 로그인 되어 있거나 인증이 필요 없는 경우 그대로 이동 
    next()
  }
}); 

export default router;

import HomeView from '../views/HomeView.vue'
import admin from './admin';
import { createRouter, createWebHistory } from "vue-router";
import store from '@/store';
import Image from "./Image"
import error from "./error"


const routes = [
  {
    path: "/",
    name: "Home",
    component: HomeView,
  },
  {
    path: "/about",
    name: "About",
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.

    component: () => import(/* webpackChunkName: "about" */ '../views/AboutView.vue')
  },
  ...admin,

  {
    path: "/contact",
    name: "Contact",
    // route level code-splitting
    // this generates a separate chunk (contact.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () =>
      import(/* webpackChunkName: "contact" */ "../views/ContactView.vue"),
  },
...Image,
...error,
];


const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

router.beforeEach((to, from, next) => {

  if(to.matched.some(record => record.meta.requiresAuth) && !store.state.id) {
      next({
        path: "/admin/login",
        query: { redirect: to.fullPath }
      })
  } else {
    // 로그인 되어 있거나 인증이 필요 없는 경우 그대로 이동 
    next()
  }
}); 

export default router;

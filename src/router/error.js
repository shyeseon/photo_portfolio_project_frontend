import PageNotFound from '@/views/Error/PageNotFound.vue';

const routes = [
    {
        path: "/404",
        name: "PageNotFound",
        component: PageNotFound,
    },
    {
        path: '/:pathMatch(.*)*', 
        redirect: "/404",
    },
];

export default routes;
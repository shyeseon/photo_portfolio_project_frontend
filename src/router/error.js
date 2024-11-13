const routes = [
    {
        path: '*', 
        component: () => import (/* webpackChunkName: "Error" */ '@/views/Error/PageNotFound'),
    },
];

export default routes;
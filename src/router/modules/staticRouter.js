import {HOME_URL, LOGIN_URL} from '@/config';

export const staticRouter = [
    {
        path: '/',
        redirect: HOME_URL,
    },
    {
        path: LOGIN_URL,
        name: 'login',
        component: () => import('@/views/Login/index.vue'),
        meta: {
            title: '登录',
        },
    },
    {
        path: '/layout',
        name: 'layout',
        component: () => import('@/layouts/index.vue'),
        redirect: HOME_URL,
        children: [],
    },
];


export const errorRouter = [
    {
        path: '/403',
        name: '403',
        component: () => import('@/components/ErrorPage/403.vue'),
        meta: {
            title: '403',
        },
    },
    {
        path: '/404',
        name: '404',
        component: () => import('@/components/ErrorPage/404.vue'),
        meta: {
            title: '404',
        },
    },
    {
        path: '/500',
        name: '500',
        component: () => import('@/components/ErrorPage/500.vue'),
        meta: {
            title: '500',
        },
    },
    //resolve refresh page, route warnings
    {
        path: '/:pathMatch(.*)*',
        component: () => import('@/components/ErrorPage/404.vue'),
    },
];

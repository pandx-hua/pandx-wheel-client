import {createRouter, createWebHistory} from 'vue-router';
import {errorRouter, staticRouter} from '@/router/modules/staticRouter';
import NProgress from '@/config/nprogress';
import {initDynamicRouter} from '@/router/modules/dynamicRouter';
import {LOGIN_URL, ROUTER_WHITE_LIST} from '@/config';
import {usePersonalStore} from '@/stores/modules/personal/personal';

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes: [...staticRouter, ...errorRouter],
    strict: false,
    scrollBehavior: () => ({left: 0, top: 0}),
});

router.beforeEach(async (to, from, next) => {
    const personalStore = usePersonalStore();
    //1.NProgress开始
    NProgress.start();
    //2.动态设置标题
    const title = import.meta.env.VITE_GLOBAL_APP_TITLE;
    document.title = to.meta.title ? `${to.meta.title} - ${title}` : title;
    //3.判断到访页是否是登录页，如果是登录页，有Token就留在当前页，没有Token就重置路由到登录页
    if (to.path.toLocaleLowerCase() === LOGIN_URL) {
        if (personalStore.token.accessToken) {
            return next(from.fullPath);
        }
        resetRouter();
        return next();
    }
    //4.判断到访页是否在路由白名单中，如果是则直接放行
    if (ROUTER_WHITE_LIST.includes(to.path)) {
        return next();
    }
    //5.判断是否有Token，没有则重定向导登录页
    if (!personalStore.token.accessToken) {
        return next({path: LOGIN_URL, replace: true});
    }

    //6.如果没有菜单列表，就重新请求菜单列表并添加动态路由
    if (!personalStore.menuList.length) {
        await initDynamicRouter();
        return next({...to, replace: true});
    }
    //7.正常访问页面
    return next();
});

router.onError(() => {
    NProgress.done();
});
router.afterEach(() => {
    NProgress.done();
});

export const resetRouter = () => {
    const personalStore = usePersonalStore();
    personalStore.flatMenuList.forEach(route => {
        const {name} = route;
        if (name && router.hasRoute(name)) router.removeRoute(name);
    });
};
export default router;

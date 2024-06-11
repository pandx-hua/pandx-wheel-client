import {usePersonalStore} from '@/stores/modules/personal/personal';
import router from '@/router';
import {LOGIN_URL} from '@/config';

const modules = import.meta.glob('@/views/**/*.vue');
export const initDynamicRouter = async () => {
    const personalStore = usePersonalStore();
    try {
        await personalStore.getMenuList();
        if (!personalStore.menuList.length) {
            console.debug('当前用户无任何菜单权限');
            personalStore.logout();
            await router.replace(LOGIN_URL);
            // return Promise.reject(new Error("当前用户无任何菜单权限"));
            return Promise.reject();
        }
        personalStore.flatMenuList
            .forEach(item => {
                item.children && delete item.children;
                if (item.component && typeof item.component == 'string') {
                    item.component = modules[`/src/views/${item.component}/index.vue`];
                }
                if (item.meta.isFull) {
                    router.addRoute(item);
                } else {
                    router.addRoute('layout', item);
                }
            });
    } catch (error) {
        personalStore.logout();
        await router.replace(LOGIN_URL);
        return Promise.reject(error);
    }
};



import {defineStore} from 'pinia';
import {computed, ref} from 'vue';
import piniaPersist from '@/stores/helpers/piniaPersist';
import {getBreadcrumbList, getFlatMenuList, getShowMenuList} from '@/utils';
import {$getMenus} from '@/services/modules/menus';
import {useTabsStore} from '@/stores/modules/tabs';
import {
    $changePersonalPassword,
    $getAvatar,
    $getLoginAttempts,
    $getPersonal,
    $getToken,
    $refreshToken,
    $updateUser,
} from '@/services/modules/personal';


export const usePersonalStore = defineStore('personalStore', () => {
    const tabsStore = useTabsStore();
    const grantedPermissions = ref([]);
    const token = ref({});
    const user = ref({});
    const menuList = ref([]);
    const loginAttempts = ref([]);
    const avatar = ref('');
    const getMenuList = async () => {
        const response = await $getMenus();
        menuList.value = response.data.result.items;
    };

    const getPersonal = async () => {
        const response = await $getPersonal();
        user.value = response.data.result.user;
        grantedPermissions.value = response.data.result.grantedPermissions;
    };
    const getToken = async (payload) => {
        const response = await $getToken(payload);
        token.value = response.data.result;
    };

    const refreshToken = async (payload) => {
        return await $refreshToken(payload);
    };

    const updateUser = async (payload) => {
        const response = await $updateUser(payload);
        user.value = response.data.result;
    };

    const changePersonalPassword = async (payload) => {
        await $changePersonalPassword(payload);
    };

    const getLoginAttempts = async () => {
        const response = await $getLoginAttempts();
        loginAttempts.value = response.data.result.items;
    };

    const getAvatar = async () => {
        const response = await $getAvatar();
        avatar.value = response.data.result;
    };
    const logout = () => {
        grantedPermissions.value = [];
        token.value = {};
        user.value = {};
        tabsStore.clearTabs();
    };

    const flatMenuList = computed(() => getFlatMenuList(menuList.value));
    const breadcrumbList = computed(() => getBreadcrumbList(menuList.value));
    const showMenuList = computed(() => getShowMenuList(menuList.value));

    return {
        grantedPermissions,
        token,
        user,
        menuList,
        flatMenuList,
        breadcrumbList,
        showMenuList,
        loginAttempts,
        avatar,
        getMenuList,
        logout,
        getPersonal,
        getToken,
        refreshToken,
        updateUser,
        changePersonalPassword,
        getLoginAttempts,
        getAvatar,
    };
}, {
    persist: {
        enabled: true, ...piniaPersist([
            'user',
            'token',
            'grantedPermissions',
            'avatar'
        ]),

    },
});

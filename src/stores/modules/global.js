import {defineStore} from 'pinia';
import {ref} from 'vue';
import piniaPersist from '@/stores/helpers/piniaPersist';
import {DEFAULT_PRIMARY} from '@/config';
// import {usePersonalStore} from '@/stores/modules/authorization/user';
// import {usePermissionStore} from '@/stores/modules/authorization/permission';


export const useGlobalStore = defineStore('globalStore', () => {
    const primary = ref(DEFAULT_PRIMARY);
    const layout = ref('classic');
    /**
     *
     * @type {Ref<UnwrapRef<'default'|'large'|'small'>>}
     */
    const size = ref('default');

    const isDark = ref(false);
    const isGray = ref(false);
    const isWeak = ref(false);
    const isAsideInverted = ref(false);
    const isHeaderInverted = ref(false);
    const isAccordion = ref(true);
    const isCollapse = ref(false);
    const isBreadcrumb = ref(true);
    const isBreadcrumbIcon = ref(true);
    const isTabs = ref(true);
    const isTabsIcon = ref(true);
    const isFooter = ref(true);
    const isMaximization = ref(false);
    /**
     *
     * @type {Ref<UnwrapRef<string[]>>}
     */
    const keepAlivePages = ref([]);
    /**
     *
     * @param {string} name
     */
    const addKeepAlivePage = async (name) => {
        !keepAlivePages.value.includes(name) && keepAlivePages.value.push(name);
    };
    /**
     *
     * @param {string} name
     */
    const removeKeepAlivePage = async (name) => {
        keepAlivePages.value = keepAlivePages.value.filter(item => item !== name);
    };
    /**
     *
     * @param {string[]} keepAlivePages
     */
    const setKeepAlivePages = async (keepAlivePages) => {
        keepAlivePages.value = keepAlivePages;
    };

    const setGlobalState = (...args) => {
        eval(args[0]).value = args[1];
    };


    return {
        primary,
        layout,
        size,
        isDark,
        isGray,
        isWeak,
        isAsideInverted,
        isHeaderInverted,
        isAccordion,
        isCollapse,
        isBreadcrumb,
        isBreadcrumbIcon,
        isTabs,
        isTabsIcon,
        isFooter,
        isMaximization,
        keepAlivePages,
        addKeepAlivePage,
        removeKeepAlivePage,
        setKeepAlivePages,
        setGlobalState,
    };
}, {
    persist: {
        enabled: true, ...piniaPersist([
            'primary',
            'layout',
            'size',
            'isDark',
            'isGray',
            'isWeak',
            'isAsideInverted',
            'isHeaderInverted',
            'isAccordion',
            'isCollapse',
            'isBreadcrumb',
            'isBreadcrumbIcon',
            'isTabs',
            'isTabsIcon',
            'isFooter',
            'isMaximization',
            'keepAlivePages',
        ]),
    },
});

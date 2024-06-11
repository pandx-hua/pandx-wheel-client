import {defineStore} from 'pinia';
import {ref} from 'vue';
import {useGlobalStore} from '@/stores/modules/global';
import router from '@/router';
import {getUrlWithParams} from '@/utils';
import piniaPersist from '@/stores/helpers/piniaPersist';


export const useTabsStore = defineStore('tabsStore', () => {
    const globalStore = useGlobalStore();
    /**
     *
     * @type {Ref<UnwrapRef<TabItem[]>>}
     */
    const tabs = ref([]);

    /**
     *
     * @param {TabItem} tabItem
     * @returns {Promise<void>}
     */
    const addTab = async (tabItem) => {
        if (tabs.value.every(item => item.path !== tabItem.path)) {
            tabs.value.push(tabItem);
        }
        //add keepAlivePage
        if (!globalStore.keepAlivePages.includes(tabItem.name) && tabItem.isKeepAlive) {
            await globalStore.addKeepAlivePage(tabItem.name);
        }
    };
    /**
     *
     * @param {string} path
     * @param {boolean} isCurrent
     * @returns {Promise<void>}
     */
    const removeTab = async (path, isCurrent = true) => {
        if (isCurrent) {

            tabs.value.forEach((item, index) => {
                if (item.path === path) {
                    const nextTab = tabs.value[index + 1] || tabs.value[index - 1];
                    if (nextTab) {
                        router.push(nextTab.path);
                    }
                }
            });
        }
        //remove keepAlivePage
        const tab = tabs.value.find(item => item.path === path);
        if (tab && tab.isKeepAlive) {
            await globalStore.removeKeepAlivePage(tab.name);
        }
        //set tabs
        tabs.value = tabs.value.filter(item => item.path !== path);
    };
    /**
     *
     * @param {string} path
     * @param {'left'|'right'} type
     */
    const closeTabOnSide = async (path, type) => {
        const currentIndex = tabs.value.findIndex(item => item.path === path);
        if (currentIndex !== -1) {
            const range = type === 'left' ? [0, currentIndex] : [currentIndex + 1, tabs.value.length];
            tabs.value = tabs.value.filter((item, index) => {
                return index < range[0] || index >= range[1] || !item.isClose;
            });
        }
        //set keepAlivePage
        const keepAlivePages = tabs.value.filter(item => item.isKeepAlive);
        await globalStore.setKeepAlivePages(keepAlivePages.map(item => item.name));

    };
    const closeMultipleTab = async (path = null) => {
        tabs.value = tabs.value.filter(item => {
            return item.path === path || !item.isClose;
        });
        const keepAlivePages = tabs.value.filter(item => item.isKeepAlive);
        await globalStore.setKeepAlivePages(keepAlivePages.map(item => item.name));
    };
    /**
     *
     * @param {TabItem[]} tabs
     */
    const setTabs = async (tabs) => {
        tabs.value = tabs;
    };

    const setTabTitle = (title) => {
        tabs.value.forEach(item => {
            if (item.path === getUrlWithParams()) {
                item.title = title;
            }
        });
    };

    const clearTabs = () => {
        tabs.value = [];
    };

    return {
        tabs,
        addTab,
        removeTab,
        closeTabOnSide,
        closeMultipleTab,
        setTabs,
        setTabTitle,
        clearTabs,
    };
}, {
    persist: {
        enabled: true, ...piniaPersist([
            'tabs',
        ]),
    },
});
import {defineStore} from 'pinia';
import piniaPersist from '@/stores/helpers/piniaPersist';
import {ref} from 'vue';
import {
    $deleteUserNotification,
    $download,
    $getPagedUserNotifications,
    $setUserNotificationAsRead,
} from '@/services/modules/notifications';
import {usePersonalStore} from '@/stores/modules/personal/personal';

export const useNotificationStore = defineStore('notificationStore', () => {
    const personalStore = usePersonalStore();
    const totalCount = ref(0);
    const unReadCount = ref(0);
    const loading = ref(false);
    const notifications = ref([]);
    const currentPage = ref(1);
    const pageSize = ref(10);

    const getPagedUserNotifications = async (payload) => {
        try {
            loading.value = true;
            const response = await $getPagedUserNotifications(payload);
            for (const item of response.data.result.items) {
                const index = notifications.value.findIndex(i => i.id === item.id);
                if (index < 0) {
                    const notification = formatNotification(item);
                    notifications.value.push(notification);
                }
            }
            totalCount.value = response.data.result.totalCount;
            unReadCount.value = response.data.result.unReadCount;
        } finally {
            loading.value = false;
        }
    };

    const setUserNotificationAsRead = async (payload) => {
        await $setUserNotificationAsRead(payload);
        const index = notifications.value.findIndex(i => i.id === payload.id);
        if (index >= 0) {
            notifications.value[index].state = 1;
            unReadCount.value--;
        }
    };

    const deleteUserNotification = async (payload) => {
        await $deleteUserNotification(payload);
        const index = notifications.value.findIndex(i => i.id === payload.id);
        if (index >= 0) {
            if (!notifications.value[index].state) {
                unReadCount.value--;
            }
            notifications.value.splice(index, 1);
            totalCount.value--;
        }
    };

    const formatNotification = (notification) => {
        switch (notification.notificationName) {
            case 'Sample.InvalidUsers':
                const url = import.meta.env.VITE_REMOTE_SERVICE_BASE_URL + $download + '?encrypted-token=' + encodeURIComponent(personalStore.token.encryptedToken) + '&filename=' + JSON.parse(notification.notificationData).downloadToken;
                notification.special = `部分用户导入失败，<a href="${url}" style="color:var(--el-color-primary)">点击下载</a>失败的用户列表及其失败原。`;
                break;
        }
        return notification;
    };

    return {
        totalCount,
        unReadCount,
        loading,
        notifications,
        currentPage,
        pageSize,
        getPagedUserNotifications,
        setUserNotificationAsRead,
        deleteUserNotification,
        formatNotification,
    };
}, {
    persist: {
        enabled: true, ...piniaPersist([]),
    },
});
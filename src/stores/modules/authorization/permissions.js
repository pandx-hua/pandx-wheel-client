import {defineStore} from 'pinia';
import piniaPersist from '@/stores/helpers/piniaPersist';
import {ref} from 'vue';
import {$getPermissions} from '@/services/modules/permissions';

export const usePermissionStore = defineStore('permissionStore', () => {

    const permissions = ref([]);

    const getPermissions = async () => {
        const response = await $getPermissions();
        permissions.value = response.data.result.items;
    };
    return {permissions, getPermissions};


}, {
    persist: {
        enabled: true, ...piniaPersist([]),
    },
});

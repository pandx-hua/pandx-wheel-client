import {defineStore} from 'pinia';
import piniaPersist from '@/stores/helpers/piniaPersist';
import {ref} from 'vue';
import {
    $batchDeleteRoles,
    $createOrUpdateRole,
    $deleteRole,
    $getPagedRoles,
    $getRoles,
    $validateRoleName,
} from '@/services/modules/roles';

export const useRoleStore = defineStore('roleStore', () => {

    const loading = ref(false);
    const roles = ref([]);
    const pagedRoles = ref([]);
    const totalCount = ref(0);
    const currentPage = ref(1);
    const pageSize = ref(10);
    const deletedCount = ref(0);
    const getRoles = async () => {
        const response = await $getRoles();
        roles.value = response.data.result.items;
    };
    const getPagedRoles = async (payload) => {
        try {
            loading.value = true;
            const response = await $getPagedRoles(payload);
            pagedRoles.value = response.data.result.items;
            totalCount.value = response.data.result.totalCount;
        } finally {
            loading.value = false;
        }
    };

    const createOrUpdateRole = async (payload) => {
        await $createOrUpdateRole(payload);
    };

    const deleteRole = async (payload) => {
        await $deleteRole(payload);
    };

    const batchDeleteRoles = async (payload) => {
        const response = await $batchDeleteRoles(payload);
        deletedCount.value = response.data.result;
    };

    const validateRoleName = async (payload) => {
        return await $validateRoleName(payload);
    };

    return {
        loading,
        roles,
        getRoles,
        pagedRoles,
        totalCount,
        getPagedRoles,
        currentPage,
        pageSize,
        deletedCount,
        createOrUpdateRole,
        deleteRole,
        batchDeleteRoles,
        validateRoleName,
    };

}, {
    persist: {
        enabled: true, ...piniaPersist([]),
    },
});

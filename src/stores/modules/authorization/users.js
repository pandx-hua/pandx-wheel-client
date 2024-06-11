import {defineStore} from 'pinia';
import piniaPersist from '@/stores/helpers/piniaPersist';
import {ref} from 'vue';
import {
    $batchDeleteUsers,
    $changePassword,
    $createOrUpdateUser,
    $deleteUser,
    $exportUsersToExcel, $getAvatarById,
    $getPagedUsers,
    $unlockUser,
    $validateEmail,
    $validateUserName,
} from '@/services/modules/users';

export const useUserStore = defineStore('userStore', () => {

    const loading = ref(false);
    const pagedUsers = ref([]);
    const totalCount = ref(0);
    const currentPage = ref(1);
    const pageSize = ref(10);
    const deletedCount = ref(0);
    const cachedFile = ref({});
    const avatar=ref('');

    const getPagedUsers = async (payload) => {
        try {
            loading.value = true;
            const response = await $getPagedUsers(payload);
            pagedUsers.value = response.data.result.items;
            totalCount.value = response.data.result.totalCount;
        } finally {
            loading.value = false;
        }
    };

    const validateUserName = async (payload) => {
        return await $validateUserName(payload);
    };

    const validateEmail = async (payload) => {
        return await $validateEmail(payload);
    };

    const createOrUpdateUser = async (payload) => {
        await $createOrUpdateUser(payload);
    };

    const unlockUser = async (payload) => {
        await $unlockUser(payload);
    };
    const deleteUser = async (payload) => {
        await $deleteUser(payload);
    };

    const batchDeleteUsers = async (payload) => {
        const response = await $batchDeleteUsers(payload);
        deletedCount.value = response.data.result;
    };

    const changePassword = async (payload) => {
        await $changePassword(payload);
    };

    const getAvatarById=async (payload)=>{
        const response=await $getAvatarById(payload);
        avatar.value=response.data.result;
    }

    const exportUsersToExcel = async (payload) => {
        const response = await $exportUsersToExcel(payload);
        cachedFile.value = response.data.result;
    };

    return {
        loading,
        pagedUsers,
        totalCount,
        getPagedUsers,
        currentPage,
        pageSize,
        deletedCount,
        cachedFile,
        avatar,
        createOrUpdateUser,
        validateUserName,
        validateEmail,
        unlockUser,
        deleteUser,
        changePassword,
        batchDeleteUsers,
        getAvatarById,
        exportUsersToExcel,
    };


}, {
    persist: {
        enabled: true, ...piniaPersist([]),
    },
});

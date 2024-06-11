import {ref} from 'vue';
import {$getAuditingToExcel, $getPagedAuditing} from '@/services/modules/auditing';
import {defineStore} from 'pinia';
import piniaPersist from '@/stores/helpers/piniaPersist';

export const useAuditingStore = defineStore('auditingStore', () => {

    const loading = ref(false);
    const pagedAuditing = ref([]);
    const totalCount = ref(0);
    const currentPage = ref(1);
    const pageSize = ref(10);
    const cachedFile = ref({});
    const getPagedAuditing = async (payload) => {
        try {
            loading.value = true;
            const response = await $getPagedAuditing(payload);
            pagedAuditing.value = response.data.result.items;
            totalCount.value = response.data.result.totalCount;
        } finally {
            loading.value = false;
        }
    };

    const getAuditingToExcel = async (payload) => {
        const response = await $getAuditingToExcel(payload);
        cachedFile.value = response.data.result;
    };

    return {
        loading,
        pagedAuditing,
        totalCount,
        getPagedAuditing,
        currentPage,
        pageSize,
        cachedFile,
        getAuditingToExcel,
    };
}, {
    persist: {
        enabled: true, ...piniaPersist([]),
    },
});
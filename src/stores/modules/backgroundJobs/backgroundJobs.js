import {defineStore} from 'pinia';
import {ref} from 'vue';
import {
    $changeBackgroundJobStatus,
    $createOrUpdateBackgroundJob,
    $deleteBackgroundJob,
    $getExposedBackgroundJobs,
    $getJobExecutions,
    $getPagedBackgroundJobs,
    $validateCronExpression,
    $validateJobName,
} from '@/services/modules/backgroundJobs';
import piniaPersist from '@/stores/helpers/piniaPersist';

export const useBackgroundJobStore = defineStore('backgroundJobStore', () => {
    const getPagedLoading = ref(false);
    const jobExecutionsLoading = ref(false);
    const pagedBackgroundJobs = ref([]);
    const totalCount = ref(0);
    const currentPage = ref(1);
    const pageSize = ref(10);
    const exposedBackgroundJobs = ref([]);
    const jobExecutions = ref([]);

    const getPagedBackgroundJobs = async (payload) => {
        try {
            getPagedLoading.value = true;
            const response = await $getPagedBackgroundJobs(payload);
            pagedBackgroundJobs.value = response.data.result.items;
            totalCount.value = response.data.result.totalCount;
        } finally {
            getPagedLoading.value = false;
        }
    };

    const createOrUpdateBackgroundJob = async (payload) => {
        await $createOrUpdateBackgroundJob(payload);
    };

    const deleteBackgroundJob = async (payload) => {
        await $deleteBackgroundJob(payload);
    };

    const getExposedBackgroundJobs = async () => {
        const response = await $getExposedBackgroundJobs();
        exposedBackgroundJobs.value = response.data.result.items;
    };

    const changeBackgroundJobStatus = async (payload) => {
        await $changeBackgroundJobStatus(payload);
    };

    const getJobExecutions = async (payload) => {
        try {
            jobExecutionsLoading.value = true;
            const response = await $getJobExecutions(payload);
            jobExecutions.value = response.data.result.items;
        } finally {
            jobExecutionsLoading.value = false;
        }
    };

    const validateJobName = async (payload) => {
        return await $validateJobName(payload);
    };

    const validateCronExpression = async (payload) => {
        return await $validateCronExpression(payload);
    };

    return {
        getPagedLoading,
        jobExecutionsLoading,
        pagedBackgroundJobs,
        totalCount,
        currentPage,
        pageSize,
        exposedBackgroundJobs,
        jobExecutions,
        getPagedBackgroundJobs,
        createOrUpdateBackgroundJob,
        getExposedBackgroundJobs,
        changeBackgroundJobStatus,
        getJobExecutions,
        deleteBackgroundJob,
        validateJobName,
        validateCronExpression,
    };
}, {
    persist: {
        enabled: true,
        ...piniaPersist([]),
    },
});
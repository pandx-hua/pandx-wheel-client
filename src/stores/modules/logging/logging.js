import {defineStore} from 'pinia';
import {ref} from 'vue';
import {$downloadLogs, $getLatestLogs} from '@/services/modules/logging';
import piniaPersist from '@/stores/helpers/piniaPersist';

export const useLoggingStore = defineStore('loggingStore', () => {

    const logLines = ref([]);
    const cachedFile = ref({});
    const getLatestLogs = async () => {
        const response = await $getLatestLogs();
        logLines.value = response.data.result['latestLogLines'];
    };
    const downloadLogs = async () => {
        const response = await $downloadLogs();
        cachedFile.value = response.data.result;
    };
    return {logLines, cachedFile, getLatestLogs, downloadLogs};
}, {
    persist: {
        enabled: true,
        ...piniaPersist([]),
    },
});
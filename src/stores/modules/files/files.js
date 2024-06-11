import {defineStore} from 'pinia';
import {ref} from 'vue';
import piniaPersist from '@/stores/helpers/piniaPersist';

export const useFileStore = defineStore('fileStore', () => {
    const loading = ref(false);

    return {loading};

}, {
    persist: {
        enabled: true,
        ...piniaPersist([]),
    },
});
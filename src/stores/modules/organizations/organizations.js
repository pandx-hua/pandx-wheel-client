import {defineStore} from 'pinia';
import piniaPersist from '@/stores/helpers/piniaPersist';
import {ref} from 'vue';
import {
    $addUsersToOrganization,
    $createOrganization,
    $deleteOrganization,
    $down,
    $findUsers,
    $getOrganizations,
    $getOrganizationUsers1,
    $getOrganizationUsers2,
    $moveOrganization,
    $removeUserFromOrganization,
    $removeUsersFromOrganizations,
    $up,
    $updateOrganization,
    $validateOrganization,
} from '@/services/modules/organizations';

export const useOrganizationStore = defineStore('organizationStore', () => {

    const organizations = ref([]);
    const currentOrganization = ref({});
    const foundUsers = ref([]);
    const foundCount = ref(0);
    const foundLoading = ref(false);
    const addedUsers = ref([]);
    const addedCount = ref(0);
    const addedCurrentPage = ref(1);
    const addedPageSize = ref(10);
    const addedLoading = ref(false);
    const organizationUsers = ref([]);
    const organizationCount = ref(0);
    const organizationLoading = ref(false);

    const createOrganization = async (payload) => {
        const response = await $createOrganization(payload);
        currentOrganization.value = response.data.result;
    };

    const updateOrganization = async (payload) => {
        const response = await $updateOrganization(payload);
        currentOrganization.value = response.data.result;
    };

    const moveOrganization = async (payload) => {
        const response = await $moveOrganization(payload);
        currentOrganization.value = response.data.result;
    };

    const deleteOrganization = async (payload) => {
        await $deleteOrganization(payload);
    };

    const up = async (payload) => {
        await $up(payload);
    };
    const down = async (payload) => {
        await $down(payload);
    };

    const getOrganizations = async () => {
        const response = await $getOrganizations();
        organizations.value = response.data.result.items;
    };

    const getOrganizationUsers1 = async (payload) => {
        try {
            addedLoading.value = true;
            const response = await $getOrganizationUsers1(payload);
            addedUsers.value = response.data.result.items;
            addedCount.value = response.data.result.totalCount;
        } finally {
            addedLoading.value = false;
        }
    };

    const getOrganizationUsers2 = async (payload) => {
        try {
            organizationLoading.value = true;
            const response = await $getOrganizationUsers2(payload);
            organizationUsers.value = response.data.result.items;
            organizationCount.value = response.data.result.totalCount;
        } finally {
            organizationLoading.value = false;
        }
    };

    const removeUserFromOrganization = async (payload) => {
        await $removeUserFromOrganization(payload);
    };

    const removeUsersFromOrganization = async (payload) => {
        await $removeUsersFromOrganizations(payload);
    };

    const addUsersToOrganization = async (payload) => {
        await $addUsersToOrganization(payload);
    };

    const findUsers = async (payload) => {
        try {
            foundLoading.value = true;
            const response = await $findUsers(payload);
            foundUsers.value = response.data.result.items;
            foundCount.value = response.data.result.totalCount;
        } finally {
            foundLoading.value = false;
        }
    };

    const validateOrganization = async (payload) => {
        return await $validateOrganization(payload);
    };


    return {
        addedLoading,
        foundLoading,
        organizationLoading,
        organizations,
        currentOrganization,
        addedUsers,
        addedCount,
        addedCurrentPage,
        addedPageSize,
        organizationUsers,
        organizationCount,
        foundUsers,
        foundCount,
        createOrganization,
        updateOrganization,
        moveOrganization,
        deleteOrganization,
        getOrganizations,
        getOrganizationUsers1,
        getOrganizationUsers2,
        removeUserFromOrganization,
        removeUsersFromOrganization,
        addUsersToOrganization,
        findUsers,
        validateOrganization,
        up,
        down,
    };

}, {
    persist: {
        enabled: true, ...piniaPersist([]),
    },
});

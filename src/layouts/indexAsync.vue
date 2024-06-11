<script setup>
import {useGlobalStore} from '@/stores/modules/global';
import ThemeDrawer from '@/layouts/components/ThemeDrawer/index.vue';
import {defineAsyncComponent} from 'vue';
import {usePersonalStore} from '@/stores/modules/personal/personal';
import {initSignalR} from '@/utils/signalR';
import {useNotificationStore} from '@/stores/modules/notifications/notifications';

const globalStore = useGlobalStore();
const personalStore = usePersonalStore();
const notificationStore = useNotificationStore();
const LayoutComponents = {
  classic: defineAsyncComponent(() => import('@/layouts/ClassicLayout/index.vue')),
  vertical: defineAsyncComponent(() => import('@/layouts/VerticalLayout/index.vue')),
  transverse: defineAsyncComponent(() => import('@/layouts/TransverseLayout/index.vue')),
  columns: defineAsyncComponent(() => import('@/layouts/ColumnsLayout/index.vue')),
};
window.wheel.auth.grantedPermissions = personalStore.grantedPermissions;
initSignalR();
notificationStore.getPagedUserNotifications({});
</script>

<template>
  <Suspense>
    <component :is="LayoutComponents[globalStore.layout]"></component>
  </Suspense>
  <ThemeDrawer></ThemeDrawer>
</template>

<style lang="scss" scoped>

</style>

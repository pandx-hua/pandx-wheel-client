<script setup>
import ClassicLayout from '@/layouts/ClassicLayout/index.vue';
import VerticalLayout from '@/layouts/VerticalLayout/index.vue';
import TransverseLayout from '@/layouts/TransverseLayout/index.vue';
import ColumnsLayout from '@/layouts/ColumnsLayout/index.vue';
import {useGlobalStore} from '@/stores/modules/global';
import ThemeDrawer from '@/layouts/components/ThemeDrawer/index.vue';
import {usePersonalStore} from '@/stores/modules/personal/personal';
import {initSignalR} from '@/utils/signalR';
import {useNotificationStore} from '@/stores/modules/notifications/notifications';


const globalStore = useGlobalStore();
const personalStore = usePersonalStore();
const notificationStore = useNotificationStore();
const LayoutComponents = {
  classic: ClassicLayout,
  vertical: VerticalLayout,
  transverse: TransverseLayout,
  columns: ColumnsLayout,
};
window.wheel.auth.grantedPermissions = personalStore.grantedPermissions;
initSignalR();
notificationStore.getPagedUserNotifications({});
</script>

<template>
  <component :is="LayoutComponents[globalStore.layout]"></component>
  <ThemeDrawer></ThemeDrawer>
</template>

<style lang="scss" scoped>

</style>

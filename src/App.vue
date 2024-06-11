<script setup>
import {RouterView} from 'vue-router';
import {useGlobalStore} from '@/stores/modules/global';
import {useTheme} from '@/hooks/useTheme';
import {reactive} from 'vue';
import {usePersonalStore} from '@/stores/modules/personal/personal';
import mittBus from '@/utils/mittBus';
import {useNotificationStore} from '@/stores/modules/notifications/notifications';
import {ElNotification} from 'element-plus';
import {getNotificationClass, getNotificationSeverity} from '@/utils';


const globalStore = useGlobalStore();
const personalStore = usePersonalStore();
const notificationStore = useNotificationStore();
const {initTheme} = useTheme();
const buttonConfig = reactive({autoInsertSpace: false});
initTheme && initTheme();
mittBus.on('notification.Received', (notification) => {
  notificationStore.notifications.splice(0, 0, notificationStore.formatNotification(notification));
  notificationStore.totalCount += 1;
  notificationStore.unReadCount += 1;
  ElNotification({
    title: '消息提醒',
    type: getNotificationSeverity(notification.severity),
    message: JSON.parse(notification.notificationData).message,
    customClass: getNotificationClass(notification.severity),
    duration: 3000,
  });
});
</script>

<template>
  <el-config-provider :button="buttonConfig" :size="globalStore.size">
    <router-view></router-view>
  </el-config-provider>

</template>

<style lang="scss" scoped>
</style>

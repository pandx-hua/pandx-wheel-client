<script setup>

import {FontAwesomeIcon} from '@fortawesome/vue-fontawesome';
import {Check, Close} from '@element-plus/icons-vue';
import {useNotificationStore} from '@/stores/modules/notifications/notifications';
import {computed, ref} from 'vue';
import dayjs from 'dayjs';

const notificationStore = useNotificationStore();
const currentPage = ref(1);
const loading = ref(false);

const disabled = computed(() => loading.value || noMore.value);
const noMore = computed(() => {
  return notificationStore.notifications.length === notificationStore.totalCount;
});
const notifications = computed(() => notificationStore.notifications);

const handleLoad = async () => {
  loading.value = true;
  try {
    currentPage.value += 1;
    await notificationStore.getPagedUserNotifications({currentPage: currentPage.value});
  } finally {
    loading.value = false;
  }
};

const handleClick = async (data) => {
  if(!data.state){
    await notificationStore.setUserNotificationAsRead({id: data.id});
  }
};

const handleDelete = async (data) => {
  await notificationStore.deleteUserNotification({id: data.id});
  if (notificationStore.notifications.length < 10) {
    await notificationStore.getPagedUserNotifications({});
  }
};
</script>

<template>
  <div class="message-icon">
    <el-popover placement="bottom" trigger="click" width="500">
      <template #reference>
        <el-badge :hidden="!notificationStore.unReadCount" :value="notificationStore.unReadCount">
          <font-awesome-icon class="header-awesome-icon" icon="fa fa-bell"></font-awesome-icon>
        </el-badge>
      </template>
      <div class="popover-content">
        <ul v-infinite-scroll="handleLoad" :infinite-scroll-delay="1000" :infinite-scroll-disabled="disabled">
          <li v-for="(item,index) in notifications">
            <el-card class="mb12" shadow="hover">
              <div class="control-box">
                <el-tooltip content="标记为已读" placement="top">
                  <el-icon color="#c8c9cc" style="margin-left:4px;" @click="handleClick(item)">
                    <Check/>
                  </el-icon>
                </el-tooltip>
                <el-tooltip content="删除" placement="top">
                  <el-icon color="#c8c9cc" style="margin-left:4px;" @click="handleDelete(item)">
                    <Close/>
                  </el-icon>
                </el-tooltip>
              </div>
              <div class="message-box">
                <div v-if="!item.state" class="state0"></div>
                <div v-if="item.state" class="state1"></div>
                <span v-if="!item.state" style="cursor:pointer;"
                      @click="handleClick(item)"><strong>{{ JSON.parse(item.notificationData).message }}</strong></span>
                <span v-if="item.state">{{ JSON.parse(item.notificationData).message }}</span>
              </div>
              <div v-if="JSON.parse(item.notificationData).details" class="details-box mb12"
                   v-html="JSON.parse(item.notificationData).details">
              </div>
              <div v-if="item.special" class="details-box mb12" v-html="item.special"></div>
              <div class="time-box">接收于 {{ dayjs(item.creationTime).format('YYYY-MM-DD HH:mm:ss') }}</div>
            </el-card>
          </li>
        </ul>
        <div class="loading-box">
          <p v-if="loading">加载中...</p>
          <p v-if="noMore && notificationStore.totalCount!==0">已经是最下面了</p>
          <el-empty v-if="notificationStore.totalCount===0" description="空空如也"></el-empty>
        </div>
      </div>
    </el-popover>
  </div>
</template>

<style lang="scss" scoped>
@import "./icon.scss";

.popover-content {
  max-height: 500px;
  overflow: auto;
  padding: 10px 10px;

  .el-card {
    position: relative;

    .control-box {
      position: absolute;
      top: 2px;
      right: 4px;

      .el-icon {
        cursor: pointer;
      }
    }

    .message-box {
      display: flex;
      justify-content: flex-start;
      align-items: center;
      margin-bottom: 12px;

      .state0 {
        height: 12px;
        width: 12px;
        border-radius: 6px;
        background-color: #f56c6c;
        margin-right: 6px;
      }

      .state1 {
        height: 12px;
        width: 12px;
        border-radius: 6px;
        background-color: #c8c9cc;
        margin-right: 6px;
      }
    }

    .details-box {

    }

    .time-box {
      color: var(--el-text-color-placeholder);
    }
  }

  .loading-box {
    display: flex;
    justify-content: center;
    align-items: center;
    margin-top: 20px;
  }
}
</style>
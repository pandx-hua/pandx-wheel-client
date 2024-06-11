<script setup>

import {CircleClose, DArrowLeft, FullScreen, Refresh} from '@element-plus/icons-vue';
import {inject, nextTick} from 'vue';
import {useGlobalStore} from '@/stores/modules/global';
import {useRoute, useRouter} from 'vue-router';
import {useTabsStore} from '@/stores/modules/tabs';
import {HOME_URL} from '@/config';

const refreshCurrentPage = inject('refresh');
const globalStore = useGlobalStore();
const tabsStore = useTabsStore();
const route = useRoute();
const router = useRouter();

const refresh = () => {
  setTimeout(async () => {
    await globalStore.removeKeepAlivePage(route.name);
    refreshCurrentPage(false);
    await nextTick(async () => {
      await globalStore.addKeepAlivePage(route.name);
      refreshCurrentPage(true);
    });
  }, 0);
};

const maximize = () => {
  globalStore.setGlobalState('isMaximization', true);
};

const closeCurrent = async () => {
  if (!route.meta.isAffix) {
    await tabsStore.removeTab(route.fullPath);
  }
};

const closeLeft = async () => {
  await tabsStore.closeTabOnSide(route.fullPath, 'left');
};

const closeRight = async () => {
  await tabsStore.closeTabOnSide(route.fullPath, 'right');

};

const closeOthers = async () => {
  await tabsStore.closeMultipleTab(route.fullPath);
};

const closeAll = async () => {
  await tabsStore.closeMultipleTab();
  await router.push(HOME_URL);
};
</script>

<template>
  <el-dropdown :teleported="false" trigger="click">
    <div class="more-btn">
      <font-awesome-icon class="awesome-icon" icon="fas fa-chevron-down"></font-awesome-icon>
    </div>
    <template #dropdown>
      <el-dropdown-menu>
        <el-dropdown-item @click="refresh">
          <el-icon>
            <Refresh/>
          </el-icon>
          刷新页面
        </el-dropdown-item>
        <el-dropdown-item @click="maximize">
          <el-icon>
            <FullScreen/>
          </el-icon>
          最大化
        </el-dropdown-item>
        <el-dropdown-item divided @click="closeCurrent">
          <el-icon>
            <Remove/>
          </el-icon>
          关闭当前
        </el-dropdown-item>
        <el-dropdown-item @click="closeLeft">
          <el-icon>
            <DArrowLeft/>
          </el-icon>
          关闭左侧
        </el-dropdown-item>
        <el-dropdown-item @click="closeRight">
          <el-icon>
            <DArrowRight/>
          </el-icon>
          关闭右侧
        </el-dropdown-item>
        <el-dropdown-item divided @click="closeOthers">
          <el-icon>
            <CircleClose/>
          </el-icon>
          关闭其它
        </el-dropdown-item>
        <el-dropdown-item @click="closeAll">
          <el-icon>
            <FolderDelete/>
          </el-icon>
          关闭所有
        </el-dropdown-item>
      </el-dropdown-menu>
    </template>
  </el-dropdown>
</template>

<style lang="scss" scoped>
.el-dropdown {
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;

  .more-btn {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 43px;
    cursor: pointer;
    border-left: 1px solid var(--el-border-color-light);
    transition: all 0.3s;

    &:hover {
      background-color: var(--el-color-info-light-9);
    }

    .awesome-icon {
      font-size: 16px;
    }
  }
}
</style>
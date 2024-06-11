<script setup>
import Sortable from 'sortablejs';
import {useGlobalStore} from '@/stores/modules/global';
import {useTabsStore} from '@/stores/modules/tabs';
import {useRoute, useRouter} from 'vue-router';
import {onMounted, ref, watch} from 'vue';
import MoreButton from '@/layouts/components/Tabs/components/MoreButton.vue';
import {HOME_URL} from '@/config';
import {usePersonalStore} from '@/stores/modules/personal/personal';
import {hasPermission} from '@/utils/wheel';

const route = useRoute();
const router = useRouter();
const globalStore = useGlobalStore();
const tabsStore = useTabsStore();
const personalStore = usePersonalStore();

const activeName = ref(route.fullPath);

const tabClick = (paneContext) => {
  router.push(paneContext.props.name);
};

const tabRemove = (paneName) => {
  tabsStore.removeTab(paneName, paneName === route.fullPath);
};

const initTabs = async () => {
  for (const item of personalStore.flatMenuList) {
    if (item.meta.isAffix && !item.meta.isHide && !item.meta.isFull && hasPermission(item.meta.permission)) {
      const tabItem = {
        icon: item.meta.icon,
        title: item.meta.title,
        path: item.path,
        name: item.name,
        isClose: !item.meta.isAffix,
        isKeepAlive: item.meta.isKeepAlive,
      };
      await tabsStore.addTab(tabItem);
    }
  }
};
const dropTabs = async () => {
  Sortable.create(document.querySelector('.el-tabs__nav'), {
    draggable: '.el-tabs__item',
    animation: 300,
    filter: (event, item) => {
      //禁止home/index拖动
      if (item.id === `tab-${HOME_URL}`) {
        return true;
      }
    },
    onEnd: async ({newIndex, oldIndex}) => {
      const tabs = [...tabsStore.tabs];
      const currentTab = tabs.splice(oldIndex, 1)[0];
      tabs.splice(newIndex, 0, currentTab);
      await tabsStore.setTabs(tabs);
    },
    onMove: (event) => {
      //禁止落在home/index之前
      if (event.related.id === `tab-${HOME_URL}`) {
        return false;
      }
    },
  });
};

watch(
    () => route.fullPath,
    () => {
      if (!route.meta.isFull) {
        activeName.value = route.fullPath;
        const tabItem = {
          icon: route.meta.icon,
          title: route.meta.title,
          path: route.fullPath,
          name: route.name,
          isClose: !route.meta.isAffix,
          isKeepAlive: route.meta.isKeepAlive,
        };
        tabsStore.addTab(tabItem);
      }
    }, {immediate: true});

onMounted(async () => {
  await dropTabs();
  await initTabs();
});
</script>

<template>
  <div class="tabs-box">
    <div class="tabs-menu">
      <el-tabs v-model="activeName" type="card" @tab-click="tabClick" @tab-remove="tabRemove">
        <el-tab-pane v-for="item in tabsStore.tabs" :key="item.path" :closable="item.isClose" :label="item.title"
                     :name="item.path">
          <template #label>
            <el-icon v-show="item.icon && globalStore.isTabsIcon" class="tabs-icon">
              <component :is="item.icon"></component>
            </el-icon>
            {{ item.title }}
          </template>
        </el-tab-pane>
      </el-tabs>
      <MoreButton></MoreButton>
    </div>
  </div>
</template>

<style lang="scss" scoped>
@import "./index.scss";
</style>
<script setup>
import Footer from '@/layouts/components/Footer/index.vue';
import Tabs from '@/layouts/components/Tabs/index.vue';
import Maximization from '@/layouts/components/Main/components/Maximization.vue';
import {RouterView} from 'vue-router';
import {useGlobalStore} from '@/stores/modules/global';
import {onBeforeUnmount, provide, ref, watch} from 'vue';
import {useDebounceFn} from '@vueuse/core';

const globalStore = useGlobalStore();

const isRouterShow = ref(true);
const screenWidth = ref(0);
const refreshCurrentPage = (value) => isRouterShow.value = value;
const listeningWindow = useDebounceFn(() => {
  screenWidth.value = document.body.clientWidth;
  if (!globalStore.isCollapse && screenWidth.value < 1200) {
    globalStore.setGlobalState('isCollapse', true);
  }
  if (globalStore.isCollapse && screenWidth.value > 1200) {
    globalStore.setGlobalState('isCollapse', false);
  }
}, 100);

window.addEventListener('resize', listeningWindow, false);


watch(() => globalStore.isMaximization, () => {
  const app = document.getElementById('app');
  if (globalStore.isMaximization) {
    app.classList.add('main-max');
  } else {
    app.classList.remove('main-max');
  }
}, {immediate: true});

watch(() => globalStore.layout, () => {
  const body = document.body;
  body.setAttribute('class', globalStore.layout);

}, {immediate: true});

provide('refresh', refreshCurrentPage);

onBeforeUnmount(() => {
  window.removeEventListener('resize', listeningWindow);
});

</script>

<template>
  <Maximization v-show="globalStore.isMaximization"></Maximization>
  <Tabs v-show="globalStore.isTabs"></Tabs>
  <el-main>
    <router-view v-slot="{Component,route}">
      <transition :appear="true" mode="out-in" name="fade-transform">
        <keep-alive :include="globalStore.keepAlivePages">
          <component :is="Component" v-if="isRouterShow" :key="route.fullPath"></component>
        </keep-alive>
      </transition>
    </router-view>
  </el-main>
  <el-footer>
    <Footer v-show="globalStore.isFooter"></Footer>
  </el-footer>
</template>

<style lang="scss" scoped>
@import "./index.scss";
</style>

<script setup>

import Main from '@/layouts/components/Main/index.vue';
import SubMenu from '@/layouts/components/Menu/SubMenu.vue';
import {useGlobalStore} from '@/stores/modules/global';
import {useRoute, useRouter} from 'vue-router';
import {computed} from 'vue';
import HeaderRight from '@/layouts/components/Header/HeaderRight.vue';
import {usePersonalStore} from '@/stores/modules/personal/personal';


const globalStore = useGlobalStore();
const personalStore = usePersonalStore();

const route = useRoute();
const router = useRouter();
const title = import.meta.env.VITE_GLOBAL_APP_TITLE;
const activeMenu = computed(() => route.meta.activeMenu ? route.meta.activeMenu : route.path);
const handleClickItem = async (item) => {
  if (item.meta.link) {
    return window.open(item.meta.link, '_blank');
  }
  await router.push(item.path);
};
</script>

<template>
  <el-container class="container">
    <el-header>

      <div class="logo flex-center">
        <img alt="pandx.wheel" class="logo-img" src="@/assets/images/logo.png"/>
        <span class="logo-txt">{{ title }}</span>
      </div>
      <el-menu :default-active="activeMenu"
               :router="false"
               mode="horizontal">

        <template v-for="item in personalStore.showMenuList" :key="item.path">
          <el-sub-menu v-if="item.children&&item.children.length" :key="item.path" :index="`${item.path}el-sub-menu`">
            <template #title>
              <el-icon>
                <component :is="item.meta.icon"></component>
              </el-icon>

              <span>{{ item.meta.title }}</span>

            </template>
            <SubMenu :menu-list="item.children"></SubMenu>
          </el-sub-menu>
          <el-menu-item v-else :key="`${item.path}el-menu-item`" :index="item.path" @click="handleClickItem(item)">
            <el-icon>
              <component :is="item.meta.icon"></component>
            </el-icon>
            <template #title>
              <span class="s-omit">{{ item.meta.title }}</span>
            </template>
          </el-menu-item>
        </template>
      </el-menu>
      <HeaderRight></HeaderRight>
    </el-header>
    <Main></Main>
  </el-container>
</template>

<style lang="scss" scoped>
@import "./index.scss";
</style>
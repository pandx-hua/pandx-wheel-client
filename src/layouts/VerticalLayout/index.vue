<script setup>
import Main from '@/layouts/components/Main/index.vue';
import SubMenu from '@/layouts/components/Menu/SubMenu.vue';
import {useGlobalStore} from '@/stores/modules/global';
import {useRoute} from 'vue-router';
import HeaderLeft from '@/layouts/components/Header/HeaderLeft.vue';
import {computed} from 'vue';
import HeaderRight from '@/layouts/components/Header/HeaderRight.vue';
import {usePersonalStore} from '@/stores/modules/personal/personal';

const globalStore = useGlobalStore();
const personalStore = usePersonalStore();

const route = useRoute();
const title = import.meta.env.VITE_GLOBAL_APP_TITLE;
const activeMenu = computed(() => route.meta.activeMenu ? route.meta.activeMenu : route.path);


</script>

<template>
  <el-container class="container">
    <el-aside>
      <div :style="{width:globalStore.isCollapse?'65px':'210px'}" class="aside-box">
        <div class="logo flex-center">
          <img alt="pandx.wheel" class="logo-img" src="@/assets/images/logo.png"/>
          <span v-show="!globalStore.isCollapse" class="logo-txt">{{ title }}</span>
        </div>
        <el-scrollbar>
          <el-menu
              :collapse="globalStore.isCollapse"
              :collapse-transition="false"
              :default-active="activeMenu"
              :router="false"
              :unique-opened="globalStore.isAccordion">
            <SubMenu :menu-list="personalStore.showMenuList"></SubMenu>
          </el-menu>
        </el-scrollbar>
      </div>
    </el-aside>
    <el-container>
      <el-header>
        <HeaderLeft></HeaderLeft>
        <HeaderRight></HeaderRight>
      </el-header>
      <Main></Main>
    </el-container>
  </el-container>
</template>

<style lang="scss" scoped>
@import "./index.scss";
</style>
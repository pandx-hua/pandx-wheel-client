<script setup>
import Main from '@/layouts/components/Main/index.vue';
import SubMenu from '@/layouts/components/Menu/SubMenu.vue';
import {useGlobalStore} from '@/stores/modules/global';
import {useRoute, useRouter} from 'vue-router';
import HeaderLeft from '@/layouts/components/Header/HeaderLeft.vue';
import {computed, ref, watch} from 'vue';
import HeaderRight from '@/layouts/components/Header/HeaderRight.vue';
import {usePersonalStore} from '@/stores/modules/personal/personal';


const globalStore = useGlobalStore();
const personalStore = usePersonalStore();

const route = useRoute();
const router = useRouter();
const title = import.meta.env.VITE_GLOBAL_APP_TITLE;
const activeMenu = computed(() => route.meta.activeMenu ? route.meta.activeMenu : route.path);
const menuList = computed(() => personalStore.showMenuList);

const subMenuList = ref([]);
const splitActive = ref('');
watch(() => [menuList, route], () => {

  if (menuList.value.length) {
    splitActive.value = route.path;
    const menuItem = menuList.value.filter(item => {
      return route.path === item.path || `/${route.path.split('/')[1]}` === item.path;
    });
    if (menuItem[0] && menuItem[0].children && menuItem[0].children.length) {
      return subMenuList.value = menuItem[0].children;
    }
    subMenuList.value = [];
  }
}, {deep: true, immediate: true});

const changeSubMenu = (item) => {
  splitActive.value = item.path;
  if (item.children && item.children.length) {
    return subMenuList.value = item.children;
  }
  subMenuList.value = [];
  router.push(item.path);
};

</script>

<template>
  <el-container class="container">
    <div class="aside-split">
      <div class="logo flex-center">
        <img alt="pandx.wheel" class="logo-img" src="@/assets/images/logo.png"/>
      </div>
      <el-scrollbar>
        <div class="split-list">
          <div v-for="item in menuList"
               :key="item.path"
               :class="{'split-active':splitActive===item.path || `/${splitActive.split('/')[1]}`===item.path}"
               class="split-item"
               @click="changeSubMenu(item)">
            <el-icon>
              <component :is="item.meta.icon"></component>
            </el-icon>
            <span class="title">{{ item.meta.title }}</span>
          </div>
        </div>
      </el-scrollbar>
    </div>
    <el-aside :class="{'not-aside':!subMenuList.length}" :style="{width:globalStore.isCollapse?'65px':'210px'}">
      <div class="logo flex-center">
        <span v-show="subMenuList.length" class="logo-txt">{{ globalStore.isCollapse ? 'W' : title }}</span>
      </div>
      <el-scrollbar>
        <el-menu
            :collapse="globalStore.isCollapse"
            :collapse-transition="false"
            :default-active="activeMenu"
            :router="false"
            :unique-opened="globalStore.isAccordion">
          <SubMenu :menu-list="subMenuList"></SubMenu>
        </el-menu>
      </el-scrollbar>
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
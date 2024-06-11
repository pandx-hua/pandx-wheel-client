<script setup>

import {
  CircleCheckFilled,
  ColdDrink,
  Moon,
  Notification,
  QuestionFilled,
  Setting,
  Sunny,
} from '@element-plus/icons-vue';
import {useGlobalStore} from '@/stores/modules/global';
import {ref} from 'vue';
import mittBus from '@/utils/mittBus';
import {useTheme} from '@/hooks/useTheme';
import {DEFAULT_PRIMARY} from '@/config';

const globalStore = useGlobalStore();
const drawerVisible = ref(false);
const theme = useTheme();

const colorList = [
  DEFAULT_PRIMARY,
  '#daa96e',
  '#0c819f',
  '#409eff',
  '#27ae60',
  '#ff5c93',
  '#e74c3c',
  '#fd726d',
  '#f39c12',
  '#9b59b6',
];

mittBus.on('openThemeDrawer', () => {
  drawerVisible.value = true;

});
</script>

<template>
  <el-drawer v-model="drawerVisible" size="300px" title="布局设置">
    <el-divider class="divider" content-position="center">
      <el-icon>
        <Notification/>
      </el-icon>
      布局样式
    </el-divider>
    <div class="layout-box">
      <el-tooltip :show-after="200" content="纵向" effect="dark" placement="top">
        <div :class="['layout-item layout-vertical',{'is-active':globalStore.layout==='vertical'}]"
             @click="globalStore.setGlobalState('layout','vertical')">
          <div class="layout-dark"></div>
          <div class="layout-container">
            <div class="layout-light"></div>
            <div class="layout-content"></div>
          </div>
          <el-icon v-if="globalStore.layout==='vertical'">
            <CircleCheckFilled/>
          </el-icon>
        </div>
      </el-tooltip>
      <el-tooltip :show-after="200" content="经典" effect="dark" placement="top">
        <div :class="['layout-item layout-classic',{'is-active':globalStore.layout==='classic'}]"
             @click="globalStore.setGlobalState('layout','classic')">
          <div class="layout-dark"></div>
          <div class="layout-container">
            <div class="layout-light"></div>
            <div class="layout-content"></div>
          </div>
          <el-icon v-if="globalStore.layout==='classic'">
            <CircleCheckFilled/>
          </el-icon>
        </div>
      </el-tooltip>
      <el-tooltip :show-after="200" content="横向" effect="dark" placement="top">
        <div :class="['layout-item layout-transverse',{'is-active':globalStore.layout==='transverse'}]"
             @click="globalStore.setGlobalState('layout','transverse')">
          <div class="layout-dark"></div>
          <div class="layout-content"></div>
          <el-icon v-if="globalStore.layout==='transverse'">
            <CircleCheckFilled/>
          </el-icon>
        </div>
      </el-tooltip>
      <el-tooltip :show-after="200" content="分栏" effect="dark" placement="top">
        <div :class="['layout-item layout-columns',{'is-active':globalStore.layout==='columns'}]"
             @click="globalStore.setGlobalState('layout','columns')">
          <div class="layout-dark"></div>
          <div class="layout-light"></div>
          <div class="layout-content"></div>
          <el-icon v-if="globalStore.layout==='columns'">
            <CircleCheckFilled/>
          </el-icon>
        </div>
      </el-tooltip>
    </div>
    <div class="theme-item">
      <span>
        侧栏颜色反转
        <el-tooltip content="侧栏颜色变为深色模式" effect="dark" placement="top">
          <el-icon><QuestionFilled/></el-icon>
        </el-tooltip>
      </span>
      <el-switch v-model="globalStore.isAsideInverted" @change="theme.setAsideTheme"></el-switch>
    </div>
    <div class="theme-item mb40">
      <span>
        头部颜色反转
        <el-tooltip content="头部颜色变为深色模式" effect="dark" placement="top">
          <el-icon><QuestionFilled/></el-icon>
        </el-tooltip>
      </span>
      <el-switch v-model="globalStore.isHeaderInverted" @change="theme.setHeaderTheme"></el-switch>
    </div>
    <el-divider class="divider" content-position="center">
      <el-icon>
        <ColdDrink/>
      </el-icon>
      全局主题
    </el-divider>
    <div class="theme-item">
      <span>主题颜色</span>
      <el-color-picker v-model="globalStore.primary" :predefine="colorList"
                       @change="theme.changePrimary"></el-color-picker>
    </div>
    <div class="theme-item">
      <span>暗黑模式</span>
      <el-switch v-model="globalStore.isDark" :active-icon="Sunny" :inactive-icon="Moon" inline-prompt
                 @change="theme.switchDark"/>
    </div>
    <div class="theme-item">
      <span>灰色模式</span>
      <el-switch v-model="globalStore.isGray" @change="theme.changeGrayOrWeak('gray', !!$event)"/>
    </div>
    <div class="theme-item mb40">
      <span>色弱模式</span>
      <el-switch v-model="globalStore.isWeak" @change="theme.changeGrayOrWeak('weak', !!$event)"/>
    </div>

    <!-- 界面设置 -->
    <el-divider class="divider" content-position="center">
      <el-icon>
        <Setting/>
      </el-icon>
      界面设置
    </el-divider>
    <div class="theme-item">
      <span>菜单折叠</span>
      <el-switch v-model="globalStore.isCollapse"/>
    </div>
    <div class="theme-item">
      <span>菜单手风琴</span>
      <el-switch v-model="globalStore.isAccordion"/>
    </div>
    <div class="theme-item">
      <span>面包屑</span>
      <el-switch v-model="globalStore.isBreadcrumb"/>
    </div>
    <div class="theme-item">
      <span>面包屑图标</span>
      <el-switch v-model="globalStore.isBreadcrumbIcon"/>
    </div>
    <div class="theme-item">
      <span>标签栏</span>
      <el-switch v-model="globalStore.isTabs"/>
    </div>
    <div class="theme-item">
      <span>标签栏图标</span>
      <el-switch v-model="globalStore.isTabsIcon"/>
    </div>
    <div class="theme-item">
      <span>页脚</span>
      <el-switch v-model="globalStore.isFooter"/>
    </div>
  </el-drawer>
</template>

<style lang="scss" scoped>
@import "./index.scss";
</style>
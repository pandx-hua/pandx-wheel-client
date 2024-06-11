<script setup>
import {useGlobalStore} from '@/stores/modules/global';

const globalStore = useGlobalStore();
const toggleCollapse = () => {
  globalStore.setGlobalState('isCollapse', !globalStore.isCollapse);
};
</script>

<template>
  <el-icon class="collapse-icon" @click="toggleCollapse">
    <component :is="globalStore.isCollapse?'expand':'fold'"></component>
  </el-icon>
</template>

<style lang="scss" scoped>
.collapse-icon {
  margin-right: 20px;
  font-size: 21.5px;
  color: var(--el-header-text-color);
  cursor: pointer;

  &:hover {
    color: var(--el-color-primary);
  }
}
</style>

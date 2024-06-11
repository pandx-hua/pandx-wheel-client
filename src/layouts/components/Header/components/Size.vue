<script setup>

import {FontAwesomeIcon} from '@fortawesome/vue-fontawesome';
import {useGlobalStore} from '@/stores/modules/global';

const globalStore = useGlobalStore();

const sizeList = [
  {
    label: '默认', value: 'default',
  },
  {
    label: '大号', value: 'large',
  },
  {
    label: '小号', value: 'small',
  },
];

const setSize = (value) => {
  if (globalStore.size !== value) {
    globalStore.setGlobalState('size', value);
  }
};
</script>

<template>
  <div class="size-icon">
    <el-dropdown trigger="click" @command="setSize">
      <font-awesome-icon class="header-awesome-icon" icon="fas fa-cubes"></font-awesome-icon>
      <template #dropdown>
        <el-dropdown-menu>
          <el-dropdown-item v-for="item in sizeList" :key="item.value" :command="item.value"
                            :disabled="item.value===globalStore.size">
            {{ item.label }}
          </el-dropdown-item>
        </el-dropdown-menu>
      </template>
    </el-dropdown>

  </div>
</template>

<style lang="scss" scoped>
@import "./icon.scss";
</style>
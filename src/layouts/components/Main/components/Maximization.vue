<script setup>

import {useGlobalStore} from '@/stores/modules/global';
import {FontAwesomeIcon} from '@fortawesome/vue-fontawesome';

const globalStore = useGlobalStore();

const exitMaximization = () => {
  globalStore.setGlobalState('isMaximization', false);
};
</script>

<template>
  <div class="maximization" @click="exitMaximization">
    <font-awesome-icon class="awesome-icon" icon="fas fa-sign-out"></font-awesome-icon>
  </div>
</template>

<style lang="scss" scoped>
.maximization {
  position: fixed;
  top: -25px;
  right: -25px;
  z-index: 999;
  width: 55px;
  height: 55px;
  cursor: pointer;
  background-color: var(--el-color-info);
  border-radius: 50%;
  opacity: 0.9;

  &:hover {
    background-color: var(--el-color-info-dark-2);
  }

  .awesome-icon {
    position: relative;
    top: 46%;
    left: 19%;
    font-size: 14px;
    color: #ffffff;
    transform: rotateY(180deg);
  }
}
</style>
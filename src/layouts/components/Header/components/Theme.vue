<script setup>

import {FontAwesomeIcon} from '@fortawesome/vue-fontawesome';
import mittBus from '@/utils/mittBus';

const openDrawer = () => {
  mittBus.emit('openThemeDrawer');
};
</script>

<template>
  <div class="theme-icon">
    <font-awesome-icon class="header-awesome-icon" icon="fas fa-tshirt" @click="openDrawer"></font-awesome-icon>
  </div>
</template>

<style lang="scss" scoped>
@import "./icon.scss";
</style>
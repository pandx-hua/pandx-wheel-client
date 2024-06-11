<script setup>
import screenfull from 'screenfull';
import {FontAwesomeIcon} from '@fortawesome/vue-fontawesome';
import {onMounted, ref} from 'vue';
import {ElMessage} from 'element-plus';

const isFullscreen = ref(screenfull.isFullscreen);
const handleFullscreen = () => {
  if (!screenfull.isEnabled) {
    ElMessage.warning('当前浏览器不支持全屏');
  }
  screenfull.toggle();
};

onMounted(() => {
  screenfull.on('change', () => {
    isFullscreen.value = screenfull.isFullscreen;
  });
});
</script>

<template>
  <div class="fullscreen-icon">
    <font-awesome-icon :icon="isFullscreen?'fas fa-compress':'fas fa-expand'" class="header-awesome-icon"
                       @click="handleFullscreen"></font-awesome-icon>
  </div>
</template>

<style lang="scss" scoped>
@import "./icon.scss";
</style>
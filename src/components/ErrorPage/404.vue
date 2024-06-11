<script setup>
import page404 from '@/assets/images/404.png';
</script>

<template>
  <div class="main">
    <img :src="page404" alt="404">
  </div>
</template>

<style lang="scss" scoped>
.main {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
}
</style>

<script setup>
import {useGlobalStore} from '@/stores/modules/global';
import CollapseIcon from '@/layouts/components/Header/components/Collapse.vue';
import Breadcrumb from '@/layouts/components/Header/components/Breadcrumb.vue';

const globalStore = useGlobalStore();

</script>

<template>
  <div class="header-l">
    <CollapseIcon></CollapseIcon>
    <Breadcrumb v-show="globalStore.isBreadcrumb"></Breadcrumb>
  </div>
</template>

<style lang="scss" scoped>
.header-l {
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  white-space: nowrap;
}
</style>

<script setup>

import AvatarIcon from '@/layouts/components/Header/components/Avatar.vue';
import FullscreenIcon from '@/layouts/components/Header/components/Fullscreen.vue';
import SizeIcon from '@/layouts/components/Header/components/Size.vue';
import SearchIcon from '@/layouts/components/Header/components/Search.vue';
import ThemeIcon from '@/layouts/components/Header/components/Theme.vue';
import MessageIcon from '@/layouts/components/Header/components/Message.vue';
import {usePersonalStore} from '@/stores/modules/personal/personal';

const personalStore = usePersonalStore();
</script>

<template>
  <div class="header-r">
    <div class="header-icon">
      <SizeIcon></SizeIcon>
      <SearchIcon></SearchIcon>
      <ThemeIcon></ThemeIcon>
      <MessageIcon></MessageIcon>
      <FullscreenIcon></FullscreenIcon>
    </div>
    <AvatarIcon></AvatarIcon>
  </div>
</template>

<style lang="scss" scoped>
.header-r {
  display: flex;
  align-items: center;
  justify-content: center;
  padding-right: 0;

  .header-icon {
    display: flex;
    align-items: center;

    & > * {
      margin-left: 21px;
      color: var(--el-header-text-color);
    }
  }
}
</style>

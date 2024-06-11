<script setup>
import {useRouter} from 'vue-router';

defineProps({
  menuList: Array,
});
const router = useRouter();

const handleClickItem = async (item) => {
  if (item.meta.link) {
    return window.open(item.meta.link, '_blank');
  }
  await router.push(item.path);
};
</script>

<template>
  <template v-for="item in menuList" :key="item.path">
    <el-sub-menu v-if="item.children&&item.children.length" :index="item.path">
      <template #title>
        <el-icon>
          <component :is="item.meta.icon"></component>
        </el-icon>

        <span class="s-omit">{{ item.meta.title }}</span>
      </template>
      <SubMenu :menu-list="item.children"></SubMenu>
    </el-sub-menu>
    <el-menu-item v-else :index="item.path" @click="handleClickItem(item)">
      <el-icon>
        <component :is="item.meta.icon"></component>
      </el-icon>
      <template #title>
        <span class="s-omit">{{ item.meta.title }}</span>
      </template>
    </el-menu-item>
  </template>
</template>

<style lang="scss">
.el-sub-menu .el-sub-menu__title:hover {
  color: var(--el-menu-hover-text-color) !important;
  background-color: transparent !important;
}

.el-menu--collapse {
  .is-active {
    .el-sub-menu__title {
      color: #ffffff !important;
      background-color: var(--el-color-primary) !important;
    }
  }
}

.el-menu-item {
  &:hover {
    color: var(--el-menu-hover-text-color);
  }

  &.is-active {
    color: var(--el-menu-active-color) !important;
    background-color: var(--el-menu-active-bg-color);

    &::before {
      position: absolute;
      top: 0;
      bottom: 0;
      width: 4px;
      content: "";
      background-color: var(--el-color-primary);
    }
  }
}

.vertical,
.classic,
.transverse {
  .el-menu-item {
    &.is-active {
      &::before {
        left: 0;
      }
    }
  }
}

.columns {
  .el-menu-item {
    &.is-active {
      &::before {
        right: 0;
      }
    }
  }
}
</style>

<script setup>
import {useGlobalStore} from '@/stores/modules/global';
import {ArrowRight} from '@element-plus/icons-vue';
import {useRoute, useRouter} from 'vue-router';
import {computed} from 'vue';
import {HOME_ICON, HOME_TITLE, HOME_URL} from '@/config';
import {usePersonalStore} from '@/stores/modules/personal/personal';

const globalStore = useGlobalStore();
const personalStore = usePersonalStore();
const route = useRoute();
const router = useRouter();

const breadcrumbList = computed(() => {
  let breadcrumb = personalStore.breadcrumbList[route.matched[route.matched.length - 1].path];
  //home breadcrumb
  if (breadcrumb[0].path !== HOME_URL) {
    breadcrumb = [{path: HOME_URL, meta: {icon: HOME_ICON, title: HOME_TITLE}}, ...breadcrumb];
  }
  return breadcrumb;
});
const handleBreadcrumbClick = (item, index) => {
  if (index !== breadcrumbList.value.length - 1 || index !== breadcrumbList.value.length - 2) {
    router.push(item.path);
  }
};

</script>

<template>
  <div :class="['breadcrumb-box mask-img',!globalStore.isBreadcrumbIcon && 'no-icon']">
    <el-breadcrumb :separator-icon="ArrowRight">
      <transition-group name="breadcrumb">
        <el-breadcrumb-item v-for="(item,index) in breadcrumbList" :key="item.path">
          <div class="el-breadcrumb__inner is-link" @click="handleBreadcrumbClick(item,index)">
            <el-icon v-show="item.meta.icon && globalStore.isBreadcrumbIcon" class="breadcrumb-icon">
              <component :is="item.meta.icon"></component>
            </el-icon>
            <span class="breadcrumb-title">{{ item.meta.title }}</span>
          </div>
        </el-breadcrumb-item>
      </transition-group>
    </el-breadcrumb>
  </div>
</template>

<style lang="scss" scoped>
.breadcrumb-box {
  display: flex;
  align-items: center;
  overflow: hidden;

  .el-breadcrumb {
    white-space: nowrap;

    .el-breadcrumb__item {
      position: relative;
      display: inline-block;
      float: none;

      .el-breadcrumb__inner {
        display: inline-flex;

        &.is-link {
          color: var(--el-header-text-color);

          &:hover {
            color: var(--el-color-primary);
          }
        }

        .breadcrumb-icon {
          margin-top: 2px;
          margin-right: 6px;
          font-size: 16px;
        }

        .breadcrumb-title {
          margin-top: 3px;
        }
      }

      &:last-child .el-breadcrumb__inner,
      &:last-child .el-breadcrumb__inner:hover {
        color: var(--el-header-text-color-regular);
      }

      :deep(.el-breadcrumb__separator) {
        position: relative;
        top: -1px;
      }
    }
  }
}

.no-icon {
  .el-breadcrumb {
    .el-breadcrumb__item {
      top: -2px;

      :deep(.el-breadcrumb__separator) {
        top: 2px;
      }
    }
  }
}
</style>

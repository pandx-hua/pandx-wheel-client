<script setup>

import {FontAwesomeIcon} from '@fortawesome/vue-fontawesome';
import {computed, nextTick, ref} from 'vue';
import {useRouter} from 'vue-router';
import {Search} from '@element-plus/icons-vue';
import {usePersonalStore} from '@/stores/modules/personal/personal';

const router = useRouter();
const personalStore = usePersonalStore();
const searchVisible = ref(false);
const searchInputRef = ref();
const searchMenu = ref('');
const menuList = computed(() => personalStore.flatMenuList.filter(item => !item.meta.isHide));
const openSearch = () => {
  searchVisible.value = true;
  nextTick(() => {
    setTimeout(() => {
      searchInputRef.value.focus;
    });
  });
};
const closeSearch = () => {
  searchVisible.value = false;
};
const searchMenuList = (query, callback) => {
  const results = query ? menuList.value.filter(filterNodeMethod(query)) : menuList.value;
  return callback(results);
};

const filterNodeMethod = (query) => {
  return (material) => {
    return (material.path.toLowerCase().indexOf(query.toLowerCase()) > -1 || material.meta.title.toLowerCase().indexOf(query.toLowerCase()) > -1);
  };
};

const handleClickMenu = (item) => {
  searchMenu.value = '';
  if (item.meta.link) {
    window.open(item.meta.link, '_blank');
  } else {
    router.push(item.path);
    closeSearch();
  }
};
</script>

<template>
  <div class="search-icon">
    <font-awesome-icon class="header-awesome-icon" icon="fas fa-search" @click="openSearch"></font-awesome-icon>
    <el-dialog v-model="searchVisible" :modal="false" :show-close="false" destroy-on-close fullscreen
               @click="closeSearch">
      <el-autocomplete
          ref="searchInputRef"
          v-model="searchMenu"
          :fetch-suggestions="searchMenuList"
          placeholder="请输入菜单或路径搜索"
          value-key="path"
          @select="handleClickMenu"
          @click.stop>
        <template #prefix>
          <el-icon>
            <Search/>
          </el-icon>
        </template>
        <template #default="{item}">
          <el-icon>
            <component :is="item.meta.icon"></component>
          </el-icon>
          <span>{{ item.meta.title }}</span>
        </template>
      </el-autocomplete>
    </el-dialog>
  </div>
</template>

<style lang="scss" scoped>
@import "./icon.scss";

.search-icon {
  :deep(.el-dialog) {
    background-color: rgb(0 0 0 / 50%);
    border-radius: 0;
    box-shadow: unset !important;

    .el-dialog__header {
      border-bottom: none !important;
    }
  }

  :deep(.el-autocomplete) {
    position: relative;
    top: 100px;
    left: 50%;
    width: 550px;
    transform: translateX(-50%);

    .el-input__wrapper {
      background-color: var(--el-bg-color);
    }
  }
}

.el-autocomplete__popper {
  .el-icon {
    position: relative;
    top: 2px;
    font-size: 16px;
  }

  span {
    margin: 0 0 0 10px;
    font-size: 14px;
  }
}
</style>
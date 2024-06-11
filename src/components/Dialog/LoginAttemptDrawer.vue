<script setup>

import {onMounted, ref} from 'vue';
import {usePersonalStore} from '@/stores/modules/personal/personal';
import dayjs from 'dayjs';

const personalStore = usePersonalStore();
const visible = ref(false);

const openDrawer = () => {
  visible.value = true;
};

const formattedResult = (result) => {
  switch (result) {
    case 0:
      return '成功';
    case 1:
      return '未通过账号或Email地址验证';
    case 2:
      return '未通过密码验证';
    case 3:
      return '未通过双向验证';
    case 4:
      return '用户未激活';
    case 5:
      return '用户被锁定';
  }
};

defineExpose({openDrawer});

onMounted(async () => {
  await personalStore.getLoginAttempts();
});
</script>

<template>
  <el-drawer v-model="visible" :destroy-on-close="true" size="640" title="登录记录">
    <el-card v-for="item in personalStore.loginAttempts" key="item.id" class="mb10" shadow="hover">
      <el-row :gutter="16">
        <el-col :span="4" class="key">IP地址：</el-col>
        <el-col :span="20" class="value">{{ item.clientIpAddress }}</el-col>
      </el-row>
      <el-row :gutter="16">
        <el-col :span="4" class="key">浏览器：</el-col>
        <el-col :span="20" class="value">{{ item.browserInfo }}</el-col>
      </el-row>
      <el-row :gutter="16">
        <el-col :span="4" class="key">登录时间：</el-col>
        <el-col :span="20" class="value">{{ dayjs(item.creationTime).format('YYYY-MM-DD HH:mm:ss') }}</el-col>
      </el-row>
      <el-row :gutter="16">
        <el-col :span="4" class="key">登录结果：</el-col>
        <el-col v-if="!item.result" :span="20" class="value">
          <el-text type="success">{{ formattedResult(item.result) }}</el-text>
        </el-col>
        <el-col v-if="item.result" :span="20" class="value">
          <el-text type="danger">{{ formattedResult(item.result) }}</el-text>
        </el-col>
      </el-row>
    </el-card>
  </el-drawer>
</template>

<style lang="scss" scoped>
.key {
  text-align: right;
  font-weight: bolder;
  font-size: 14px;
  color: var(--el-text-color-regular);
}

.value {
  text-align: left;
  font-size: 14px;
  color: var(--el-text-color-regular);
}

</style>
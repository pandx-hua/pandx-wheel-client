<script setup>

import {hasPermission} from '@/utils/wheel';
import {Download, Files, Refresh} from '@element-plus/icons-vue';
import {onMounted, ref} from 'vue';
import {useLoggingStore} from '@/stores/modules/logging/logging';
import {$downloadFileFromCache} from '@/services/modules/files';
import {downloadWithToken} from '@/utils/download';

const loading = ref(false);
const loggingStore = useLoggingStore();

const refresh = async () => {
  await loggingStore.getLatestLogs();
};

const clearCache = () => {
};

const exportLogs = async () => {
  loading.value = true;
  try {
    await loggingStore.downloadLogs();
    await downloadWithToken($downloadFileFromCache, loggingStore.cachedFile.name, loggingStore.cachedFile.type, loggingStore.cachedFile);
  } finally {
    loading.value = false;
  }
};

const getFormattedLogs = (logLines) => {
  let resultHtml = '';
  for (const line of logLines) {
    resultHtml += `<span><pre>${line.replace(/^\[DEB]/, '<span class="tag tag-color-debug">DEB</span>')
        .replace(/^\[VER]/, '<span class="tag tag-color-verbose">VER</span>')
        .replace(/^\[INF]/, '<span class="tag tag-color-info">INF</span>')
        .replace(/^\[WAR]/, '<span class="tag tag-color-warning">WAR</span>')
        .replace(/^\[ERR]/, '<span class="tag tag-color-danger">ERR</span>')
        .replace(/^\[FAT]/, '<span class="tag tag-color-fetal">FAT</span>')}</pre></span>`;
  }
  return resultHtml;
};

onMounted(async () => {
  await loggingStore.getLatestLogs();
});
</script>

<template>
  <div class="card main">
    <el-form ref="searchFormRef">
      <el-row :gutter="16" class="mb12">
        <el-col :span="18">
          <div class="float-left">
            <el-button :disabled="!hasPermission('Permission.Caches.Clean')" :icon="Files" :plain="false"
                       type="primary"
                       @click="clearCache">清空全部缓冲
            </el-button>
            <el-button :disabled="!hasPermission('Permission.Logs.Export')" :icon="Download" :loading="loading"
                       :plain="true"
                       type="primary" @click="exportLogs">导出全部运行日志
            </el-button>
          </div>
        </el-col>
        <el-col :span="6">
          <div class="float-right">
            <el-button :disabled="!hasPermission('Permission.Logs.Search')" :icon="Refresh" type="default"
                       @click="refresh">刷新
            </el-button>
          </div>
        </el-col>
      </el-row>
    </el-form>
    <div class="data-box">
      <span v-html="getFormattedLogs(loggingStore.logLines)"></span>
    </div>
  </div>
</template>

<style lang="scss" scoped>
@import "./index.scss";
</style>
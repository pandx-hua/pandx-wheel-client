<script setup>

import {nextTick, ref} from 'vue';
import {SuccessFilled, WarningFilled} from '@element-plus/icons-vue';
import {useBackgroundJobStore} from '@/stores/modules/backgroundJobs/backgroundJobs';
import dayjs from 'dayjs';

const backgroundJobStore = useBackgroundJobStore();
const visible = ref(false);
const props = ref({
  title: '',
  data: {},
});

const acceptParams = (params) => {
  props.value = params;
  visible.value = true;
  nextTick(async () => {
    await backgroundJobStore.getJobExecutions({
      backgroundJobId: params.data.id,
    });
  });
};

const getFormattedParams = (parameters) => {
  try {
    const json = JSON.parse(parameters);
    return JSON.stringify(json, null, 4);
  } catch (e) {
    return parameters;
  }
};

defineExpose({
  acceptParams,
});
</script>

<template>
  <el-drawer v-model="visible" :title="props.title" size="50%">
    <el-timeline v-loading="backgroundJobStore.jobExecutionsLoading">
      <el-timeline-item v-for="(item, index) in backgroundJobStore.jobExecutions" :key="index"
                        :icon="item.result?SuccessFilled:WarningFilled"
                        :timestamp="dayjs(item.startTime).format('YYYY-MM-DD HH:mm:ss')"
                        :type="item.result?'success':'warning'" placement="top">
        <div class="content-box mb8 mt16">
          <div class="message-box mr12">执行了定时任务<i class="ml6 mr6">{{ item.jobName }}</i>，运行结果为
            <el-text v-if="item.result" class="ml6 mr6" size="large" type="success"><i>成功</i></el-text>
            <el-text v-if="!item.result" class="ml6 mr6" size="large" type="warning"><i>失败</i></el-text>
            。
          </div>

        </div>
        <div class="duration-box"> 耗时
          <el-tag class="ml8 mr8" effect="plain" size="small" type="primary">{{ item.duration }}
          </el-tag>
          ms
        </div>
        <div v-if="!item.result" class="data-box mt12">
          <pre lang="js">{{ getFormattedParams(item.exception) }}</pre>
        </div>
      </el-timeline-item>
    </el-timeline>
  </el-drawer>
</template>
<style lang="scss" scoped>
.duration-box {
  color: var(--el-text-color-placeholder);
  display: flex;
  align-items: center;
}

.data-box {
  width: 100%;
  border: 1px solid var(--el-border-color-light);
  border-radius: var(--el-border-radius-base);
  background-color: var(--el-bg-color-page);
  padding: 2px;
  overflow: auto;
  font-size: 12px;
  color: var(--el-text-color-regular);
}

.message-box {
  display: flex;
  align-items: center;
}
</style>
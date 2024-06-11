<script lang="jsx" setup>

import {Check, Close} from '@element-plus/icons-vue';
import {nextTick, onMounted, reactive, ref} from 'vue';
import {useBackgroundJobStore} from '@/stores/modules/backgroundJobs/backgroundJobs';

const emits = defineEmits(['save-success']);
const backgroundJobStore = useBackgroundJobStore();
const formRef = ref();
const visible = ref(false);
const loading = ref(false);
const props = ref({
  isUpdate: false,
  isBrowse: false,
  title: '',
  data: {},
});

const rules = reactive({
  jobName: [
    {
      required: true,
      message: '任务名称是必须的',
      trigger: 'blur',
    },
    {
      validator: async (rule, value, callback) => {
        const response = await backgroundJobStore.validateJobName({
          value: value,
          id: props.value.isUpdate ? props.value.data.id : null,
        });
        if (response.data) {
          if (response.data.result.status) {
            callback();
          } else {
            callback(new Error(response.data.result.message));
          }
        }
      },
      trigger: ['change', 'blur'],
    },
  ],
  cronExpression: [
    {
      required: true,
      message: 'CRON表达式是必须的',
      trigger: 'blur',
    },
    {
      validator: async (rule, value, callback) => {
        const response = await backgroundJobStore.validateCronExpression({
          value: value,
        });
        if (response.data) {
          if (response.data.result.status) {
            callback();
          } else {
            callback(new Error(response.data.result.message));
          }
        }
      },
      trigger: ['change', 'blur'],
    },
  ],
  job: [
    {
      required: true,
      message: '任务动作是必须的',
      trigger: 'change',
    },
  ],
});
const acceptParams = (params) => {
  props.value = params;
  visible.value = true;
  if (props.value.isUpdate || props.value.isBrowse) {
    nextTick(() => {
      props.value.data.isStartNow = false;
    });
  }
};

defineExpose({
  acceptParams,
});
const handleClick = async (form) => {
  form && form.validate(async (valid, fields) => {
    if (valid) {
      try {
        loading.value = true;
        await backgroundJobStore.createOrUpdateBackgroundJob({
          id: props.value.data.id,
          backgroundJob: props.value.data,
          isStartNow: props.value.data.isStartNow,
        });
        emits('save-success', props.value.isUpdate);
        visible.value = false;
      } catch {
      } finally {
        loading.value = false;
      }

    } else {
      console.log(fields);
    }
  });
};

onMounted(async () => {

});

const handleClose = () => {

};

const handleOpen = () => {

};
</script>

<template>
  <el-drawer v-model="visible" :destroy-on-close="true" :title="props.title" size="50%" @close="handleClose"
             @open="handleOpen">
    <el-form ref="formRef" :disabled="props.isBrowse" :hide-required-asterisk="false" :model="props.data" :rules="rules"
             label-position="top" label-suffix=" :" label-width="100">
      <el-form-item label="任务名称" prop="jobName">
        <el-input v-model="props.data.jobName" :clearable="true" :maxlength="256" placeholder=""></el-input>
      </el-form-item>
      <el-form-item label="任务动作" prop="job">
        <el-select v-model="props.data.job" :clearable="true" placeholder="选择任务要执行的动作">
          <el-option v-for="item in backgroundJobStore.exposedBackgroundJobs" :key="item.key" :label="item.value"
                     :value="item.key"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="CRON表达式" prop="cronExpression">
        <el-input v-model="props.data.cronExpression" :clearable="true" :maxlength="256" placeholder=""></el-input>
      </el-form-item>
      <el-form-item label="任务描述" prop="description">
        <el-input v-model="props.data.description" :clearable="true" :maxlength="1024" :rows="4" placeholder=""
                  type="textarea"></el-input>
      </el-form-item>
      <el-checkbox v-if="!props.isUpdate && !props.isBrowse" v-model="props.data.isStartNow">
        立即启用
      </el-checkbox>
    </el-form>
    <template v-if="!props.isBrowse" #footer>
      <el-button :icon="Close" @click="visible=false">取消</el-button>
      <el-button :icon="Check" :loading="loading" type="primary"
                 @click="handleClick(formRef)">确认
      </el-button>
    </template>
  </el-drawer>

</template>

<style lang="scss" scoped>

</style>
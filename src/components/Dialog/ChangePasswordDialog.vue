<script setup>

import {Check, Close} from '@element-plus/icons-vue';
import {reactive, ref} from 'vue';
import {usePersonalStore} from '@/stores/modules/personal/personal';

const personalStore = usePersonalStore();
const emits = defineEmits(['change-success']);
const loading = ref(false);
const formRef = ref();

const props = ref({});
const visible = ref(false);
const openDialog = () => {
  visible.value = true;
};
const rules = reactive({
  currentPassword: [
    {
      required: true,
      message: '当前密码是必须的',
      trigger: 'blur',
    },
  ],
  newPassword: [
    {
      required: true,
      message: '密码是必须的',
      trigger: 'blur',
    },
    {
      min: 6,
      trigger: 'blur',
      message: '密码至少要6位',
    },
  ],
  confirmPassword: [
    {
      required: true,
      message: '确认密码是必须的',
      trigger: 'blur',
    },
    {
      validator: async (rule, value, callback) => {
        if (props.value.newPassword !== value) {
          callback(new Error('两次输入的密码不一致'));
        } else {
          callback();
        }
      },
      trigger: 'blur',
    },
  ],
});
const handleClick = async (form) => {
  form && form.validate(async (valid, fields) => {
    if (valid) {
      try {
        loading.value = true;
        await personalStore.changePersonalPassword({
          currentPassword: props.value.currentPassword,
          newPassword: props.value.newPassword,
        });
        emits('change-success');
        visible.value = false;
      } finally {
        loading.value = false;
      }
    } else {
      console.log(fields);
    }
  });
};

defineExpose({
  openDialog,
});
</script>

<template>
  <el-dialog v-model="visible" :destroy-on-close="true" :draggable="true" title="修改密码" width="40%">
    <el-form ref="formRef" :model="props" :rules="rules" label-position="top">
      <el-form-item :label="`当前的密码`" prop="currentPassword">
        <el-input v-model="props.currentPassword" :maxlength="1024" placeholder="" type="password"></el-input>
      </el-form-item>
      <el-form-item label="新密码" prop="newPassword">
        <el-input v-model="props.newPassword" :maxlength="1024" placeholder="" type="password"></el-input>
      </el-form-item>
      <el-form-item label="确认密码" prop="confirmPassword">
        <el-input v-model="props.confirmPassword" :maxlength="1024" placeholder="" type="password"></el-input>
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button :icon="Close" @click="visible=false">取消</el-button>
      <el-button :icon="Check" :loading="loading" type="primary" @click="handleClick(formRef)">确认</el-button>
    </template>
  </el-dialog>
</template>

<style lang="scss" scoped>

</style>
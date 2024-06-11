<script setup>

import {Check, Close} from '@element-plus/icons-vue';
import {reactive, ref} from 'vue';
import {usePersonalStore} from '@/stores/modules/personal/personal';
import {useUserStore} from '@/stores/modules/authorization/users';

const personalStore = usePersonalStore();
const userStore = useUserStore();
const emits = defineEmits(['change-success']);
const loading = ref(false);
const formRef = ref();
const props = ref({
  title: '',
  data: {},
});
const visible = ref(false);
const acceptParams = async (params) => {
  props.value = params;
  visible.value = true;
};
const rules = reactive({
  superPassword: [
    {
      required: true,
      message: '当前用户的密码是必须的',
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
        if (props.value.data.newPassword !== value) {
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
        await userStore.changePassword({
          superPassword: props.value.data.superPassword,
          newPassword: props.value.data.newPassword,
          userId: props.value.data.id,
        });
        emits('change-success', props.value.data.name);
        visible.value = false;
      } finally {
        loading.value = false;
      }
    } else {
      console.log(fields);
    }
  });
};
const handleOpen = () => {
};
defineExpose({
  acceptParams,
});
</script>

<template>
  <el-dialog v-model="visible" :destroy-on-close="true" :draggable="true" :title="props.title" width="40%"
             @close="handleOpen">
    <el-form ref="formRef" :model="props.data" :rules="rules" label-position="top">
      <el-form-item :label="`当前用户 ${personalStore.user.name} 的密码`" prop="superPassword">
        <el-input v-model="props.data.superPassword" :maxlength="1024" placeholder="" type="password"></el-input>
      </el-form-item>
      <el-form-item label="新密码" prop="newPassword">
        <el-input v-model="props.data.newPassword" :maxlength="1024" placeholder="" type="password"></el-input>
      </el-form-item>
      <el-form-item label="确认密码" prop="confirmPassword">
        <el-input v-model="props.data.confirmPassword" :maxlength="1024" placeholder="" type="password"></el-input>
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
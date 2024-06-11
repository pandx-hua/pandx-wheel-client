<script setup>

import {reactive, ref} from 'vue';
import avatarJpg from '@/assets/images/avatar.jpg';
import {usePersonalStore} from '@/stores/modules/personal/personal';
import {Check, Close} from '@element-plus/icons-vue';
import {useUserStore} from '@/stores/modules/authorization/users';

const emits = defineEmits(['save-success']);
const personalStore = usePersonalStore();
const userStore = useUserStore();
const visible = ref(false);
const formRef = ref();
const loading = ref(false);
const user = ref({});
const rules = reactive({
  name: [
    {
      required: true,
      message: '姓名是必须的',
      trigger: 'blur',
    },
  ],
  gender: [
    {
      required: true,
      message: '性别是必须的',
      trigger: 'change',
    },
  ],
  email: [
    {
      required: true,
      message: 'Email地址是必须的',
      trigger: 'blur',

    },
    {
      type: 'email',
      message: 'Email地址格式不正确',
      trigger: 'blur',
    },
    {
      validator: async (rule, value, callback) => {
        const response = await userStore.validateEmail({
          value: value,
          id: personalStore.user.id,
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
  phoneNumber: [
    {
      required: true,
      message: '电话号码是必须的',
      trigger: 'blur',
    },
  ],
});

const handleClick = async (form) => {
  form && form.validate(async (valid, fields) => {
    if (valid) {
      try {
        loading.value = true;
        await personalStore.updateUser({
          user: user.value,
        });
        emits('save-success');
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

const openDialog = () => {
  user.value = {...personalStore.user};
  visible.value = true;
};

const handleClose = () => {

};

defineExpose({openDialog});
</script>

<template>
  <el-dialog v-model="visible" :destroy-on-close="true" :draggable="true" title="个人信息" width="40%"
             @close="handleClose">
    <el-form ref="formRef" :hide-required-asterisk="false" :model="user" :rules="rules"
             label-position="top" label-suffix=" :" label-width="100">
      <div class="avatar-wrapper">
        <div class="avatar-box">
          <el-avatar :src="avatarJpg" class="avatar" shape="square"
                     v-if="!personalStore.avatar"></el-avatar>
          <el-avatar :src="`data:image/png;base64,${personalStore.avatar}`" class="avatar" shape="square"
                     v-if="personalStore.avatar"></el-avatar>
        </div>
        <div class="form-box">
          <el-form-item label="账号" prop="userName">
            <el-input v-model="user.userName" :clearable="false" :maxlength="256" placeholder=""
                      :readonly="true"></el-input>
          </el-form-item>
          <el-form-item label="姓名" prop="name">
            <el-input v-model="user.name" :clearable="true" :maxlength="64" placeholder=""></el-input>
          </el-form-item>
        </div>
      </div>
      <el-form-item label="性别" prop="gender">
        <el-radio-group v-model="user.gender">
          <el-radio :label="0" value="0">男</el-radio>
          <el-radio :label="1" value="1">女</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="Email地址" prop="email">
        <el-input v-model="user.email" :clearable="true" :maxlength="256" placeholder=""></el-input>
      </el-form-item>
      <el-form-item label="电话号码" prop="phoneNumber">
        <el-input v-model="user.phoneNumber" :clearable="true" :maxlength="24" placeholder=""></el-input>
      </el-form-item>
    </el-form>
    <template #footer>
    <span class="dialog-footer">
      <el-button :icon="Close" @click="visible=false">取消</el-button>
      <el-button :icon="Check" :loading="loading" type="primary" @click="handleClick(formRef)">确认</el-button>
    </span>
    </template>
  </el-dialog>
</template>

<style lang="scss" scoped>
.avatar-wrapper {
  display: flex;
  align-items: center;
  justify-content: center;

  .avatar-box {
    width: 150px;
    margin-right: 20px;
    padding-bottom: 20px;
  }

  .form-box {
    width: 100%;
  }
}

.avatar {
  width: 148px;
  height: 148px;
  background-color: #ccc;
  border: 1px solid var(--el-border-color);
  border-radius: 20px;
}
</style>
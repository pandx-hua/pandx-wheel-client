<script setup>
import {onMounted, reactive, ref} from 'vue';
import {useRouter} from 'vue-router';
import {usePersonalStore} from '@/stores/modules/personal/personal';
import {useTabsStore} from '@/stores/modules/tabs';
import {useGlobalStore} from '@/stores/modules/global';
import {initDynamicRouter} from '@/router/modules/dynamicRouter';
import {ElForm, ElNotification} from 'element-plus';
import {getTimeState} from '@/utils';
import {HOME_URL} from '@/config';

const router = useRouter();
const personalStore = usePersonalStore();
const tabsStore = useTabsStore();
const globalStore = useGlobalStore();
const loginFormRef = ref();
const loading = ref(false);
const loginModel = reactive({
  userNameOrEmail: 'admin@pandx.com.cn',
  password: 'good!@#',
  isPersistent: false,
});
const loginRules = reactive({
  userNameOrEmail: [
    {
      required: true,
      message: '请输入账号或电子邮件地址',
      trigger: 'blur',
    },
  ],
  password: [
    {
      required: true,
      message: '请输入密码',
      trigger: 'blur',
    },
  ],
});

const login = (form) => {
  form && form.validate(async valid => {
    if (valid) {
      loading.value = true;
      try {
        await personalStore.getToken(loginModel);
        if (personalStore.token) {
          await personalStore.getPersonal();
          await personalStore.getAvatar();

          await initDynamicRouter();
          await tabsStore.setTabs([]);
          await globalStore.setKeepAlivePages([]);

          await router.push(HOME_URL);
          ElNotification({
            title: getTimeState(personalStore.user.name),
            message: `欢迎进入 ${import.meta.env.VITE_GLOBAL_APP_TITLE}`,
            type: 'info',
            customClass: 'notification-primary',
            duration: 3000,
          });
        }
      } finally {
        loading.value = false;
      }
    }
  });
};

const resetForm = (form) => {
  form && form.resetFields();
};

onMounted(() => {
  document.onkeydown = (e) => {
    if (e.code === 'Enter' || e.code === 'enter' || e.code === 'NumpadEnter') {
      if (loading.value) {
        return;
      }
      login(loginFormRef.value);
    }
  };
});
</script>

<template>
  <el-form ref="loginFormRef" :model="loginModel" :rules="loginRules" size="large">
    <el-form-item prop="userNameOrEmail">
      <el-input v-model="loginModel.userNameOrEmail" placeholder="邮箱">
        <template #prefix>
          <!--          <el-icon class="el-input__icon">-->
          <!--            <User></User>-->
          <!--          </el-icon>-->
          <span class="iconfont icon-account"></span>
        </template>
      </el-input>
    </el-form-item>
    <el-form-item prop="password">
      <el-input v-model="loginModel.password" placeholder="密码" show-password type="password">
        <template #prefix>
          <!--          <el-icon class="el-input__icon">-->
          <!--            <Lock></Lock>-->
          <!--          </el-icon>-->
          <span class="iconfont icon-lock"></span>
        </template>
      </el-input>
    </el-form-item>
    <!--    <el-form-item prop="isPersistent">-->
    <el-checkbox v-model="loginModel.isPersistent" label="记住我的登录状态"></el-checkbox>
    <!--  </el-form-item>-->
  </el-form>

  <div class="login-btn">
    <el-button size="large" @click="resetForm(loginFormRef)">
      <template #icon>
        <i class="iconfont icon-reset"></i>
      </template>
      重置
    </el-button>
    <el-button :loading="loading" size="large" type="primary" @click="login(loginFormRef)">
      <template #icon>
        <i class="iconfont icon-login"></i>
      </template>
      登录
    </el-button>
  </div>
</template>

<style lang="scss" scoped>
@import "../index.scss";
</style>
<script setup>
import {usePersonalStore} from '@/stores/modules/personal/personal';
import {ArrowDownBold, Edit, Postcard, SwitchButton, Tickets, User} from '@element-plus/icons-vue';
import {useRouter} from 'vue-router';
import {ElMessage, ElMessageBox} from 'element-plus';
import {LOGIN_URL} from '@/config';
import {ref} from 'vue';
import PersonalDialog from '@/components/Dialog/PersonalDialog.vue';
import ChangePasswordDialog from '@/components/Dialog/ChangePasswordDialog.vue';
import {useTabsStore} from '@/stores/modules/tabs';
import avatarJpg from '@/assets/images/avatar.jpg';
import LoginAttemptDrawer from '@/components/Dialog/LoginAttemptDrawer.vue';
import ChangeAvatarDialog from '@/components/Dialog/ChangeAvatarDialog.vue';

const personalStore = usePersonalStore();
const tabsStore = useTabsStore();
const router = useRouter();
const personalRef = ref();
const changePwdRef = ref();
const loginAttemptRef = ref();
const changeAvatarRef = ref();
const logout = () => {
  ElMessageBox.confirm('您确认要退出系统吗？', '系统提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning',
    draggable: true,
  }).then(async () => {
    personalStore.logout();
    await router.replace(LOGIN_URL);
    ElMessage.success('已成功退出系统，期待我们的下次相见');
  }).catch(() => {
    console.log('cancel');
  });
};

const openDialogOrDrawer = (ref) => {
  if (ref === 'personalRef') {
    personalRef.value && personalRef.value.openDialog();
  }
  if (ref === 'changePwdRef') {
    changePwdRef.value && changePwdRef.value.openDialog();
  }
  if (ref === 'loginAttemptRef') {
    loginAttemptRef.value && loginAttemptRef.value.openDrawer();
  }
  if (ref === 'changeAvatarRef') {
    changeAvatarRef.value && changeAvatarRef.value.openDialog();
  }
};

const handleSaveSuccess = () => {
  ElMessage.success(`已成功修改个人信息`);
};
const handleChangeSuccess = () => {
  ElMessage.success(`已成功修改密码`);
};

const handleUpdateSuccess = async() => {
  await personalStore.getAvatar();
};
</script>

<template>
  <div class="avatar-icon">
    <el-dropdown placement="bottom-end" trigger="click">
      <div class="dropdown-box">
        <span
            class="user-link">{{ personalStore.user.name }}（{{
            personalStore.user.userName
          }} / {{ personalStore.user.email }}）</span>
        <el-avatar :size="40" :src="avatarJpg" v-if="!personalStore.avatar"></el-avatar>
        <el-avatar :size="40" :src="`data:image/png;base64,${personalStore.avatar}`" v-if="personalStore.avatar"></el-avatar>
        <el-icon class="arrow-box">
          <ArrowDownBold/>
        </el-icon>
      </div>
      <template #dropdown>
        <el-dropdown-menu>
          <el-dropdown-item @click="openDialogOrDrawer('personalRef')">
            <el-icon>
              <User/>
            </el-icon>
            个人信息
          </el-dropdown-item>
          <el-dropdown-item @click="openDialogOrDrawer('changePwdRef')">
            <el-icon>
              <Edit/>
            </el-icon>
            修改密码
          </el-dropdown-item>
          <el-dropdown-item @click="openDialogOrDrawer('loginAttemptRef')">
            <el-icon>
              <Tickets/>
            </el-icon>
            登录记录
          </el-dropdown-item>
          <el-dropdown-item @click="openDialogOrDrawer('changeAvatarRef')">
            <el-icon>
              <Postcard/>
            </el-icon>
            更换头像
          </el-dropdown-item>
          <el-dropdown-item divided @click="logout">
            <el-icon>
              <SwitchButton/>
            </el-icon>
            退出系统
          </el-dropdown-item>
        </el-dropdown-menu>
      </template>
    </el-dropdown>
    <PersonalDialog ref="personalRef" @save-success="handleSaveSuccess"></PersonalDialog>
    <ChangePasswordDialog ref="changePwdRef" @change-success="handleChangeSuccess"></ChangePasswordDialog>
    <LoginAttemptDrawer ref="loginAttemptRef"></LoginAttemptDrawer>
    <ChangeAvatarDialog ref="changeAvatarRef" @update-success="handleUpdateSuccess"></ChangeAvatarDialog>
  </div>

</template>

<style lang="scss" scoped>
.avatar-icon {
  cursor: pointer;
}

.dropdown-box {
  display: flex;
  box-sizing: border-box;
  align-items: center;
  justify-content: center;

  .arrow-box {
    cursor: pointer;
    color: var(--el-color-primary);
    margin-left: 12px;
  }

  .user-link {
    cursor: pointer;
    color: var(--el-color-primary);
    display: flex;
    align-items: center;
    margin-left: 20px;
    font-size: 15px;
  }
}
</style>
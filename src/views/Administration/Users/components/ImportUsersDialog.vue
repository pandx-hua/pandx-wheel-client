<script setup>

import {Check, Close, UploadFilled} from '@element-plus/icons-vue';
import {useUserStore} from '@/stores/modules/authorization/users';
import {ref} from 'vue';
import {$importUsersFromExcel} from '@/services/modules/users';
import ajax from '@/services/ajax';
import {guid} from '@/utils';
import {ElMessage} from 'element-plus';
import {downloadWithToken} from '@/utils/download';
import {$downloadFileFromDisk2} from '@/services/modules/files';


const userStore = useUserStore();
const loading = ref(false);
const props = ref({
  title: '',
  data: {},
});
const visible = ref(false);
const uploadFile = ref(null);
const acceptParams = async (params) => {
  props.value = params;
  visible.value = true;
  uploadFile.value = null;
};
const handleClick = async () => {
  loading.value = true;
  const formData = new FormData();
  formData.append(guid(), uploadFile.value);
  ajax.post($importUsersFromExcel, formData).then(response => {
    visible.value = false;
  }).catch(error => {
    ElMessage.error(error.message);
  }).finally(() => {
    loading.value = false;
  });
};
const handleClose = () => {

};

const beforeUpload = (file) => {
  const isValid = file.type === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' || 'application/vnd.ms-excel';
  if (!isValid) {
    ElMessage.error('文件格式不正确，仅支Excel文件');
    return isValid;
  }
  const isLt10M = file.size / 1024 / 1024 < 10;
  if (!isLt10M) {
    ElMessage.error('文件大小超出 10MB 的限制');
    return isLt10M;
  }
  uploadFile.value = file;
  return false;
};

const handleLink = () => {
  downloadWithToken($downloadFileFromDisk2, '导入用户模板.xlsx', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', {fileName: 'import_users_template.xlsx'});
};
defineExpose({
  acceptParams,
});
</script>

<template>
  <el-dialog v-model="visible" :destroy-on-close="true" :draggable="true" :title="props.title" width="40%"
             @close="handleClose">
    <div class="tip-box mb16">
      <p>
        第 1 步：请先
        <el-link type="primary" @click="handleLink">下载导入用户需要的Excel文件模版</el-link>
        ，将要导入的用户信息填写到Excel文件中；
      </p>
      <p>
        第 2 步：选择填写好用户信息的Excel文件准备上传；
      </p>
    </div>
    <el-upload ref="uploadRef" :before-upload="beforeUpload" :drag="true" accept="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,application/vnd.ms-excel"
               action="">
      <el-icon class="el-icon--upload">
        <UploadFilled></UploadFilled>
      </el-icon>
      <div v-if="!uploadFile" class="el-upload__text">将文件拖放到这或者<em>点击选择文件</em></div>
      <div v-if="uploadFile" class="el-upload__text">{{ uploadFile && uploadFile.name }}</div>
    </el-upload>
    <div class="tip-box mt16">
      第 3 步：点击确定上传Excel文件，导入工作将在后台进程中执行，完毕后会给出提示并告知结果。
    </div>
    <template #footer>
      <el-button :icon="Close" @click="visible=false">取消</el-button>
      <el-button :disabled="!uploadFile" :icon="Check" :loading="loading" type="primary" @click="handleClick()">
        确认
      </el-button>
    </template>
  </el-dialog>
</template>

<style lang="scss" scoped>
.tip-box {
  line-height: 2;
}

:deep(.el-upload-list) {
  .el-upload-list__item-info {
    margin-left: -5px;
  }
}
</style>
<script setup>

import {
  ArrowDown,
  ArrowLeft,
  ArrowRight,
  ArrowUp,
  Check,
  Close,
  Minus,
  Plus,
  RefreshRight,
  Sort,
  Upload,
} from '@element-plus/icons-vue';
import {computed, nextTick, ref, watch} from 'vue';
import {usePersonalStore} from '@/stores/modules/personal/personal';
import {ElMessage} from 'element-plus';
import Cropper from 'cropperjs';
import 'cropperjs/dist/cropper.css';
import ajax from '@/services/ajax';
import {$uploadAvatar} from '@/services/modules/personal';

const personalStore = usePersonalStore();
const emits = defineEmits(['update-success']);
const loading = ref(false);
const formRef = ref();

const props = ref({});
const visible = ref(false);

const src = ref('');
const preview = ref(true);
const moveStep = ref(4);
const cropper = ref(null);
const insideSrc = ref('');
const disabled = ref(false);
const file = ref(null);

const imgId = computed(() => `cropper-${Math.random().toString(36).substr(2)}`);
const previewId = computed(() => `preview-${Math.random().toString(36).substr(2)}`);
watch(() => src.value, async (value) => {
  replace(value);
});
watch(() => insideSrc.value, async (value) => {
  replace(value);
});

const replace = (src) => {
  cropper.value.replace(src);
  insideSrc.value = src;
};

const beforeUpload = (file) => {
  const isValid = file.type === 'image/jpeg' || file.type === 'image/png' || file.type === 'image/jpg' || file.type === 'image/png';
  if (!isValid) {
    ElMessage.error('图像格式不正确，仅支持JPG、PNG、GIF格式');
    return isValid;
  }
  const isLt10M = file.size / 1024 / 1024 < 10;
  if (!isLt10M) {
    ElMessage.error('原始图像大小超出 10MB 的限制');
    return isLt10M;
  }
  const reader = new FileReader();
  reader.readAsDataURL(file);
  reader.onload = (event) => {
    insideSrc.value = event.target.result;
  };
  return false;
};

const rotate = () => {
  cropper.value.rotate(90);
};

const shrink = () => {
  cropper.value.zoom(-0.1);
};

const magnify = () => {
  cropper.value.zoom(0.1);
};

const scale = (d) => {
  cropper.value[`scale${d}`](-cropper.value.getData()[`scale${d}`]);
};

const move = (...arg) => {
  cropper.value.move(...arg);
};
const openDialog = () => {

  visible.value = true;
  nextTick(() => {
    let dom = document.getElementById(imgId.value);
    cropper.value = new Cropper(dom, {
      aspectRatio: 1 / 1,
      preview: document.getElementById(previewId.value),
      viewMode: 1,
      checkCrossOrigin: true,
      dragMode: 'move',
      cropBoxMovable: false,
      cropBoxResizable: false,
      toggleDragModeOnDblclick: false,
      ready: function () {
        disabled.value = false;
      },
    });
  });
};
const reset = () => {
  src.value = '';
  insideSrc.value = '';
  file.value = null;
  cropper.value.destroy();
};
const handleClick = async () => {
  if (!insideSrc.value) {
    ElMessage.error('选择要裁剪的图像后再操作');
  } else {
    loading.value = true;
    const canvas = cropper.value.getCroppedCanvas();
    canvas.toBlob((blob) => {
      const formData = new FormData();
      formData.append('croppedImg', blob);
      ajax.post($uploadAvatar, formData).then(response => {
        ElMessage.success('头像更换成功');
        emits('update-success');
        visible.value = false;
      }).catch(error => {
        ElMessage.error(error.message);
      }).finally(() => {
        loading.value = false;
      });
    });
  }
};


const handleClose = () => {
  reset();
};
defineExpose({
  openDialog,
});
</script>

<template>
  <el-dialog v-model="visible" :destroy-on-close="true" :draggable="true" title="更换头像" width="595"
             @close="handleClose">
    <div class="cropper-wrapper">
      <div class="img-box bg">
        <img :id="imgId" alt="" class="cropper-image">
      </div>
      <div class="right-wrapper">
        <div v-if="preview" :id="previewId" class="preview-box bg"></div>
        <div class="button-box">
          <el-upload :before-upload="beforeUpload" accept="image/jpg,image/jpeg,image/gif,image/png"
                     action="">
            <el-button :icon="Upload" style="width: 150px;" type="primary">选择图像</el-button>
          </el-upload>
          <div v-show="insideSrc">
            <el-button type="primary" @click="rotate">
              <el-tooltip content="旋转">
                <el-icon :size="18">
                  <RefreshRight/>
                </el-icon>
              </el-tooltip>
            </el-button>
            <el-button type="primary" @click="shrink">
              <el-tooltip content="缩小">
                <el-icon :size="19">
                  <Minus/>
                </el-icon>
              </el-tooltip>
            </el-button>
            <el-button type="primary" @click="magnify">
              <el-tooltip content="放大">
                <el-icon :size="18">
                  <Plus/>
                </el-icon>
              </el-tooltip>
            </el-button>
            <el-button type="primary" @click="scale('X')">
              <el-tooltip content="水平翻转">
                <el-icon :size="18" style="transform: rotateZ(90deg);">
                  <Sort/>
                </el-icon>
              </el-tooltip>
            </el-button>
            <el-button type="primary" @click="move(0, -moveStep)">
              <el-tooltip content="上移">
                <el-icon :size="19">
                  <ArrowUp/>
                </el-icon>
              </el-tooltip>
            </el-button>
            <el-button type="primary" @click="scale('Y')">
              <el-tooltip content="垂直翻转">
                <el-icon :size="18">
                  <Sort/>
                </el-icon>
              </el-tooltip>
            </el-button>
            <el-button type="primary" @click="move(-moveStep, 0)">
              <el-tooltip content="左移">
                <el-icon :size="18">
                  <ArrowLeft/>
                </el-icon>
              </el-tooltip>
            </el-button>
            <el-button type="primary" @click="move(0, moveStep)">
              <el-tooltip content="下移">
                <el-icon :size="19">
                  <ArrowDown/>
                </el-icon>
              </el-tooltip>
            </el-button>
            <el-button type="primary" @click="move(moveStep, 0)">
              <el-tooltip content="右移">
                <el-icon :size="18">
                  <ArrowRight/>
                </el-icon>
              </el-tooltip>
            </el-button>
          </div>
        </div>
      </div>
    </div>
    <template #footer>
      <el-button :icon="Close" @click="visible=false">取消</el-button>
      <el-button :disabled="insideSrc==='' || disabled" :icon="Check" :loading="loading" type="primary"
                 @click="handleClick(formRef)">确认
      </el-button>
    </template>
  </el-dialog>
</template>

<style lang="scss" scoped>
.cropper-wrapper {
  width: 595px;
  height: 300px;

  .bg {
    background-image: url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQAQMAAAAlPW0iAAAAA3NCSVQICAjb4U/gAAAABlBMVEXMzMz////TjRV2AAAACXBIWXMAAArrAAAK6wGCiw1aAAAAHHRFWHRTb2Z0d2FyZQBBZG9iZSBGaXJld29ya3MgQ1M26LyyjAAAABFJREFUCJlj+M/AgBVhF/0PAH6/D/HkDxOGAAAAAElFTkSuQmCC")
  }

  .img-box {
    height: 298px;
    width: 400px;
    border: 1px solid var(--el-border-color-light);
    display: inline-block;

    img {
      max-width: 100%;
      display: block;
    }
  }

  .right-wrapper {
    display: inline-block;
    width: 160px;
    vertical-align: top;
    box-sizing: border-box;
    padding: 0 0 0 8px;

    .preview-box {
      height: 150px !important;
      width: 100% !important;
      overflow: hidden;
      border: 1px solid #ebebeb;

      .bg {
        background-image: url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQAQMAAAAlPW0iAAAAA3NCSVQICAjb4U/gAAAABlBMVEXMzMz////TjRV2AAAACXBIWXMAAArrAAAK6wGCiw1aAAAAHHRFWHRTb2Z0d2FyZQBBZG9iZSBGaXJld29ya3MgQ1M26LyyjAAAABFJREFUCJlj+M/AgBVhF/0PAH6/D/HkDxOGAAAAAElFTkSuQmCC")
      }
    }

    .button-box {
      padding: 10px 0 0;

      .el-button + .el-button {
        margin-left: 0 !important;
      }
    }
  }
}
</style>
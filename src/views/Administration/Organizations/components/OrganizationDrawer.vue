<script setup>
import {ref} from 'vue';
import {Check, Close} from '@element-plus/icons-vue';
import {useOrganizationStore} from '@/stores/modules/organizations/organizations';

const emits = defineEmits(['save-success']);
const loading = ref(false);
const organizationStore = useOrganizationStore();
const formRef = ref();

const props = ref({
  isBrowse: false,
  isUpdate: false,
  title: '',
  data: {},
  parentData: {},
});
const visible = ref(false);
const rules = {
  displayName: [
    {
      required: true,
      message: '部门名称是必须的',
      trigger: 'blur',
    }, {
      validator: async (rule, value, callback) => {
        const response = await organizationStore.validateOrganization({
          value: value,
          id: props.value.isUpdate ? props.value.data.id : null,
          parentId: props.value.isUpdate ? props.value.data.parentId : props.value.parentData.id,
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
};
const acceptParams = (params) => {
  props.value = params;
  visible.value = true;
};

const handleOpen = () => {

};

const handleClick = (form) => {
  form && form.validate(async (valid, fields) => {
    if (valid) {
      try {
        loading.value = true;
        if (!props.value.isUpdate) {
          await organizationStore.createOrganization({
            parentId: props.value.parentData.id,
            displayName: props.value.data.displayName,
            address: props.value.data.address,
            phone: props.value.data.phone,
            head: props.value.data.head,
          });
        } else {
          await organizationStore.updateOrganization({
            id: props.value.data.id,
            displayName: props.value.data.displayName,
            address: props.value.data.address,
            phone: props.value.data.phone,
            head: props.value.data.head,
          });
        }
        emits('save-success');
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
  acceptParams,
});
</script>

<template>
  <el-drawer v-model="visible" :destroy-on-close="true" :title="props.title" size="50%" @close="handleOpen">
    <el-form ref="formRef" :disabled="props.isBrowse" :hide-required-asterisk="false" :model="props.data" :rules="rules"
             label-position="top"
             label-suffix=" :" label-width="100">
      <el-form-item label="部门名称" prop="displayName">
        <el-input v-model="props.data.displayName" :clearable="true" :maxlength="128" placeholder=""></el-input>
      </el-form-item>
      <el-form-item label="部门地址" prop="address">
        <el-input v-model="props.data.address" :clearable="true" :maxlength="256" placeholder=""></el-input>
      </el-form-item>
      <el-form-item label="部门电话" prop="phone">
        <el-input v-model="props.data.phone" :clearable="true" :maxlength="15" placeholder=""></el-input>
      </el-form-item>
      <el-form-item label="部门负责人" prop="head">
        <el-input v-model="props.data.head" :clearable="true" :maxlength="15" placeholder=""></el-input>
      </el-form-item>
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
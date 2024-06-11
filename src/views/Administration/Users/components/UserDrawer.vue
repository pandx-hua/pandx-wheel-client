<script lang="jsx" setup>

import {computed, nextTick, onMounted, reactive, ref} from 'vue';
import {Check, Close, Star} from '@element-plus/icons-vue';
import TableSelect from '@/components/Select/TableSelect.vue';
import {useRoleStore} from '@/stores/modules/authorization/roles';
import dayjs from 'dayjs';
import {useUserStore} from '@/stores/modules/authorization/users';
import avatarJpg from '@/assets/images/avatar.jpg';
import TreeSelect from '@/components/Select/TreeSelect.vue';
import {useOrganizationStore} from '@/stores/modules/organizations/organizations';

const emits = defineEmits(['save-success']);
const organizationStore = useOrganizationStore();
const roleStore = useRoleStore();
const userStore = useUserStore();
const formRef = ref();
const tableSelectRef = ref();
const confirmPasswordRef = ref();
const visible = ref(false);
const defaultTab = ref('a');
const loading = ref(false);
const treeSelectRef = ref();

const defaultProps = {
  children: 'children',
  label: 'displayName',
};
const treeData = computed(() => {
  return getTreeData(null);
});
const props = ref({
  isUpdate: false,
  isBrowse: false,
  title: '',
  data: {},
});

const columns = [
  {
    prop: 'displayName',
    label: '角色名称',
    width: 160,
    minWidth: 160,
    fixed: false,
    align: 'center',
    sortable: 'custom',
  }, {
    prop: 'isStatic',
    label: '系统',
    align: 'center',
    fixed: false,
    width: 70,
    minWidth: 70,
    columnKey: 'isStatic',
    filters: [
      {
        text: '是',
        value: true,
      }, {
        text: '否',
        value: false,
      },
    ],
    render: scope => {
      return (
          <>
            {scope.row.isStatic ? (
                <el-icon color="#67C23A">
                  <Star></Star>
                </el-icon>
            ) : (
                <el-icon color="#E6A23C">
                  <Star></Star>
                </el-icon>
            )}
          </>);
    },
  }, {
    prop: 'isDefault',
    label: '默认',
    align: 'center',
    fixed: false,
    width: 70,
    minWidth: 70,
    columnKey: 'isDefault',
    filters: [
      {
        text: '是',
        value: true,
      }, {
        text: '否',
        value: false,
      },
    ],
    render: scope => {
      return (
          <>
            {scope.row.isDefault ? (
                <el-icon color="#67C23A">
                  <Star></Star>
                </el-icon>
            ) : (
                <el-icon color="#E6A23C">
                  <Star></Star>
                </el-icon>
            )}
          </>);
    },
  }, {
    prop: 'description',
    label: '角色描述',
    align: 'center',
    fixed: false,
    minWidth: 200,
  }, {
    prop: 'creationTime',
    label: '创建时间',
    align: 'center',
    width: 180,
    minWidth: 180,
    sortable: 'custom',
    render: scope => {
      return dayjs(scope.row.creationTime).format('YYYY-MM-DD HH:mm:ss');
    },
  },
];

const rules = reactive({
  userName: [
    {
      required: true,
      message: '账号是必须的',
      trigger: 'blur',
    },
    {
      validator: async (rule, value, callback) => {
        const response = await userStore.validateUserName({
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
  password: [
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
        if (props.value.data.password !== value) {
          callback(new Error('两次输入的密码不一致'));
        } else {
          callback();
        }
      },
      trigger: 'blur',
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
  phoneNumber: [
    {
      required: true,
      message: '电话号码是必须的',
      trigger: 'blur',
    },
  ],
});
const acceptParams = (params) => {
  props.value = params;
  visible.value = true;
  if (props.value.isUpdate || props.value.isBrowse) {
    nextTick(async () => {
      treeSelectRef.value && treeSelectRef.value.setCheckedKeys(props.value.data.organizations.map(i => i.id));
      await userStore.getAvatarById({id:props.value.data.id});
    });
  }
};
defineExpose({
  acceptParams,
});

const handleChange = async (params) => {
  await roleStore.getPagedRoles(params);
};

const handleClose = () => {
  tableSelectRef.value && tableSelectRef.value.reset();
  defaultTab.value = 'a';
};

const getTreeData = (parentId) => {
  const nodes = [];
  organizationStore.organizations.forEach(i => {
    if (i.parentId === parentId) {
      i.children = getTreeData(i.id);
      nodes.push(i);
    }
  });
  return nodes;
};
const renderContent = (h, {node, data, store}) => {
  return (
      <span>{data.displayName}（{data.memberCount}）</span>
  );
};
const handleClick = async (form) => {
  form && form.validate(async (valid, fields) => {
    if (valid) {
      try {
        loading.value = true;
        const assignedRoleNames = props.value.data.roles ? props.value.data.roles.map(i => i.displayName) : [];
        const assignedOrganizationIds = props.value.data.organizations ? props.value.data.organizations.map(i => i.id) : [];
        await userStore.createOrUpdateUser({
          id: props.value.data.id,
          user: props.value.data,
          assignedRoleNames,
          assignedOrganizationIds,
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
  await organizationStore.getOrganizations();
  await roleStore.getPagedRoles({});
});
</script>

<template>
  <el-drawer v-model="visible" :destroy-on-close="true" :title="props.title" size="50%" @close="handleClose">
    <el-tabs v-model="defaultTab">
      <el-tab-pane label="用户详情" name="a">
        <el-form ref="formRef" :disabled="props.isBrowse" :hide-required-asterisk="false" :model="props.data" :rules="rules"
                 label-position="top" label-suffix=" :" label-width="100">
          <div class="avatar-wrapper">
            <div class="avatar-box">
              <el-avatar :src="avatarJpg" class="avatar" shape="square"
                       v-if="!userStore.avatar"></el-avatar>
              <el-avatar :src="`data:image/png;base64,${userStore.avatar}`" class="avatar" shape="square"
                         v-if="userStore.avatar"></el-avatar>
            </div>
            <div class="form-box">
              <el-form-item label="账号" prop="userName">
                <el-input v-model="props.data.userName" :clearable="true" :maxlength="256" placeholder=""></el-input>
              </el-form-item>
              <el-form-item label="姓名" prop="name">
                <el-input v-model="props.data.name" :clearable="true" :maxlength="64" placeholder=""></el-input>
              </el-form-item>
            </div>
          </div>
          <el-form-item label="性别" prop="gender">
            <el-radio-group v-model="props.data.gender">
              <el-radio :label="0" value="0">男</el-radio>
              <el-radio :label="1" value="1">女</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-row :gutter="16">
            <el-col :span="12">
              <el-form-item v-if="props.title.indexOf('新建')===0" label="密码" prop="password">
                <el-input ref="passwordRef" v-model="props.data.password" :clearable="true" :maxlength="1024"
                          placeholder=""
                          type="password"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item v-if="props.title.indexOf('新建')===0" label="确认密码" prop="confirmPassword">
                <el-input ref="confirmPasswordRef" v-model="props.data.confirmPassword" :clearable="true"
                          :maxlength="1024"
                          placeholder="" type="password"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-form-item label="Email地址" prop="email">
            <el-input v-model="props.data.email" :clearable="true" :maxlength="256" placeholder=""></el-input>
          </el-form-item>
          <el-form-item label="电话号码" prop="phoneNumber">
            <el-input v-model="props.data.phoneNumber" :clearable="true" :maxlength="24" placeholder=""></el-input>
          </el-form-item>
          <el-checkbox v-model="props.data.isActive">
            默认激活
          </el-checkbox>
          <el-checkbox v-model="props.data.lockoutEnabled">
            启用锁定
          </el-checkbox>
        </el-form>
      </el-tab-pane>
      <el-tab-pane name="b">
        <template #label>
          <el-badge v-if="props.data.roles && props.data.roles.length>0"
                    :value="props.data.roles && props.data.roles.length" type="primary">
            所属角色
          </el-badge>
          <span v-else>
            所属角色
          </span>
        </template>
        <TableSelect ref="tableSelectRef"
                     v-model:selected="props.data.roles"
                     :columns="columns"
                     :disabled="props.isBrowse"
                     :items="roleStore.pagedRoles"
                     :loading="roleStore.loading"
                     :multi-select="true"
                     :tag-show="true"
                     :total-count="roleStore.totalCount"
                     display-property="displayName"
                     placeholder="在角色名称、角色描述中搜索"
                     tag-type="info"
                     @change="handleChange"></TableSelect>
      </el-tab-pane>
      <el-tab-pane name="c">
        <template #label>
          <el-badge v-if="props.data.organizations && props.data.organizations.length>0"
                    :value="props.data.organizations && props.data.organizations.length" type="primary">
            所属单位
          </el-badge>
          <span v-else>
            所属单位
          </span>
        </template>
        <TreeSelect ref="treeSelectRef" v-model:selected="props.data.organizations"
                    :check-on-click-node="true"
                    :check-strictly="true"
                    :data="treeData"
                    :default-props="defaultProps"
                    :disabled="props.isBrowse"
                    :expand-on-click-node="false"
                    :render-content="renderContent"
                    display-property="displayName"
                    node-key="id"
        ></TreeSelect>
      </el-tab-pane>
    </el-tabs>
    <template v-if="!props.isBrowse" #footer>
      <el-button :icon="Close" @click="visible=false">取消</el-button>
      <el-button :icon="Check" :loading="loading" type="primary" @click="handleClick(formRef)">确认</el-button>
    </template>
  </el-drawer>
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

:deep(.el-tree) {
  .el-tree-node {
    .el-tree-node__content {
      padding-top: 2px;
      padding-bottom: 2px;
    }
  }
}
</style>
<script lang="jsx" setup>


import {ArrowRightBold, Check, Close} from '@element-plus/icons-vue';
import {useRoleStore} from '@/stores/modules/authorization/roles';
import {computed, nextTick, onMounted, reactive, ref} from 'vue';
import TableSelect from '@/components/Select/TableSelect.vue';
import dayjs from 'dayjs';
import {useUserStore} from '@/stores/modules/authorization/users';
import {useOrganizationStore} from '@/stores/modules/organizations/organizations';
import {usePermissionStore} from '@/stores/modules/authorization/permissions';
import TreeSelect from '@/components/Select/TreeSelect.vue';

const emits = defineEmits(['save-success']);
const roleStore = useRoleStore();
const permissionStore = usePermissionStore();
const userStore = useUserStore();
const organizationStore = useOrganizationStore();
const formRef = ref();
const tableSelectRef = ref();
const visible = ref(false);
const defaultTab = ref('a');
const loading = ref(false);
const treeRef = ref();
const treeSelectRef = ref();
const isAll = ref(true);
const defaultProps = {
  children: 'children',
  label: 'displayName',
};
const treeData = computed(() => {
  return getTreeData(null, null);
});
const getTreeData = (parentResource, parentAction) => {
  const nodes = [];
  permissionStore.permissions.forEach(i => {
    if (i.parentResource === parentResource && i.parentAction === parentAction) {
      i.children = getTreeData(i.resource, i.action);
      nodes.push(i);
    }
  });
  return nodes;

};
const organizationTreeData = computed(() => {
  return getOrganizationTreeData(null);
});
const getOrganizationTreeData = (parentId) => {
  const nodes = [];
  organizationStore.organizations.forEach(i => {
    if (i.parentId === parentId) {
      i.children = getOrganizationTreeData(i.id);
      nodes.push(i);
    }
  });
  return nodes;
};
const props = ref({
  isUpdate: false,
  isBrowse: false,
  title: '',
  data: {},
});
const filters = [
  {
    text: '是',
    value: true,
  }, {
    text: '否',
    value: false,
  },
];
const columns = [
  {
    prop: 'organizations',
    label: '所属部门',
    width: 200,
    minWidth: 100,
    fixed: false,
    align: 'center',
    render: scope => {
      return (
          <>{scope.row.organizations && scope.row.organizations.map(o => o.displayName).join('，')}</>
      );
    },
    // sortable:'custom'
  }, {
    prop: 'userName',
    label: '账号',
    width: 120,
    minWidth: 100,
    fixed: false,
    align: 'center',
    sortable: 'custom',
  }, {
    prop: 'name',
    label: '姓名',
    width: 120,
    minWidth: 100,
    fixed: false,
    align: 'center',
    sortable: 'custom',
  }, {
    prop: 'gender',
    label: '性别',
    width: 70,
    minWidth: 70,
    fixed: false,
    align: 'center',
    columnKey: 'gender',
    filters: [
      {
        text: '男',
        value: 0,
      }, {
        text: '女',
        value: 1,
      },
    ],
    render: scope => {
      return (
          <>
            {
              scope.row.gender === 0 ? (
                  <el-icon color="#67C23A">
                    <Male></Male>
                  </el-icon>
              ) : (
                  <el-icon color="#E6A23C">
                    <Female></Female>
                  </el-icon>
              )
            }
          </>
      );
    },
  },
  {
    prop: 'roles',
    label: '所属角色',
    // width: 200,
    minWidth: 200,
    fixed: false,
    align: 'center',
    // sortable:'custom'
    render: scope => {
      return (
          <>{scope.row.roles && scope.row.roles.map(r => r.displayName).join('，')}</>
      );
    },
  }, {
    prop: 'isActive',
    label: '激活状态',
    width: 100,
    minWidth: 100,
    fixed: false,
    align: 'center',
    columnKey: 'isActive',
    filters: filters,
    render: scope => {
      return (
          <>
            {
              scope.row.isActive ? (
                  <el-icon color="#67C23A">
                    <Star></Star>
                  </el-icon>
              ) : (
                  <el-icon color="#E6A23C">
                    <Star></Star>
                  </el-icon>
              )
            }
          </>
      );
    },
  },
  {
    prop: 'isLockout',
    label: '锁定状态',
    width: 100,
    minWidth: 100,
    fixed: false,
    align: 'center',
    columnKey: 'isLockout',
    filters: filters,
    render: scope => {
      return (
          <>
            {
              !scope.row.isLockout ? (
                  <el-icon color="#67C23A">
                    <Unlock></Unlock>
                  </el-icon>
              ) : (
                  <el-icon color="#E6A23C">
                    <Lock></Lock>
                  </el-icon>
              )
            }
          </>
      );
    },
  },
  {
    prop: 'isWeixin',
    label: '微信绑定',
    width: 100,
    minWidth: 100,
    fixed: false,
    align: 'center',
    columnKey: 'isWeixin',
    filters: filters,
    render: scope => {
      return (
          <>
            {
              scope.row.isWeixin ? (
                  <el-icon color="#67C23A">
                    <Star></Star>
                  </el-icon>
              ) : (
                  <el-icon color="#E6A23C">
                    <Star></Star>
                  </el-icon>
              )
            }
          </>
      );
    },
  }, {
    prop: 'creationTime',
    label: '创建时间',
    width: 180,
    minWidth: 180,
    fixed: false,
    align: 'center',
    sortable: 'custom',
    render: scope => {
      return (
          <>{dayjs(scope.row.creationTime).format('YYYY-MM-DD HH:mm:ss')}</>
      );
    },
  },
];
const rules = reactive({
  displayName: [
    {
      required: true,
      message: '角色名称是必须的',
      trigger: 'blur',
    },
    {
      validator: async (rule, value, callback) => {
        const response = await roleStore.validateRoleName({
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
});
const acceptParams = (params) => {
  props.value = params;
  visible.value = true;
  if (props.value.isUpdate || props.value.isBrowse) {
    nextTick(() => {
      treeSelectRef.value && treeSelectRef.value.setCheckedKeys(props.value.data['permissions'].filter(i => i.leaf).map(i => i.value));
    });
  }
};
const handleAllOrganization = () => {
  isAll.value = true;
  organizationStore.currentOrganization = {};
  treeRef.value && treeRef.value.setCurrentKey();
  // organizationStore.currentPage = 1;
  // await organizationStore.getOrganizationUsers({organizationId:organizationStore.currentOrganization.id});
  // tableSelectRef.value&&tableSelectRef.value.emits('change',"xxx");
  tableSelectRef.value && tableSelectRef.value.fuse();
};
defineExpose({
  acceptParams,
});
const handleClick = async (form) => {
  form && form.validate(async (valid, fields) => {
    if (valid) {
      try {
        loading.value = true;
        const grantedPermissions = props.value.data['permissions'] ? props.value.data['permissions'].map(i => i.value) : [];
        const userIds = props.value.data['users'] ? props.value.data['users'].map(i => i.id) : [];
        await roleStore.createOrUpdateRole({
          id: props.value.data.id,
          role: props.value.data,
          grantedPermissions,
          userIds,
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
  // await organizationStore.getOrganizations();
  // await roleStore.getPagedRoles({});
  // await userStore.getPagedUsers({});
  await organizationStore.getOrganizations();
  await permissionStore.getPermissions();
});
const handleChange = async (params) => {
  params.organizationId = organizationStore.currentOrganization.id;
  await organizationStore.getOrganizationUsers2(params);

  // await userStore.getPagedUsers(params);
};
const handleClose = () => {
  tableSelectRef.value && tableSelectRef.value.reset();
  defaultTab.value = 'a';
  organizationStore.currentOrganization = [];

};
const handleCurrentChange = (data, node) => {

};
const renderContent2 = (h, {node, data, store}) => {
  return (

      <span>{data.displayName} {
        data.description ? <span class="description">{data.description}</span> : ''
      }</span>

  );
};
const renderContent1 = (h, {node, data, store}) => {
  return (

      <span>{data.displayName}<span
          style="color:var(--el-text-color-placeholder);">（<i>{data.memberCount}</i>）</span></span>

  );
};
const handleNodeClick = async (data) => {
  isAll.value = false;
  organizationStore.currentOrganization = data;
  // organizationStore.currentPage = 1;
  // await organizationStore.getOrganizationUsers({organizationId:organizationStore.currentOrganization.id});
  // tableSelectRef.value&&tableSelectRef.value.emits('change',"xxx");
  tableSelectRef.value && tableSelectRef.value.fuse();
};
const handleOpen = () => {
  isAll.value = true;
  tableSelectRef.value && tableSelectRef.value.fuse();
};
</script>

<template>
  <el-drawer v-model="visible" :destroy-on-close="true" :title="props.title" size="50%" @close="handleClose"
             @open="handleOpen">
    <el-tabs v-model="defaultTab">
      <el-tab-pane label="角色详情" name="a">
        <el-form ref="formRef" :disabled="props.isBrowse" :hide-required-asterisk="false" :model="props.data" :rules="rules"
                 label-position="top" label-suffix=" :" label-width="100">

          <el-form-item label="角色名称" prop="displayName">
            <el-input v-model="props.data.displayName" :clearable="true" :maxlength="256" placeholder=""></el-input>
          </el-form-item>
          <el-form-item label="角色描述" prop="description">
            <el-input v-model="props.data.description" :clearable="true" :maxlength="1024" :rows="4"
                      placeholder="" type="textarea"></el-input>
          </el-form-item>

          <el-checkbox v-model="props.data.isDefault">
            新用户默认拥有该角色
          </el-checkbox>
        </el-form>
      </el-tab-pane>
      <el-tab-pane class="b" name="b">
        <template #label>
          <el-badge v-if="props.data.users && props.data.users.length>0"
                    :value="props.data.users && props.data.users.length" type="primary">
            所属用户
          </el-badge>
          <span v-else>
            角色用户
          </span>
        </template>
        <el-row :gutter="16">
          <el-col :span="props.isBrowse?0:6">
            <el-card v-if="!props.isBrowse" shadow="never">
              <template #header>
                <div :class="{background:isAll}" @click="handleAllOrganization">
                  <el-text type="primary">
                    全部用户
                  </el-text>
                </div>

              </template>
              <el-tree ref="treeRef"
                       :data="organizationTreeData"
                       :default-expand-all="true"
                       :expand-on-click-node="false"
                       :highlight-current="true"
                       :icon="ArrowRightBold"
                       :indent="28"
                       :props="defaultProps"
                       :render-content="renderContent1"
                       node-key="id"
                       @node-click="handleNodeClick"
                       @current-change="handleCurrentChange">
                <template #empty>
                  <!--                  <img :src="empty" alt="暂无数据" class="empty">-->
                  <el-empty description="空空如也"></el-empty>
                </template>
              </el-tree>
            </el-card>

          </el-col>
          <el-col :span="props.isBrowse?24:18">

            <TableSelect ref="tableSelectRef"
                         v-model:selected="props.data.users"
                         :columns="columns"
                         :disabled="props.isBrowse"
                         :items="organizationStore.organizationUsers"
                         :loading="organizationStore.organizationLoading"
                         :multi-select="true"
                         :tag-show="true"
                         :total-count="organizationStore.organizationCount"
                         display-property="name"
                         placeholder="在所属部门、账号、姓名、Email地址、电话号码中搜索"
                         tag-type="info"
                         @change="handleChange"></TableSelect>

          </el-col>
        </el-row>

      </el-tab-pane>
      <el-tab-pane class="c" name="c">
        <template #label>
          <el-badge v-if="props.data.permissions && props.data.permissions.length>0"
                    :value="props.data.permissions && props.data.permissions.length" type="primary">
            角色权限
          </el-badge>
          <span v-else>
            角色权限
          </span>
        </template>
        <TreeSelect ref="treeSelectRef" v-model:selected="props.data.permissions"
                    :check-on-click-node="true"
                    :check-strictly="false"
                    :data="treeData"
                    :default-props="defaultProps"
                    :disabled="props.isBrowse"
                    :expand-on-click-node="false"
                    :render-content="renderContent2"
                    display-property="displayName"
                    node-key="value"
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

.background {
  background-color: var(--el-color-primary-light-9);
}

.b {
  :deep(.el-tree) {
    .el-tree-node {
      .el-tree-node__content {
        padding-top: 4px;
        padding-bottom: 4px;
      }
    }
  }
}

.c {
  :deep(.el-tree) {
    .el-tree-node {
      .el-tree-node__content {
        padding-top: 2px;
        padding-bottom: 2px;
      }

      .description {
        font-size: 10px;
        color: var(--el-text-color-placeholder);
      }
    }
  }
}

:deep(.el-card) {
  border: none;

  .el-card__header {
    padding: 2px 0;

    div {
      padding: 6px;
      width: 100%;
      height: 100%;
      cursor: pointer;

      .el-text {
        font-size: 16px;
      }
    }
  }
}
</style>
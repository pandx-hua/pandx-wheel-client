<script lang="jsx" setup>

import {Check, Close, Lock, Star, Unlock} from '@element-plus/icons-vue';
import {ref} from 'vue';
import TableSelect from '@/components/Select/TableSelect.vue';
import dayjs from 'dayjs';
import {useOrganizationStore} from '@/stores/modules/organizations/organizations';

const emits = defineEmits(['success']);
const organizationStore = useOrganizationStore();
const filters = [
  {
    text: '是',
    value: true,
  }, {
    text: '否',
    value: false,
  },
];
const expandColumn = scope => {
  return (
      <el-row gutter={16} class="expanded-box">
        <el-col span={8}><span class="title">Email地址：</span>{scope.row.email}</el-col>
        <el-col span={8}><span class="title">电话号码：</span>{scope.row.phoneNumber}</el-col>
        <el-col span={8}></el-col>
      </el-row>
  );
};
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
const loading = ref(false);
const props = ref({
  title: '',
});
const selected = ref([]);
const visible = ref(false);
const acceptParams = async (params) => {
  props.value = params;
  visible.value = true;
  selected.value = [];
  await organizationStore.findUsers({
    organizationId: organizationStore.currentOrganization.id,
  });
};
const handleClick = async () => {
  loading.value = true;
  await organizationStore.addUsersToOrganization({
    organizationId: organizationStore.currentOrganization.id,
    userIds: selected.value.map(i => i.id),
  });
  emits('success', true, selected.value);
  loading.value = false;
  visible.value = false;
};
const handleOpen = () => {
};

// const handleChange=(values)=>{
//   selected.value=values;
// };

const handleChange = async (params) => {
  await organizationStore.findUsers({
    ...params,
    organizationId: organizationStore.currentOrganization.id,
  });
};

defineExpose({
  acceptParams,
});
</script>

<template>
  <el-dialog v-model="visible" :destroy-on-close="true" :draggable="true" :title="props.title" width="60%"
             @close="handleOpen">
    <!--    <UserTableSelect @change="handleChange"></UserTableSelect>-->
    <TableSelect ref="tableSelectRef"
                 v-model:selected="selected"
                 :columns="columns"
                 :expandColumn="expandColumn"
                 :items="organizationStore.foundUsers"
                 :loading="organizationStore.foundLoading"
                 :multi-select="true"
                 :tag-show="true"
                 :total-count="organizationStore.foundCount"
                 display-property="name"
                 placeholder="在账号、姓名、Email地址、电话号码中搜索"
                 tag-type="info"
                 @change="handleChange"></TableSelect>
    <template #footer>
      <el-button :icon="Close" @click="visible=false">取消</el-button>
      <el-button :icon="Check" :loading="loading" type="primary" @click="handleClick()">确认</el-button>
    </template>
  </el-dialog>
</template>

<style lang="scss" scoped>

</style>
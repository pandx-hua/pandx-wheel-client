<script lang="jsx" setup>

import TableSelect from '@/components/Select/TableSelect.vue';
import {useUserStore} from '@/stores/modules/authorization/users';
import {onMounted, ref, watch} from 'vue';
import dayjs from 'dayjs';

const userStore = useUserStore();
const tableSelectRef = ref();
const selected = ref([]);
const emits = defineEmits(['change']);
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
    // sortable:'custom'
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
        value: 1,
      }, {
        text: '女',
        value: 0,
      },
    ],
    render: scope => {
      return (
          <>
            {
              scope.row.gender === 1 ? (
                  <el-icon color="#67C23A">
                    <Male></Male>
                  </el-icon>
              ) : (
                  <el-icon color="E6A23C">
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
          <>{scope.row.roles && scope.row.roles.map(r => r.displayName).join(', ')}</>
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
              scope.row.gender === 1 ? (
                  <el-icon color="#67C23A">
                    <Male></Male>
                  </el-icon>
              ) : (
                  <el-icon color="E6A23C">
                    <Female></Female>
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
              scope.row.gender === 1 ? (
                  <el-icon color="#67C23A">
                    <Male></Male>
                  </el-icon>
              ) : (
                  <el-icon color="E6A23C">
                    <Female></Female>
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
              scope.row.gender === 1 ? (
                  <el-icon color="#67C23A">
                    <Male></Male>
                  </el-icon>
              ) : (
                  <el-icon color="E6A23C">
                    <Female></Female>
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

const handleChange = async (params) => {
  await userStore.getPagedUsers(params);
};

watch(() => selected.value, (values) => {
  emits('change', values);
});

onMounted(async () => {
  // if (userStore.pagedUsers.length === 0) {
  await userStore.getPagedUsers({});
  // }

});
</script>

<template>
  <TableSelect ref="tableSelectRef"
               v-model:selected="selected"
               :columns="columns"
               :items="userStore.pagedUsers"
               :loading="userStore.loading"
               :multi-select="true"
               :tag-show="true"
               :total-count="userStore.totalCount"
               display-property="name"
               placeholder="在所属部门、账号、姓名、Email地址、电话号码中搜索"
               tag-type="info"
               @change="handleChange"></TableSelect>
</template>

<style lang="scss" scoped>

</style>
<script setup>

import {
  ArrowDown,
  ArrowLeftBold,
  ArrowRightBold,
  Delete,
  EditPen,
  Refresh,
  Search,
  Star,
} from '@element-plus/icons-vue';
import {hasPermission} from '@/utils/wheel';
import {onMounted, ref} from 'vue';
import {useRoleStore} from '@/stores/modules/authorization/roles';
import {useUserStore} from '@/stores/modules/authorization/users';
import dayjs from 'dayjs';
import RoleDrawer from '@/views/Administration/Roles/components/RoleDrawer.vue';
import {ElMessage, ElMessageBox} from 'element-plus';
import {usePermissionStore} from '@/stores/modules/authorization/permissions';

const roleStore = useRoleStore();
const permissionStore = usePermissionStore();
const userStore = useUserStore();
const collapsed = ref(true);
const request = ref({});
const dateRange = ref([]);
const drawerRef = ref();
const tableRef = ref();
const batchDelete_loading = ref(false);
const shortcuts = [
  {
    text: '近 3 个月',
    value: [new Date().setMonth(new Date().getMonth() - 3), new Date()],
  }, {
    text: '近 6 个月',
    value: [new Date().setMonth(new Date().getMonth() - 6), new Date()],
  },
];
const filters = [
  {
    text: '是',
    value: true,
  }, {
    text: '否',
    value: false,
  },
];


const openDrawer = (title, data = {}, isUpdate = false, isBrowse = false) => {
  const params = {
    title,
    isUpdate,
    isBrowse,
    data: {...data},
  };
  drawerRef.value.acceptParams(params);
};

const batchDelete = () => {
  ElMessageBox.confirm(`确定要批量删除选定的角色吗？`, '系统提示', {
    type: 'warning',
    showClose: false,
    closeOnClickModal: false,
    closeOnPressEscape: false,
  })
      .then(async () => {
        try {
          batchDelete_loading.value = true;
          await roleStore.batchDeleteRoles({
            roleIds: tableRef.value && tableRef.value.getSelectionRows().map(i => i.id),
          });
          await getPaged();
          ElMessage.success(`已成功删除 ${roleStore.deletedCount} 个选定的角色`);
        } finally {
          batchDelete_loading.value = false;
        }
      })
      .then(() => {

      })
      .catch(() => {
      });
};

const search = async () => {
  roleStore.currentPage = 1;
  await getPaged();
};

const reset = async () => {
  request.value.filter = undefined;
  request.value.sorting = undefined;
  request.value.startTime = undefined;
  request.value.endTime = undefined;
  request.value.isStatic = [];
  request.value.isDefault = [];
  dateRange.value = [];
  tableRef.value && tableRef.value.clearSort();
  tableRef.value && tableRef.value.clearFilter();
  roleStore.currentPage = 1;
  await roleStore.getPagedRoles({
    currentPage: roleStore.currentPage,
    pageSize: roleStore.pageSize,
  });
};

const handleClear = async () => {
  roleStore.currentPage = 1;
  await getPaged();
};

const dateChange = async (date) => {
  if (date) {
    request.value.startTime = date[0];
    request.value.endTime = date[1];
  } else {
    request.value.startTime = undefined;
    request.value.endTime = undefined;
    await getPaged();
  }
};

const handleCommand = (command) => {
  switch (command.name) {
    case 'browse':
      command.data.permissions.map(i => i.displayName = permissionStore.permissions.find(j => j.value === i.value) && permissionStore.permissions.find(j => j.value === i.value)['displayName']);
      command.data.permissions.map(i => i.leaf = permissionStore.permissions.find(j => j.value === i.value) && permissionStore.permissions.find(j => j.value === i.value)['leaf']);
      openDrawer(`浏览 ${command.data.name}`, command.data, true, true);
      break;
    case 'update':
      command.data.permissions.map(i => i.displayName = permissionStore.permissions.find(j => j.value === i.value) && permissionStore.permissions.find(j => j.value === i.value)['displayName']);
      command.data.permissions.map(i => i.leaf = permissionStore.permissions.find(j => j.value === i.value) && permissionStore.permissions.find(j => j.value === i.value)['leaf']);
      openDrawer(`编辑 ${command.data.name}`, command.data, true);
      break;
    case 'delete':
      ElMessageBox.confirm(`确定要删除角色 ${command.data.name} 吗？`, '系统提示', {
        type: 'warning',
        showClose: false,
        closeOnClickModal: false,
        closeOnPressEscape: false,
      })
          .then(async () => {
            try {
              await roleStore.deleteRole({
                id: command.data.id,
              });
              await getPaged();
              ElMessage.success(`已成功删角色 ${command.data.name}`);
            } finally {

            }
          })
          .catch(() => {
          });
      break;
  }
};

const handleChange = async (currentPage, pageSize) => {
  roleStore.currentPage = currentPage;
  roleStore.pageSize = pageSize;
  request.value.currentPage = currentPage;
  request.value.pageSize = pageSize;
  await roleStore.getPagedRoles(request.value);
};

const handleSortChange = async (sorting) => {
  if (sorting.column.sortable === 'custom') {
    if (sorting.order === 'descending' || sorting.order === 'ascending') {
      request.value.sorting = sorting.prop + ' ' + sorting.order;
    }
    roleStore.currentPage = 1;
    await getPaged();
  }
};

const handleFilterChange = async (filters) => {
  const propertyName = Object.keys(filters)[0];
  request.value[propertyName] = filters[propertyName];
  roleStore.currentPage = 1;
  await getPaged();
};

const getPaged = async () => {
  request.value.currentPage = roleStore.currentPage;
  request.value.pageSize = roleStore.pageSize;
  await roleStore.getPagedRoles(request.value);
};

const handleSaveSuccess = async (isUpdate) => {
  if (isUpdate) {
    await getPaged();
  } else {
    roleStore.currentPage = 1;
    await getPaged();
  }
};

onMounted(async () => {
  roleStore.currentPage = 1;
  await roleStore.getPagedRoles({
    currentPage: roleStore.currentPage,
    pageSize: roleStore.pageSize,
  });
});
</script>

<template>
  <div class="card main">
    <el-form ref="searchFormRef">
      <el-row :gutter="16" class="mb12">
        <el-col :span="18">
          <div class="float-left">
            <el-button :disabled="!hasPermission('Permission.Roles.Create')" :icon="EditPen" type="primary"
                       @click="openDrawer('新建角色')">新建角色
            </el-button>
            <el-button :disabled="!hasPermission('Permission.Roles.Delete')" :icon="Delete" type="danger"
                       @click="batchDelete">批量删除
            </el-button>
          </div>
        </el-col>
        <el-col :span="6">
          <div class="float-right">
            <el-button :disabled="!hasPermission('Permission.Roles.Search')" :icon="Search" type="default"
                       @click="search">搜索
            </el-button>
            <el-button :disabled="!hasPermission('Permission.Roles.Search')" :icon="Refresh" type="default"
                       @click="reset">重置
            </el-button>
          </div>
        </el-col>
      </el-row>
      <el-row :gutter="16">
        <el-col :span="12">
          <el-form-item prop="filter">
            <el-input v-model="request.filter" :clearable="true"
                      placeholder="在角色名称、角色描述中搜索"
                      @clear="handleClear"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-tooltip content="选择创建时间范围"
                      placement="top">
            <el-form-item prop="time">
              <el-date-picker v-model=dateRange :clearable="true" :editable="false" :shortcuts="shortcuts"
                              end-placeholder="结束时间"
                              format="YYYY-MM-DD" range-separator="至"
                              start-placeholder="开始时间" type="daterange" @change="dateChange"></el-date-picker>
            </el-form-item>
          </el-tooltip>
        </el-col>
      </el-row>
      <!--      <el-collapse-transition>-->
      <!--                <el-row v-if="!collapsed" :gutter="16">-->
      <!--                  <el-col :span="24">-->
      <!--                  </el-col>-->
      <!--                </el-row>-->
      <!--      </el-collapse-transition>-->
      <!--      <el-button type="primary" :link="true" @click="collapsed=!collapsed" class="mb12">-->
      <!--        <el-icon class="el-icon&#45;&#45;left">-->
      <!--          <component :is="collapsed?ArrowDown:ArrowUp"></component>-->
      <!--        </el-icon>-->
      <!--        {{ collapsed ? '显示高级搜索' : '隐藏高级搜索' }}-->
      <!--      </el-button>-->
    </el-form>
    <el-table ref="tableRef"
              v-loading="roleStore.loading"
              :border="true"
              :data="roleStore.pagedRoles"
              :header-cell-style="{'background-color':'var(--el-bg-color-page)'}" :highlight-current-row="false"
              :show-overflow-tooltip="true" @sort-change="handleSortChange"
              @filter-change="handleFilterChange">
      <template #empty>
        <!--        <img :src="empty" alt="暂无数据" class="empty">-->
        <el-empty description="空空如也"></el-empty>
      </template>
      <el-table-column fixed="left" type="selection" width="40"></el-table-column>
      <el-table-column type="expand" width="40">
        <template #default="scope">
          <el-row :gutter="16" class="expanded-box">
            <el-col :span="24"><span class="title">角色用户：</span>{{ scope.row.users.map(i => i.name).join(', ') }}
            </el-col>
          </el-row>
        </template>
      </el-table-column>
      <el-table-column align="center" label="角色名称" min-width="160" prop="displayName" sortable="custom"
                       width="160"></el-table-column>
      <el-table-column :filters="filters" align="center" column-key="isStatic" label="系统" min-width="70"
                       prop="isStatic"
                       width="70">
        <template #default="scope">
          <el-icon v-if="scope.row.isStatic" color="#67C23A">
            <Star></Star>
          </el-icon>
          <el-icon v-if="!scope.row.isStatic" color="#E6A23C">
            <Star></Star>
          </el-icon>
        </template>
      </el-table-column>
      <el-table-column :filters="filters" align="center" column-key="isDefault" label="默认" min-width="70"
                       prop="isDefault"
                       width="70">
        <template #default="scope">
          <el-icon v-if="scope.row.isDefault" color="#67C23A">
            <Star></Star>
          </el-icon>
          <el-icon v-if="!scope.row.isDefault" color="#E6A23C">
            <Star></Star>
          </el-icon>
        </template>
      </el-table-column>
      <el-table-column align="center" label="角色描述" min-width="200" prop="description">
      </el-table-column>
      <el-table-column align="center" label="创建时间" min-width="180" prop="creationTime" sortable="custom"
                       width="180">
        <template #default="scope">
          {{ dayjs(scope.row.creationTime).format('YYYY-MM-DD HH:mm:ss') }}
        </template>
      </el-table-column>
      <el-table-column align="center" fixed="right" label="操作" width="100">
        <template #default="scope">
          <el-dropdown @command="handleCommand">
            <span class="el-dropdown--link">
            操作
            <el-icon class="el-icon--right">
              <ArrowDown></ArrowDown>
            </el-icon>
            </span>
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item :command="{data:scope.row,name:'browse'}"
                                  :disabled="!hasPermission('Permission.Roles.Browse')">浏览
                </el-dropdown-item>
                <el-dropdown-item :command="{data:scope.row,name:'update'}"
                                  :disabled="!hasPermission('Permission.Roles.Update')"
                                  :divided="true">编辑
                </el-dropdown-item>
                <el-dropdown-item :command="{data:scope.row,name:'delete'}"
                                  :disabled="!hasPermission('Permission.Roles.Delete')">删除
                </el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination v-if="roleStore.pagedRoles.length>0" v-model:current-page="roleStore.currentPage"
                   v-model:page-size="roleStore.pageSize"
                   :background="true" :hide-on-single-page="false"
                   :next-icon="ArrowRightBold"
                   :page-sizes="[10,20,30,40,50]" :prev-icon="ArrowLeftBold"
                   :total="roleStore.totalCount" class="mt12"
                   layout="sizes,total,prev,pager,next,jumper"
                   @change="handleChange"></el-pagination>
    <RoleDrawer ref="drawerRef" @save-success="handleSaveSuccess"></RoleDrawer>
  </div>
</template>

<style lang="scss" scoped>
@import "./index.scss";
</style>
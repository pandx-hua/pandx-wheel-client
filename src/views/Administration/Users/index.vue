<script setup>

import {
  ArrowDown,
  ArrowLeftBold,
  ArrowRightBold,
  Delete,
  Download,
  EditPen,
  Female,
  Lock,
  Male,
  Refresh,
  Search,
  Star,
  Unlock,
  Upload,
} from '@element-plus/icons-vue';
import {hasPermission} from '@/utils/wheel';
import {onMounted, ref} from 'vue';
import {useRoleStore} from '@/stores/modules/authorization/roles';
import {useUserStore} from '@/stores/modules/authorization/users';
import dayjs from 'dayjs';
import UserDrawer from '@/views/Administration/Users/components/UserDrawer.vue';
import {ElMessage, ElMessageBox} from 'element-plus';
import ChangePasswordDialog from '@/views/Administration/Users/components/ChangePasswordDialog.vue';
import {$downloadFileFromCache} from '@/services/modules/files';
import {downloadWithToken} from '@/utils/download';
import ImportUsersDialog from '@/views/Administration/Users/components/ImportUsersDialog.vue';

const roleStore = useRoleStore();
const userStore = useUserStore();
const collapsed = ref(true);
const request = ref({});
const dateRange = ref([]);
const drawerRef = ref();
const changePasswordRef = ref();
const importUsersRef = ref();
const tableRef = ref();
const batchDelete_loading = ref(false);
const export_loading = ref(false);

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
    title: title,
    isUpdate: isUpdate,
    isBrowse: isBrowse,
    data: {...data},
  };
  drawerRef.value.acceptParams(params);
};

const openDialog = (dialogRef, title, data = {}) => {
  const params = {
    title: title,
    data: {...data},
  };
  dialogRef.value.acceptParams(params);
};

const importUsers = () => {
  openDialog(importUsersRef, '导入用户');
};

const exportUsers = async () => {
  export_loading.value = true;
  await userStore.exportUsersToExcel(request.value);
  await downloadWithToken($downloadFileFromCache, userStore.cachedFile.name, userStore.cachedFile.type, userStore.cachedFile);
  export_loading.value = false;
};

const batchDelete = () => {
  ElMessageBox.confirm(`确定要批量删除选定的用户吗？`, '系统提示', {
    type: 'warning',
    showClose: false,
    closeOnClickModal: false,
    closeOnPressEscape: false,
  })
      .then(async () => {
        try {
          batchDelete_loading.value = true;
          await userStore.batchDeleteUsers({
            userIds: tableRef.value && tableRef.value.getSelectionRows().map(i => i.id),
          });
          await getPaged();
          ElMessage.success(`已成功删除 ${userStore.deletedCount} 个选定的用户`);
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
  userStore.currentPage = 1;
  await getPaged();
};

const reset = async () => {
  request.value.filter = undefined;
  request.value.sorting = undefined;
  request.value.startTime = undefined;
  request.value.endTime = undefined;
  request.value.isActive = [];
  request.value.isLockout = [];
  request.value.isWeixin = [];
  request.value.gender = [];
  dateRange.value = [];
  tableRef.value && tableRef.value.clearSort();
  tableRef.value && tableRef.value.clearFilter();
  userStore.currentPage = 1;
  await userStore.getPagedUsers({
    currentPage: userStore.currentPage,
    pageSize: userStore.pageSize,
  });
};

const handleClear = async () => {
  userStore.currentPage = 1;
  await getPaged();
};

const dateChange = async (date) => {
  if (date) {
    request.value.startTime = date[0];
    request.value.endTime = date[1];
  } else {
    request.value.startTime = undefined;
    request.value.endTime = undefined;
    userStore.currentPage = 1;
    await getPaged();
  }
};

const handleCommand = (command) => {
  switch (command.name) {
    case 'browse':
      openDrawer(`浏览 ${command.data.name}`, command.data, true, true);
      break;
    case 'update':
      openDrawer(`编辑 ${command.data.name}`, command.data, true);
      break;
    case 'unlock':
      ElMessageBox.confirm(`确定要解锁用户 ${command.data.name} 吗？`, '系统提示', {
        type: 'warning',
        showClose: false,
        closeOnClickModal: false,
        closeOnPressEscape: false,
      })
          .then(async () => {
            try {
              await userStore.unlockUser({
                id: command.data.id,
              });
              await getPaged();
              ElMessage.success(`已成功解锁用户 ${command.data.name}`);
            } finally {

            }
          })
          .catch(() => {
          });
      break;
    case 'delete':
      ElMessageBox.confirm(`确定要删除用户 ${command.data.name} 吗？`, '系统提示', {
        type: 'warning',
        showClose: false,
        closeOnClickModal: false,
        closeOnPressEscape: false,
      })
          .then(async () => {
            try {
              await userStore.deleteUser({
                id: command.data.id,
              });
              await getPaged();
              ElMessage.success(`已成功删除用户 ${command.data.name}`);
            } finally {

            }
          })
          .catch(() => {
          });
      break;
    case 'change':
      openDialog(changePasswordRef, `修改 ${command.data.name} 的密码 `, command.data);
      break;
  }
};

const handleChange = async (currentPage, pageSize) => {
  userStore.currentPage = currentPage;
  userStore.pageSize = pageSize;
  request.value.currentPage = currentPage;
  request.value.pageSize = pageSize;
  await userStore.getPagedUsers(request.value);
};

const handleSortChange = async (sorting) => {
  if (sorting.column.sortable === 'custom') {
    if (sorting.order === 'descending' || sorting.order === 'ascending') {
      request.value.sorting = sorting.prop + ' ' + sorting.order;
    }
    userStore.currentPage = 1;
    await getPaged();
  }
};

const handleFilterChange = async (filters) => {
  const propertyName = Object.keys(filters)[0];
  request.value[propertyName] = filters[propertyName];
  userStore.currentPage = 1;
  await getPaged();
};

const getPaged = async () => {
  request.value.currentPage = userStore.currentPage;
  request.value.pageSize = userStore.pageSize;
  await userStore.getPagedUsers(request.value);
};

const handleSaveSuccess = async (isUpdate) => {
  if (isUpdate) {
    await getPaged();
  } else {
    userStore.currentPage = 1;
    await getPaged();
  }
};

const handleChangeSuccess = async (name) => {
  ElMessage.success(`已成功修改用户 ${name} 的密码`);
};
const createUsers = () => {
  userStore.avatar = '';
  openDrawer('新建用户');
};

onMounted(async () => {
  await roleStore.getRoles();
  userStore.currentPage = 1;
  await userStore.getPagedUsers({
    currentPage: userStore.currentPage,
    pageSize: userStore.pageSize,
  });
});
</script>

<template>
  <div class="card main">
    <el-form ref="searchFormRef">
      <el-row :gutter="16" class="mb12">
        <el-col :span="18">
          <div class="float-left">
            <el-button :disabled="!hasPermission('Permission.Users.Create')" :icon="EditPen" type="primary"
                       @click="createUsers">新建用户
            </el-button>
            <el-button :disabled="!hasPermission('Permission.Users.Import')" :icon="Upload" :plain="true" type="warning"
                       @click="importUsers">导入用户
            </el-button>
            <el-button :disabled="!hasPermission('Permission.Users.Export')" :icon="Download" :loading="export_loading"
                       :plain="true"
                       type="warning"
                       @click="exportUsers">导出用户
            </el-button>
            <el-button :disabled="!hasPermission('Permission.Users.Delete')" :icon="Delete"
                       :loading="batchDelete_loading"
                       type="danger" @click="batchDelete">批量删除
            </el-button>
          </div>
        </el-col>
        <el-col :span="6">
          <div class="float-right">
            <el-button :disabled="!hasPermission('Permission.Users.Search')" :icon="Search" type="default"
                       @click="search">搜索
            </el-button>
            <el-button :disabled="!hasPermission('Permission.Users.Search')" :icon="Refresh" type="default"
                       @click="reset">重置
            </el-button>
          </div>
        </el-col>
      </el-row>
      <el-row :gutter="16">
        <el-col :span="12">
          <el-form-item prop="filter">
            <el-input v-model="request.filter" :clearable="true"
                      placeholder="在账号、姓名、Email地址、电话号码中搜索"
                      @clear="handleClear"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-tooltip content="选择创建时间范围"
                      placement="top">
            <el-form-item prop="time">
              <el-date-picker v-model=dateRange :clearable="true" :editable="false" :shortcuts="shortcuts"
                              end-placeholder="结束时间"
                              format="YYYY-MM-DD" range-separator="至" start-placeholder="开始时间"
                              type="daterange" @change="dateChange" @clear="handleClear"></el-date-picker>
            </el-form-item>
          </el-tooltip>
        </el-col>
      </el-row>
      <!--      <el-collapse-transition>-->
      <!--        <el-row v-if="!collapsed" :gutter="16">-->
      <!--          <el-col :span="24">-->
      <!--            <el-form-item prop="role">-->
      <!--              <el-select v-model="request.roleId" placeholder="选择所属角色" style="width:100%;" :clearable="true">-->
      <!--                <el-option v-for="item in roleStore.roles" :key="item.id" :label="item.displayName" :value="item.id">-->
      <!--                  <span>{{ item.displayName }}</span>-->
      <!--                  <span>{{ item.description }}</span>-->
      <!--                </el-option>-->
      <!--              </el-select>-->
      <!--            </el-form-item>-->
      <!--          </el-col>-->
      <!--        </el-row>-->
      <!--      </el-collapse-transition>-->
      <!--      <el-button type="primary" :link="true" @click="collapsed=!collapsed" class="mb12">-->
      <!--        <el-icon class="el-icon&#45;&#45;left">-->
      <!--          <component :is="collapsed?ArrowDown:ArrowUp"></component>-->
      <!--        </el-icon>-->
      <!--        {{ collapsed ? '显示高级搜索' : '隐藏高级搜索' }}-->
      <!--      </el-button>-->
    </el-form>
    <el-table ref="tableRef"
              v-loading="userStore.loading"
              :border="true"
              :data="userStore.pagedUsers"
              :header-cell-style="{'background-color':'var(--el-bg-color-page)'}" :highlight-current-row="false"
              :show-overflow-tooltip="true" @sort-change="handleSortChange"
              @filter-change="handleFilterChange">
      <template #empty>
        <el-empty description="空空如也"></el-empty>
        <!--        <img :src="empty" alt="暂无数据" class="empty">-->
      </template>
      <el-table-column fixed="left" type="selection" width="40"></el-table-column>
      <el-table-column type="expand" width="40">
        <template #default="scope">
          <el-row :gutter="16" class="expanded-box">
            <el-col :span="8"><span class="title">Email地址：</span>{{ scope.row.email }}</el-col>
            <el-col :span="8"><span class="title">电话号码：</span>{{ scope.row.phoneNumber }}</el-col>
            <el-col :span="8"></el-col>
          </el-row>
        </template>
      </el-table-column>
      <el-table-column align="center" label="所属部门" min-width="100" prop="organizations"
                       width="200">
        <template #default="scope">
          {{ scope.row.organizations.map(o => o.displayName).join('，') }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="账号" min-width="100" prop="userName" sortable="custom"
                       width="120"></el-table-column>
      <el-table-column align="center" label="姓名" min-width="100" prop="name" sortable="custom"
                       width="120"></el-table-column>
      <el-table-column :filters="[{text:'男',value:0},{text:'女',value:1}]" align="center" column-key="gender"
                       label="性别" min-width="70"
                       prop="gender" width="70">
        <template #default="scope">
          <el-icon v-if="scope.row.gender===0" color="#67C23A">
            <Male></Male>
          </el-icon>
          <el-icon v-if="scope.row.gender===1" color="#E6A23C">
            <Female></Female>
          </el-icon>
        </template>
      </el-table-column>
      <el-table-column align="center" label="所属角色" min-width="200" prop="roles">
        <template #default="scope">
          {{ scope.row.roles.map(r => r.displayName).join('，') }}
        </template>
      </el-table-column>
      <el-table-column :filters="filters" align="center" column-key="isActive" label="激活状态" min-width="100"
                       prop="isActive"
                       width="100">
        <template #default="scope">
          <el-icon v-if="scope.row.isActive" color="#67C23A">
            <Star></Star>
          </el-icon>
          <el-icon v-if="!scope.row.isActive" color="#E6A23C">
            <Star></Star>
          </el-icon>
        </template>
      </el-table-column>
      <el-table-column :filters="filters" align="center" column-key="isLockout" label="锁定状态" min-width="100"
                       prop="isLockout"
                       width="100">
        <template #default="scope">
          <el-icon v-if="scope.row.isLockout" color="#E6A23C">
            <Lock></Lock>
          </el-icon>
          <el-icon v-if="!scope.row.isLockout" color="#67C23A">
            <Unlock></Unlock>
          </el-icon>
        </template>
      </el-table-column>
      <el-table-column :filters="filters" align="center" column-key="isWeixin" label="微信绑定" min-width="100"
                       prop="isWeixin"
                       width="100">
        <template #default="scope">
          <el-icon v-if="scope.row.isWeixin" color="#67C23A">
            <Star></Star>
          </el-icon>
          <el-icon v-if="!scope.row.isWeixin" color="#E6A23C">
            <Star></Star>
          </el-icon>
        </template>
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
                                  :disabled="!hasPermission('Permission.Users.Browse')">浏览
                </el-dropdown-item>
                <el-dropdown-item :command="{data:scope.row,name:'update'}"
                                  :disabled="!hasPermission('Permission.Users.Update')" divided>编辑
                </el-dropdown-item>
                <el-dropdown-item :command="{data:scope.row,name:'unlock'}"
                                  :disabled="!hasPermission('Permission.Users.Unlock')">解锁
                </el-dropdown-item>
                <el-dropdown-item :command="{data:scope.row,name:'delete'}"
                                  :disabled="!hasPermission('Permission.Users.Delete')">删除
                </el-dropdown-item>
                <el-dropdown-item :command="{data:scope.row,name:'change'}"
                                  :disabled="!hasPermission('Permission.Users.Change')"
                                  divided>修改密码
                </el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination v-if="userStore.pagedUsers.length>0" v-model:current-page="userStore.currentPage"
                   v-model:page-size="userStore.pageSize"
                   :background="true" :hide-on-single-page="false"
                   :next-icon="ArrowRightBold"
                   :page-sizes="[10,20,30,40,50]" :prev-icon="ArrowLeftBold"
                   :total="userStore.totalCount"
                   class="mt12" layout="sizes,total,prev,pager,next,jumper"
                   @change="handleChange"></el-pagination>
    <UserDrawer ref="drawerRef" @save-success="handleSaveSuccess"></UserDrawer>
    <ChangePasswordDialog ref="changePasswordRef" @change-success="handleChangeSuccess"></ChangePasswordDialog>
    <ImportUsersDialog ref="importUsersRef"></ImportUsersDialog>
  </div>
</template>

<style lang="scss" scoped>
@import "./index.scss";
</style>
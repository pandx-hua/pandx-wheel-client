<script lang="jsx" setup>

import {
  ArrowLeftBold,
  ArrowRightBold,
  Delete,
  EditPen,
  Female,
  Lock,
  Male,
  Plus,
  RemoveFilled,
  Star,
  Unlock,
} from '@element-plus/icons-vue';
import {hasPermission} from '@/utils/wheel';
import OrganizationDrawer from '@/views/Administration/Organizations/components/OrganizationDrawer.vue';
import {computed, nextTick, onMounted, ref} from 'vue';
import {useOrganizationStore} from '@/stores/modules/organizations/organizations';
import dayjs from 'dayjs';
import {useRoleStore} from '@/stores/modules/authorization/roles';
import {useUserStore} from '@/stores/modules/authorization/users';
import UserDialog from '@/views/Administration/Organizations/components/UserDialog.vue';
import {ElMessage, ElMessageBox} from 'element-plus';
import ContextMenu from '@/components/ContextMenu/index.vue';

const loading = ref(false);
const treeContextMenu = ref({
  name: 'organization-menu',
  axis: {
    x: null,
    y: null,
  },
  items: [
    {
      handler: 'create',
      button: '新建下级部门',
      disabled: !hasPermission('Permission.Organizations.Create'),
    },
    {
      handler: 'browse',
      button: '浏览',
      disabled: !hasPermission('Permission.Organizations.Browse'),
    },
    {
      handler: 'update',
      button: '编辑',
      disabled: !hasPermission('Permission.Organizations.Update'),
    },
    {
      handler: 'delete',
      button: '删除',
      divided: true,
      disabled: !hasPermission('Permission.Organizations.Delete'),
    },
    {
      handler: 'up',
      button: '上移',
      disabled: !hasPermission('Permission.Organizations.Move'),
    },
    {
      handler: 'down',
      button: '下移',
      divided: true,
      disabled: !hasPermission('Permission.Organizations.Move'),
    },
    {
      handler: 'display',
      button: '查看代码',
      disabled: !hasPermission('Permission.Organizations.Browse'),
    },
  ],
});
const roleStore = useRoleStore();
const userStore = useUserStore();
const drawerRef = ref();
const dialogRef = ref();
const treeRef = ref();
const tableRef = ref();
const organizationStore = useOrganizationStore();
const request = ref({});
const defaultProps = {
  children: 'children',
  label: 'displayName',
};
const filters = [
  {
    text: '是',
    value: true,
  }, {
    text: '否',
    value: false,
  },
];

const treeData = computed(() => {
  return getTreeData(null);
});

const openDrawer = (title, isUpdate = false, data = {}, parentData = {}, isBrowse = false) => {
  const params = {
    isBrowse: isBrowse,
    isUpdate: isUpdate,
    title: title,
    data: {...data},
    parentData: {...parentData},
  };
  drawerRef.value.acceptParams(params);
};

const openDialog = (title) => {
  const params = {
    title: title,
  };
  dialogRef.value.acceptParams(params);
};

const handleNodeClick = async (data) => {
  organizationStore.currentOrganization = data;
  organizationStore.addedCurrentPage = 1;
  await getPaged();
};

const handleNodeContextmenu = async (e, data) => {
  treeRef.value.setCurrentKey(data.id);
  organizationStore.currentOrganization = data;
  await nextTick(() => {
    treeContextMenu.value.axis = {x: e.clientX, y: e.clientY};
  });
  organizationStore.addedCurrentPage = 1;
  await getPaged();
};

const handleCurrentChange = (data, node) => {

};

const handleSaveSuccess = async () => {
  await organizationStore.getOrganizations();
  treeRef && treeRef.value.setCurrentNode(organizationStore.currentOrganization, true);
  organizationStore.addedCurrentPage = 1;
  await getPaged();
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

const handleChange = async (currentPage, pageSize) => {
  organizationStore.addedCurrentPage = currentPage;
  organizationStore.addedPageSize = pageSize;
  request.value.currentPage = currentPage;
  request.value.pageSize = pageSize;
  await organizationStore.getOrganizationUsers1(request.value);
};

const handleSortChange = async (sorting) => {
  if (sorting.column.sortable === 'custom') {
    if (sorting.order === 'descending' || sorting.order === 'ascending') {
      request.value.sorting = sorting.prop + ' ' + sorting.order;
    }
    organizationStore.addedCurrentPage = 1;
    await getPaged();
  }
};

const handleFilterChange = async (filters) => {
  const propertyName = Object.keys(filters)[0];
  request.value[propertyName] = filters[propertyName];
  organizationStore.addedCurrentPage = 1;
  await getPaged();
};

const handleSuccess = async (result, values) => {
  if (result) {
    await organizationStore.getOrganizations();
    organizationStore.addedCurrentPage = 1;
    await getPaged();
  }
};

const batchRemove = () => {
  ElMessageBox.confirm(`确定从当前部门批量移除选定的成员吗？`, '系统提示', {
    type: 'warning',
    showClose: false,
    closeOnClickModal: false,
    closeOnPressEscape: false,
  })
      .then(async () => {
        try {
          loading.value = true;
          await organizationStore.removeUsersFromOrganization({
            userIds: tableRef && tableRef.value.getSelectionRows().map(i => i.id),
            organizationId: organizationStore.currentOrganization.id,
          });
          await organizationStore.getOrganizations();
          organizationStore.addedCurrentPage = 1;
          await getPaged();
          ElMessage.success(`已从当前部门成功移除选定的成员`);
        } finally {
          loading.value = false;
        }
      })
      .catch(() => {
        loading.value = false;
      });
};

const singleRemove = (data) => {
  ElMessageBox.confirm(`确定从当前部门中移除 ${data.name} 吗？`, '系统提示', {
    type: 'warning',
    showClose: false,
    closeOnClickModal: false,
    closeOnPressEscape: false,
  })
      .then(async () => {
        try {
          await organizationStore.removeUserFromOrganization({
            userId: data.id,
            organizationId: organizationStore.currentOrganization.id,
          });
          await organizationStore.getOrganizations();
          organizationStore.addedCurrentPage = 1;
          await getPaged();
          ElMessage.success(`已从当前部门中成功移除成员 ${data.name}`);
        } finally {

        }
      })
      .catch(() => {
      });
};

const getPaged = async () => {
  request.value.currentPage = organizationStore.addedCurrentPage;
  request.value.pageSize = organizationStore.addedPageSize;
  request.value.organizationId = organizationStore.currentOrganization.id;
  await organizationStore.getOrganizationUsers1(request.value);
};

// const renderContent = (h, {node, data, store}) => {
//   const slots = {
//     dropdown: () => {
//       return (
//           <>
//             <el-dropdown-menu>
//               <el-dropdown-item command={{name:'create',data:data}}>新建下级部门</el-dropdown-item>
//               <el-dropdown-item command={{name:'update',data:data}}>编辑</el-dropdown-item>
//               <el-dropdown-item commond={{name:'delete',data:data}}>删除</el-dropdown-item>
//               <el-dropdown-item commond={{name:'display',data:data}} divided>查看代码</el-dropdown-item>
//             </el-dropdown-menu>
//           </>
//       );
//     },
//   };
//   return (
//       <el-dropdown hide-on-click={true} ref={dropdownRef} v-slots={slots} trigger="contextmenu" size="large" onCommand={handleCommand}>
//         <span>{data.displayName}（{data.memberCount}）</span>
//       </el-dropdown>
//   );
// };

const renderContent = (h, {node, data, store}) => {
  // const slots = {
  //   dropdown: () => {
  //     return (
  //         <>
  //           <el-dropdown-menu>
  //             <el-dropdown-item command={{name:'create',data:data}}>新建下级部门</el-dropdown-item>
  //             <el-dropdown-item command={{name:'update',data:data}}>编辑</el-dropdown-item>
  //             <el-dropdown-item commond={{name:'delete',data:data}}>删除</el-dropdown-item>
  //             <el-dropdown-item commond={{name:'display',data:data}} divided>查看代码</el-dropdown-item>
  //           </el-dropdown-menu>
  //         </>
  //     );
  //   },
  // };
  return (

      <span>{data.displayName}<span
          style="color:var(--el-text-color-placeholder);">（<i>{data.memberCount}</i>）</span></span>

  );
};

const createHandler = () => {
  openDrawer(`在 ${organizationStore.currentOrganization.displayName} 下新建部门`, false, {}, organizationStore.currentOrganization);
};

const updateHandler = () => {
  openDrawer(`编辑 ${organizationStore.currentOrganization.displayName}`, true, organizationStore.currentOrganization, {});
};

const deleteHandler = () => {
  const organization = organizationStore.currentOrganization;
  ElMessageBox.confirm(`确定要删除部门 ${organizationStore.currentOrganization.displayName} 吗？`, '系统提示', {
    type: 'warning',
    showClose: false,
    closeOnClickModal: false,
    closeOnPressEscape: false,
  })
      .then(async () => {
        await organizationStore.deleteOrganization({
          id: organizationStore.currentOrganization.id,
        }).then(async () => {
          organizationStore.currentOrganization = {};
          await organizationStore.getOrganizations();
          ElMessage.success(`已成功删除部门 ${organization['displayName']}`);
        });
      })
      .catch(() => {
      });
};

const displayHandler = () => {
  ElMessageBox.alert(`${organizationStore.currentOrganization.displayName} 的代码是 ${organizationStore.currentOrganization.code}`, '系统提示', {
    type: 'info',
    showClose: false,
    closeOnClickModal: false,
    closeOnPressEscape: false,
  })
      .then(() => {
      })
      .catch(() => {
      });
};

const browseHandler = () => {
  openDrawer(`浏览 ${organizationStore.currentOrganization.displayName}`, true, organizationStore.currentOrganization, {}, true);
};

const upHandler = async () => {
  await organizationStore.up({id: organizationStore.currentOrganization.id});
  await organizationStore.getOrganizations();
  treeRef.value.setCurrentKey(organizationStore.currentOrganization.id);
};

const downHandler = async () => {
  await organizationStore.down({id: organizationStore.currentOrganization.id});
  await organizationStore.getOrganizations();
  treeRef.value.setCurrentKey(organizationStore.currentOrganization.id);
};

const handleDragEnd = async (startNode, endNode, position) => {
  try {
    await organizationStore.moveOrganization({
      id: startNode.data.id,
      newId: endNode.data.id,
      position: position,
    });
  } finally {
    await organizationStore.getOrganizations();
    treeRef.value.setCurrentKey(startNode.data.id);
    organizationStore.currentOrganization = startNode.data;
    await getPaged();
  }
};

onMounted(async () => {
  await organizationStore.getOrganizations();
});
</script>

<template>
  <div class="card main">
    <el-row :gutter="16">
      <el-col :span="6">
        <div class="flow-left mb12">
          <el-button :disabled="!hasPermission('Permission.Organizations.Create')" :icon="EditPen" type="primary"
                     @click="openDrawer('新建根部门')">新建根部门
          </el-button>
        </div>
        <el-tree ref="treeRef" :data="treeData" :default-expand-all="true"
                 :draggable="hasPermission('Permission.Organizations.Move')" :expand-on-click-node="false"
                 :highlight-current="true"
                 :icon="ArrowRightBold" :indent="28" :props="defaultProps"
                 :render-content="renderContent" node-key="id" @node-click="handleNodeClick"
                 @node-contextmenu="handleNodeContextmenu" @current-change="handleCurrentChange"
                 @node-drag-end="handleDragEnd">
          <template #empty>
            <!--            <img :src="empty" alt="暂无数据" class="empty">-->
            <el-empty description="空空如也"></el-empty>
          </template>
          <template #default="scope">
            <div class="mb8 mt8">{{ scope.data.displayName }}（{{ scope.data.memberCount }}）</div>
          </template>
        </el-tree>
      </el-col>
      <el-col :span="18" class="right-box">
        <template v-if="!organizationStore.currentOrganization.displayName">
          <div class="flow-right mb12">
            <el-button :disabled="!hasPermission('Permission.Organizations.Add')"
                       :icon="Plus" style="visibility: hidden;"
                       type="primary">添加成员
            </el-button>
          </div>
          <div class="none">请在左侧选择一个部门</div>
        </template>
        <template v-else>
          <div class="flow-right mb12">
            <div><span>{{ organizationStore.currentOrganization.displayName }}</span> 下的成员</div>
            <div>
              <el-button :disabled="!hasPermission('Permission.Organizations.Add')" :icon="Plus"
                         type="primary"
                         @click="openDialog(`给 ${organizationStore.currentOrganization.displayName} 添加成员`)">添加成员
              </el-button>
              <el-button :disabled="!hasPermission('Permission.Organizations.Remove')" :icon="Delete" :loading="loading"
                         type="danger" @click="batchRemove">批量移除
              </el-button>
            </div>
          </div>
          <el-table ref="tableRef"
                    v-loading="organizationStore.addedLoading"
                    :border="true"
                    :data="organizationStore.addedUsers"
                    :header-cell-style="{'background-color':'var(--el-bg-color-page)'}" :highlight-current-row="false"
                    :show-overflow-tooltip="true"
                    @sort-change="handleSortChange"
                    @filter-change="handleFilterChange">
            <template #empty>
              <!--              <img :src="empty" alt="暂无数据" class="empty">-->
              <el-empty description="空空如也"></el-empty>
            </template>
            <el-table-column fixed="left" type="selection" width="40"></el-table-column>
            <el-table-column align="center" label="操作" width="60">
              <template #default="scope">
                <el-button :disabled="!hasPermission('Permission.Organizations.Remove')" :icon="RemoveFilled"
                           :link="true"
                           title="移除成员" type="danger"
                           @click="singleRemove(scope.row)"></el-button>
              </template>
            </el-table-column>
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
            <el-table-column align="center" label="添加时间" min-width="180" prop="addedTime" sortable="custom"
                             width="180">
              <template #default="scope">
                {{ dayjs(scope.row.addedTime).format('YYYY-MM-DD HH:mm:ss') }}
              </template>
            </el-table-column>
          </el-table>
          <el-pagination v-if="organizationStore.addedUsers.length>0"
                         v-model:current-page="organizationStore.addedCurrentPage"
                         v-model:page-size="organizationStore.addedPageSize"
                         :background="true"
                         :hide-on-single-page="false"
                         :next-icon="ArrowRightBold"
                         :page-sizes="[10,20,30,40,50]" :prev-icon="ArrowLeftBold"
                         :total="organizationStore.addedCount" class="mt12"
                         layout="sizes,total,prev,pager,next,jumper"
                         @change="handleChange"></el-pagination>
        </template>
      </el-col>
    </el-row>
    <OrganizationDrawer ref="drawerRef" @save-success="handleSaveSuccess"></OrganizationDrawer>
    <UserDialog ref="dialogRef" @success="handleSuccess"></UserDialog>
    <ContextMenu :data="treeContextMenu" @browse="browseHandler" @create="createHandler" @delete="deleteHandler"
                 @display="displayHandler" @down="downHandler" @up="upHandler" @update="updateHandler"></ContextMenu>
  </div>
</template>

<style lang="scss" scoped>
@import "./index.scss";
</style>
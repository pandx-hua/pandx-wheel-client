<script setup>

import {ArrowDown, ArrowLeftBold, ArrowRightBold, EditPen, Refresh, Search} from '@element-plus/icons-vue';
import {hasPermission} from '@/utils/wheel';
import {onMounted, ref} from 'vue';
import dayjs from 'dayjs';
import {ElMessage, ElMessageBox} from 'element-plus';
import {useBackgroundJobStore} from '@/stores/modules/backgroundJobs/backgroundJobs';
import LogDrawer from '@/views/Administration/Jobs/components/LogDrawer.vue';
import JobDrawer from '@/views/Administration/Jobs/components/JobDrawer.vue';

const backgroundJobStore = useBackgroundJobStore();
const collapsed = ref(true);
const request = ref({});
const dateRange = ref([]);
const jobRef = ref();
const logRef = ref();
const tableRef = ref();

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
    text: '启用',
    value: true,
  }, {
    text: '停用',
    value: false,
  },
];

const openDrawer = (drawerRef, title, data = {}, isUpdate = false, isBrowse = false) => {
  const params = {
    title,
    isUpdate,
    isBrowse,
    data: {...data},
  };
  drawerRef.value.acceptParams(params);
};

const search = async () => {
  backgroundJobStore.currentPage = 1;
  await getPaged();
};

const reset = async () => {
  request.value.filter = undefined;
  request.value.sorting = undefined;
  request.value.startTime = undefined;
  request.value.endTime = undefined;
  request.value.status = [];
  dateRange.value = [];
  tableRef.value && tableRef.value.clearSort();
  tableRef.value && tableRef.value.clearFilter();
  backgroundJobStore.currentPage = 1;
  await backgroundJobStore.getPagedBackgroundJobs({
    currentPage: backgroundJobStore.currentPage,
    pageSize: backgroundJobStore.pageSize,
  });
};

const handleClear = async () => {
  backgroundJobStore.currentPage = 1;
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
      openDrawer(jobRef, `浏览 ${command.data.jobName}`, command.data, true, true);
      break;
    case 'update':
      openDrawer(jobRef, `编辑 ${command.data.jobName}`, command.data, true);
      break;
    case 'delete':
      ElMessageBox.confirm(`确定要删除定时任务 ${command.data.jobName} 吗？`, '系统提示', {
        type: 'warning',
        showClose: false,
        closeOnClickModal: false,
        closeOnPressEscape: false,
      })
          .then(async () => {
            try {
              await backgroundJobStore.deleteBackgroundJob({
                id: command.data.id,
              });
              await getPaged();
              ElMessage.success(`已成功删定时任务 ${command.data.jobName}`);
            } finally {

            }
          })
          .catch(() => {
          });
      break;
  }
};

const handleChange = async (currentPage, pageSize) => {
  backgroundJobStore.currentPage = currentPage;
  backgroundJobStore.pageSize = pageSize;
  request.value.currentPage = currentPage;
  request.value.pageSize = pageSize;
  await backgroundJobStore.getPagedBackgroundJobs(request.value);
};

const handleSortChange = async (sorting) => {
  if (sorting.column.sortable === 'custom') {
    if (sorting.order === 'descending' || sorting.order === 'ascending') {
      request.value.sorting = sorting.prop + ' ' + sorting.order;
    }
    backgroundJobStore.currentPage = 1;
    await getPaged();
  }
};

const handleFilterChange = async (filters) => {
  const propertyName = Object.keys(filters)[0];
  request.value[propertyName] = filters[propertyName];
  backgroundJobStore.currentPage = 1;
  await getPaged();
};

const getPaged = async () => {
  request.value.currentPage = backgroundJobStore.currentPage;
  request.value.pageSize = backgroundJobStore.pageSize;
  await backgroundJobStore.getPagedBackgroundJobs(request.value);
};

const handleSaveSuccess = async (isUpdate) => {
  if (isUpdate) {
    await getPaged();
  } else {
    backgroundJobStore.currentPage = 1;
    await getPaged();
  }
};

const display = (data) => {
  openDrawer(logRef, '执行日志详情', data);
};

const handleStatusChange = async (data) => {
  try {
    await backgroundJobStore.changeBackgroundJobStatus({
      id: data.id,
      status: data.status,
    });
  } catch {
    data.status = !data.status;
  }
};

const handleClick = () => {
  openDrawer(jobRef, '新建任务');
};

onMounted(async () => {
  backgroundJobStore.currentPage = 1;
  await backgroundJobStore.getPagedBackgroundJobs({
    currentPage: backgroundJobStore.currentPage,
    pageSize: backgroundJobStore.pageSize,
  });
  await backgroundJobStore.getExposedBackgroundJobs();
});
</script>

<template>
  <div class="card main">
    <el-form ref="searchFormRef">
      <el-row :gutter="16" class="mb12">
        <el-col :span="18">
          <div class="float-left">
            <el-button :disabled="!hasPermission('Permission.Jobs.Create')" :icon="EditPen" type="primary"
                       @click="handleClick">新建任务
            </el-button>
          </div>
        </el-col>
        <el-col :span="6">
          <div class="float-right">
            <el-button :disabled="!hasPermission('Permission.Jobs.Search')" :icon="Search" type="default"
                       @click="search">搜索
            </el-button>
            <el-button :disabled="!hasPermission('Permission.Jobs.Search')" :icon="Refresh" type="default"
                       @click="reset">重置
            </el-button>
          </div>
        </el-col>
      </el-row>
      <el-row :gutter="16">
        <el-col :span="12">
          <el-form-item prop="filter">
            <el-input v-model="request.filter" :clearable="true"
                      placeholder="在任务名称、任务描述中搜索"
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
      <!--      </el-collapse-transition>-->
      <!--      <el-button type="primary" :link="true" @click="collapsed=!collapsed" class="mb12">-->
      <!--        <el-icon class="el-icon&#45;&#45;left">-->
      <!--          <component :is="collapsed?ArrowDown:ArrowUp"></component>-->
      <!--        </el-icon>-->
      <!--        {{ collapsed ? '显示高级搜索' : '隐藏高级搜索' }}-->
      <!--      </el-button>-->
    </el-form>
    <el-table ref="tableRef"
              v-loading="backgroundJobStore.getPagedLoading"
              :border="true"
              :data="backgroundJobStore.pagedBackgroundJobs"
              :header-cell-style="{'background-color':'var(--el-bg-color-page)'}" :highlight-current-row="false"
              :show-overflow-tooltip="true"
              @sort-change="handleSortChange"
              @filter-change="handleFilterChange">
      <template #empty>
        <!--        <img :src="empty" alt="暂无数据" class="empty">-->
        <el-empty description="空空如也"></el-empty>
      </template>
      <el-table-column align="center" fixed="left" label="详情" width="60">
        <template #default="scope">
          <el-tooltip content="执行日志详情" placement="top">
            <el-button :disabled="!hasPermission('Permission.Jobs.Detail')" :icon="Search" :link="true"
                       type="primary" @click="display(scope.row)"></el-button>
          </el-tooltip>
        </template>
      </el-table-column>
      <el-table-column align="center" label="任务名称" min-width="200" prop="jobName" sortable="custom"
                       width="200"></el-table-column>
      <el-table-column :filters="filters" align="center" column-key="status" label="状态" min-width="80" prop="status"
                       width="80">
        <template #default="scope">
          <el-switch v-model="scope.row.status" :disabled="!hasPermission('Permission.Jobs.Change')"
                     active-color="#67c23a"
                     active-text="启用" inactive-color="#f56c6c" inactive-text="停用" inline-prompt
                     size="default"
                     @change="handleStatusChange(scope.row)"></el-switch>
        </template>
      </el-table-column>
      <el-table-column align="center" label="任务动作" min-width="200" prop="job" sortable="custom"
                       width="200">
        <template #default="scope">
          {{
            backgroundJobStore.exposedBackgroundJobs.find(i => i.key === scope.row.job) && backgroundJobStore.exposedBackgroundJobs.find(i => i.key === scope.row.job).value
          }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="CRON表达式" min-width="160" prop="cronExpression" sortable="custom"
                       width=160>
      </el-table-column>
      <el-table-column align="center" label="任务描述" min-width="200" prop="description">
      </el-table-column>
      <el-table-column align="center" label="成功" min-width="80" prop="successCount" sortable="custom" width="80">
      </el-table-column>
      <el-table-column align="center" label="失败" min-width="80" prop="failCount" sortable="custom" width="80">
      </el-table-column>
      <el-table-column align="center" label="最后运行时间" min-width="180" prop="lastRunTime" sortable="custom"
                       width="180">
        <template #default="scope">
          {{ scope.row.lastRunTime ? dayjs(scope.row.lastRunTime).format('YYYY-MM-DD HH:mm:ss') : '' }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="下次运行时间" min-width="180" prop="nextRunTime" sortable="custom"
                       width="180">
        <template #default="scope">
          {{ scope.row.nextRunTime ? dayjs(scope.row.nextRunTime).format('YYYY-MM-DD HH:mm:ss') : '' }}
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
                                  :disabled="!hasPermission('Permission.Jobs.Browse')">浏览
                </el-dropdown-item>
                <el-dropdown-item :command="{data:scope.row,name:'update'}"
                                  :disabled="!hasPermission('Permission.Jobs.Update')"
                                  :divided="true">编辑
                </el-dropdown-item>
                <el-dropdown-item :command="{data:scope.row,name:'delete'}"
                                  :disabled="!hasPermission('Permission.Jobs.Delete')">删除
                </el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination v-if="backgroundJobStore.pagedBackgroundJobs.length>0"
                   v-model:current-page="backgroundJobStore.currentPage" v-model:page-size="backgroundJobStore.pageSize"
                   :background="true" :hide-on-single-page="false"
                   :next-icon="ArrowRightBold"
                   :page-sizes="[10,20,30,40,50]" :prev-icon="ArrowLeftBold"
                   :total="backgroundJobStore.totalCount" class="mt12"
                   layout="sizes,total,prev,pager,next,jumper"
                   @change="handleChange"></el-pagination>
    <JobDrawer ref="jobRef" @save-success="handleSaveSuccess"></JobDrawer>
    <LogDrawer ref="logRef"></LogDrawer>
  </div>
</template>
<style lang="scss" scoped>
@import "./index.scss";
</style>
<script setup>

import {useAuditingStore} from '@/stores/modules/auditing/auditing';
import {onMounted, ref} from 'vue';
import {hasPermission} from '@/utils/wheel';
import {
  ArrowDown,
  ArrowLeftBold,
  ArrowRightBold,
  ArrowUp,
  Download,
  Refresh,
  Search,
  SuccessFilled,
  WarningFilled,
} from '@element-plus/icons-vue';
import dayjs from 'dayjs';
import AuditingDrawer from '@/views/Administration/Auditing/components/AuditingDrawer.vue';
import {useFileStore} from '@/stores/modules/files/files';
import {$downloadFileFromCache} from '@/services/modules/files';
import {downloadWithToken} from '@/utils/download';

const auditingStore = useAuditingStore();
const fileStore = useFileStore();
const collapsed = ref(true);
const request = ref({});
const dateRange = ref([]);
const drawerRef = ref();
const tableRef = ref();
const loading = ref(false);
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
    text: '成功',
    value: false,
  }, {
    text: '失败',
    value: true,
  },
];

const openDrawer = (title, data = {}) => {
  const params = {
    title: title,
    data: {...data},
  };
  drawerRef.value.acceptParams(params);
};

const exportAuditing = async () => {
  loading.value = true;
  try {
    await auditingStore.getAuditingToExcel(request.value);
    await downloadWithToken($downloadFileFromCache, auditingStore.cachedFile.name, auditingStore.cachedFile.type, auditingStore.cachedFile);
  } finally {
    loading.value = false;
  }
};

const search = async () => {
  auditingStore.currentPage = 1;
  await getPaged();
};

const reset = async () => {
  request.value.userName = undefined;
  request.value.controller = undefined;
  request.value.action = undefined;
  request.value.sorting = undefined;
  request.value.startTime = undefined;
  request.value.endTime = undefined;
  request.value.clientIpAddress = undefined;
  request.value.hasException = [];
  dateRange.value = [];
  tableRef.value && tableRef.value.clearSort();
  tableRef.value && tableRef.value.clearFilter();
  auditingStore.currentPage = 1;
  await auditingStore.getPagedAuditing({
    currentPage: auditingStore.currentPage,
    pageSize: auditingStore.pageSize,
  });
};

const handleClear = async () => {
  auditingStore.currentPage = 1;
  await getPaged();
};

const dateChange = async (date) => {
  if (date) {
    request.value.startTime = date[0];
    request.value.endTime = date[1];
  } else {
    request.value.startTime = undefined;
    request.value.endTime = undefined;
    auditingStore.currentPage = 1;
    await getPaged();
  }
};

const handleChange = async (currentPage, pageSize) => {
  auditingStore.currentPage = currentPage;
  auditingStore.pageSize = pageSize;
  request.value.currentPage = currentPage;
  request.value.pageSize = pageSize;
  await auditingStore.getPagedAuditing(request.value);
};

const handleSortChange = async (sorting) => {
  if (sorting.column.sortable === 'custom') {
    if (sorting.order === 'descending' || sorting.order === 'ascending') {
      request.value.sorting = sorting.prop + ' ' + sorting.order;
    }
    auditingStore.currentPage = 1;
    await getPaged();
  }
};

const handleFilterChange = async (filters) => {
  const propertyName = Object.keys(filters)[0];
  request.value[propertyName] = filters[propertyName];
  auditingStore.currentPage = 1;
  await getPaged();
};

const getPaged = async () => {
  request.value.currentPage = auditingStore.currentPage;
  request.value.pageSize = auditingStore.pageSize;
  await auditingStore.getPagedAuditing(request.value);
};

const display = (data) => {
  openDrawer('审计日志详情', data);
};

onMounted(async () => {
  auditingStore.currentPage = 1;
  await auditingStore.getPagedAuditing({
    currentPage: auditingStore.currentPage,
    pageSize: auditingStore.pageSize,
  });
});
</script>

<template>
  <div class="card main">
    <el-form ref="searchFormRef">
      <el-row :gutter="16" class="mb12">
        <el-col :span="18">
          <div class="float-left">
            <el-button :disabled="!hasPermission('Permission.Auditing.Export')" :icon="Download" :loading="loading"
                       :plain="true"
                       type="primary" @click="exportAuditing">导出审计日志
            </el-button>
          </div>
        </el-col>
        <el-col :span="6">
          <div class="float-right">
            <el-button :disabled="!hasPermission('Permission.Auditing.Search')" :icon="Search" type="default"
                       @click="search">搜索
            </el-button>
            <el-button :disabled="!hasPermission('Permission.Auditing.Search')" :icon="Refresh" type="default"
                       @click="reset">重置
            </el-button>
          </div>
        </el-col>
      </el-row>
      <el-row :gutter="16">
        <el-col :span="12">
          <el-tooltip content="选择执行时间范围"
                      placement="top">
            <el-form-item prop="time">
              <el-date-picker v-model=dateRange :clearable="true" :editable="false" :shortcuts="shortcuts"
                              end-placeholder="结束时间"
                              format="YYYY-MM-DD" range-separator="至" start-placeholder="开始时间"
                              type="daterange" @change="dateChange" @clear="handleClear"></el-date-picker>
            </el-form-item>
          </el-tooltip>
        </el-col>
        <el-col :span="12">
          <el-form-item prop="userName">
            <el-input v-model="request.userName" :clearable="true"
                      placeholder="账号"
                      @clear="handleClear"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-collapse-transition>
        <el-row v-if="!collapsed" :gutter="16">
          <el-col :span="8">
            <el-form-item prop="controller">
              <el-input v-model="request.controller" :clearable="true"
                        placeholder="控制器"
                        @clear="handleClear"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item prop="action">
              <el-input v-model="request.action" :clearable="true"
                        placeholder="方法"
                        @clear="handleClear"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item prop="controller">
              <el-input v-model="request.clientIpAddress" :clearable="true"
                        placeholder="IP地址"
                        @clear="handleClear"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
      </el-collapse-transition>
      <el-button :link="true" class="mb12" type="primary" @click="collapsed=!collapsed">
        <el-icon class="el-icon--left">
          <component :is="collapsed?ArrowDown:ArrowUp"></component>
        </el-icon>
        {{ collapsed ? '显示高级搜索' : '隐藏高级搜索' }}
      </el-button>
    </el-form>
    <el-table ref="tableRef"
              v-loading="auditingStore.loading"
              :border="true"
              :data="auditingStore.pagedAuditing"
              :header-cell-style="{'background-color':'var(--el-bg-color-page)'}" :highlight-current-row="false"
              :show-overflow-tooltip="true" @sort-change="handleSortChange"
              @filter-change="handleFilterChange">
      <template #empty>
        <!--        <img :src="empty" alt="暂无数据" class="empty">-->
        <el-empty description="空空如也"></el-empty>
      </template>
      <el-table-column fixed="left" type="expand" width="40">
        <template #default="scope">
          <el-row :gutter="16" class="expanded-box">
            <el-col :span="24"><span class="title">浏览器：</span>{{ scope.row.browserInfo }}</el-col>
          </el-row>
        </template>
      </el-table-column>
      <el-table-column align="center" fixed="left" label="详情" width="60">
        <template #default="scope">
          <el-tooltip content="审计日志详情" placement="top">
            <el-button :disabled="!hasPermission('Permission.Auditing.Detail')" :icon="Search" :link="true"
                       title="审计日志详情" type="primary"
                       @click="display(scope.row)"></el-button>
          </el-tooltip>
        </template>
      </el-table-column>
      <el-table-column :filters="filters" align="center" column-key="hasException" label="状态" min-width="70"
                       prop="hasException"
                       width="70">
        <template #default="scope">
          <el-icon v-if="!scope.row.hasException" color="#67C23A">
            <SuccessFilled></SuccessFilled>
          </el-icon>
          <el-icon v-if="scope.row.hasException" color="#E6A23C">
            <WarningFilled></WarningFilled>
          </el-icon>
        </template>
      </el-table-column>
      <el-table-column align="center" label="执行时间" min-width="180" prop="executionTime" sortable="custom"
                       width="180">
        <template #default="scope">
          {{ dayjs(scope.row.creationTime).format('YYYY-MM-DD HH:mm:ss') }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="账号" min-width="100" prop="userName" sortable="custom"
                       width="140"></el-table-column>
      <el-table-column align="center" label="控制器" min-width="200" prop="controller" sortable="custom"
                       width="240"></el-table-column>
      <el-table-column align="center" label="方法" min-width="120" prop="action" sortable="custom"
      ></el-table-column>
      <el-table-column align="center" label="持续时间" min-width="100" prop="executionDuration" sortable="custom"
                       width="140">
        <template #default="scope">
          {{ scope.row.executionDuration }}ms
        </template>
      </el-table-column>
      <el-table-column align="center" label="客户端" min-width="100" prop="clientName" sortable="custom"
                       width="140"></el-table-column>
      <el-table-column align="center" label="IP地址" min-width="100" prop="clientIpAddress" sortable="custom"
                       width="180"></el-table-column>
    </el-table>
    <el-pagination v-if="auditingStore.pagedAuditing.length>0" v-model:current-page="auditingStore.currentPage"
                   v-model:page-size="auditingStore.pageSize"
                   :background="true" :hide-on-single-page="false"
                   :next-icon="ArrowRightBold"
                   :page-sizes="[10,20,30,40,50]" :prev-icon="ArrowLeftBold"
                   :total="auditingStore.totalCount"
                   class="mt12" layout="sizes,total,prev,pager,next,jumper"
                   @change="handleChange"></el-pagination>
    <AuditingDrawer ref="drawerRef"></AuditingDrawer>
  </div>
</template>

<style lang="scss" scoped>
@import "./index.scss";
</style>
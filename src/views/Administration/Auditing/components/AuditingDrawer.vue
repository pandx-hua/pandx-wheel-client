<script setup>

import {ref} from 'vue';
import {SuccessFilled, WarningFilled} from '@element-plus/icons-vue';

const visible = ref(false);
const props = ref({
  title: '',
  data: {},
});

const acceptParams = (params) => {
  props.value = params;
  visible.value = true;
};

const getFormattedParams = (parameters) => {
  try {
    const json = JSON.parse(parameters);
    return JSON.stringify(json, null, 4);
  } catch (e) {
    return parameters;
  }
};

defineExpose({
  acceptParams,
});
</script>

<template>
  <el-drawer v-model="visible" :title="props.title" size="50%">
    <el-divider class="divider" content-position="center">
      用户信息
    </el-divider>
    <div>
      <el-row :gutter="10">
        <el-col :span="3" class="key">账号：</el-col>
        <el-col :span="21" class="value">{{ props.data.userName }}</el-col>
      </el-row>
      <el-row :gutter="10">
        <el-col :span="3" class="key">IP地址：</el-col>
        <el-col :span="21" class="value">{{ props.data.clientIpAddress }}</el-col>
      </el-row>
      <el-row :gutter="10">
        <el-col :span="3" class="key">客户端：</el-col>
        <el-col :span="21" class="value">{{ props.data.clientName }}</el-col>
      </el-row>
      <el-row :gutter="10">
        <el-col :span="3" class="key">浏览器：</el-col>
        <el-col :span="21" class="value">{{ props.data.browserInfo }}</el-col>
      </el-row>
    </div>
    <el-divider class="divider" content-position="center">
      操作信息
    </el-divider>
    <div>
      <el-row :gutter="10">
        <el-col :span="3" class="key">控制器：</el-col>
        <el-col :span="21" class="value">{{ props.data.controller }}</el-col>
      </el-row>
      <el-row :gutter="10">
        <el-col :span="3" class="key">方法：</el-col>
        <el-col :span="21" class="value">{{ props.data.action }}</el-col>
      </el-row>
      <el-row :gutter="10">
        <el-col :span="3" class="key">执行时间：</el-col>
        <el-col :span="21" class="value">{{ props.data.executionTime }}</el-col>
      </el-row>
      <el-row :gutter="10">
        <el-col :span="3" class="key">持续时间：</el-col>
        <el-col :span="21" class="value">{{ props.data.executionDuration }}ms</el-col>
      </el-row>
      <el-row :gutter="10">
        <el-col :span="3" class="key">参数：</el-col>
        <el-col :span="21" class="value">
          <div class="data-box">
            <pre lang="js">{{ getFormattedParams(props.data.parameters) }}</pre>
          </div>
        </el-col>
      </el-row>
    </div>
    <el-divider class="divider" content-position="center">
      执行状态
    </el-divider>
    <el-row :gutter="10">
      <el-col :span="24" class="value">
        <template v-if="!props.data.hasException">
          <div class="little-box">
            <el-icon color="#67c23a">
              <SuccessFilled/>
            </el-icon>
            <span style="margin-left:8px;">成功</span>
          </div>
        </template>
        <template v-else>
          <div class="little-box">
            <el-icon color="#e6a23c">
              <WarningFilled/>
            </el-icon>
            <span style="margin-left:8px;">失败</span>
          </div>
          <div class="data-box mt10">
            <pre lang="js">{{ getFormattedParams(props.data.exception) }}</pre>
          </div>
        </template>
      </el-col>
    </el-row>
    <template v-if="props.data.returnValue">
      <el-divider class="divider" content-position="center">
        返回结果
      </el-divider>
      <div class="data-box">
        <pre>{{ getFormattedParams(props.data.returnValue) }}</pre>
      </div>
    </template>
  </el-drawer>
</template>

<style lang="scss" scoped>
.key {
  text-align: right;
  font-weight: bolder;
  font-size: 14px;
  color: var(--el-text-color-regular);
}

.value {
  text-align: left;
  font-size: 14px;
  color: var(--el-text-color-regular);
}

.data-box {
  width: 100%;
  border: 1px solid var(--el-border-color-light);
  border-radius: var(--el-border-radius-base);
  background-color: var(--el-bg-color-page);
  padding: 2px;
  overflow: auto;
  font-size: 12px;
  color: var(--el-text-color-regular);
}

.little-box {
  margin-left: 40px;
  display: flex;
  align-items: center;
}
</style>
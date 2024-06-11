<script setup>

import alipay from '@/assets/images/alipay.jpg';
import weixin from '@/assets/images/weixin.jpg';
</script>

<template>
  <div class="home card">
    <div>
    <el-alert :closable="false" title="注意：演示数据库每隔10分钟还原为初始状态，演示版ADMIN用户与ADMIN角色无法删除和更新，如需体验，请新建用户或角色"
              type="warning"></el-alert>
    <el-card class="mt16" shadow="hover">
      <template #header>
        <span style="font-size:18px;"><strong><i>pandx.Wheel</i></strong> 简介</span>
      </template>
      <div style="line-height:1.6;">
        <strong><i>pandx.Wheel</i></strong> 是一个开源的WEB应用快速开发框架，它基于领域驱动设计（Domain Driven
        Design，DDD）开发，构建于最新的.NET 8.0之上。当前版本，<strong><i>pandx.Wheel</i></strong>
        是单体单租户的，但我们有计划在不久的将来，开源单体多租户及微服务多租户版本。在快速开发框架之外，<strong><i>pandx.Wheel</i></strong>
        提供了一个健壮的启动模板。启动模板是前后端分离的，其中前端基于Vue3（JavaScript + Element
        Plus）技术栈。启动模板包含了WEB应用开发常用的模块且在持续进化中，当前包含用户、角色、权限、部门、维护、日志、定时任务等。使用
        <strong><i>pandx.Wheel</i></strong> 提供的启动模版，您可以在不改动任何模板代码的情况下，快速开始编写您的业务代码。
      </div>
      <div>前端界面修改自<el-link type="primary" target="_blank" href="https://docs.spicyboy.cn/">Geeker-Admin</el-link>，在此对原项目作者表示感谢！</div>
    </el-card>
    <el-card class="mt16 mb16" shadow="hover">
      <el-row :gutter="20">
        <el-col :span="2" class="key">官方网站：</el-col>
        <el-col :span="10" class="value">
          <el-link href="http://www.pandx.com.cn" target="_blank" type="primary">http://www.pandx.com.cn</el-link>
        </el-col>
        <el-col :span="2" class="key">演示网站：</el-col>
        <el-col :span="10" class="value">
          <el-link href="http://120.53.120.184:8082" target="_blank" type="primary">http://120.53.120.184:8082</el-link>
        </el-col>
      </el-row>
      <el-divider></el-divider>
      <el-row :gutter="20">
        <el-col :span="2" class="key">GitHub：</el-col>
        <el-col :span="10" class="value">
          <el-link href="https://www.github.com/pandx-hua/pandx-wheel-server" target="_blank" type="primary">
            https://www.github.com/pandx-hua/pandx-wheel-server（后端）
          </el-link>
        </el-col>
        <el-col :span="2" class="key">GitHub：</el-col>
        <el-col :span="10" class="value">
          <el-link href="https://www.github.com/pandx-hua/pandx-wheel-client" target="_blank" type="primary">
            https://www.github.com/pandx-hua/pandx-wheel-client（前端）
          </el-link>
        </el-col>
      </el-row>
      <el-divider></el-divider>
      <el-row :gutter="20">
        <el-col :span="2" class="key">Gitee：</el-col>
        <el-col :span="10" class="value">
          <el-link href="https://www.gitee.com/pandx-hua/pandx-wheel-server" target="_blank" type="primary">
            https://www.gitee.com/pandx-hua/pandx-wheel-server（后端）
          </el-link>
        </el-col>
        <el-col :span="2" class="key">Gitee：</el-col>
        <el-col :span="10" class="value">
          <el-link href="https://www.gitee.com/pandx-hua/pandx-wheel-client" target="_blank" type="primary">
            https://www.gitee.com/pandx-hua/pandx-wheel-client（前端）
          </el-link>
        </el-col>
      </el-row>
      <el-divider></el-divider>
      <el-row :gutter="20">
        <el-col :span="2" class="key">QQ群：</el-col>
        <el-col :span="10" class="value">972528993</el-col>
      </el-row>
    </el-card>
    <el-card shadow="hover">
      <template #header>
        如果您觉得 <strong><i>pandx.Wheel</i></strong> 对您有所帮助，您可以通过以下方式支持我们：
      </template>
      <el-row :gutter="20">
        <el-col :span="2" class="key">微信：</el-col>
        <el-col :span="10" class="value">
          <el-image :src="weixin" fit="cover"></el-image>
        </el-col>
        <el-col :span="2" class="key">支付宝：</el-col>
        <el-col :span="10" class="value">
          <el-image :src="alipay" fit="cover"></el-image>
        </el-col>
      </el-row>
    </el-card>
    </div>
  </div>

</template>

<style lang="scss" scoped>
@import "./index.scss";
</style>

<script setup>

import {ArrowRightBold} from '@element-plus/icons-vue';
import {ref} from 'vue';

const props = defineProps({
  selected: {type: Array, default: () => []},
  defaultProps: {type: Object, default: undefined},
  data: {type: Array, default: () => []},
  renderContent: {type: Function, default: undefined},
  nodeKey: {type: String, default: ''},
  checkStrictly: {type: Boolean, default: false},
  checkOnClickNode: {type: Boolean, default: false},
  expandOnClickNode: {type: Boolean, default: true},
  defaultCheckedKeys: {type: Array, default: () => []},
  defaultExpandAll: {type: Boolean, default: true},
  tagShow: {type: Boolean, default: true},
  tagType: {type: String, default: 'info'},
  disabled: {type: Boolean, default: false},
  displayProperty: String,
});
const emits = defineEmits(['update:selected']);
const treeRef = ref();
const handleCheck = (current, checked) => {
  const {checkedNodes, checkedKeys, halfCheckedNodes, halfCheckedKeys} = checked;
  if (props.checkStrictly) {
    emits('update:selected', checkedNodes);
  } else {
    emits('update:selected', halfCheckedNodes.concat(checkedNodes).sort(i => i.level));
  }
};
const setCheckedKeys = (keys) => {
  if (!props.disabled) {
    treeRef.value && treeRef.value.setCheckedKeys(keys);
  }
};
defineExpose({
  setCheckedKeys,
});
const handleClose = (item) => {
  const temp = props.selected.filter(i => item[props.nodeKey] !== i[props.nodeKey]);
  emits('update:selected', temp);
  if (!props.disabled) {
    treeRef.value && treeRef.value.setCheckedNodes(temp);
  }
};
</script>

<template>
  <template v-if="tagShow">
    <div class="mb4 over">
      <el-tag class="mr6 mb4" size="small" type="info">已选</el-tag>
      <el-tag v-if="!selected.length" class="mr6 mb4" effect="plain" size="small" type="info"></el-tag>
      <el-tag v-for="item in selected" v-else :key="item[props.nodeKey]" :closable="!props.disabled"
              :type="props.tagType"
              class="mr6 mb4"
              effect="plain" size="small" @close="handleClose(item)">
        {{ item[props.displayProperty] }}
      </el-tag>
    </div>
  </template>
  <div v-if="!props.disabled">
    <el-tree ref="treeRef"
             :check-on-click-node="props.checkOnClickNode"
             :check-strictly="props.checkStrictly"
             :data="props.data"
             :default-checked-keys="defaultCheckedKeys"
             :default-expand-all="defaultExpandAll"
             :expand-on-click-node="props.expandOnClickNode"
             :highlight-current="false"
             :icon="ArrowRightBold"
             :indent="24"
             :node-key="props.nodeKey"
             :props="props.defaultProps"
             :render-content="props.renderContent"
             :show-checkbox="true"
             @check="handleCheck">
      <template #empty>
        <el-empty description="空空如也"></el-empty>
        <!--        <img :src="empty" alt="暂无数据" class="empty">-->
      </template>
    </el-tree>
  </div>
</template>

<style lang="scss" scoped>
.over {
  overflow-x: scroll;
  line-height: 26px;
  white-space: nowrap;
}
</style>
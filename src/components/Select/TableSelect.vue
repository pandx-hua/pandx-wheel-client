<script setup>

import {computed, nextTick, ref, watch} from 'vue';
import {ArrowLeftBold, ArrowRightBold, Search} from '@element-plus/icons-vue';

const props = defineProps({
  selected: {type: Array, default: () => []},
  columns: {type: Array, default: () => []},
  items: {type: Array, default: () => []},
  totalCount: {type: Number, default: 0},
  tagShow: {type: Boolean, default: false},
  tagType: {type: String, default: 'info'},
  placeholder: String,
  displayProperty: String,
  pageSize: {type: Number, default: 10},
  loading: {type: Boolean, default: false},
  expandColumn: {type: Function, default: undefined},
  multiSelect: {type: Boolean, default: true},
  disabled: {type: Boolean, default: false},
});
const emits = defineEmits(['change', 'update:selected']);

const tableRef = ref();
const request = ref({});


const selectedItems = computed(() => {
  props.items.map(i => {
    i._selected = props.selected.some(j => i.id === j.id);
  });
  return props.items;
});
const handleClose = (item) => {
  if (props.multiSelect) {
    const temp = props.selected.filter(i => item.id !== i.id);
    emits('update:selected', temp);
    tableRef.value && tableRef.value.toggleRowSelection(item, false);

  } else {
    emits('update:selected', []);
    tableRef.value && tableRef.value.setCurrentRow();
  }
};
const handleChange = (currentPage, pageSize) => {
  request.value.pageSize = pageSize;
  request.value.currentPage = currentPage;
  emits('change', request.value);
};
const handleSelect = (selection, row) => {
  if (row._selected) {
    emits('update:selected', props.selected.filter(i => row.id !== i.id));
  } else {
    emits('update:selected', props.selected.concat(selection.filter(i => !props.selected.some(j => j.id === i.id))));
  }
};
const handleSelectAll = (selection) => {
  if (selection.length) {
    emits('update:selected', props.selected.concat(selection.filter(i => !props.selected.some(j => j.id === i.id))));
  } else {
    emits('update:selected', props.selected.filter(i => !props.items.some(j => j.id === i.id)));
  }
};

const handleRowClick = (row) => {
  if (props.disabled) return;
  if (props.multiSelect) {
    if (row._selected) {
      emits('update:selected', props.selected.filter(i => row.id !== i.id));
    } else {
      props.selected.push(row);
      emits('update:selected', props.selected);
    }
    tableRef.value && tableRef.value.toggleRowSelection(row);
  } else {
    emits('update:selected', [row]);
  }
};
const handleSortChange = (_sorting) => {
  if (_sorting.column.sortable === 'custom') {
    if (_sorting.order === 'descending' || _sorting.order === 'ascending') {
      request.value.sorting = _sorting.prop + ' ' + _sorting.order;
    }
    request.value.pageSize = props.pageSize;
    request.value.currentPage = 1;
    // request.value.connectionId=props.value.connectId;
    // emitChange(request.value);
    emits('change', request.value);
  }
};
const handleFilterChange = (filters) => {
  const propertyName = Object.keys(filters)[0];
  request.value[propertyName] = filters[propertyName];
  request.value.pageSize = props.pageSize;
  request.value.currentPage = 1;
  // request.value.connectionId=props.value.connectId;
  // emitChange(request.value);
  emits('change', request.value);
};

const handleClear = () => {
  request.value.pageSize = props.pageSize;
  request.value.currentPage = 1;
  // request.value.connectionId=props.value.connectId;
  // emitChange(request.value);
  emits('change', request.value);
};
const handleClick = () => {
  request.value.pageSize = props.pageSize;
  request.value.currentPage = 1;
  // request.value.connectionId=props.value.connectId;
  // emitChange(request.value);
  emits('change', request.value);
};

const reset = () => {
  request.value.sorting = undefined;
  request.value.filter = undefined;
  request.value.pageSize = props.pageSize;
  request.value.currentPage = 1;
  // request.value.connectionId=null;
  // emits('change', request.value);
};

watch(() => props.items, (_) => {
  props.items.forEach(i => {
    if (props.selected && props.selected.some(j => j.id === i.id)) {
      const index = props.selected.findIndex(j => j.id === i.id);
      props.selected.splice(index, 1, i);
    }
    nextTick(() => {
      tableRef.value && tableRef.value.toggleRowSelection(i, i._selected);
    });
  });
}, {immediate: true});

// const emitChange=(params)=>{
//   if(props.value.optional){
//     for(const temp of props.value.optional){
//       params[temp.key]=temp.value;
//     }
//   }
//   emits('change',params);
// };
const fuse = () => {
  request.value.pageSize = props.pageSize;
  request.value.currentPage = 1;
  emits('change', request.value);
};

const handleKeyDown = (event) => {
  if (event.keyCode === 13) {
    request.value.pageSize = props.pageSize;
    request.value.currentPage = 1;
    // request.value.connectionId=props.value.connectId;
    // emitChange(request.value);
    emits('change', request.value);
  }
};
defineExpose({
  reset, emits, fuse,
});
</script>

<template>
  <template v-if="tagShow">
    <div class="mb4 over">
      <el-tag class="mr6 mb4" size="small" type="info">已选</el-tag>
      <el-tag v-if="!selected.length" class="mr6 mb4" effect="plain" size="small" type="info"></el-tag>
      <el-tag v-for="item in selected" v-else :key="item.id" :closable="!props.disabled" :type="props.tagType" class="mr6 mb4"
              effect="plain" size="small" @close="handleClose(item)">
        {{ item[props.displayProperty] }}
      </el-tag>
    </div>
  </template>
  <div v-if="!props.disabled">
    <el-form ref="queryForm" class="mb10">
      <el-input v-model="request.filter" :clearable="true" :placeholder="placeholder" @clear="handleClear"
                @keydown.enter.prevent="handleKeyDown($event)">
        <template #suffix>
          <el-button :icon="Search" :link="true" @click="handleClick"></el-button>
        </template>
      </el-input>
    </el-form>
    <el-table ref="tableRef" v-loading="props.loading"
              :border="true"
              :data="selectedItems"
              :header-cell-style="{'background-color':'var(--el-bg-color-page)'}"
              :highlight-current-row="!multiSelect"
              :row-key="(row)=>row.id"
              :show-overflow-tooltip="true"
              @select="handleSelect"
              @select-all="handleSelectAll"
              @row-click="handleRowClick"
              @sort-change="handleSortChange"
              @filter-change="handleFilterChange">
      <template #empty>
        <!--        <img :src="empty" alt="暂无数据" class="empty">-->
        <el-empty description="空空如也"></el-empty>
      </template>
      <el-table-column v-if="multiSelect" :resource="true" fixed="left" type="selection" width="40"></el-table-column>
      <el-table-column v-if="expandColumn" type="expand" width="40">
        <template #default="scope">
          <component :is="expandColumn" v-if="expandColumn" v-bind="scope"></component>
        </template>
      </el-table-column>
      <el-table-column v-for="item in columns"
                       :key="item.prop"
                       :align="item.align"
                       :column-key="item.columnKey"
                       :filters="item.filters"
                       :fixed="item.fixed"
                       :formatter="item.formatter"
                       :label="item.label"
                       :min-width="item.minWidth"
                       :prop="item.prop"
                       :sortable="item.sortable"
                       :width="item.width">
        <template #default="scope">
          <component :is="item.render" v-if="item.render" v-bind="scope"></component>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination v-if="items.length>0" v-model:current-page="request.currentPage" v-model:page-size="request.pageSize"
                   :background="true" :hide-on-single-page="false" :next-icon="ArrowRightBold"
                   :page-sizes="[10,20,30,40,50]" :prev-icon="ArrowLeftBold"
                   :small="false" :total="totalCount"
                   class="mt12" layout="total,prev,pager,next,jumper"
                   @change="handleChange"></el-pagination>
  </div>
</template>

<style lang="scss" scoped>
.over {
  overflow-x: scroll;
  line-height: 26px;
  white-space: nowrap;
}

:deep(.current-row) {
  .el-table__cell {
    background-color: var(--el-color-primary) !important;
    color: var(--el-color-white)
  }
}
</style>
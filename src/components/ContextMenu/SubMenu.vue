<script setup>
const props = defineProps({
  float: {type: String, default: ''},
  items: {type: Array, default: () => []},
});
const emits = defineEmits(['itemHandler']);
const handler = (item) => {
  emits('itemHandler', item);
};
</script>

<template>
  <ul :class="float" class="i-ul-wrapper">
    <li v-for="item in props.items" :key="item.name" :class="{'divided':item.divided}" class="i-li-wrapper">
      <div v-if="item.children && item.children.length>0" :class="{'background':!(item.disabled?item.disabled:false)}"
           class="has-child">
        <div :class="{'disabled':item.disabled?item.disabled:false}" class="btn-wrapper">
          <span :class="item.icon?item.icon:''" class="left-icon iconfont"></span>
          <span class="btn">{{ item.button }}</span>
          <span class="right-icon iconfont icon-right"></span>
        </div>
        <SubMenu :float="props.float" :items="item.children" @item-handler="handler"></SubMenu>
      </div>
      <div v-else :class="{'background':!(item.disabled?item.disabled:false)}">
        <div :class="{'disabled':item.disabled?item.disabled:false}" class="btn-wrapper"
             @click.stop="item.disabled?'':handler(item)">
          <span :class="item.icon?item.icon:''" class="left-icon iconfont"></span>
          <span class="btn">{{ item.button }}</span>
        </div>
      </div>
    </li>
  </ul>
</template>

<style lang="scss" scoped>
.float-1 {
  left: 100%;
  bottom: -1px;
  z-index: 10001;
}

.float-2 {
  left: 100%;
  top: -1px;
  //margin-left:2px;
  z-index: 10001
}

.float-3 {
  right: 100%;
  top: -1px;
  //margin-right:2px;
  z-index: 10001
}

.float-4 {
  right: 100%;
  bottom: -1px;
  z-index: 10001
}

.i-ul-wrapper {
  width: 130px;
  background: var(--el-bg-color);
  position: absolute;
  display: none;
  border: 1px solid var(--el-border-color-light);
  border-radius: var(--el-border-radius-base);
  font-size: 14px;
  color: var(--el-text-color-regular);
  box-shadow: var(--el-box-shadow-light);

  .background:hover {
    background: var(--el-color-primary-light-9);
  }

  .divided {
    border-bottom: 1px solid var(--el-border-color-light);
    padding-bottom: 6px;

    + li {
      margin-top: 6px;
    }
  }

  .i-li-wrapper {
    > div {
      padding: 3px 0;
    }

    position: relative;
    background: var(--el-bg-color);
    text-decoration: none;
    list-style: none;
    //margin: 3px 0;
    &:hover {
      //background: var(--el-color-primary-light-9);
      cursor: pointer;
      color: var(--el-color-primary);

      > .has-child {
        .btn-wrapper {
          position: relative;
          height: 30px;
          line-height: 30px;

          .left-icon {
            display: inline-block;
            margin-left: 8px;
            position: relative;
            top: 2px;
          }

          .right-icon {
            position: absolute;
            right: 2px;
          }

          .btn {
            margin: 0 8px;
            height: 30px;
            line-height: 30px;
            display: inline-block;

          }
        }

        > :deep(.i-ul-wrapper) {
          display: block;
        }
      }
    }

    .has-child {
      position: relative;
    }

    .btn-wrapper {
      position: relative;
      height: 30px;
      line-height: 30px;

      .left-icon {
        display: inline-block;
        margin-left: 8px;
        position: relative;
        top: 2px;
      }

      .right-icon {
        position: absolute;
        right: 2px;
      }

      .btn {
        margin: 0 8px;
        height: 30px;
        line-height: 30px;
        display: inline-block;
      }
    }
  }

}

</style>
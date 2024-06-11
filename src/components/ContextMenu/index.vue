<script setup>
import SubMenu from './SubMenu.vue';
import {ref, watch} from 'vue';

const emits = defineEmits([]);
const props = defineProps({
  data: {
    type: Object, required: false, default: () => {
      return {
        name: null,
        axis: {
          x: null,
          y: null,
        },
        items: [{
          handler: '',
          icon: '',
          button: '',
          children: [],
          disabled: false,
        }],
        icon: null,
        disabled: false,
        divided: false,
      };
    },
  },
  transferIndex: {type: Number, default: 0},
});
const direction = ref('float-1');
const handler = (item) => {
  emits(item.handler);
};

watch(() => props.data.axis, (val) => {
  const x = val.x;
  const y = val.y;
  const innerWidth = window.innerWidth;
  const innerHeight = window.innerHeight;
  const menuName = 'contextMenu-' + props.data.name;
  const menu = document.getElementsByClassName(menuName)[props.transferIndex];
  menu.style.display = 'block';
  const menuHeight = props.data.items.length * 30;
  const menuWidth = 150;
  menu.style.top = (y + menuHeight > innerHeight ? innerHeight - menuHeight : y) + 'px';
  menu.style.left = (x + menuWidth > innerWidth ? innerWidth - menuWidth : x) + 'px';
  document.addEventListener('mouseup', (e) => {
    // 解决mac电脑在鼠标右键后会执行mouseup事件
    if (e.button === 0) {
      menu.style.display = 'none';
    }
  }, false);
  if ((x + 2 * menuWidth) > innerWidth && (y + 2 * menuHeight) > innerHeight) {
    direction.value = 'float-4';
  }
  if ((x + 2 * menuWidth) < innerWidth && (y + 2 * menuHeight) > innerHeight) {
    direction.value = 'float-1';
  }
  if ((x + 2 * menuWidth) > innerWidth && (y + 2 * menuHeight) < innerHeight) {
    direction.value = 'float-3';
  }
  if ((x + 2 * menuWidth) < innerWidth && (y + 2 * menuHeight) < innerHeight) {
    direction.value = 'float-2';
  }
});

</script>

<template>
  <ul :class="'contextMenu-' + props.data.name" class="ul-wrapper" @contextmenu.stop="">
    <li v-for="item in props.data.items" :key="item.button" :class="{'divided':item.divided}" class="li-wrapper">
      <div v-if="item.children && item.children.length>0" :class="{'background':!(item.disabled?item.disabled:false)}"
           class="has-child">
        <div :class="{'disabled':item.disabled?item.disabled:false}" class="btn-wrapper">
          <span :class="item.icon?item.icon:''" class="left-icon iconfont"></span>
          <span class="btn">{{ item.button }}</span>
          <span v-if="!(item.disabled?item.disabled:false)" class="right-icon iconfont icon-right"></span>
        </div>
        <SubMenu v-if="!(item.disabled?item.disabled:false)" :float="direction" :items="item.children"
                 @item-handler="handler"></SubMenu>
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
.disabled {
  color: var(--el-text-color-disabled) !important;
  cursor: not-allowed;
}

.ul-wrapper {

  width: 130px;
  display: none;
  position: fixed;
  z-index: 9999;
  background: var(--el-bg-color);
  top: 0;
  left: 0;
  border-radius: var(--el-border-radius-base);
  box-shadow: var(--el-box-shadow-light);
  font-size: 14px;
  color: var(--el-text-color-regular);
  border: 1px solid var(--el-border-color-light);

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

  .li-wrapper {
    > div {
      padding: 3px 0;
    }

    position: relative;
    background: var(--el-bg-color);
    text-decoration: none;
    list-style: none;
    //margin:3px 0;
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
            right: 4px;
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
      //display: flex;
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
        right: 4px;
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
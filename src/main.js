import '@/assets/styles/reset.scss';
import '@/assets/styles/base.scss';
import '@/assets/styles/element.scss';
import '@/assets/styles/element-dark.scss';
import 'element-plus/dist/index.css';
import 'element-plus/theme-chalk/dark/css-vars.css';

import {createApp} from 'vue';
import 'default-passive-events';
import pinia from '@/stores';
import router from '@/router';
import ElementPlus from 'element-plus';
import * as ElementPlusIconsVue from '@element-plus/icons-vue';
import zhCn from 'element-plus/dist/locale/zh-cn.mjs';
import App from '@/App.vue';

import {FontAwesomeIcon} from '@fortawesome/vue-fontawesome';
import {library} from '@fortawesome/fontawesome-svg-core';
import {
    faBell,
    faChevronDown,
    faCompress,
    faCubes,
    faExpand,
    faSearch,
    faSignOut,
    faTshirt,
} from '@fortawesome/free-solid-svg-icons';
import '@/assets/fonts/iconfont.css';
import '@/assets/fonts/specialfont.css';


library.add(faCompress, faExpand, faSignOut, faChevronDown, faTshirt, faSearch, faBell, faCubes);


const app = createApp(App);

// app.config.errorHandler=errorHandler;

for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
    app.component(key, component);
}
app.component('font-awesome-icon', FontAwesomeIcon);

app.use(pinia);
app.use(router);
// app.use(directives);
app.use(ElementPlus, {locale: zhCn});


app.mount('#app');

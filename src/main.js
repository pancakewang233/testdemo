import Vue from 'vue';
import App from './App.vue';
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import {
  Button,
  Dialog,
  Empty,
  Icon,
  Sidebar,
  SidebarItem,
  Toast
} from 'vant';
import 'vant/lib/index.css';
import throttle from './directives/throttle';

Vue.use(ElementUI);
Vue.use(Button);
Vue.use(Dialog);
Vue.use(Empty);
Vue.use(Icon);
Vue.use(Sidebar);
Vue.use(SidebarItem);
Vue.use(Toast);
Vue.directive('throttle', throttle);

// 全局过滤器 + 实例方法：保留4位小数
const toFixedFn = (value) => {
  if (value === null || value === undefined || value === '') return '';
  return Number(value).toFixed(4);
};
Vue.filter('toFixed', toFixedFn);
Vue.prototype.$toFixed = toFixedFn;

// 正整数输入指令
Vue.directive('positiveInteger', {
  bind(el) {
    el.addEventListener('input', (e) => {
      e.target.value = e.target.value.replace(/[^\d]/g, '');
    });
  },
});

Vue.config.productionTip = false;

new Vue({
  render: h => h(App)
}).$mount('#app');

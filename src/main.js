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
  inserted(el) {
    const input = el.querySelector('input') || el;
    
    // keydown 阶段阻止非数字输入，提供更好的用户体验
    input.addEventListener('keydown', (e) => {
      const key = e.key;
      // 允许：数字键、控制键（Backspace, Delete, Tab, Enter, 方向键等）
      const isDigit = /^\d$/.test(key);
      const isControlKey = ['Backspace', 'Delete', 'Tab', 'Enter', 'ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown', 'Home', 'End'].includes(key);
      const isMetaKey = e.ctrlKey || e.metaKey; // 允许 Ctrl/Cmd + A/C/V/X 等操作
      
      if (!isDigit && !isControlKey && !isMetaKey) {
        e.preventDefault();
      }
    });
    
    // input 事件作为后备过滤，防止通过粘贴等方式输入非数字
    input.addEventListener('input', (e) => {
      const oldValue = e.target.value;
      const newValue = oldValue.replace(/[^\d]/g, '');
      if (newValue !== oldValue) {
        e.target.value = newValue;
      }
    });
  },
});

Vue.config.productionTip = false;

new Vue({
  render: h => h(App)
}).$mount('#app');

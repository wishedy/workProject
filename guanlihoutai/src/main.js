// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue';
import App from './App';
import { router } from './router/index';
import store from './store/store';
import HomemadeUI from './components/registerUI.js';

// 引入element-ui
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';

// 动态设置语言包
import locale from 'element-ui/lib/locale/lang/zh-CN.js';
// import mavonEditor from 'mavon-editor'
// import 'mavon-editor/dist/css/index.css'
// use
// Vue.use(mavonEditor)

Vue.use(ElementUI);

// 引入UI
Vue.use(HomemadeUI);
locale.el.pagination = {
  goto: '跳转至',
  pagesize: '条/页',
  total: '共 {total} 条',
  pageClassifier: '页'
};

Vue.use(ElementUI, { locale });

Vue.config.productionTip = false;

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  components: { App },
  template: '<App/>'
});

/**
 * Created by lichunhui on 2017.11.27.
 */
import Vue from 'vue';
import "static/css/cropper.min.css";
import 'static/js/third-party/flexible.js';
import 'static/js/third-party/ajaxfileupload.js';
import global_ from 'common/Global';
Vue.prototype.GLOBAL = global_;
import store from "./store/store.js";
import weixinMethods from "static/js/weixinflag.js";
weixinMethods.loginWeiXin();
import App from './App';
import VueRouter from "vue-router";
Vue.use(VueRouter);
import routes from "./router/router.config";
const router = new VueRouter(routes);

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  render: h => h(App)
});

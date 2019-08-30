/**
 * Created by lichunhui on 2017.11.27.
 */
import Vue from 'vue';
import "scss/base.scss";
import global_ from 'common/Global';
Vue.prototype.GLOBAL = global_;

import App from './App';
import weixinMethods from "static/js/weixinflag.js";
weixinMethods.loginWeiXin();
/* eslint-disable no-new */
new Vue({
  el: '#app',
  render: h => h(App)
});
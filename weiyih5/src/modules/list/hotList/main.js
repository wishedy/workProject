import Vue from 'vue';
import App from './App';
import 'static/js/third-party/flexible.js'
import "scss/base.scss";
import FastClick from "fastclick";
import weixinMethods from "static/js/weixinflag.js";
weixinMethods.loginWeiXin();

/* eslint-disable no-new */
FastClick.attach(document.body);
new Vue({
  el: '#app',
  render: h => h(App)
});

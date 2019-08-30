import Vue from 'vue';
import "static/css/swiper.min.css";
import store from "./store/store.js";


import App from './App';
import Router from "vue-router";

import weixinMethods from "static/js/weixinflag.js";
weixinMethods.loginWeiXin();

import routes from "./router/router.config";
/* eslint-disable no-new */
Vue.use(Router);
const router  = new Router(routes);
new Vue({
  el: '#app',
    router,
    store,
  render: h => h(App)
});

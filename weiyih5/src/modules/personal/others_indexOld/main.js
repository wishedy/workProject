/**
 * Create By DingLindong on 2017/12/5
 */
import Vue from "vue";
import App from "./App";
import store from "./store/store.js";

import VueRouter from "vue-router";
Vue.use(VueRouter);

import weixinMethods from "static/js/weixinflag.js";
weixinMethods.loginWeiXin();

import routes from "./router/router.config";
const router = new VueRouter(routes);
new Vue({
    router,
    store,
    render:h => h(App)
}).$mount("#app");
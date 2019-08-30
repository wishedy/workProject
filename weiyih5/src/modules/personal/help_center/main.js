import Vue from "vue";
import App from "./App";
import store from "./store/index.js";
import VueRouter from "vue-router";
Vue.use(VueRouter);

import weixinMethods from "static/js/weixinflag.js";
weixinMethods.loginWeiXin();

import routes from "./router/router.config";
const router = new VueRouter(routes);
new Vue({
    store,
    router,
    render:h => h(App)
}).$mount("#app");
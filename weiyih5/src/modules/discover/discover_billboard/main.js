/**
 * Create By DingLindong on 2017/11/13
 */
import Vue from 'vue';
import App from './App';
// import store from './store.js'
import Router from 'vue-router';
import routes from "./router/router.config";

import weixinMethods from "static/js/weixinflag.js";
weixinMethods.loginWeiXin();

/* eslint-disable no-new */
Vue.use(Router);
const router  = new Router(routes);

new Vue({
    router,
    // store,
    render: h => h(App)
}).$mount('#app');
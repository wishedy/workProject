import Vue from 'vue';
import App from './App';
import Router from 'vue-router';
import routes from "./router/router.config";

import store from "./store/store.js";

import weixinMethods from "static/js/weixinflag.js";
weixinMethods.loginWeiXin();
/* eslint-disable no-new */
Vue.use(Router);
const router  = new Router(routes);

new Vue({
    router,
    store,
    render: h => h(App)
}).$mount('#app');

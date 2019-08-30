import Vue from 'vue';
import store from "./store/store.js";
import App from './App';
import Router from "vue-router";

import weixinMethods from "static/js/weixinflag.js";
weixinMethods.loginWeiXin();

import routes from "./router/router.config";
/* eslint-disable no-new */
Vue.use(Router);
const router = new Router(routes);
router.afterEach((to,from,next) => {
    window.scrollTo(0,0);
});
new Vue({
    el: '#app',
    store,
    router,
    render: h => h(App)
});

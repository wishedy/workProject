/**
 * Create By zhenghui on 2017/12/19
 */
import Vue from 'vue'
import App from './App'
// import Router from 'vue-router'
import store from "./store/store.js"
// import routers from './router/router.config'
import VueAwesomeSwiper from 'vue-awesome-swiper'
import "scss/base.scss"
import "scss/pages/index/hotest_index.scss"
import "static/js/third-party/flexible.js"
import weixinMethods from "static/js/weixinflag.js";
weixinMethods.loginWeiXin();

// Vue.use(Router);
// const router  = new Router(routers);

Vue.use(VueAwesomeSwiper)
Vue.config.productionTip = false;

/* eslint-disable no-new */
new Vue({
    el: '#app',
    // router,
    store,//使用store
    render: h => h(App)
})

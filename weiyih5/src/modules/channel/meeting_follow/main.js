import Vue from 'vue';
import App from './App';
// import Router from 'vue-router'
// import routers from './router/router.config'
import "scss/pages/meeting/meeting_fellow.scss";
import "static/js/third-party/flexible.js"
import weixinMethods from "static/js/weixinflag.js";
weixinMethods.loginWeiXin();
// Vue.use(Router);
// const router  = new Router(routers);
Vue.config.productionTip = false;

/* eslint-disable no-new */
new Vue({
    el: '#app',
    // router,
    render: h => h(App)
});

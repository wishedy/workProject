 import Vue from 'vue';
/*import "scss/base.scss";*/
import '../../../js/third-party/flexible.js'
import App from './App';
import Router from "vue-router";
import routes from "./router/router.config";
import weixinMethods from "static/js/weixinflag.js";
weixinMethods.loginWeiXin();
/* eslint-disable no-new */
Vue.use(Router);
const router  = new Router(routes);
new Vue({
    el: '#app',
    router,
    render: h => h(App)
});

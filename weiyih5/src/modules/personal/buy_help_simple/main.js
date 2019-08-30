import Vue from 'vue';
import "scss/base.scss";
import 'static/js/third-party/flexible.js'
import 'static/js/third-party/vue-scroll.js'
import weixinMethods from "static/js/weixinflag.js"
import App from './App';
import Router from "vue-router"
import global_ from 'common/Global'
document.title='购买帮助';
Vue.prototype.GLOBAL = global_;
import routes from "./router/router.config"
Vue.use(Router);
const router  = new Router(routes);
weixinMethods.loginWeiXin();
new Vue({
    el: '#app',
    router,
    render: h => h(App)
});

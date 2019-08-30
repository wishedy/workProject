import Vue from 'vue';
import store from "./store/store.js"
import 'static/js/third-party/flexible.js'
import 'static/js/third-party/vue-scroll.js'
import weixinMethods from "static/js/weixinflag.js"
import App from './App';
import Router from "vue-router"
import global_ from 'common/Global'
Vue.prototype.GLOBAL = global_;
import routes from "./router/router.config"
Vue.use(Router);
weixinMethods.loginWeiXin();
const router  = new Router(routes);
new Vue({
    el: '#app',
    router,
    store,
    render: h => h(App)
});

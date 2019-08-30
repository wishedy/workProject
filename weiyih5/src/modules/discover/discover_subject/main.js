/**
 * Create By DingLindong on 2017/11/27
 */
import Vue from "vue";
import App from "./App.vue";
import VueRouter  from "vue-router";
import store from "./store/store.js";

import weixinMethods from "static/js/weixinflag.js";
weixinMethods.loginWeiXin();

// import routes from "./router/router.config"

/*Vue.use(VueRouter);
const router = new VueRouter(routes);*/
new Vue({
    // router,
    store,
    render: h => h(App)
}).$mount("#app");
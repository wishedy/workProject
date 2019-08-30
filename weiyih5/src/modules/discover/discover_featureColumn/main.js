/**
 * Create By DingLindong on 2017/11/29
 */
import Vue from "vue";
import App from "./App";
import  store  from "./store/store.js";

import weixinMethods from "static/js/weixinflag.js";
weixinMethods.loginWeiXin();

new Vue({
    render:h => h(App),
    store
}).$mount("#app");
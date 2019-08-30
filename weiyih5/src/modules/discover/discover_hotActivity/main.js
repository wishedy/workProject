/**
 * Create By DingLindong on 2017/11/23
 */
import Vue from "vue";
import App from "./App.vue";

import weixinMethods from "static/js/weixinflag.js";
weixinMethods.loginWeiXin();

new Vue({
    render:h => h(App)
}).$mount("#app")
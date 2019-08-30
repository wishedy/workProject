/**
 * Create By lichunhui on 2018/01/11
 */
import Vue from "vue";
import App from "./App";
import "static/js/third-party/flexible";
import weixinMethods from "static/js/weixinflag.js"
weixinMethods.loginWeiXin();

new Vue({
    render:h => h(App)
}).$mount("#app");
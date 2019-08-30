/**
 * Create By DingLindong on 2018/1/23
 */
import Vue from 'vue';
import App from './App';
import store from "./store/store.js";

import weixinMethods from "static/js/weixinflag.js";
weixinMethods.loginWeiXin();

new Vue({
    el: '#app',
    store,
    render: h => h(App)
});
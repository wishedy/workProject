import Vue from 'vue';
import 'static/js/third-party/flexible.js';
import store from "./store/store.js"
import App from './App';
import weixinMethods from "static/js/weixinflag.js";
weixinMethods.loginWeiXin();
/* eslint-disable no-new */
new Vue({
    el: '#app',
    store,
    render: h => h(App)
});

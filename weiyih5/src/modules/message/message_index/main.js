import Vue from 'vue';
import App from './App';

import weixinMethods from "static/js/weixinflag.js";
weixinMethods.loginWeiXin();

new Vue({
    el: '#app',
    render: h => h(App)
});

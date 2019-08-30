import Vue from 'vue';

import "static/css/swiper.min.css";
import '../../../js/third-party/flexible.js'
import App from './App';
import weixinMethods from "static/js/weixinflag.js";
weixinMethods.loginWeiXin();
/* eslint-disable no-new */
new Vue({
    el: '#app',
    render: h => h(App)
});
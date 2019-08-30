/**
 * Created by zhanghongda on 2018/01/10.
 */
import Vue from 'vue';
import "scss/base.scss";
import 'static/js/third-party/flexible.js'
import App from './App';
import weixinMethods from "static/js/weixinflag.js"
weixinMethods.loginWeiXin();

/* eslint-disable no-new */
new Vue({
    el: '#app',
    render: h => h(App)
});
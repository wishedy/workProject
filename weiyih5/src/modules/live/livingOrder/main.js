/**
 * Created by zhanghongda on 2017/12/7.
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
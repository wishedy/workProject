import Vue from 'vue';
import App from './App';
import "scss/pages/meeting/meeting_trailer.scss";
import 'static/js/third-party/flexible.js';
import store from "./store/store.js"

import weixinMethods from "static/js/weixinflag.js";
weixinMethods.loginWeiXin();


/* eslint-disable no-new */
new Vue({
    el: '#app',
    store,
    render: h => h(App)
});

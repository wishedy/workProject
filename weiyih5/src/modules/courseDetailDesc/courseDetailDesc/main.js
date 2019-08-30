import Vue from 'vue';
import 'static/js/third-party/flexible.js'
import 'static/js/third-party/vue-scroll.js'
import weixinMethods from "static/js/weixinflag.js"
import App from './App';
import global_ from 'common/Global'
Vue.prototype.GLOBAL = global_;
weixinMethods.loginWeiXin();
new Vue({
    el: '#app',
    render: h => h(App)
});

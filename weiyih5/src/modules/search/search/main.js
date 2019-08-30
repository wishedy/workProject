import Vue from 'vue';
// import "../../../css/pages/search/search_index.css";
import store from "./store/store.js"
import 'static/js/third-party/flexible.js'
import 'static/js/third-party/vue-scroll.js'
import weixinMethods from "static/js/weixinflag.js"
import App from './App';
import Router from "vue-router"
import global_ from 'common/Global'
// import "babel-polyfill";
Vue.prototype.GLOBAL = global_;
import routes from "./router/router.config"
/*import VueScroller from 'vue-scroller'*/
/*Vue.use(VueScroller);*/
/* eslint-disable no-new */
Vue.use(Router);
weixinMethods.loginWeiXin();
/*Vue.use(vuescroll);*/
const router  = new Router(routes);
new Vue({
    el: '#app',
    router,
    store,
    render: h => h(App)
});

// import axios from 'axios'
// axios.defaults.baseURL = 'http://10.202.42.24:8080/sf-cloud-web'
// Vue.prototype.axios = axios;

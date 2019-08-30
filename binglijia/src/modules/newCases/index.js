import '~polyfill'
import Vue from 'vue'
import Meta from 'vue-meta';
import App from './app.vue';
import store from "./store/store.js";
import Router from "vue-router";
import routerConfig from "./router/router.config.js";
import "~utils/global.js";
const router  = new Router(routerConfig);
Vue.use(Router);
Vue.use(Meta)

const app = new Vue({
    store,
    router,
    ...App
})

app.$mount('#app')

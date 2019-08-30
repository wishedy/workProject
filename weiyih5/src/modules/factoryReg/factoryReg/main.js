import Vue from 'vue';
import "scss/base.scss";
import 'swiper/dist/css/swiper.css';
import 'static/js/third-party/flexible.js'
import 'static/js/third-party/vue-scroll.js'
import App from './App';
import Router from "vue-router"
import global_ from 'common/Global'
Vue.prototype.GLOBAL = global_;
import routes from "./router/router.config"
Vue.use(Router);
const router  = new Router(routes);
new Vue({
    el: '#app',
    router,
    render: h => h(App)
});

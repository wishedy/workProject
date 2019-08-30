import Vue from 'vue';
import App from './App';
import Router from 'vue-router';
import routes from "./router/router.config";

import store from "./store/store";
/* eslint-disable no-new */
Vue.use(Router);
const router  = new Router(routes);

import weixinMethods from "static/js/weixinflag.js";
weixinMethods.loginWeiXin();

router.beforeEach((to, from, next) => {
    const list = ['article', 'video']; 
    const toName = to.name; 
    const fromName = from.name; 
    const toIndex = list.indexOf(toName); 
    const fromIndex = list.indexOf(fromName); 
    let direction = '';

    if (toIndex > -1 && fromIndex > -1) {
        if (toIndex < fromIndex) {    
            direction = 'left'
        } else {
            direction = 'right'  
        }
    }
    store.state.viewDirection = direction;

    return next()
});
new Vue({
    store,
    router,
    render: h => h(App)
}).$mount('#app');

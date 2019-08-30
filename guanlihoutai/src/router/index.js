import Vue from 'vue';
import Router from 'vue-router';
import {routers} from './router';

Vue.use(Router);

const config = {
  routes: routers
};

export const router = new Router(config);

router.beforeEach((to, from, next) => {
  // 判断是否登录，如果未登录，则跳转至登录界面
  if (to.name !== 'login') {
    if (!sessionStorage.getItem('userLoginName')) {
      localStorage.clear();
      sessionStorage.clear();
      next('/login');
    }
    else {
      next();
    }
  }
  else {
    if (!localStorage.getItem('userLoginName')) {
      next();
    }
    else {
      next('/home');
    }
  }
});

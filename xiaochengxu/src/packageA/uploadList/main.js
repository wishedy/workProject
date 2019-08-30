import Vue from 'vue'
import App from './uploadList'
import Vuex from 'vuex';
Vue.use(Vuex);

const app = new Vue({
  ...App,
});
app.$mount()


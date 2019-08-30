import Vue from 'vue'
import App from './medicalReportDetail'
import Vuex from 'vuex';
Vue.use(Vuex);

const app = new Vue({
  ...App,
});
app.$mount()


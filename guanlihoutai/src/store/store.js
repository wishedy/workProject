/**
 * 功能描述：
 * 使用方法：
 * 注意事项：
 * 引入来源：
 * 作用：
 * Create by YaoQiao on 2018/9/7
 */

'use strict';
import Vue from 'vue';
import Vuex from 'vuex';
import state from './state';
import actions from './actions';
import getters from './getters';
import mutations from './mutations';
import Demo from './modules/demo/index.js';
import PatientsEvaluation from './modules/patientsEvaluation/index.js';

Vue.use(Vuex);
export default new Vuex.Store({
  state,
  mutations,
  getters,
  actions,
  strict: true,
  modules: {
    Demo,
    PatientsEvaluation
  }
});

/**
 * @Desc：Vuex全局状态机
 * @Usage:
 * @Notify：
 * @Depend：
 *
 * Created by qiangkailiang on 2017/8/23.
 */

import Vue from "vue";
import Vuex from "vuex";
Vue.use(Vuex);
import state from "./states";
import mutations from "./mutations";
import actions from "./actions";
import getters from "./getters";


export default new Vuex.Store({
  state,
  mutations,
  actions,
  getters
})

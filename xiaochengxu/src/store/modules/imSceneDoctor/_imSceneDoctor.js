/**
 * @Desc：Vuex全局状态机
 * @Usage:
 * @Notify：
 * @Depend：
 *
 * Created by qiangkailiang on 2017/8/23.
 */

import state from "./states";
import getters from "./getters";
import mutations from "./mutations";
import actions from "./actions";


export default {
  namespaced:true,
  state,
  mutations,
  actions,
  getters
}

/**
 * @Desc：
 * @Usage:
 * @Notify：
 * @Depend：
 *
 * Created by Hallmader on 2018/8/12.
 */


import state from "./state";
import mutations from "./mutations";
import getters from "./getters";
import actions from "./actions"

export default {
  namespaced: true,
  state,
  mutations,
  getters,
  actions
}

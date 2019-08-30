/**
 * @Desc：
 * @Usage:
 * @Notify：
 * @Depend：
 *
 * Created by Hallmader on 2018/4/20.
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

/**
 * @Desc：
 * @Usage:
 * @Notify：
 * @Depend：
 *
 * Created by Hallmader on 2018/6/6.
 */
const getters = {
  isLogin: (state, getters, rootState, rootGetters) => rootState.isLogin,
  loading: (state, getters, rootState, rootGetters) => rootState.loading,
  customerId: (state, getters, rootState, rootGetters) => rootState.customerId,
  toastContent: (state, getters, rootState, rootGetters) => rootState.toastContent,
  toastShow: (state, getters, rootState, rootGetters) => rootState.toastShow,
  patientMessage: (state, getters, rootState, rootGetters) => rootState.patientMessage,
  questionDetail: (state, getters, rootState, rootGetters) => rootState.questionDetail,
};
export default getters;

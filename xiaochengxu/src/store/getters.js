/**
 * @Desc：
 * @Usage:
 * @Notify：
 * @Depend：
 *
 * Created by Hallmader on 2018/3/19.
 */
const getters = {
  toastContent: (state, getters, rootState, rootGetters) => rootState.toastContent,
  toastShow: (state, getters, rootState, rootGetters) => rootState.toastShow,
  patientMessage: (state, getters, rootState, rootGetters) => rootState.patientMessage,
  isLogin: (state, getters, rootState, rootGetters) => rootState.isLogin,
  loading: (state, getters, rootState, rootGetters) => rootState.loading,
  updatePatient: (state, getters, rootState, rootGetters) => rootState.updatePatient,
  updatePatientList: (state, getters, rootState, rootGetters) => rootState.updatePatientList,
  userInfoEnd: (state, getters, rootState, rootGetters) => rootState.userInfoEnd,
};
export default getters;

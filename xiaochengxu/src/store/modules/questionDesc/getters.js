/**
 * @Desc：
 * @Usage:
 * @Notify：
 * @Depend：
 *
 * Created by Hallmader on 2018/3/19.
 */
const getters = {
  loading:(state, getters, rootState, rootGetters)=> rootState.loading,
  toastContent:(state, getters, rootState, rootGetters)=> rootState.toastContent,
  toastShow:(state, getters, rootState, rootGetters)=> rootState.toastShow,
  scene:(state, getters, rootState, rootGetters)=> rootState.scene,
  queryObject:(state)=> state.queryObject,
  // doctorMessage:(state)=> state.doctorMessage,
  // patientMessage:(state)=> state.patientMessage,
};
export default getters;

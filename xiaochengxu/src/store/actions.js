/**
 * @Desc：
 * @Usage:
 * @Notify：
 * @Depend：
 *
 * Created by Hallmader on 2018/3/19.
 */

const actions={
  setLoadingState({dispatch, commit, rootState},flag) {
    rootState.loading =flag;
  },
  showToast({dispatch, commit, rootState},content) {
    rootState.toastShow = true;
    rootState.toastContent =content;
    setTimeout(()=>{
      rootState.toastShow = false;
    },2000)
  },
  hideToast({dispatch, commit, rootState},content) {
    rootState.toastShow = false;
  },
  getSubscribeStatus:({commit,state})=>{
    commit("getSubscribeStatus");
  },
  setPatientMessage({dispatch, commit, rootState},param){
    rootState.patientMessage=Object.assign(rootState.patientMessage,param);
  },
  setUpdatePatient({dispatch, commit, rootState},param){
    rootState.updatePatient = param;
  },
  setIsLogin({dispatch, commit, rootState},flag){
    rootState.isLogin = flag;
  },
  // 康复日记视频数递增
  setVideoNum({dispatch, commit, rootState},){
    rootState.videoNum ++;
  },
  // 康复日记视频数赋值
  setVideoDefaultNum({dispatch, commit, rootState},num){
    rootState.videoNum = num;
  },
  storageUserInfoEnd:({commit,state})=>{
    commit("storageUserInfoEnd");
  }
};


export default actions;

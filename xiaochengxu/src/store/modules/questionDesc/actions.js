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
  // setIsLogin({dispatch, commit, rootState},flag) {
  //   rootState.isLogin =flag;
  //   console.log(rootState);
  // },
  // setPatientMessage({dispatch, commit, rootState},param){
  //   rootState.patientMessage=Object.assign(rootState.patientMessage,param);
  // },
};


export default actions;

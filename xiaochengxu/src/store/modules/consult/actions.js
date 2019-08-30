/**
 * @Desc：
 * @Usage:
 * @Notify：
 * @Depend：
 *
 * Created by Hallmader on 2018/6/6.
 */
const actions={
  setCustomerId({dispatch, commit, rootState},flag) {
    rootState.customerId =flag;
  },
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
  setPatientMessage({dispatch, commit, rootState},param){
    rootState.patientMessage=Object.assign(rootState.patientMessage,param);
  },
  setQuestionOne({dispatch, commit, rootState},param){
    rootState.questionOne=Object.assign(rootState.questionOne,param);
  },
  setQuestionOneDes({dispatch, commit, rootState},param){
    rootState.questionOneDes = param;
  },
  setQuestionTwo({dispatch, commit, rootState},param){
    if (param.length>0) {
      rootState.questionTwo = param;
    } else {
      rootState.questionTwo=[];
    }
  },
  setQuestionTwoDes({dispatch, commit, rootState},param){
    rootState.questionTwoDes = param;
  },
};


export default actions;

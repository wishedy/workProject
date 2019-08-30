/**
 * @Desc：
 * @Usage:
 * @Notify：
 * @Depend：
 *
 * Created by Hallmader on 2018/6/6.
 */


const mutations = {
  showLoading(state) {
    state.loading = true;
  },
  hideLoading(state) {
    state.loading = false;
  },
  setCustomerId(state,id){
    state.customerId=id;
  },
  setLoginStatus(state,flag){
    state.isLogin=flag;
  },
  setImgList(state,arrList){
    state.imgList = Object.assign(state.imgList,arrList);
  },
  setPatientMessage(state,param){
    state.patientMessage=Object.assign(state.patientMessage,param);
  },
  setQuestionDetail(state,param){
    state.questionDetail= param;
  },
  setDoctorMessage(state,param){
    state.doctorMessage=Object.assign(state.doctorMessage,param);
  },
  setQuestionOne(state,param){
    state.questionOne=param;
  },
  setQuestionOneDes(state,param){
    state.questionOneDes=param;
  },
  setQuestionTwo(state,param){
    state.questionTwo=param;
  },
  setQuestionTwoDes(state,param){
    state.questionTwoDes=param;
  },
  showToast(state,content){
    state.toastContent=content;
    state.toastShow=true;
    setTimeout(()=>{
      state.toastShow=false;
      // setTimeout(()=>{
      //   state.toastContent="";
      // },200);
    },2000)
  },

}
export default mutations;

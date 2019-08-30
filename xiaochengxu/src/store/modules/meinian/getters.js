const getters = {
  titleName(state){
    return state.titleName;
  },
  verifyPhoneNumber(state){
    return state.verifyPhoneNumber;
  },
  hasReport(state){
    return state.hasReport;
  },
  patientName(state){
    return state.patientName;
  },
  identityCardNum(state){
    return state.identityCardNum;
  },
  clickAble(state){
    return state.clickAble;
  },
  phoneNum(state){
    return state.phoneNum;
  },
  verificationCode(state){
    return state.verificationCode;
  },
  limit(state){
    return state.limit;
  },
  verificationCodeIng:(state)=>{
    return state.verificationCodeIng;
  },
  codeDes(state){
    return state.codeDes;
  },
  verificationCodeNum:(state)=>{
    return state.verificationCodeNum;
  },
  reportDialog(state){
    return state.reportDialog;
  },
  patientList(state){
    return state.patientList;
  },
  reportData(state){
    return state.reportData.responseObject;
  },
  idInfo(state){
    return  state.idInfo;
  }
};
export default getters;

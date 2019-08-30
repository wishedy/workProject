/**
 * @Desc：
 * @Usage:
 * @Notify：
 * @Depend：
 *
 * Created by Hallmader on 2018/3/19.
 */

/**************************Axios Http Requests*************************/
import getDoctorBaseMsg from "common/js/HttpRequest/getDoctorBaseMsg"; // 获取专业医生基本信息 

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
  setDoctorMessage({dispatch, commit, rootState},param){
    commit("setDoctorMessage",param);
  },
  /** 获取医生信息 */
  // 获取医生姓名、头像
  getDoctorMsg({dispatch, commit, rootState},doctorCustomerId) {
    return new Promise( (resolve, reject) => {
      getDoctorBaseMsg({
        doctorCustomerId,
        logoUseFlag: 5
      }).then(data => {
        if (data.responseObject && data.responseObject.responseData) {
          const dataList = data.responseObject.responseData.dataList[0];
          commit("setDoctorMessage",{
            doctorId: this.doctorCustomerId,
            doctorName: dataList.customerName
          });
          resolve(true);
        }
      });
    }) 
  },
  // 设置是否是扫码进来的找医生；
  setQrCode({dispatch, commit, rootState},flag) {
    rootState.qrCode = flag;
  },
  setPatientMessage({dispatch, commit, rootState},param){
    rootState.patientMessage=Object.assign(rootState.patientMessage,param);
  },
};


export default actions;

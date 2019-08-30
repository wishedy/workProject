/**
 * @Desc：
 * @Usage:
 * @Notify：
 * @Depend：
 *
 * Created by Hallmader on 2018/3/19.
 */
import getReportDetails from "common/js/HttpRequest/getReportDetails"

const mutations = {
  setLoadingState(state,flag) {
   state.loading =flag;
  },
  setScene(state, scene) {
    state.scene = scene;
  },
  emptyQueryObject(state) {
    state.queryObject = {};
  },
  setQueryObject(state, param) {
    state.queryObject = Object.assign(state.queryObject, param);
  },
  getQueryObject(state, reportId) {
    getReportDetails({
      reportId
    }).then(data => {
      if (data.responseObject.responseStatus) {
        if (data.responseObject.responseData && data.responseObject.responseData.data_list) {
          state.queryObject = data.responseObject.responseData.data_list[0];
          console.log(state.queryObject)
        }
      }
    })
  },
  // 设置医生 doctorCustomerId；
  setDoctorCustomerId (state,id) {
    state.doctorCustomerId = id;
  },
  setDoctorMessage(state,flag) {
    state.doctorMessage =flag;
  },
  setPatientMessage(state,param){
     console.log(state);
     state.patientMessage=Object.assign(state.patientMessage,param);
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
  setQuestionDetail(state,param){
    state.questionDetail= param;
  },
};

export default mutations;

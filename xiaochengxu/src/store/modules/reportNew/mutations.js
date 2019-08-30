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
  // 设置医生 doctorCustomerId；
  setDoctorCustomerId (state,id) {
    state.doctorCustomerId = id;
  },
  // 设置 reportId；
  setReportId (state,id) {
    state.reportId = id;
  },
  // 设置caseId；
  setCaseId (state,id) {
    state.caseId = id;
  },
  // 设置patientId；
  setPatientId (state,id) {
    state.patientId = id;
  },
  // 设置医生信息；
  setDoctorMessage (state, params) {
    Object.assign(state.doctorMessage,params);
  },
};

export default mutations;

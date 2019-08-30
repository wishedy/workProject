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
  setDoctorMessage(state,flag) {
    state.doctorMessage =flag;
  },
};

export default mutations;

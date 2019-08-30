/**
 * @Desc：
 * @Usage:
 * @Notify：
 * @Depend：
 *
 * Created by Hallmader on 2018/6/6.
 */

import api from "common/js/util/util";
import localStorage from "localStorage";
import { resolve } from "path";

const XHRList = {
  getDocMain: api.httpEnv() +  "/mcall/customer/auth/v2/getMapById/", //医生信息
};
const mutations = {
  setIsLogin(state,flag){
    state.isLogin=flag;
  },
  setCustomerId(state, id) {
    state.customerId = id;
  },
  setMainKey(state,id){
    state.mainKey=id;
  },
  setDoctorBaseInfo(state,param){
    state.doctorBaseInfo = param;
  },
  setDoctorMessage(state, param) {
    state.doctorMessage = param;
  },
  setId(state, param){
    state.idList = Object.assign(state.idList, param)
  },
  getDoctorMessage({state, param}) {
    let _this = this;
    api.ajax({
      url: XHRList.getDocMain,
      method: "POST",
      data: {
        customerId: localStorage.getItem("doctorId"),
        logoUseFlag: 3
      },
      done(data) {
        if (
          data &&
          data.responseObject.responseData &&
          data.responseObject.responseData.dataList
        ) {
          let _data = data.responseObject.responseData.dataList[0];
          state.doctorBaseInfo = _data.authMap;
          state.doctorMessage = _data;
          console.log(state.doctorBaseInfo)
          console.log(state.doctorMessage)
          // commit("setDoctorMessage", _data);
          // commit("setDoctorBaseInfo", _data.authMap);
        }
      },
      fail(err) {
        console.log("获取医生信息失败" + err);
      }
    });
  },
  showLoading(state) {
    state.loading = true;
  },
  hideLoading(state) {
    state.loading = false;
  },
  setDoctorGuideList (state,param) {
    state.doctorGuideList = param;
  },
}
export default mutations;

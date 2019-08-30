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
const actions={
  // 获取医生数据
  getDoctorMessage({commit, state}) {
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
          commit("setDoctorMessage", _data);
          commit("setDoctorBaseInfo", _data.authMap);
        }
      },
      fail(err) {
        console.log("获取医生信息失败" + err);
      }
    });
  }
};


export default actions;

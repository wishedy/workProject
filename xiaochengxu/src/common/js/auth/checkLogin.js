/**
 * @Desc：检测登录状态
 * @Usage:
 * @Notify：
 * @Depend：
 *
 * Created by Qiangkailiang on 17/12/7.
 */
// import axios from "axios";
import api from "../util/util";

const XHRList = {
  getCheckSession: api.httpEnv() + "/mcall/patient/customer/unite/v1/checkSession/"
}

export default class checkSession {
  constructor() {

  }

  getStatus() {

    return new Promise((resolve, reject) => {
      return new Promise((resolve, reject) => {
        wx.showLoading({
          mask: true
        });
        wx.request({
          url: XHRList.getCheckSession,
          method: "POST",
          header: {
            "Content-Type": "application/x-www-form-urlencoded"
          },
          timeout: 30000,
          success(res) {
            resolve(res);
          },
          complete() {
            wx.hideLoading()
          },
          fail(err) {
            reject(err)
          }
        })
      }).then((res) => {
        console.log(res);
      //  if (!(api.getPara().hybrid && api.getPara().hybrid == 1)) {
          if (!res.data.responseObject.responseStatus) {
            localStorage.removeItem("userId");
            localStorage.removeItem("userName");
            localStorage.removeItem("mobile");
            localStorage.removeItem("logoUrl");
          } else {
            localStorage.setItem("userId", res.data.responseObject.responsePk)
          }
      //  }
        console.log("resolve");
        resolve(res);
      }, (err) => {
        reject(err);
      });
    });
  }
}

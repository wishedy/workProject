/**
 * @Desc：用户登出方法
 * @Usage:
 * @Notify：
 * @Depend：
 *
 * Created by lichenyang on 18/03/13.
 */
import api from 'common/js/util/util';

const XHRList = {
  loginOutUrl: api.httpEnv() + "/mcall/patient/customer/unite/v1/logout/"
}

export default class LoginOut {
  constructor() {

  }

  loginOutInit() {
    return new Promise((resolve, reject) => {
      return new Promise((resolve, reject) => {
        wx.showLoading({
          mask: true
        });
        wx.request({
          url: XHRList.loginOutUrl,
          method: "POST",
          header: {
            "Content-Type": "application/x-www-form-urlencoded"
          },
          timeout: 30000,
          success(res) {
            resolve(res.data);
          },
          complete() {
            wx.hideLoading()
          },
          fail(err) {
            reject(err)
          }
        })
      }).then((res) => {
        if (res && res.responseObject && res.responseObject.responseStatus) {
          localStorage.removeItem("hasCloseAttention");
          localStorage.removeItem("userId");
          localStorage.removeItem("userName");
          localStorage.removeItem("mobile");
          localStorage.removeItem("logoUrl");
          localStorage.removeItem("isSubscribe");
        }
        resolve(res);
      }, (err) => {
        reject(err);
      });

    })
  }
}

//小程序登录获取customerId
import api from "common/js/util/util";
import miniApi from "./miniUtil";

const XHRList = {
  getSession: api.httpEnv() + "/mcall/wx/api/v1/jscode2session/",
  getMiniLogin: api.httpEnv() + "/mcall/patient/customer/unite/v1/miniLogin/"
};
export default function miniLogin(obj) {
  class GetCustomerId {
    constructor() {
      this.getLoginInfo();
    }

    getLoginInfo() {
      miniApi.login().then((resOne) => {
        api.ajax({
          url: XHRList.getSession,
          method: "POST",
          data: {
            code: resOne.code
          },
          done(resTwo) {
            if (resTwo && resTwo.responseObject.responseData) {
              let sessionRes = resTwo.responseObject.responseData;
              wx.setStorageSync("openId", sessionRes.openid);
              wx.setStorageSync("unionId", sessionRes.unionid);
              wx.setStorageSync("sessionKey", encodeURIComponent(sessionRes.session_key));
              wx.setStorageSync('JSESSIONID', new Date().getTime());

              miniApi.getUserInfo({
                withCredentials: true
              }).then((resUser) => {
                console.log('这里');
                console.log(resUser);
                console.log("这里---");
                if (resUser && resUser.errMsg == "getUserInfo:ok") {
                  wx.setStorageSync("encryptedData", encodeURIComponent(resUser.encryptedData));
                  wx.setStorageSync("iv", encodeURIComponent(resUser.iv));
                  api.ajax({
                    url: XHRList.getMiniLogin,
                    method: "POST",
                    data: {
                      encryptedData: encodeURIComponent(resUser.encryptedData),
                      iv: encodeURIComponent(resUser.iv),
                      sessionKey: wx.getStorageSync("sessionKey"),
                      visitSiteId: 24
                    },
                    done(resFour) {
                      if (resFour && resFour.responseObject.responseData) {
                        wx.setStorageSync("gender", resUser.userInfo.gender);
                        wx.setStorageSync("mobile", resFour.responseObject.responseData.mobile);
                        wx.setStorageSync("userId", resFour.responseObject.responseData.customerId);
                        wx.setStorageSync('logoUrl', resFour.responseObject.responseData.headUrl);
                        wx.setStorageSync('nickName', resFour.responseObject.responseData.nickName);
                        obj.successCallBack && obj.successCallBack({
                          data: resFour
                        });

                      } else {
                        obj.failCallback && obj.failCallback();
                        console.log("获取customerId失败");
                      }
                    },fail(err){
                      obj.failCallback && obj.failCallback();
                    }
                  })
                } else {
                  obj.failCallback && obj.failCallback();
                  console.log("获取微信用户信息失败");
                }
              }, (error) => {
                console.log(error);
                console.log("授权失败")
                obj.failCallback && obj.failCallback();
              }).catch(err=>{
                console.log(err)
                obj.failCallback && obj.failCallback();
              })
            } else {
              obj.failCallback && obj.failCallback();
              console.log("获取session失败");
            }
          },
          fail : (err) => {
            console.log(err)
            obj.failCallback && obj.failCallback();
          }
        })
      }).catch( (err) => {
        console.log(err);
        obj.failCallback && obj.failCallback();
      })
    }
  }

  new GetCustomerId(obj);
}

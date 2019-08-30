import api from "common/js/util/util";
import miniApi from "common/js/miniUtil/miniUtil";
import miniLogin from "common/js/miniUtil/miniLogin";
import bindMobile from "common/js/auth/bindMobile";
import localStorage from "common/js/miniUtil/localStorage";
const XHRList = {
  getSession: api.httpEnv() + "/mcall/wx/api/v1/jscode2session/",
  getMiniLogin: api.httpEnv() + "/mcall/patient/customer/unite/v1/miniLogin/",
  getPhoneNumber:api.httpEnv() + "/mcall/patient/customer/unite/v1/minAuthPhone/"
};
class GetPhoneAuthorization {
  constructor(props){
    let _this = this;
    _this.init = _this.init.bind(this);
  }
  init(options){
    let e = options.info;
    wx.checkSession({

      success: function () {

        console.log(e.detail.errMsg)

        console.log(e.detail.iv)

        console.log(e.detail.encryptedData)



        var ency = e.detail.encryptedData;

        var iv = e.detail.iv;


        var sessionk = wx.getStorageSync("sessionKey");

        console.log(wx.getStorageSync("sessionKey"));

        if (e.detail.errMsg == 'getPhoneNumber:fail user deny') {
            options.cancelBack&&options.cancelBack();
        } else {//同意授权
          api.ajax({
            url: XHRList.getPhoneNumber,
            method: "POST",
            data: {
              encryptedData: encodeURIComponent(ency),
              iv:encodeURIComponent(iv),
              visitSiteId:24,
              sessionKey:sessionk
            },
            done(resTwo) {
              if(resTwo&&resTwo.responseObject.responseCode&&(parseInt(resTwo.responseObject.responseCode,10)===40001)&&(!resTwo.responseObject.responseStatus)){
                miniLogin({
                  successCallBack: (res) => {

                  }, failCallBack: (err) => {

                  }
                });
              }
              if (resTwo && resTwo.responseObject.responseData&&resTwo.responseObject.responseStatus) {
                bindMobile({
                  account: resTwo.responseObject.responseData.phoneNumber,
                  encryptedData: localStorage.getItem("encryptedData"),
                  sessionKey: sessionk,
                  iv: localStorage.getItem("iv"),
                  visitSiteId: '24'
                }).then(res => {
                  console.log(res);
                  wx.setStorageSync("userId",res.responseObject.responsePk);
                  wx.setStorageSync("mobile",resTwo.responseObject.responseData.phoneNumber);
                  console.log('loacal======', localStorage.getItem('mobile'))
                  api.codeRecord();
                  options.successBack&&options.successBack();

                }).finally(() => {
                });
              }
            },
            fail : (err) => {
              console.log(err);

            }
          })
        }

      },

      fail: function () {

        console.log("session_key 已经失效，需要重新执行登录流程");

        miniApi.login(); //重新登录

      }

    });
  }
  checkPhoneNumber(){
    let _this = this;
    console.log(localStorage.getItem("mobile"));
    return localStorage.getItem("mobile")?true:false;
  }
}
export default new GetPhoneAuthorization();

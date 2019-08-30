/**
 * @Desc：微信认证
 * @Usage:
 * @Notify：
 * @Depend：
 *
 * Created by wangjinglong on 17/12/11.
 */

import PersonalInfo from "./getPersonal";
import CheckLogin from 'common/js/auth/checkLogin';
import api from 'common/js/util/util';
;

class WxBindingFD {
  constructor() {
  }

  isBind(obj) {
    let personalInfo = new PersonalInfo();
    let checkLogin = new CheckLogin();
    // if (!api.getPara().openId) {
      new Promise((resolve, reject) => {
        let cId = "";
        checkLogin.getStatus().then((res) => {
          if (res.data.responseObject.responseStatus) {
            localStorage.setItem("customerId",res.data.responseObject.responsePk);
            resolve(res.data.responseObject.responsePk);
          } else {
            resolve(cId);
          }
        });
      }).then((data) => {
        console.log(data);
        if (data) {
          personalInfo.getMessage(data).then((res) => {
            if (res && res.responseObject.responseData) {
              let result = res.responseObject.responseData;
              if (result.mobile && result.mobile.length > 0) {
                if (result.uniteFlagWeixin == 1) {
                  console.log("该用户已绑定手机号（微信）");
                  obj.callBack && obj.callBack(data);
                } else {
                  // let url = `${window.location.origin}${window.location.pathname}?customerId=${data}`;
                  if (api.getPara().wxState == 1) { //wxState：3：账户不存在，4：参数不全
                    obj.hasBindedFn && obj.hasBindedFn(data);
                  } else {
                    let url = window.location.href;
                    if(url.indexOf('#')!= -1){
                      this.wxBind(url.substring(0,url.indexOf('#')+1));
                    }else{
                      this.wxBind(url);
                    }
                  }
                }
              } else {
                if (api.getPara().wxState == 2) {
                  console.log("绑定失败");
                  obj.failCallBack && obj.failCallBack();
                } else {
                  // localStorage.setItem("backUrl", window.location.href);
                  // console.log("返回登录1");
                  // window.location.href = `/dist/mLogin.html?from=weChat&customerId=${data}`;
                }
              }
            } else {
              console.log("获取个人信息失败");
            }
          }).catch((err) => {
            console.log(err)
          })
        } else {
          if (api.getPara().wxState == 0) {
            console.log("绑定微信成功");
            // obj.callBack && obj.callBack(data);
          } else if (api.getPara().wxState == 1) {
            console.log("您已绑定其他用户");
            obj.hasBindedFn && obj.hasBindedFn(data);
          } else if (api.getPara().wxState == 2) {
            console.log("绑定失败");
            obj.failCallBack && obj.failCallBack();
          } else {
            obj.failCallBack && obj.failCallBack();
          }
        }
      })
  }

  wxBind(url) {
    let appId = "", XHRUrl = "", envCode = "";
    if (window.location.origin.includes("localhost") || window.location.origin.includes("10.1")) {
      return false;
    }
    if (!window.location.hostname.includes("m1")) {
      envCode = 1;
    } else {
      envCode = 2;
    }

    if (envCode == 1) {
      appId = "wxe8384f7b06c169ef";
      XHRUrl = "http://m.allinmed.cn/mcall/wx/tocure/interact/v1/view/";
    } else if (envCode == 2) {
      appId = "wxaa5288ad7f627608";
      XHRUrl = "http://m1.allinmed.cn/mcall/wx/tocure/interact/v1/view/";
    }


    let encodeUrl = XHRUrl + "?ref=" + url + "&response_type=code&scope=snsapi_base&state=bundingWx#wechat_redirect";

    // alert(encodeUrl);
    // if (api.getPara().code || api.getPara().openId) {
    //   console.log("正在支付重定向");
    // } else {
      // window.location.href = "https://open.weixin.qq.com/connect/oauth2/authorize?appid=" + appId + "&redirect_uri=" + encodeUrl;
      window.location.replace("https://open.weixin.qq.com/connect/oauth2/authorize?appid=" + appId + "&redirect_uri=" + encodeUrl);
    // }
  }


}

export default new WxBindingFD();

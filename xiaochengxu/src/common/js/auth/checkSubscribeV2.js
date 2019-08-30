/**
 * @Desc：
 * @Usage:
 * @Notify：
 * @Depend：
 *
 * Created by Hallmader on 2018/6/24.
 */
import api from 'common/js/util/util';


export default class CheckSubscribeV2 {
  constructor() {

  }

  check() {
    if (api.isWXBrowse() === "other") {
      return true;
    } else if (window.location.href.indexOf("m1.allinmed.cn") > 0 || window.location.href.indexOf("m.allinmed.cn") > 0) {
      if (api.getPara().openId) sessionStorage.setItem("openId", api.getPara().openId);
      if (api.getPara().isSubscribe) sessionStorage.setItem("isSubscribe", api.getPara().isSubscribe);
      if (api.getPara().unionId) sessionStorage.setItem("unionId", api.getPara().unionId);
      let _openId = sessionStorage.getItem("openId"),
        _isSubscribe = sessionStorage.getItem("isSubscribe"),
        _unionId = sessionStorage.getItem("unionId"),
        _checkKey;
      if (_openId != null && _isSubscribe != null && _unionId != null) {
        _checkKey = true;
      } else {
        _checkKey = false;
      }
      return _checkKey;
    } else {
      return true;
    }
  }

  getSubscribe(url) {
    /* env环境变量参数
 * 1代表唯医骨科-正式线上环境
 * 2代表唯仁唯医社区-线下调试环境
 *
 */
    let appId = "";
    let XHRUrl = "";
    let envCode = "";

    if (window.location.origin.includes("localhost")) {
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

    const encodeUrl = XHRUrl + "?ref=" + url + "&response_type=code&scope=snsapi_base&state=subscribe#wechat_redirect";

    if (window.location.href.includes("openId") && window.location.href.includes("isSubscribe") && window.location.href.includes("unionId")) {


      localStorage.setItem("openId", api.getPara().openId)
    } else {
      window.location.href = "https://open.weixin.qq.com/connect/oauth2/authorize?appid=" + appId + "&redirect_uri=" + encodeUrl;
    }
  }
}

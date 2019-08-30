/*
* Created by zhangheng on 2017.11.27.
* 是否微信浏览器 weixinFlag:true 是
* */
var storeSession = {
    checkInvalid: function (val) {
        if (((typeof val == 'string') && (val.length == 0)) || (val == undefined) || (val == 'undefined') || (val == 'null') || (typeof val == 'undefined') || (typeof val == 'null') || (val == null)) {
            return true;
        } else {
            return false;
        }
    },
    getQueryString: function (name) {
        var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
        var r = window.location.search.substr(1).match(reg);
        if (r != null) return unescape(r[2]);
        return null;
    },
    loginInit: function () {
        var webdomain = '//' + location.host;
        var appId = 'wx8d4a2df6fdc13658';
        var searchParam = '';
        var searchUrlOnOff = storeSession.checkInvalid(location.search);
        var loginOnOff = false;
        if (searchUrlOnOff) {
            loginOnOff = true;
            searchParam = "?redirectNum=1";
        } else {
            var redirectNum = storeSession.getQueryString('redirectNum');
            var loginNumRight = !storeSession.checkInvalid(redirectNum);
            if (loginNumRight && parseInt(redirectNum, 10) === 1) {
                loginOnOff = false;
            } else {
                searchParam = location.search + "&redirectNum=1";
                loginOnOff = true;
            }
        }
        var href = location.origin + location.pathname + searchParam;
        var toUrl = 'http:' + webdomain + '/mcall/wx/allin/interact/viewVideo/?url=' + encodeURIComponent(href);
        if (loginOnOff) {
            var weixinLoginUrl = 'https://open.weixin.qq.com/connect/oauth2/authorize?appid=' + appId + '&redirect_uri=' + encodeURIComponent(toUrl) + '&response_type=code&scope=snsapi_base&state=STATE#wechat_redirect';
            window.location.href = weixinLoginUrl;
        } else {

        }
    }
};
const weixinMethods={
    isWXBrowse(){
        var ua = navigator.userAgent.toLowerCase();
        if (ua.match(/MicroMessenger/i) == "micromessenger" && ua.indexOf("iphone") > 0) {
            return "iphoneWX";
        } else if (ua.match(/MicroMessenger/i) == "micromessenger" && ua.indexOf("android") > 0) {
            return "androidWX";
        }
        return "other";
    },
    weixinFlag:false,
    loginWeiXin(){
      let t = this;
      let isWXBrowse=t.isWXBrowse();
      if(isWXBrowse=="iphoneWX"||isWXBrowse=="androidWX"){
        t.weixinFlag = true;
        //storeSession.loginInit();
      }
    }
};

export default weixinMethods;
//异常监控
import "./arthas_monitor_report.js";

/*
* Created by zhangheng on 2017.11.27.
* 是否微信浏览器 weixinFlag:true 是
* */

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
      }
    }
};

export default weixinMethods;
//异常监控
import "./arthas_monitor_report.js";
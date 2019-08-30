/**
 * @Desc：
 * @Usage:
 * @Notify：
 * @Depend：
 *
 * Created by Hallmader on 2018/8/13.
 */
import localStorage from "localStorage";
import api from "../util/util";
import createBrowse from "../HttpRequest/createBrowse";
import updateLeave from "../HttpRequest/updateLeave";
import createTrack from "../HttpRequest/createTrack";

import pageList from "./pageList";
import eventList from "./eventList";

class DataLog {
  constructor() {
    this.clickFlag = true;

    // const pages = getCurrentPages();
    // console.log(pages)
    // if (pages[pages.length - 1].route.includes("mIndex")){
    //   localStorage.removeItem("location")
    // }
    if (!localStorage.getItem("location")) {
      this.getLocation().then((res) => {
        const location = {
          latitude: res ? res.latitude : "", //经度
          longitude: res ? res.longitude : "", //纬度
          speed: res ? res.speed : "" //移动速度
        };

        localStorage.setItem("location", JSON.stringify(location));
      });
    }

  }

  timeFormat() {
    const _date = new Date();
    const result = {
      year: _date.getFullYear(),
      month: (_date.getMonth() + 1).toString().padStart("2", "0"),
      day: _date.getDate().toString().padStart("2", "0"),
      hour: _date.getHours().toString().padStart("2", "0"),
      minute: _date.getMinutes().toString().padStart("2", "0"),
      second: _date.getSeconds().toString().padStart("2", "0"),
    };

    return `${result.year}-${result.month}-${result.day} ${result.hour}:${result.minute}:${result.second}`;

  }

  getLocation() {

    return new Promise((resolve) => {

      wx.getLocation({
        type: 'wgs84',
        success: (res) => {
          // console.log(res)
          resolve(res);
        },
        fail: (err) => {
          console.log("用户拒绝授权，无法获取位置信息");
          resolve(err);
        }
      });
    })
  }

  getSearchOptions(options) {
    // console.log(options)
    if (Object.keys(options).length === 0) {
      return "";
    } else {
      let result = [];
      for (let i in options) {
        result.push(`${i}=${options[i]}`);
      }
      return "?" + result.join("&");
    }
  }

  enterBrowse(params) {
    const systomInfo = wx.getSystemInfoSync();
    const location = localStorage.getItem("location") ? JSON.parse(localStorage.getItem("location")) : {};
    const pages = getCurrentPages();

    const pageUrl = pages[pages.length - 1];
    const _default = {
      openId: localStorage.getItem("openId") || "", //openId
      unionId: localStorage.getItem("unionId") || "", //uuId
      sessionId: localStorage.getItem("sessionKey") || "",  //sessionId
      customerId: localStorage.getItem("userId") || "",  //customerId
      brand: systomInfo.brand, //手机品牌
      model: systomInfo.model, //手机型号
      language: systomInfo.language, //微信语言
      wxVersion: systomInfo.version, //微信版本号
      systomVersion: systomInfo.system,  //操作系统版本
      platform: systomInfo.platform, //客户端平台
      fontSizeSetting: systomInfo.fontSizeSetting,  //用户字号设置
      SDKVersion: systomInfo.SDKVersion,  //小程序基础库版本
      opAdvice: "miniProgram",  //来源为小程序
      sendSiteId: api.getSiteId(),  //站点ID
      isValid: 1,  //可用
      openTime: this.timeFormat(),  //当前时间XXXX-XX-XX XX:XX:XX
      browseType: (params && params.browseType) ? params.browseType : pageList[pageUrl.route.split("/")[2]].browseType,  //页面ID
      browseUrl: (params && params.browseUrl) ? params.browseUrl : encodeURIComponent(pageUrl.route + this.getSearchOptions(pageUrl.options)), //页面URL
      browseTypeSource: this.browseTypeSource || "",  //来源页ID
      resourceId: (params&&params.resourceId)||"",  //资源ID
      opDesc: (params && params.opDesc) ? params.opDesc : pageList[pageUrl.route.split("/")[2]].opDesc,  //页面描述
      latitude: location ? location.latitude : "", //经度
      longitude: location ? location.longitude : "", //纬度
      speed: location ? location.speed : ""//移动速度
    };

    const _data = Object.assign(_default, params);
    createBrowse(_data).then(data => {
      if (data.responseObject.responseStatus && data.responseObject.responseData) {
        this.rowKey = data.responseObject.responseData.rowKey
        console.log("页面已进入：" + this.rowKey);
      }
    })


  }

  leaveBrowse(params) {
    const _default = {
      rowKey: this.rowKey,
      id: this.rowKey,
      leaveTime: this.timeFormat(), //离开时间
      sessionId: localStorage.getItem("sessionKey"),  //sessionId
    };
    const pages = getCurrentPages();
    this.browseTypeSource = encodeURIComponent(pages[pages.length - 1].route + this.getSearchOptions(pages[pages.length - 1].options));
    const _data = Object.assign(_default, params);
    updateLeave(_data).then(data => {
      console.log("页面已离开：" + this.rowKey);
    })
  }

  getTimeZone() {
    return new Date().getTimezoneOffset() / 60
  }

  createTrack(params) {
    if (!this.clickFlag) return false;
    this.clickFlag = false;
    setTimeout(() => {
      this.clickFlag = true;
    });
    const systomInfo = wx.getSystemInfoSync();
    const pages = getCurrentPages();
    const pageUrl = pages[pages.length - 1];
    const location = localStorage.getItem("location") ? JSON.parse(localStorage.getItem("location")) : {};

    const _default = {
      openId: localStorage.getItem("openId") || "", //openId
      unionId: localStorage.getItem("unionId") || "", //uuId
      sessionId: localStorage.getItem("sessionKey") || "",  //sessionId
      customerId: localStorage.getItem("userId") || "",  //customerId
      brand: systomInfo.brand, //手机品牌
      model: systomInfo.model, //手机型号
      language: systomInfo.language, //微信语言
      wxVersion: systomInfo.version, //微信版本号
      systomVersion: systomInfo.system,  //操作系统版本
      createTime: this.timeFormat(),  //当前时间XXXX-XX-XX XX:XX:XX
      platform: systomInfo.platform, //客户端平台
      fontSizeSetting: systomInfo.fontSizeSetting,  //用户字号设置
      SDKVersion: systomInfo.SDKVersion,  //小程序基础库版本
      opSource: "miniProgram",  //来源为小程序
      siteId: api.getSiteId(),  //站点ID
      browseType: (params && params.browseType) ? params.browseType : pageList[pageUrl.route.split("/")[2]].browseType,  //页面ID
      browseTypeUrl: pageUrl.route, //页面URL
      browseDesc: (params && params.browseType) ? params.browseType : pageList[pageUrl.route.split("/")[2]].opDesc,  //页面描述
      actionId: params.actionId || "",//事件ID
      opDesc: eventList[params.actionId].opDesc || "",//事件描述
      keyword: eventList[params.actionId].keyword || "",//事件关键字
      appVersion: api.appVersion(), //版本号
      latitude: location ? location.latitude : "", //经度
      longitude: location ? location.longitude : "", //纬度
      zone: "GMT " + this.getTimeZone() //时区
    };
    const _data = Object.assign(_default, params);

    createTrack(_data).then((data) => {
      if (data.responseObject.responseStatus && data.responseObject.responseData) {
        console.log("事件已记录：" + data.responseObject.responseData.rowKey);
      }
      this.clickFlag = true;
    }).catch(err => {
      console.log("网络错误");
      this.clickFlag = true;
    })

  }
}

export default new DataLog();

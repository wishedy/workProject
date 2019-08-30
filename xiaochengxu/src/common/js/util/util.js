/**
 * @Desc：总入口方法集合
 * @Usage:
 * @Notify：
 * @Depend：
 *
 * Created by Qiangkailiang on 17/7/14.
 */
import ajax from "./ajax";
import prototype from "./prototype";
import wxCommon from "./wxCommon";
import accountValidate from "./accountValidate";
import net from "./net";
import timeFormat from "./timeFormat";
import stringFormat from "./stringFormat";
import reloadFile from "./reloadPic";
import showBigImg from "./showBigImg";
import getLocationCity from './getLocationCity';
import {mixin, addProperty} from "@/common/js/allinmed_decorators/decorators";

@mixin({
  ajax,
  browser: net.browser,
  wxGetOpenId: wxCommon.wxGetOpenId,
  mobileCheck: accountValidate,
  checkOpenId: wxCommon.checkOpenId,
  isWXBrowse: wxCommon.isWXBrowse,
  getPara: net.getPara,
  getCookie: net.getCookie,
  getNetWork: net.getNetWork,
  getConnectType: net.getConnectType,
  getDeviceType: net.getDeviceType,
  timeFormate: timeFormat.timeFormate,
  MillisecondToDate: timeFormat.MillisecondToDate,
  MillisecondToDateNew: timeFormat.MillisecondToDateNew,
  getByteLen: stringFormat.getByteLen,
  getStrByteLen: stringFormat.getStrByteLen,
  getByteLength: stringFormat.getByteLength,
  getStrByteLength: stringFormat.getStrByteLength,
  getStrByteLimit: stringFormat.getStrByteLimit,
  getStrCount: stringFormat.getStrCount,
  getStrInputCut: stringFormat.getStrInputCut,
  reloadFile: reloadFile,
  showBigImg: showBigImg,
  getLocationCity: getLocationCity
})


class Api {
  constructor() {
    prototype();
  }

  //获取授权
  getUserInfo() {
    return new Promise((resolve, reject) => {
      wx.getSetting({
        success: (res) => {
          if (res.authSetting['scope.userInfo']) {
            resolve(res)
          } else {
            reject(res);
          }
        },
        fail: (err) => {
          console.log(err);
        }
      });
    });
  }

  //禁止分享
  forbidShare(opt) {

  }

  httpEnv() {
    const env = "test";
    // const env = "online";
    return env == "test" ? "https://m1.allinmed.cn" : "https://m.allinmed.cn"
  }

  // 原生多事件注册
  addListenerMulti(el, s, fn) {
    s.split(' ').forEach(e => el.addEventListener(e, fn, false));
  }

  banZoom() {
    document.addEventListener('touchstart', function (event) {
      if (event.touches.length > 1) {
        event.preventDefault();
      }
    })
    let lastTouchEnd = 0;
    document.addEventListener('touchend', function (event) {
      let now = (new Date()).getTime();
      if (now - lastTouchEnd <= 300) {
        event.preventDefault();
      }
      lastTouchEnd = now;
    }, false)
  }


  removeDub(arr) {
    return [...new Set(arr)];
  }

  removeByValue = function (arr, value) {
    for (let i = 0; i < this.length; i++) {
      if (arr[i] == val) {
        arr.splice(i, 1);
        break;
      }
    }
    return arr;
  }


  getSiteId() {
    let siteId = 24;
    return siteId;
  }

  codeRecord(url) {
    let _data = {};
    let requestURL = '';
    if (!wx.getStorageSync("codeRecodeId")) {
      _data = {
        doctorId: wx.getStorageSync("doctorId"),
        scanType: 1,
        pageUrl: url,
        qrCodeContent: ''
      };
      requestURL = this.httpEnv() + '/mcall/log/tocure/customer/qr/code/scan/v1/create/'
    } else {
      _data = {
        id: wx.getStorageSync("codeRecodeId"),
        customerId: wx.getStorageSync("userId"),
        uniteOpenid: wx.getStorageSync("openId"),
        uniteUuid: wx.getStorageSync("unionId"),
      };
      requestURL = this.httpEnv() + '/mcall/log/tocure/customer/qr/code/scan/v1/update/';
    }

    console.log(_data);
    ajax({
      url: requestURL,
      method: "POST",
      data: _data,
      done(res) {
        if (res.responseObject.responseStatus) {
          if (!wx.getStorageSync("codeRecodeId")) {
            wx.setStorageSync("codeRecodeId", res.responseObject.responsePk);
          }
          console.log('记录日志成功！');
        }
      }, fail(error) {
      }
    }, "loading");
  }

  appVersion() {
    return "1.2.0"
  }
}

export default new Api;

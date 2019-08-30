/**
 * @Desc：
 * @Usage:
 * @Notify：
 * @Depend：
 *
 * Created by Qiangkailiang on 2018/1/3.
 */

import api from "common/js/util/util";


export default function getToolBarConfig() {
  const XHRList = api.httpEnv() + "/mcall/comm/data/tool/v1/getMapList/";
  // let deviceType=navigator.userAgent.toLowerCase().includes("iphone")?"IOS":"Android";
  let deviceType = wx.getSystemInfoSync().system.includes("iOS")?"IOS":"Android";

  return new Promise((resolve, reject) => {
    api.ajax({
      url: XHRList,
      method: "POST",
      data: {
        deviceType: deviceType,
        sortType: 1,
        isValid:1,
        visitSiteId: api.getSiteId()
      },
      done(res) {
        resolve(res);
      },
      fail(err) {
        reject(err);
      }
    },'loading')
  })
}

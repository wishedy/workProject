/**
 * @Desc：创建主报道信息
 * @Usage:
 * @Notify：
 * @Depend：
 *
 * Created by ZH on 2019/2/19.
 */

import ajax from "common/js/util/ajax";
import api from "common/js/util/util";

const XHRList = api.httpEnv()+"/mcall/patient/report/content/v2/createMainReport/";
export default function createMainReport(param) {
  return new Promise((resolve, reject) => {
    ajax({
      url: XHRList,
      method: "POST",
      data:param,
      done(data){
        if(data&&data.responseObject&&data.responseObject.responseStatus){
          resolve(data.responseObject.responseData);
        }else {
          wx.showToast({
            title:'创建报道信息失败，请重试',
            icon:'none'
          });
        }

      },
      fail(err){
        wx.showToast({
          title:'接口错误',
          icon:'none'
        });
        reject(err);
      }
    })
  })
};

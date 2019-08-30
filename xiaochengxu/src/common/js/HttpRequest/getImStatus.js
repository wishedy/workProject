/**
 * @Desc：找医生流程获取im状态
 * @Usage:
 * @Notify：
 * @Depend：
 *
 * Created by Hallmader on 2018/3/12.
 */
import util from "common/js/util/util";
const XHRUrl = util.httpEnv()+ "/mcall/customer/case/consultation/v1/getImStatus/";

import ajax from "common/js/util/ajax";


export default function getImStatus(param) {
  return new Promise((resolve, reject) => {
    ajax({
      url: XHRUrl,
      method: "POST",
      data: {
        patientCustomerId: wx.getStorageSync("userId"),
        customerId: param.doctorCustomerId,
        patientId: param.patientId,
        visitSiteId: util.getSiteId(),
      },
      done(data) {
        resolve(data);
      },
      fail(err) {
        reject(err);
      }
    })
  })
};

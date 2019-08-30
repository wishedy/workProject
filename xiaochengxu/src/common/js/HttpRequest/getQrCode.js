/**
 * @Desc：
 * @Usage:
 * @Notify：
 * @Depend：
 *
 * Created by Hallmader on 2018/5/18.
 */

import util from "common/js/util/util";

const XHRList = util.httpEnv() + "/mcall/customer/auth/v1/getMiniUrlByCustomerId/";


export default function getQrCode(param) {
  return new Promise((resolve, reject) => {
    util.ajax({
      url: XHRList,
      method: "POST",
      data: {
        customerId:param.customerId
      },
      done(data) {
        resolve(data)
      },
      fail(err) {
        reject(err);
      }
    },'loading')
  })
}

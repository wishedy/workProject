/**
 * @Desc：发送验证码
 * @Usage:
 * @Notify：
 * @Depend：
 *
 * Created by lichenyang on 18/05/21.
 */

import util from "common/js/util/util";
const XHRUrl = util.httpEnv() + "/mcall/patient/customer/unite/v1/mobileBungWeixin/";

import ajax from 'common/js/util/ajax';
export default function bindMobile (param) {
  return new Promise((resolve, reject) => {
    ajax({
      url: XHRUrl,
      method: "POST",
      data: param,
      timeout: 10000,
      done(res) {
        resolve(res);
      },
      fail(err) {
        reject(err);
        throw new Error(err);
      }
    })
  })
}
/**
 * @Desc：
 * @Usage:
 * @Notify：
 * @Depend：
 *
 * Created by Hallmader on 2018/3/9.
 */

import ajax from "common/js/util/ajax";
import util from "common/js/util/util";

export default function getDoctorBaseMsg(param) {
  const XHRUrl =util.httpEnv()+"/mcall/customer/auth/v1/getSimpleById/";
  return new Promise((resolve, reject) => {
    ajax({
      url: XHRUrl,
      method: "POST",
      data: {
        customerId: param.doctorCustomerId,
        logoUseFlag: param.logoUseFlag
      },
      done(data) {
        resolve(data);
      },
      fail(err) {
        reject(err);
      }
    },'loading')
  });
}


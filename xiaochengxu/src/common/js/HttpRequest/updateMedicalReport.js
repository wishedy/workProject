/**
 * @Desc：
 * @Usage:
 * @Notify：
 * @Depend：
 *
 * Created by Hallmader on 2018/3/15.
 */

import util from "common/js/util/util";
const XHRUrl = util.httpEnv()+ "/mcall/customer/patient/case/v1/update/";

import ajax from "common/js/util/ajax";


export default function updateMedicalReport(param) {
  return new Promise((resolve, reject) => {
    ajax({
      url: XHRUrl,
      method: "POST",
      data: {
        caseId: param.caseId,
        state: param.state
      },
      done(data) {
        resolve(data)
      },
      fail(err) {
        reject(err);
      }
    });
  });
}

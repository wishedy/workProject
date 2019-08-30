/**
 * @Desc：
 * @Usage:
 * @Notify：
 * @Depend：
 *
 * Created by Hallmader on 2018/3/13.
 */

import util from "common/js/util/util";
const XHRUrl = util.httpEnv()+"/mcall/customer/patient/case/v1/getMainMapById/";

import ajax from "common/js/util/ajax";

export default function getMedicalReportMainCase(param) {
  return new Promise((resolve, reject) => {
    ajax({
      url: XHRUrl,
      method: "POST",
      data: {
        caseId: param.caseId,
        patientId: param.patientId,
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


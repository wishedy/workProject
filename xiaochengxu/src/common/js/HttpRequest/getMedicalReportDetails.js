/**
 * @Desc：
 * @Usage:
 * @Notify：
 * @Depend：
 *
 * Created by Hallmader on 2018/3/12.
 */

import api from "common/js/util/util";
const XHRUrl =  api.httpEnv() + "/mcall/customer/patient/case/v1/getMapById/";

import ajax from "common/js/util/ajax";

export default function getMedicalReportDetails(param) {
  return new Promise((resolve, reject) => {
    ajax({
      url: XHRUrl,
      method: "POST",
      data: {
        caseId: param.caseId,
        attUseFlag: 1,
        isOrder: 0,
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



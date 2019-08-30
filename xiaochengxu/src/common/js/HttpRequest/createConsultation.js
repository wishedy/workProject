/**
 * @Desc：
 * @Usage:
 * @Notify：
 * @Depend：
 *
 * Created by Hallmader on 2018/3/12.
 */
import util from "common/js/util/util";
const XHRUrl = util.httpEnv()+"/mcall/customer/case/consultation/v1/create/";

import ajax from "common/js/util/ajax";

export default function createConsultation(param) {
  return new Promise((resolve, reject) => {
    ajax({
      url: XHRUrl,
      method: "POST",
      data: {
        caseId: param.caseId,
        customerId: param.customerId,
        patientCustomerId: param.patientCustomerId,
        patientId: param.patientId,
        consultationType: param.consultationType,
        consultationState: param.consultationState,
        caseType: param.caseType,
        visitSiteId:param.siteId,
        consultationFrequency:param.consultationFrequency,
        scene: 1
      },
      done(data) {
        resolve(data)
      },
      fail(err) {
        reject(err);
      }
    },'loading')
  }).catch( err => {
    console.log(err);
  })
}

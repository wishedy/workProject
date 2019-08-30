/**
 * @Desc：
 * @Usage:
 * @Notify：
 * @Depend：
 *
 * Created by Hallmader on 2018/3/12.
 */
import util from "common/js/util/util";
const XHRList = util.httpEnv()+"/mcall/customer/case/consultation/v1/getConsultationFrequency/";

import ajax from "common/js/util/ajax";

export default function getConsultationLastTime(param) {
  return new Promise((resolve, reject) => {
    ajax({
      url: XHRList,
      method: "POST",
      data: {
        caseId: param.caseId,
        customerId: param.customerId,
        isValid: 1,
        consultationType: param.consultationType,
        firstResult: 0,
        maxResult: 9999
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

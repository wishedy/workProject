/**
 * @Desc：
 * @Usage:
 * @Notify：
 * @Depend：
 *
 * Created by Hallmader on 2018/3/12.
 */
import util from "common/js/util/util";
const XHRUrl = util.httpEnv()+  "/mcall/customer/case/consultation/v1/getMapById/";

import ajax from "common/js/util/ajax";

export default function getConsultationList(param) {
  return new Promise((resolve, reject) => {
    ajax({
      url: XHRUrl,
      method: "POST",
      data: {
        caseId: param.caseId,
        consultationType: param.consultationType,
        sortType: 1,
        firstResult: 0,
        maxResult: 99,
        customerId: param.customerId
      },
      done(data) {
        resolve(data)
      },
      fail(err) {
        reject(err);
      }
    },"loading")
  })
}

/**
 * @Desc：
 * @Usage:
 * @Notify：
 * @Depend：
 *
 * Created by Hallmader on 2018/3/15.
 */
import util from "common/js/util/util";
const XHRUrl = util.httpEnv() +  "/mcall/customer/case/consultation/v1/update/";

import ajax from "common/js/util/ajax";


export default function updateConsultationState(param) {
  return new Promise((resolve, reject) => {
    ajax({
      url: XHRUrl,
      method: "POST",
      data: {
        consultationIds: param.consultationIds,
        consultationState: param.consultationState
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

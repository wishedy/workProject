/**
 * @Desc：
 * @Usage:
 * @Notify：
 * @Depend：
 *
 * Created by Hallmader on 2018/3/12.
 */
import util from "common/js/util/util";
const XHRUrl = util.httpEnv()+ "/mcall/customer/case/consultation/v1/updateFrequency/";

import ajax from "common/js/util/ajax";

export default function updateConsultation(param) {
  return new Promise((resolve, reject) => {
    ajax({
      url: XHRUrl,
      method: "POST",
      data: {
        consultationId: param.consultationId,
        frequency: param.frequency,
        frequencyType: param.frequencyType,
        consultationLevel: param.consultationLevel,
        consultationState: param.consultationState,
        isOuttimeNoReply:param.isOuttimeNoReply?param.isOuttimeNoReply:"0"
      },
      done(data) {
        resolve(data)
      },
      fail(err) {
        reject(err);
      }
    },'loading');
  });
}

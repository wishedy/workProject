/**
 * @Desc：通过 caseId 获取病例的一些信息
 * @Usage:
 * @Notify：
 * @Depend：
 *
 * Created by lichenyang on 2018/4/13.
 */

import util from "common/js/util/util";
const XHRUrl = util.httpEnv()+ "/mcall/customer/patient/case/v1/getMapList/";

import ajax from "common/js/util/ajax";

export default function getCaseInfo(caseId) {
  return new Promise((resolve, reject) => {
    ajax({
      url: XHRUrl,
      method: "POST",
      data: {
        caseId: caseId,
      },
      done(data) {
        resolve(data);
      },
      fail(err) {
        reject(err);
      }
    },"loading")
  })
}

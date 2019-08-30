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

export default function getDiaryStatistics(param) {
  const XHRUrl =util.httpEnv()+"/mcall/rehabilitative/diary/v1/getDiaryStatistics/";
  return new Promise((resolve, reject) => {
    ajax({
      url: XHRUrl,
      method: "POST",
      data: {
        patientCustomerId: param.patientCustomerId,
        isValid: param.isValid?param.isValid:1,
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


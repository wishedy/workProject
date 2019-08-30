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

export default function getPatientBase(param) {
  const XHRUrl = util.httpEnv() + "/mcall/customer/patient/baseinfo/v1/getMapList/";
  return new Promise((resolve, reject) => {
    ajax({
      url: XHRUrl,
      method: "POST",
      data: {
        patientId: param.patientId,
        firstResult: "0",
        maxResult: "1"
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

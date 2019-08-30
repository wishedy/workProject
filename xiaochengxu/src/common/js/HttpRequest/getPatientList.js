/**
 * @Desc：获取患者列表接口
 * @Usage:
 * @Notify：
 * @Depend：
 *
 * Created by liChenYang on 2018/12/04.
 */

import util from "common/js/util/util";
const XHRUrl = util.httpEnv()+ "/mcall/customer/patient/relation/v1/getMapList/";

import ajax from "common/js/util/ajax";
import localStorage from "localStorage";

export default function getPatientList(param) {
  const _default={
    customerId:localStorage.getItem("userId"),
    isValid: "1",
    firstResult: "0",
    maxResult: "9999",
  };

  const data=Object.assign(_default,param);
  return new Promise((resolve, reject) => {
    if (!data.customerId) {
      reject('需要传入用户ID')
    };
    ajax({
      url: XHRUrl,
      method: "POST",
      data,
      done(data) {
        resolve(data)
      },
      fail(err) {
        reject(err);
      }
    });
  });
}

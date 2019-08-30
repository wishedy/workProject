/**
 * @Desc：
 * @Usage:
 * @Notify：
 * @Depend：
 *
 * Created by Hallmader on 2018/3/27.
 */


import ajax from "common/js/util/ajax";
import api from "common/js/util/util";

const XHRList =   api.httpEnv() + "/mcall/log/patient/keyword/v1/update/";

export default function deleteHistoryRecord(params) {
  return new Promise((resolve, reject) => {
    ajax({
      url: XHRList,
      method: "POST",
      data: {
        customerId: localStorage.getItem("userId"),
        searchType:params.searchType,
        isValid: 0
      },
      done(data) {
        resolve(data);
      },
      fail(err) {
        reject(err);
      }
    })
  })
}

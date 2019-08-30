/**
 * @Desc：
 * @Usage:
 * @Notify：
 * @Depend：
 *
 * Created by Wangjingrong on 2018/4/23.
 */


import ajax from "common/js/util/ajax";
import api from "common/js/util/util";

const XHRList = api.httpEnv() +"/mcall/log/patient/keyword/v1/getMapList/";

export default function getHistoryRecord(param) {
  return new Promise((resolve, reject) => {
    ajax({
      url: XHRList,
      method: "POST",
      data: {
        customerId: localStorage.getItem("userId") ==0?'':localStorage.getItem("userId"),
        searchType:param.searchType,
        isValid: 1,
        firstResult: 0,
        maxResult: 10,
        groupType:1,
        sortType:1
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

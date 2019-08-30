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

const XHRList =   api.httpEnv() + "/mcall/log/patient/keyword/v1/create/";

export default function createHistoryRecord(param) {
  return new Promise((resolve, reject) => {
    ajax({
      url: XHRList,
      method: "POST",
      data: {
        customerId: localStorage.getItem("userId"),
        searchType: param.searchType,      //1：找医生； 2：搜患教
        keyWord: param.keyWord,
        visitSiteId: api.getSiteId(),
        isValid: 1,
        searchUrl:param.pageUrl,
        createTime:param.timing
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

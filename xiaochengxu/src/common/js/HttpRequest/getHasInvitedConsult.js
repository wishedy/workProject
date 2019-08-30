/**
 * @Desc：
 * @Usage:
 * @Notify：
 * @Depend：
 *
 * Created by Hallmader on 2018/6/25.
 */

import ajax from "common/js/util/ajax";
import util from "common/js/util/util";
const XHRList =util.httpEnv()+ "/mcall/patient/invite/clinic/getMapById/";

export default function getHasInvitedConsult(param) {
  const defaultData = {
    state:0, // string 是 邀请状态（ 0 - 未通知 1 - 已通知） 0
    firstResult:0 ,// string 是 分页参数
    maxResult:999 // string 是 分页参数
  };
  const data = Object.assign(defaultData, param);
  return new Promise((resolve, reject) => {
    ajax({
      url: XHRList,
      method: "POST",
      data,
      done(result) {
        resolve(result);
      },
      fail(err) {
        reject(err);
      }
    })
  })
}

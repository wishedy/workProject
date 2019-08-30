/**
 * @Desc：
 * @Usage:
 * @Notify：
 * @Depend：
 *
 * Created by Wangjingrong on 2018/4/23.
 */

import ajax from "common/js/util/ajax";
import util from "common/js/util/util";
const XHRList =util.httpEnv()+  "/mcall/cms/patienteducation/v1/getMapList/";

export default function getEducationList(param) {
  return new Promise((resolve, reject) => {
    ajax({
      url: XHRList,
      method: "POST",
      data: param,
      done(data) {
        resolve(data);
      },
      fail(err) {
        reject(err);
      }
    },'loading')
  })
}

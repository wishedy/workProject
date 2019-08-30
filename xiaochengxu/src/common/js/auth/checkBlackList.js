/**
 * @Desc：检查是在否黑名单内
 * @Usage:
 * @Notify：
 * @Depend：
 *
 * Created by wangning on 19/03/14.
 */

import ajax from "common/js/util/ajax";
import api from "../util/util";

const XHRUrl = api.httpEnv() + "/mcall/tocure/customer/blacklist/getMapList/";

export default function checkBlackList (data) {
  return new Promise((resolve, reject) => {
    ajax({
      url: XHRUrl,
      method: "POST",
      data: data,
      timeout: 10000,
      done(res) {
        resolve(res);
      },
      fail(err) {
        reject(err);
      }
    })
  })
}

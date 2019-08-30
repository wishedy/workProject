/**
 * @Desc：更新分享/浏览数
 * @Usage:
 * @Notify：
 * @Depend：
 *
 * Created by Hallmader on 2018/8/12.
 */

import util from "common/js/util/util";
import ajax from "common/js/util/ajax";

export default function updateBrowseAndShareNum(params) {
  const XHRUrl = util.httpEnv() +  "/mcall/rehabilitative/diary/v1/update/";
  const _defaultData = {};

  const data = Object.assign(_defaultData,params)
  return new Promise((resolve, reject) => {
    ajax({
      url: XHRUrl,
      method: "POST",
      data,
      done(res) {
        resolve(res);
      },
      fail(err) {
        reject(err);
      }
    })
  })
}

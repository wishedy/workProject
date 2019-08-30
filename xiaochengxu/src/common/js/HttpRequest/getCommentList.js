/**
 * @Desc：日记评论列表
 * @Usage:
 * @Notify：
 * @Depend：
 *
 * Created by Hallmader on 2018/8/12.
 */

import util from "common/js/util/util";
import ajax from "common/js/util/ajax";

export default function getCommentList(params) {
  const XHRUrl = util.httpEnv() +  "/mcall/customer/review/v1/getMapList/";
  const _defaultData = {};

  const data = Object.assign(_defaultData,params)
  return new Promise((resolve, reject) => {
    ajax({
      url: XHRUrl,
      method: "POST",
      data,
      done(data) {
        resolve(data);
      },
      fail(err) {
        reject(err);
      }
    })
  })
}

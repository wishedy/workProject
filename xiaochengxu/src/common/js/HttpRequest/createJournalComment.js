/**
 * @Desc：创建日记评论
 * @Usage:
 * @Notify：
 * @Depend：
 *
 * Created by Hallmader on 2018/8/12.
 */

import util from "common/js/util/util";

import ajax from "common/js/util/ajax";

export default function createJournalComment(params) {
  const XHRUrl = util.httpEnv() + "/mcall/customer/review/v1/create/";
  const _defaultData = {};

  const data = Object.assign(_defaultData, params)
  return new Promise((resolve, reject) => {
    ajax({
      url: XHRUrl,
      method: "POST",
      data,
      noWarning: true,
      done(res) {
        resolve(res);
      },
      fail(err) {
        reject(err);
      }
    })
  })
}

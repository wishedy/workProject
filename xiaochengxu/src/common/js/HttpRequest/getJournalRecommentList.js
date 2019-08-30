/**
 * @Desc：日记相关推荐列表
 * @Usage:
 * @Notify：
 * @Depend：
 *
 * Created by Hallmader on 2018/8/12.
 */

import util from "common/js/util/util";
import ajax from "common/js/util/ajax";

export default function getJournalRecommentList(params) {
  const XHRUrl = util.httpEnv() +  "";
  const _defaultData = {};

  const data = Object.assign(_defaultData, params)
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

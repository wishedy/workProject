/**
 * @Desc：
 * @Usage:
 * @Notify：
 * @Depend：
 *
 * Created by Hallmader on 2018/8/16.
 */
import util from "common/js/util/util";

const XHRUrl = util.httpEnv() + "/mcall/customer/review/v1/update/";
export default function updateCommentStatus(params) {
  const _defaultData = {};

  const data = Object.assign(_defaultData, params);
  return new Promise((resolve, reject) => {
    util.ajax({
      url: XHRUrl,
      method: "POST",
      data,
      done(data) {
        resolve(data)
      },
      fail(err) {
        reject(err);
      }
    });
  });
}

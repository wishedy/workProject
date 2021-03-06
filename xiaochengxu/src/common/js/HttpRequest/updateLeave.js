/**
 * @Desc：
 * @Usage:
 * @Notify：
 * @Depend：
 *
 * Created by Hallmader on 2018/8/13.
 */
import util from "common/js/util/util";
import ajax from "common/js/util/ajax";
const XHRUrl = util.httpEnv()+"/mcall/log/tocure/customer/browse/v1/updateLeave/";
export default function updateLeave(data) {
  return new Promise((resolve, reject) => {
    ajax({
      url: XHRUrl,
      method: "POST",
      data,
      timeout: 30000,
      done(data) {
        resolve(data)
      },
      fail(err) {
        reject(err);
      }
    })
  })
}

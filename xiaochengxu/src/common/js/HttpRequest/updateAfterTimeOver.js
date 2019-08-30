/**
 * @Desc：
 * @Usage:
 * @Notify：
 * @Depend：
 *
 * Created by Hallmader on 2018/8/16.
 */
import api from "common/js/util/util";

const XHRUrl = api.httpEnv() + "/mcall/customer/case/consultation/v1/batchUpdateStatus/";
export default function updateAfterTimeOver(params) {

  return new Promise((resolve, reject) => {
    api.ajax({
      url: XHRUrl,
      method: "POST",
      data:params,
      done(data) {
        resolve(data)
      },
      fail(err) {
        reject(err);
      }
    });
  });
}

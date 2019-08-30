

import util from "common/js/util/util";
import ajax from "common/js/util/ajax";
const XHRUrl = util.httpEnv()+"/mcall/customer/patient/case/v2/create/";
export default function createCase(param) {
  return new Promise((resolve, reject) => {
    ajax({
      url: XHRUrl,
      method: "POST",
      data: param,
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

/**
 * @Desc：发送验证码
 * @Usage:
 * @Notify：
 * @Depend：
 *
 * Created by lichenyang on 18/05/16.
 */

import util from "common/js/util/util";
const XHRUrl = util.httpEnv() + "/mcall/wx/api/v1/jscode2session/";

import ajax from 'common/js/util/ajax';
export default function getOpenId (code) {
  return new Promise((resolve, reject) => {
    ajax({
      url: XHRUrl,
      method: "POST",
      data: {
        code
      },
      timeout: 10000,
      done(res) {
        resolve(res);
      },
      fail(err) {
        reject(err);
        throw new Error(err);
      }
    })
  })
}
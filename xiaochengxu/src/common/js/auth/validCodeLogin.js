/**
 * @Desc：发送验证码
 * @Usage:
 * @Notify：
 * @Depend：
 *
 * Created by lichenyang on 18/05/16.
 */

import util from "common/js/util/util";
const XHRUrl = util.httpEnv() + "/mcall/patient/customer/unite/v1/validCodelogin/";

import ajax from 'common/js/util/ajax';
export default function validCodeLogin ({userType=1,account,isValid=1,codeId,validCode,optType= 1,typeId}=param) {
  return new Promise((resolve, reject) => {
    ajax({
      url: XHRUrl,
      method: "POST",
      data: {
        userType,
        account,
        isValid,
        codeId,
        validCode,
        optType,
        typeId
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
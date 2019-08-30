/**
 * @Desc：发送验证码
 * @Usage:
 * @Notify：
 * @Depend：
 *
 * Created by lichenyang on 18/05/16.
 */

import util from "common/js/util/util";
const XHRUrl = util.httpEnv() + "/mcall/patient/customer/unite/v1/quickSendCode/";

import ajax from 'common/js/util/ajax';
export default function sendCode ({account,accountType=0}=param) {
  return new Promise((resolve, reject) => {
    ajax({
      url: XHRUrl,
      method: "POST",
      data: {
        // userType,//用户类型 0医生用户 1患者用户
        account, //账号
        accountType, //账号类型,0手机 1邮箱
        // operateType, //1-绑定手机 2－修改手机号 3-手机号找回p密码 5-手机号注册 8-手机号快捷登录 9-老患者报到 16-患者注册
        // codeLength,
        siteId:'24',
        // typeId, //1-修改/重置密码2-账号验证(绑定手机、手机号注册)3-手机快捷登录4-老患者报到5-短信通知	
      },
      timeout: 10000,
      done(res) {
        resolve(res);
      },
      fail(err) {
        reject(err);
        // throw new Error(err);
      }
    })
  })
}

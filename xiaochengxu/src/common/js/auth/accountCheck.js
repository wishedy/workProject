/**
 * @Desc：微信绑定帐号与新号校验
 * @Usage:
 * @Notify：
 * @Depend：
 *
 * Created by jukun on 18/03/12.
 */

import api from "common/js/util/util";

const XHRList = {
  checkBinding:api.httpEnv() + "/mcall/patient/customer/unite/v1/userInfoByOpenId/"
}

export default class AccountCheck {
  constructor() {
  }

  getMessage(account) {
    return new Promise((resolve, reject) => {
      api.ajax({
        url: XHRList.checkBinding,
        method: "post",
        data: {
          unionId:account.unionId
        },
        timeout: 10000,
        done(res) {
          if(res&&res.responseObject){
            resolve(res.responseObject);
          }else{
            reject("数据错误");
          }
        }
      })
    });

  }
}



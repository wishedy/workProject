/**
 * @Desc：微信绑定其他帐号
 * @Usage:
 * @Notify：
 * @Depend：
 *
 * Created by jukun on 18/03/08.
 */

import ajax from "common/js/util/ajax";
import api from "common/js/util/util";

const XHRList = {
  checkBinding: api.httpEnv() + "/mcall/patient/customer/unite/v1/mobileBungWeixin/"
}

export default class Upbinding {
  constructor() {

  }

  getMessage(phNum) {
    return new Promise((resolve, reject) => {
      ajax({
        url: XHRList.checkBinding,
        method: "post",
        data: {
            account:phNum.account,
            openid:phNum.openid,
            unionId:phNum.unionId,
            visitSiteId:api.getSiteId(),
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



/**
 * @Desc：登录并注册
 * @Usage:
 * @Notify：
 * @Depend：
 *
 * Created by jukun 18/03/06.
 */

import ajax from "common/js/util/ajax";
import api from "common/js/util/util";
const XHRList = {
  checkBinding: api.httpEnv() + "/mcall/patient/customer/unite/v1/mobileLoginOrRegister/"
}

export default class Checkbinding {
  constructor() {

  }

  getMessage(phNum) {
    return new Promise((resolve, reject) => {
      ajax({
        url: XHRList.checkBinding,
        method: "post",
        data: {
          account:phNum.account,
          validCode:phNum.validCode,
          accountType: 0,
          codeId:phNum.codeId,
          visitSiteId:api.getSiteId()
        //   mobile:phNum,
        //   isValid:1
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



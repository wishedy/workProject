/**
 * @Desc：获取个人信息
 * @Usage:
 * @Notify：
 * @Depend：
 *
 * Created by Qiangkailiang on 17/12/7.
 */

import api from "../util/util";

const XHRList = {
  getPersonal:api.httpEnv() + "/mcall/patient/customer/unite/v1/getPatientInfo/"
}

export default class checkSession {
  constructor() {

  }

  getMessage(customerId) {
    console.log(customerId);
    return new Promise((resolve, reject) => {
      ajax({
        url: XHRList.getPersonal,
        method: "post",
        data: {
          customerId:customerId
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
    });

  }
}

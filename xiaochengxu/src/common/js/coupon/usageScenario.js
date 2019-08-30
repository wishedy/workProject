/**
 * @Desc：优惠券使用场景
 * @Usage:
 * @Notify：
 * @Depend：
 *
 * Created by jukun on 18/06/25.
 */

import api from "common/js/util/util";

const XHRList = {
    usageScenario: api.httpEnv() + "/mcall//promotion/sub/getInfoScene/"
}

export default class UsageScenario {
  constructor() {

  }

  getMessage(cou) {
    return new Promise((resolve, reject) => {
      api.ajax({
        url: XHRList.usageScenario,
        method: "post",
        data: cou,
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



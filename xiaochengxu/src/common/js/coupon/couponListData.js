/**
 * @Desc：优惠券列表
 * @Usage:
 * @Notify：
 * @Depend：
 *
 * Created by jukun on 18/03/12.
 */

import api from "common/js/util/util";

const XHRList = {
  checkBinding: api.httpEnv() + "/mcall/promotion/sub/getMapList/"
}

export default class CouponList {
  constructor() {

  }

  getMessage(cou) {
    return new Promise((resolve, reject) => {
      api.ajax({
        url: XHRList.checkBinding,
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



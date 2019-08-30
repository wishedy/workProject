/**
 * @Desc：优惠券数量获取
 * @Usage:
 * @Notify：
 * @Depend：
 *
 * Created by jukun on 18/06/25.
 */

import api from "common/js/util/util";

const XHRList = {
    couponNum: api.httpEnv() + "/mcall/promotion/sub/getNumByType/"
}

export default class GetcouponNum {
  constructor() {

  }

  getMessage(cou) {
    return new Promise((resolve, reject) => {
      api.ajax({
        url: XHRList.couponNum,
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



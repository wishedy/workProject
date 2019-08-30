/**
 * @Desc：优惠券兑换
 * @Usage:
 * @Notify：
 * @Depend：
 *
 * Created by jukun on 18/06/25.
 */
import api from "common/js/util/util";

const XHRList = {
    exchange: api.httpEnv() + "/mcall/promotion/sub/update/"
}

export default class Exchange {
  constructor() {

  }

  getMessage(cou) {
    return new Promise((resolve, reject) => {
      api.ajax({
        url: XHRList.exchange,
        method: "post",
        data: cou,
        done(res) {
          if(res&&res.responseObject){
            resolve(res.responseObject);
          }else{
            reject("数据错误");
          }
        },
        fail(){
          reject("数据错误");
        }
      })
    });

  }
}



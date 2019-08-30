/**
 * @Desc：医生基本信息
 * @Usage:
 * @Notify：
 * @Depend：
 *
 * Created by jukun on 18/08/15.
 */

import api from "common/js/util/util";

const XHRList = {
    getMapById: api.httpEnv() + "/mcall/customer/auth/v2/getMapById/"
}

export default function doctorBaseInfo(param) {
    return new Promise((resolve, reject) => {
      api.ajax({
        url: XHRList.getMapById,
        method: "post",
        data: param,
        timeout: 10000,
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
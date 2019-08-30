/**
 * @Desc：
 * @Usage:
 * @Notify：
 * @Depend：
 *
 * Created by YuxiYang on 2018/4/12.
 */
const XHRList= "/mcall/comm/ip/v1/getAddressByIp/";

import ajax from "common/js/util/ajax";

export default function getAreaList() {
  return new Promise((resolve,reject)=>{
    ajax({
      url:XHRList,
      method: "post",
      data:{},
      done(data){
        resolve(data);
      },
      fail(err){
        reject(err);
      }
    })
  });
}

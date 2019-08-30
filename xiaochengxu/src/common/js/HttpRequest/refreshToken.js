/**
 * @Desc：重新刷新TokeN
 * @Usage:
 * @Notify：
 * @Depend：
 *
 * Created by Hallmader on 2018/3/15.
 */


import api from "common/js/util/util";
const XHRUrl = api.httpEnv() +"/mcall/im/interact/v1/refreshToken/";


export default function refreshToken(param) {
  const _default={};

  const data=Object.assign(_default,param);
  return new Promise((resolve, reject) => {
    api.ajax({
      url: XHRUrl,
      method: "POST",
      data,
      done(data){
        resolve(data);
      },fail(err){
        reject(err);
      }
    })
  })
}

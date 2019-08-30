/**
 * @Desc：头像/昵称上传接口
 * @Usage:
 * @Notify：
 * @Depend：
 *
 * Created by Yuxi(Shurrik)Yang on 2018/8/20.
 */

import util from "common/js/util/util";
const XHRUrl = util.httpEnv()+ "/mcall/patient/customer/unite/info/v1/createPicture/";

import ajax from "common/js/util/ajax";

export default function uploadAvator(param) {
  const _default={};

  const data=Object.assign(_default,param);
  return new Promise((resolve, reject) => {
    ajax({
      url: XHRUrl,
      method: "POST",
      data,
      done(data) {
        resolve(data)
      },
      fail(err) {
        reject(err);
      }
    });
  });
}

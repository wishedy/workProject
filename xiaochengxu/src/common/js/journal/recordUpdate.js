/**
 * @Desc：更新日记 更新状态
 * @Usage:
 * @Notify：
 * @Depend：
 *
 * Created by JK on 2018/12/6.
 */


import ajax from "common/js/util/ajax";
import api from "common/js/util/util";

const XHRList = api.httpEnv()+"/mcall/rehabilitative/diary/supplement/record/v1/update/";

export default function recordUpdate(param) {
  return new Promise((resolve, reject) => {
    ajax({
      url: XHRList,
      method: "POST",
      data:param,
      done(data){
        resolve(data);
      },
      fail(err){
        reject(err);
      }
    })
  })
};

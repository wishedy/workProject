/**
 * @Desc：首页获取部位列表
 * @Usage:
 * @Notify：
 * @Depend：
 *
 * Created by liChenYang on 2018/12/04.
 */

import util from "common/js/util/util";
const XHRUrl = util.httpEnv()+ "/mcall/rehabilitative/diary/v1/getDiaryPartList/";

import ajax from "common/js/util/ajax";

export default function getPartList(param) {
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

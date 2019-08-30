/**
 * @Desc：首页获取患者日记列表
 * @Usage:
 * @Notify：
 * @Depend：
 *
 * Created by Yuxi(Shurrik)Yang on 2018/8/22.
 */

import util from "common/js/util/util";
const XHRUrl = util.httpEnv()+ "/mcall/rehabilitative/diary/v1/getMapList2/";

import ajax from "common/js/util/ajax";

export default function getRecureJournal(param) {
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

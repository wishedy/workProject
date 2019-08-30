/**
 * @Desc：获取健康卡列表
 * @Usage:
 * @Notify：
 * @Depend：
 *
 * Created by JK on 2019/04/03.
 */

import api from "common/js/util/util";
const XHRUrl = api.httpEnv() + "/mcall/rehabilitative/diary/v1/getDiaryPartList/";

export default function getHealthCardList(param) {
  const _default = {};
  const data = Object.assign(_default, param);
  return new Promise((resolve, reject) => {
    api.ajax({
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

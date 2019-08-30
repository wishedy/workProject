/**
 * @Desc：捷迈二维码
 * @Usage:
 * @Notify：
 * @Depend：
 *
 * Created by Hallmader on 2018/6/25.
 */

import ajax from "common/js/util/ajax";

const XHRList = api.httpEnv() + "/mcall/cms/quick/mark/getMapList/";

export default function getZimmerLink(param) {
  const defaultData={};
  const data=Object.assign(defaultData,param);
  return new Promise((resolve, reject) => {
    ajax({
      url: XHRList,
      method: "post",
      data,
      done(data) {
        resolve(data);
      },
      fail(err) {
        reject(err);
      }
    })
  })
}

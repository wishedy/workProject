/**
 * @Desc：
 * @Usage:
 * @Notify：
 * @Depend：
 *
 * Created by Hallmader on 2018/3/9.
 */

import ajax from "common/js/util/ajax";
import util from "common/js/util/util";

export default function createJournal(param) {
  const XHRUrl =util.httpEnv()+"/mcall/rehabilitative/diary/v1/create/";
  return new Promise((resolve, reject) => {
    let obj = {
      sourceType:0,	//string	是	来源类型 (0-UGC 1-PGC)
      isValid:0, // 	是否有效（0-无效1-有效）
      visitSiteId:24,
    };
    let data = Object.assign(obj,param);
    ajax({
      url: XHRUrl,
      method: "POST",
      data,
      done(data) {
        resolve(data);
      },
      fail(err) {
        reject(err);
      }
    },'loading')
  });
}


/**
 * @Desc：
 * @Usage:
 * @Notify：
 * @Depend：
 *
 * Created by Hallmader on 2018/3/12.
 */
import util from "common/js/util/util";
const XHRUrl = util.httpEnv()+ "/mcall/qiniu/storage/v1/getToken/";

import ajax from "common/js/util/ajax";


export default function getQiniuToken(param) {
  return new Promise((resolve, reject) => {
    ajax({
      url: XHRUrl,
      method: "POST",
      data: {

      },
      done(data) {
        resolve(data)
      },
      fail(err) {
        reject(err);
      }
    },"loading");
  });
};

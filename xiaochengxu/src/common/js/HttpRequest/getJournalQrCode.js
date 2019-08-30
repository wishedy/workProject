/**
 * @Desc：
 * @Usage:
 * @Notify：
 * @Depend：
 *
 * Created by Hallmader on 2018/9/24.
 */
import util from "common/js/util/util";
import ajax from "common/js/util/ajax";

export default function getJournalQrCode(params) {
  const XHRUrl = util.httpEnv() +  "/mcall/rehabilitative/diary/v1/getQrCode/";
  const _defaultData = {};

  const data = Object.assign(_defaultData, params)
  return new Promise((resolve, reject) => {
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
    })
  })
}


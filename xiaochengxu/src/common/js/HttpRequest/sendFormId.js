/**
 * @Desc：验证身份证号和姓名是否匹配
 * @Usage:
 * @Notify：
 * @Depend：
 *
 * Created by lichenyang on 2018/3/27.
 */
import ajax from "common/js/util/ajax";
import util from "common/js/util/util";

export default function sendFormId(formId) {
  const XHRUrl = util.httpEnv()+"/mcall/log/tocure/patient/mini/v1/create/";
  return new Promise((resolve, reject) => {
    ajax({
      url: XHRUrl,
      method: "POST",
      data: {
        openId: wx.getStorageSync('openId'),
        formId,
      },
      done(data) {
        resolve(data);
      },
      fail(err) {
        console.log(err);
        reject(err);
      }
    })
  })
}

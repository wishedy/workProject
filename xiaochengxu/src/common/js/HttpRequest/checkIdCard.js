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

export default function checkIdCard(param) {
  const XHRUrl = util.httpEnv()+"/mcall/apix/interact/v2/checkIdCard/";
  return new Promise((resolve, reject) => {
    console.log(param)
    ajax({
      url: XHRUrl,
      method: "POST",
      data: {
        patientId:param.patientId,
        name:param.name,
        type:"idcard",
        cardno:param.cardno,
      },
      done(data) {
        resolve(data);
      },
      fail(err) {
        reject(err);
      }
    })
  });
}

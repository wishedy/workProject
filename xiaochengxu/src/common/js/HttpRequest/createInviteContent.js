/**
 * @Desc：
 * @Usage:
 * @Notify：
 * @Depend：
 *
 * Created by Hallmader on 2018/6/25.
 */
import util from "common/js/util/util";
import ajax from "common/js/util/ajax";

const XHRList = util.httpEnv()+ "/mcall/patient/invite/clinic/create/";

export default function createInviteContent(param) {
  const defaultData={};
  const data=Object.assign(defaultData,param);
  console.log("====================")
  console.log(data)
  return new Promise((resolve, reject) => {
    ajax({
      url: XHRList,
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

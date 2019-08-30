/**
 * @Desc：
 * @Usage:
 * @Notify：
 * @Depend：
 *
 * Created by Hallmader on 2018/5/17.
 */
import util from "common/js/util/util";
const XHRUrl = util.httpEnv()+"/mcall/tocure/patient/score/getByConsultId/";


export default function getServiceCommentStatus(param) {
  return new Promise((resolve, reject) => {
    util.ajax({
      url: XHRUrl,
      method: "POST",
      data: {
        consultationId: param.consultationId,
      },
      done(data) {
        resolve(data)
      },
      fail(err) {
        reject(err);
      }
    },'loading');
  });
}

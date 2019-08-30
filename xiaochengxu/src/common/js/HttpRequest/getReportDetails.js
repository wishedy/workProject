/**
 * @Desc：
 * @Usage:
 * @Notify：
 * @Depend：
 *
 * Created by Hallmader on 2018/5/17.
 */
import util from "common/js/util/util";
const XHRUrl = util.httpEnv()+"/mcall/patient/report/improvement/v1/getMapById/";


export default function getReportDetails(param) {
  return new Promise((resolve, reject) => {
    util.ajax({
      url: XHRUrl,
      method: "POST",
      data: {
        reportId: param.reportId,
        visitSiteId:util.getSiteId(),
        isValid:1
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

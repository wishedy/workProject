/**
 * @Desc：获取分诊医生工作时间
 * @Usage:
 * @Notify：
 * @Depend：
 *
 * Created by Hallmader on 2018/3/15.
 */


import api from "common/js/util/util";
const XHRUrl = api.httpEnv() +"/mcall/customer/traige/v1/getMapById/";


export default function getTriageWorkingTime(param) {
  return new Promise((resolve, reject) => {
    api.ajax({
      url: XHRUrl,
      method: "POST",
      data: {
        visitSiteId: api.getSiteId(),
        maxResult: 999,
        id: 0
      },
      done(data){
        resolve(data);
      },fail(err){
        reject(err);
      }
    })
  })
}

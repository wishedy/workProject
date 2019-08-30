/**
 * @Desc：
 * @Usage:
 * @Notify：
 * @Depend：
 *
 * Created by YuxiYang on 2018/11/5.
 */

import ajax from "common/js/util/ajax";
import util from "common/js/util/util";
const XHRList =util.httpEnv()+ "/mcall/customer/prefer/v1/createPreferNum/";

export default function getHasInvitedConsult(param) {
  const defaultData = {
    refId:'',
    preferUpNum:0 ,
    customerId:'',
    usefulType:1,
    upDownType:1,
    sendSiteIdsendSiteId:util.getSiteId
  };
  const data = Object.assign(defaultData, param);
  return new Promise((resolve, reject) => {
    ajax({
      url: XHRList,
      method: "POST",
      data,
      done(result) {
        resolve(result);
      },
      fail(err) {
        reject(err);
      }
    })
  })
}

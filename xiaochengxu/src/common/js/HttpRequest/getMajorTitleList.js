/**
 * @Desc：
 * @Usage:
 * @Notify：
 * @Depend：
 *
 * Created by Hallmader on 2018/3/27.
 */
import ajax from "common/js/util/ajax";
import api from "common/js/util/util";

const XHRList = api.httpEnv() + "/mcall/comm/data/baseinfo/v1/getRoleConfigList/";


export default function getMajorTitleList(param) {
  return new Promise((resolve, reject) => {
    ajax({
      url: XHRList,
      method: "POST",
      data: {
        typeId: param.typeId,
        firstResult: param.firstResult,
        maxResult: param.maxResult,
        isValid: 1,
        visitSiteId:19
      },
      done(data) {
        resolve(data);
      },
      fail(err) {
        reject(err);
      }
    })
  })
}

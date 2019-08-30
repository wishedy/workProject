/**
 * @Desc：
 * @Usage:
 * @Notify：
 * @Depend：
 *
 * Created by YuxiYang on 2018/4/12.
 */
const XHRList =  api.httpEnv() + "/mcall/customer/auth/v1/getHotWordTagList/";

import ajax from "common/js/util/ajax";
import api from "common/js/util/util";

export default function getAreaList(param) {
  return new Promise((resolve, reject) => {
    ajax({
      url: XHRList,
      method: "post",
      data: {
        flag:param.flag
      },
      done(data) {
        resolve(data);
        console.log(data)
      }
      ,
      fail(err) {
        reject(err);
      }
    })
  })
    ;
}

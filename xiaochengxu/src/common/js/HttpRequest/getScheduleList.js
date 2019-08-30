/**
 * @Desc：获取医生某段时间内排班(复杂版)
 * @Usage:
 * @Notify：
 * @Depend：
 *
 * Created by lichenyang on 2018/5/8.
 */

import ajax from "common/js/util/ajax";

export default function getScheduleList(param) {
  const XHRUrl = "/mcall/customer/registration/v1/getScheduleList/";
  return new Promise((resolve, reject) => {
    ajax({
      url: XHRUrl,
      method: "POST",
      data: {
        caseId:param.caseId,
        customerId: param.doctorCustomerId,
        dataType:1,// string	是	返回数据类型		可为空，默认：1
        outpdate_start: param.outpdataStart, // string	是	门诊日期开始 datetime yyyy-mm-dd 必须不小于今天		不可为空
        outpdate_end:param.outpdateEnd, // 	string	是	门诊日期结束 datetime yyyy-mm-dd		不可为空
        firstResult:0, //	string	是	从第几条开始		不可为空
        maxResult:30, // string	是	每页多少条
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


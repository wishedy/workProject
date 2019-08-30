/**
 * @Desc：获取医生某段时间内排班(精简版)
 * @Usage:
 * @Notify：
 * @Depend：
 *
 * Created by lichenyang on 2018/5/8.
 */

import ajax from "common/js/util/ajax";
import util from "common/js/util/util";
export default function getDoctorSchedule(param) {
  const XHRUrl = util.httpEnv()+ "/mcall/customer/registration/v1/getDoctorSchedule/";
  return new Promise((resolve, reject) => {
    ajax({
      url: XHRUrl,
      method: "POST",
      data: {
        caseId:param.caseId,
        customerId: param.doctorCustomerId,
        deptcode:param.deptcode, // 科室编号
        dataType:1,// string	是	返回数据类型
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


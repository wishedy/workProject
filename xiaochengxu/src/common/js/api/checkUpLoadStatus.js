/**
 * @Desc：查看用户是否上传过图片
 * @Usage:
 * @Notify：
 * @Depend：
 *
 * Created by JuKun on 17/12/25.
 */

import api from "common/js/util/util";
const XHRList = {
  validLogin: "/mcall/customer/patient/case/attachment/v1/getMapListByPatientCustomerId/"
};
export default class GetIsUpload {
  constructor() {

  }

  getDataInit(param) {
    return new Promise((resolve, reject) => {
      api.ajax({
        url: XHRList.validLogin,
        method: "POST",
        data: {
          patientCustomerId:param.patientCustomerId
        },
        timeout: 10000,
        done(res) {
          resolve(res);
        },
        fail(err) {
          if (err) {
            reject(err);
            throw new Error(err);
          }
        }
      })
    })
  }
}

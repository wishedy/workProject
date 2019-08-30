/**
 * @Desc：发送验证码
 * @Usage:
 * @Notify：
 * @Depend：
 *
 * Created by lichenyang on 18/05/16.
 */
// import api from "common/js/util/util";
import util from "common/js/util/util";
const XHRUrl = util.httpEnv() + "/mcall/patient/report/improvement/v1/update/";

import ajax from 'common/js/util/ajax';
export default function questionSubmit(param) {
  return new Promise((resolve, reject) => {
    let _data = {
      reportType: param.reportType ? param.reportType : '',                //就诊类型：默认0，1-门诊患者，2-住院患者，3-未就诊
      doctorDiagnosis: param.doctorDiagnosis ? param.doctorDiagnosis : '', //医生诊断
      visitDate: param.visitDate,                                          //就诊时间
      dateType: param.dateType,                                            //时间类型：默认0，1-上午，2-下午，3-晚上
      siteId: util.getSiteId(),
    }
    let _wxStorage = wx.getStorageSync('patientInfo');
    let _patientInfo = '';

    if (_wxStorage.trim().length > 0) {
      _patientInfo = JSON.parse(_wxStorage);
    }
    //图片主键id
    if (!!param.attIds) {
      _data.attIds = param.attIds;
    }
    //历史图片主键id
    if (param.delAttIds) {
      _data.delAttIds = param.delAttIds;
    }
    //患者姓名
    if (_patientInfo.patientName && _patientInfo.patientName.length > 0) {
      _data.patientName = _patientInfo.patientName;
    }
    //患者报道ID
    let reportId = wx.getStorageSync('reportId');
    if (reportId && reportId.toString().length > 0) {
      _data.reportId = reportId;
    }
   
    ajax({
      url: XHRUrl,
      method: "POST",
      data: _data,
      timeout: 10000,
      done(res) {
        resolve(res);
      },
      fail(err) {
        reject(err);
        throw new Error(err);
      }
    })
  })
}

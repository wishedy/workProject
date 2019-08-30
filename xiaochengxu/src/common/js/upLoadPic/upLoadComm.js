/**
 * @Desc：上传图片
 * @Usage:
 * @Notify：
 * @Depend：
 *
 * Created by Jukun on 18/05/16.
 */

import util from "common/js/util/util";
const XHRUrl = util.httpEnv() + "/mcall/customer/patient/case/attachment/v1/update/";

import ajax from 'common/js/util/ajax';
export default function updateLoad (param) {
  return new Promise((resolve, reject) => {
    ajax({
      url: XHRUrl,
      method: "POST",
      data: {
        id:param.id,	    //string	是			
        isValid:param.isValid	//	string	是	是否有效0-无效1-有效	//	string	是	附件来源0-就医辅助(检查资料)1-视诊2-初诊建议3-检查检验4-患处照片5-分诊检查资料6-分诊患病处照片7-患者IM照片8-分诊医生IM图片9-主治医生IM图片10-患者发给分诊医生的IM视频11-分诊医生IM视频12-主治医生IM视频13-患者IM文件14-分诊医生IM文件15-主治医生IM文件16-患者发给医生的IM视频17-患者报到上传图片		
      },
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
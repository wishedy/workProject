/**
 * @Desc：完善保存报道信息
 * @Usage:
 * @Notify：
 * @Depend：
 *
 * Created by ZH on 2019/2/19.
 */

import ajax from "common/js/util/ajax";
import api from "common/js/util/util";
import pageInfoStr from "./pageInfo";


const XHRList = api.httpEnv()+"/mcall/patient/report/content/v2/createReport/";
export default function getReportList(param) {
  let pageInfo=JSON.parse(pageInfoStr);
  param.reportType=pageInfo[param.sortId-1].reportType;
  param.completionDegree=pageInfo[param.sortId-1].completionDegree;
  param.pageSort=pageInfo[param.sortId-1].pageSort;
  param.customerId=wx.getStorageSync('userId');
  if(param.reportContentList&&param.reportContentList.length){
    for(let i=0;i<param.reportContentList.length;i++){
      if(param.oldReportContentList[i]){
        pageInfo[param.sortId-1].reportContentList[i].id=param.oldReportContentList[i].id;
      }else {
        pageInfo[param.sortId-1].reportContentList[i].id='';
      }
      pageInfo[param.sortId-1].reportContentList[i].reportValue=param.reportContentList[i].reportValue;
    }
    param.reportContentList=pageInfo[param.sortId-1].reportContentList;
  }
  delete param.oldReportContentList;
  return new Promise((resolve, reject) => {
    ajax({
      url: XHRList,
      method: "POST",
      data:param,
      done(data){
        resolve(data);
      },
      fail(err){
        wx.showToast({
          title:'接口错误',
          icon:'none'
        });
        reject(err);
      }
    })
  })
};

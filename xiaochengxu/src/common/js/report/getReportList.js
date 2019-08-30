/**
 * @Desc：获取报道信息
 * @Usage:
 * @Notify：
 * @Depend：
 *
 * Created by ZH on 2019/2/19.
 */

import ajax from "common/js/util/ajax";
import api from "common/js/util/util";
import pageInfoStr from "./pageInfo";

const XHRList = api.httpEnv()+"/mcall/patient/report/content/v2/getReportList/";
export default function getReportList(param) {
  if(param.sortId){
    let pageInfo=JSON.parse(pageInfoStr);
    let pageInfoSort=pageInfo[param.sortId-1];
    param.pageSort=pageInfoSort.pageSort;
    param.reportContentList=pageInfoSort.reportContentList;
    // if(pageInfoSort.reportContentList&&pageInfoSort.reportContentList.length){
    //   for(let i=0;i<pageInfoSort.reportContentList.length;i++){
    //     pageInfoSort.reportContentList[i].id='';
    //     pageInfoSort.reportContentList[i].reportValue='';
    //   }
    //   param.reportContentList=pageInfoSort.reportContentList;
    // }
  }

  return new Promise((resolve, reject) => {
    ajax({
      url: XHRList,
      method: "POST",
      data:param,
      done(data){
        if(data&&data.responseObject&&data.responseObject.responseMessage&&data.responseObject.responseMessage=='success'){
          let responseData=data.responseObject.responseData;
          if(param.sortId&&responseData&&responseData.reportMap&&responseData.reportMap.reportContentList&&responseData.reportMap.reportContentList.length>=2){
            console.log('dsfs')
            let reportContentList=responseData.reportMap.reportContentList;
            let newArr=[];
            for (let i=0;i<reportContentList.length;i++){
              for (let j=0;j<param.reportContentList.length;j++){
                if(reportContentList[i].hasOwnProperty(param.reportContentList[j].reportFieldName)){
                  newArr[j]=reportContentList[i];
                  break;
                }
              }
            }
            responseData.reportMap.reportContentList=newArr;
          }
          resolve(responseData);

        }else {
          wx.showToast({
            title:'保存失败，请重试',
            icon:'none'
          });
        }

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

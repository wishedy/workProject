/**
 * @Desc：找医生列表
 * @Usage:
 * @Notify：
 * @Depend：
 *
 * Created by Hallmader on 2018/3/27.
 */


import ajax from "common/js/util/ajax";
import api from "common/js/util/util";

const XHRList = api.httpEnv() + "/mcall/customer/auth/v2/getMapList/";
export default function getDoctorFilterList(param) {
  return new Promise((resolve, reject) => {
    ajax({
      url: XHRList,
      method: "POST",
      data:{
        searchCustomerQuality:1,
        areasExpertise: param.areasExpertise,
        searchRegion: param.searchRegion,
        searchHospitalLevel: param.searchHospitalLevel,
        searchSortType: param.searchSortType,
        searchTitleLevel: param.searchTitleLevel,
        indexType: param.indexType,
        solrContent:param.solrContent,
        logoUseFlag: param.logoUseFlag,
        visitSiteId: api.getSiteId(),
        firstResult: param.firstResult,
        maxResult: param.maxResult
      },
      done(data){
        resolve(data);
      },
      fail(err){
        reject(err);
      }
    },'loading')
  })
};

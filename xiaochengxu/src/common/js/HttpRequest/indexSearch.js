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

const XHRList = api.httpEnv() + "/mcall/rehabilitative/diary/v1/getSearchMapList2/";
export default function indexSearchList(param) {
  return new Promise((resolve, reject) => {
    ajax({
      url: XHRList,
      method: "POST",
      data: {
        searchParam: param.searchParam,       //	string	是	搜索关键词
        solrType: param.solrType,             //	string	是	1-全部（医生列表与日记列表）		只搜日记列表（不传改参数）
        visitSiteId:param.visitSiteId,       //	string	是	站点
        firstResult: param.firstResult,       //	string	是	分页参数
        maxResult: param.maxResult,         //	string	是	分页参数
        imgUseFlag: param.imgUseFlag,
        isValid: 1
      },
      done(data) {
        resolve(data);
      },
      fail(err) {
        reject(err);
      }
    }, 'loading')
  })
};

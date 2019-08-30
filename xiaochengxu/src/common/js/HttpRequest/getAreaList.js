/**
 * @Desc：
 * @Usage:
 * @Notify：
 * @Depend：
 *
 * Created by Hallmader on 2018/3/27.
 */
const XHRList= api.httpEnv() + "/mcall/comm/data/baseinfo/v1/getRegionList/";

import ajax from "common/js/util/ajax";
import api from "common/js/util/util";

export default function getAreaList(param) {

  return new Promise((resolve,reject)=>{
    ajax({
      url:XHRList,
      method: "POST",
      data:{
        parentId: param.parentId,
        isValid: "1",
        firstResult: "0",
        maxResult: "9999",
        treeLevel: param.level //1国2省3市4区
      },
      done(data){
        resolve(data);
      },
      fail(err){
        reject(err);
      }
    })
  });
}

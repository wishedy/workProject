/**
 * @Desc：获取日记详情
 * @Usage:
 * @Notify：
 * @Depend：
 *
 * Created by Hallmader on 2018/3/27.
 */


import ajax from "common/js/util/ajax";
import util from "common/js/util/util";

const XHRList = util.httpEnv()+"/mcall/rehabilitative/diary/v1/getDiaryDetailsMapById/";

export default function getDiaryDetails(param) {
    const _default = {};
    const _param = Object.assign(_default,param)
    return new Promise((resolve, reject) => {
        ajax({
        url: XHRList,
        method: "POST",
        data:_param,
        done(data){
            resolve(data);
        },
        fail(err){
            reject(err);
        }
        })
    })
};



/**
 * @Desc：保存视频
 * @Usage:
 * @Notify：
 * @Depend：
 *
 * Created by Hallmader on 2018/12/12.
 */


import ajax from "common/js/util/ajax";
import util from "common/js/util/util";

const XHRList = util.httpEnv()+"/mcall/qiniu/storage/v1/saveVideoInfo/";

export default function saveVideoInfo(param) {
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

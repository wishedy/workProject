/**
 * @Desc：
 * @Usage:
 * @Notify：
 * @Depend：
 *
 * Created by qiangkailiang on 2017/8/18.
 */
import api from '../util/util';
class wxStrings {
  constructor(Obj) {}
  //随机串
  mathRandom(Obj) {
    let code = "";
    let codeLength = Obj.numberValue,
      random = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'];
    for (let i = 0; i < codeLength; i++) {
      let index = Math.floor(Math.random() * 36);    //取得随机数的索引（0~35）
      code += random[index];
    }
    return code.toLowerCase();
  }
  //获取token(微信中使用==>不影响线上支付)
  wxGetToken(Obj) {
    let _nonceStr = this.mathRandom({numberValue: 32});
    let appid = "";
    if (api.httpEnv() === "https://m1.allinmed.cn") {
      appid = "wx10cbfc34b9c5313e";
    } else {
      appid = "wxf052983f21c708dd";
    }
    api.ajax({
      url:api.httpEnv() + '/mcall/base/pay/external/v1/getToken/',
      method: "POST",
      data: {
        "roleId": 2,
        "nonceStr": _nonceStr,     //随机数
        "siteId": 1,
        "appid":appid, //appId
        "deviceToken":wx.getStorageSync('JSESSIONID'),
        "mch_id":"1487363262"          //商户ID
      },
      done (data) {
        if(data&&data.responseData&&data.responseData.token&&data.responseData.token.length>0){
          Obj.callBack({
            data: data,
            nonceStr: _nonceStr
          });
        }
      }
    });
  }
}

export default new wxStrings();

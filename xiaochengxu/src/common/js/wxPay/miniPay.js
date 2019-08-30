/**
 * @Desc：小程序支付
 * @Usage:
 * @Notify：
 * @Depend：
 * Created by JuKun on 2017/8/21.
 */
import api from '../util/util';
import wxStrings from './wxCommString';
import upOrder from './upOrderStatus';

export default function miniPay(Obj) {
  const XHRList = {
    prepayPth: api.httpEnv() + '/mcall/base/pay/external/v1/createPrepaidOrder/'        //预支付订单
  };
  let op = {};

  class payObj {
    constructor() {
      this.wxReady();
    }
    //ready函数
    wxReady() {
      let _t = this;
      wxStrings.wxGetToken({
        callBack: function (res) {
          if (res.data.responseStatus) {
            op.token = res.data.responseData.token;  //token
            op.nonceStr = res.nonceStr;              //随机数
            op.ipAddr = res.data.responseData.ipAddr;  //ip
            _t.prepaidOrder({
              token: op.token,
              nonceStr: op.nonceStr,
              ipAddr: op.ipAddr
            });
          }
        }
      });
    }

    //生成预支付订单
    prepaidOrder(pv) {
      let _t = this;
      let appid = "";
      if (api.httpEnv() === "https://m1.allinmed.cn") {
        appid = "wx10cbfc34b9c5313e";
      } else {
        appid = "wxf052983f21c708dd";
      }
      let _data = {
        "total_fee": Obj.total_fee * 100,            //订单总金额
        "body": "唯医骨科-" + Obj.body,               //订单描述
        "trade_type": "JSAPI",                       //支付模式 JSAPI--公众号支付、NATIVE--原生扫码支付、APP--app支付
        "scene": 1,                                  //支付场景
        "siteId": 1,                                 //站点
        "roleId": '2',
        "appid": appid,                   //appId
        "deviceToken": wx.getStorageSync('JSESSIONID'),  //保持sessionId不变
        "mch_id": "1487363262",                         //商户ID
        "openid": wx.getStorageSync("openId"),
        "nonceStr": pv.nonceStr,                     //随机数
        "token": pv.token,
        "ipAddr": pv.ipAddr                           //用户的ip
      };
      console.log("-------------预支付参数--------------", _data);
      api.ajax({
        url: XHRList.prepayPth,
        method: "POST",
        data: _data,
        done(data) {
          if (data && data.return_msg == "OK") {
            let pvResult = data;
            //更新订单状态
            upOrder({
              operationType: '1',                  //操作类型  1-生成订单  2-已支付  3-支付失败  4-取消  5-退款 6-已完成
              orderId: Obj.orderId,                //订单ID
              outTradeNo: pvResult.out_trade_no,       //微信支付订单Id
              callBack: function () {
                _t.miniPayInit(pvResult);
              }
            });
          }
        }
      });
    }

    //请求小程序支付
    miniPayInit(obj) {
      let that = this;
      wx.requestPayment({
        'timeStamp': obj.timeStamp,
        'nonceStr': obj.nonceStr,
        'package': "prepay_id=" + obj.prepay_id,
        'signType': 'MD5',
        'paySign': obj.sign,
        'success': function (res) {
          if (res.errMsg == "requestPayment:ok") {
            //更新订单状态
            if (Obj.orderSourceId == 0 && Obj.paySource !=0) {
              that.creatInquiryId({
                queryCallBack: function (sourceId) {
                  Obj.orderSourceId = sourceId;
                  that.paySuccess(obj);
                }
              })
            } else {
              that.paySuccess(obj);
            }
          }
        },
        'fail': function (err) {
          if (err.errMsg == "requestPayment:fail cancel") {
            that.payError(obj);
          }
        }
      })
    }

    paySuccess(ps) {
      upOrder({
        operationType: '2',
        orderId: Obj.orderId,
        orderSourceId: Obj.orderSourceId,
        outTradeNo: ps.out_trade_no,
        status: '2',
        payTime: '1',
        callBack: function () {
          console.log("更新订单成功");
          Obj.callBack({
            responseStatus: "true",
            out_trade_no: ps.out_trade_no
          });
        },
        errorCallBack: function () {
          console.log("更新订单失败");
        }
      });
    }

    payError(pe) {
      upOrder({
        operationType: '3',
        orderId: Obj.orderId,
        orderType: Obj.orderType,
        orderSourceId: Obj.orderSourceId,
        outTradeNo: pe.out_trade_no,
        payTime: '',                                           //支付时间 传1
        callBack: function () {
          Obj.callBack({
            responseStatus: "false"
          });
        },
        errorCallBack: function () {
          console.log("更新订单失败");
        }
      });
    }

    //咨询支付成功后创建咨询id----第一次支付加的容錯
    creatInquiryId (opt) {
      //获取是否已经存在咨询id
      api.ajax({
        url:  api.httpEnv() + "/mcall/customer/case/consultation/v1/getMapById/",
        method: "POST",
        data: {
          caseId: Obj.caseId,
          customerId: Obj.doctorId,
          consultationType: 1
        },
        done (data) {
          if (data.responseObject.responseMessage == "NO DATA"){
            api.ajax({
              url:  api.httpEnv() + "/mcall/customer/case/consultation/v1/create/",
              method: "POST",
              data: {
                caseId: Obj.caseId,
                customerId: Obj.doctorId,
                patientCustomerId: Obj.patientCustomerId,
                patientId: Obj.patientId,
                consultationType: 1,
                consultationState: -1,
                consultationLevel: 1,
                siteId: api.getSiteId(),
                caseType: 0
              },
              done (d) {
                if (d.responseObject.responseStatus) {
                  wx.setStorageSync("orderSourceId", d.responseObject.responsePk);
                  opt.queryCallBack(d.responseObject.responsePk);
                }
              }
            });
          }
        }
      });
    };
  }

  new payObj(Obj);
}

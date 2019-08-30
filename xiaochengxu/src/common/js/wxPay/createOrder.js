/**
 * @Desc：创建订单
 * @Usage:   createOrders({
                  data:{
                     caseId:'',                         //  string  是caseId
                     patientCustomerId:'1489998682602', //	string	是	患者所属用户id
                     patientId:'1491471348694',         // 	string	是	患者id
                     doctorId:'1234567890123',          //	string	是	医生id
                     orderType:'1',                     //	string	是	订单类型  1-咨询===诊后报道
                     orderSourceId:'1493697450391',     //	string	是	来源id，  对应 咨询id,手术单id，门诊预约id
                     orderSourceType:'1',               //	string	是	来源类型  咨询：0-免费  1-图文===诊后报道
                     orderAmount:0.01,                  //	string	否	订单金额  （单位/元 保留两位小数）
                     payAmount:0.01,                    //	string	是 	实际支付金额  （单位/元 保留两位小数）
                     status:'1',                        //	string	否	订单状态: 1-待支付 2-已支付 3-已完成 4-已取消 5-退款中
                     body:'唯医骨科线下预约手术支付',      //   string  否  订单描述 （微信支付展示用）
                     isCharge:"true"                    //   string  是  true-收费  false-免费
                     paySource:"0"                      //  string  否  支付来源   0-找医生 1-其他
                     promotionSubId:"",                 //	string	否	  优惠劵id
                     promotionAmount:""                 //  string	否	  优惠劵金额
                     promotionActivityId:"",            //  string	否	  优惠劵促销活动ID
                     promotionInfoName:"",              //	string	否	  优惠劵名称
                  }，
                  backCreateSuccess:function(_data){
                      //创建订单成功  （手术必选）
                  },
                  backCreateError:function(_data){
                      //创建订单失败  (必选)
                  },
                  wxPaySuccess:function(_data){
                      //支付成功回调  (咨询/门诊类型 必选)
                  },
                  wxPayError:function(_data){
                      //支付失败回调  (咨询/门诊类型 必选)
                  }
              });
 * Created by JuKun on 2017/5/15.
 * Fixed to ECMAScript6 by qiangkailiang on 2017/08/18
 */
import api from "../util/util";
import miniPay from "./miniPay";
export default function createOrders(Obj){
  const XHRList={
    createOrder:api.httpEnv() + "/mcall/cms/pay/order/v1/create/"    //创建订单
  };
  class CreateOrders {
    constructor(){
      this.init();
    }
    init(){
      this.firstLoad();
      console.log(Obj);
    }
    firstLoad(){
      const that = this;
      this.createOrderData={
        caseId:Obj.data.caseId,                       //	string	是	caseId
        patientCustomerId:Obj.data.patientCustomerId, //	string	是	患者所属用户id
        patientId:Obj.data.patientId,                 // 	string	是	患者id
        doctorId:Obj.data.doctorId,                   //	string	是	医生id
        orderType:Obj.data.orderType,                 //	string	是	订单类型:1-咨询===诊后报道
        orderSourceId:Obj.data.orderSourceId,         //	string	是	咨询id
        orderSourceType:Obj.data.orderSourceType,     //	string	是	来源类型:0-免费  1-图文===诊后报道
        orderAmount:Obj.data.orderAmount,             //	string	是	订单金额
        payAmount:Obj.data.payAmount,                 //	string	是	 实际支付金额
        status:Obj.data.isCharge=="true"?"1":"2",     //	string	是	订单状态1-待支付2-已支付3-已完成4-已取消5-退款中
        visitSiteId:api.getSiteId()                   //	string	是	站点
      };
      if(Obj.data.promotionSubId){
        this.createOrderData.promotionAmount=Obj.data.promotionAmount;           //  string	 优惠金额
        this.createOrderData.promotionActivityId=Obj.data.promotionActivityId;   //  string	 促销活动ID
        this.createOrderData.promotionSubId=Obj.data.promotionSubId;             //	 string	 优惠劵id
        this.createOrderData.promotionInfoName=Obj.data.promotionInfoName;       //	 string	 优惠劵名称
      }
      //创建支付订单
      api.ajax({
        url:XHRList.createOrder,
        method: "POST",
        data:this.createOrderData,
        done(data){
          if (data&&data.responseObject&&data.responseObject.responsePk){
            //是否免费
            if(Obj.data.isCharge==="true"){//付费
              that.goMiniPay(data.responseObject.responsePk);
            }else{//免费
              Obj.backCreateSuccess(data.responseObject.responsePk);
            }
          }else{
            //创建订单失败
            Obj.backCreateError();    //失败回调
          }
        }
      });
    }
    //去微信支付
    goMiniPay(orderId){
      miniPay({
        caseId:Obj.data.caseId,
        patientCustomerId:Obj.data.patientCustomerId,
        patientId:Obj.data.patientId,
        doctorId:Obj.data.doctorId,
        orderId:orderId,
        orderType:Obj.data.orderType,
        orderSourceId:Obj.data.orderSourceId,
        total_fee: Obj.data.payAmount,
        body: Obj.data.body,
        paySource:Obj.data.paySource,
        promotionSubId:Obj.data.promotionSubId?Obj.data.promotionSubId:"",
        callBack: function (data) {
          if(data.responseStatus ==="true"){
            Obj.wxPaySuccess();        //支付成功回调
          }else{
            Obj.wxPayError();          //支付失败回调
          }
        }
      })
    }
  }
  new CreateOrders(Obj);
};

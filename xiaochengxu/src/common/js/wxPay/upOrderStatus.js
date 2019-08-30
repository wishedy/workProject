/**
 * @Desc：更新订单状态
   * @Usage:   upOrder({
                   operationType:'',    //操作类型        1-生成订单  2-已支付  3-支付失败  4-取消  5-退款 6-已完成
                   orderId:'',          // 订单ID
                   outTradeNo:'',       //微信支付订单Id  (免费订单非必填)
                   status:'',           //订单状态        1-待支付  2-已支付  3-已完成  4-已取消  5-退款中
                   callBack:function(data){
                         //更新成功
                   },
                   errorCallBack:function(){
                         //更新失败
                   }
               });
 * @Notify：
 * @Depend：
 * Created by JuKun on 2017/4/5.
 */
import api from '../util/util';
export default function upOrder(Obj) {
  const XHRList = {
    upOrderStatusUrl:api.httpEnv() + '/mcall/cms/pay/order/v1/update/'
  };
  let _data ={
    orderId: Obj.orderId,                             //   string  是  订单ID
    visitSiteId: api.getSiteId()
  };
  class upOrderStatus{
    constructor(){
      this.init();
    }
    init(){
      switch (parseInt(Obj.operationType)) {    //1-生成订单  2-已支付  3-支付失败  4-取消  5-退款 6-已完成
        case 1:
          //1-预支付
          _data.outTradeNo = Obj.outTradeNo; //微信支付订单号
          break;
        case 2:
          //2-已支付
          _data.status = Obj.status;               //订单状态
          _data.payTime = Obj.payTime;             //支付时间
          _data.outTradeNo = Obj.outTradeNo;       //微信支付订单Id
          _data.orderSourceId = Obj.orderSourceId;       //订单资源ID
          break;
        case 3:
          //3-支付失败
          if(Obj.promotionSubId){
            _data.promotionSubId = Obj.promotionSubId            //优惠券Id
          }
          _data.status = Obj.status;               //订单状态
          _data.outTradeNo = Obj.outTradeNo;       //微信支付订单ID
          _data.orderSourceId = Obj.orderSourceId;       //订单资源ID
          break;
        case 4:
          //4-取消
          if(Obj.promotionSubId){
            _data.promotionSubId = Obj.promotionSubId            //优惠券Id
          }
          _data.status = Obj.status;                             //订单状态
          _data.orderSourceId = Obj.orderSourceId;               //订单资源ID  '来源id，对应咨询id,手术单id，门诊预约id'
          break;
      }
      api.ajax({
        url:XHRList.upOrderStatusUrl,
        method: "POST",
        data:_data,
        done(data){
          if(data && data.responseObject && data.responseObject.responseStatus){
            Obj.callBack();
          }else{
            Obj.errorCallBack();
          }
        },
        fail(err){
          Obj.errorCallBack();
        }
      });
    }
  }
  new upOrderStatus(Obj);
}

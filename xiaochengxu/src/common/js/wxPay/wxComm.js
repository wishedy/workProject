/**
 * @Desc：微信支付相关模块列表
 * @Usage:
 * @Notify：
 * @Depend：
 *
 * Created by JuKun on 2017/8/21.
 */
import upOrder from './upOrderStatus';
import createOrders from './createOrder';
import miniPay from './miniPay';
import {mixin} from "@/common/js/allinmed_decorators/decorators";
@mixin({
  wxCreateOrder:createOrders,//创建订单
  wxUpOrder:upOrder, //更新订单状态
  miniPay:miniPay //小程序支付
})
class WxPayCommon {
  constructor(Obj) {}
}
export default new WxPayCommon();

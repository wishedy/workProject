<template>
  <section class="commodity-order-detail-container">
    <h3>充值订单 /  充值订单详情</h3>
    <section class="order-detail-content">
      <el-form class="content-for-order" label-width="120px">
        <h2 class="detail-content-title"><i class="icon-bg"></i><span>订单信息</span></h2>
        <el-row>
          <el-col :span="8">
            <el-form-item label="订单号">
              <el-input :disabled="true" v-model="formData.orderNumber"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="订单类型">
              <el-input :disabled="true" v-model="formData.orderTypeName"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="订单状态">
              <el-input :disabled="true" v-model="formData.orderStatusName"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <hr color="#dcdfe6"/>
        </el-row>
        <el-row>
          <el-col :span="8">
            <el-form-item label="订单创建时间">
              <el-input :disabled="true" v-model="formData.createTime"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="订单完成时间">
              <el-input :disabled="true" v-model="formData.paymentTime"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="8">
            <el-form-item label="订单金额">
              <el-input :disabled="true" v-model="formData.payAmount"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <h2 class="detail-content-title"><i class="icon-bg"></i><span>支付信息</span></h2>
        <el-row>
          <el-col :span="8">
            <el-form-item label="支付状态">
              <el-input :disabled="true" v-model="formData.payStateName"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="支付终端">
              <el-input :disabled="true" v-model="formData.sourceTypeName"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="支付方式">
              <el-input :disabled="true" v-model="formData.payTypeName"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="8">
            <el-form-item label="支付发起时间">
              <el-input :disabled="true" v-model="formData.prepayTime"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="支付完成时间">
              <el-input :disabled="true" v-model="formData.paymentTime"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="8">
            <el-form-item label="实际支付金额">
              <el-input :disabled="true" v-model="formData.actualPayment"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="退款情况">
              <el-input :disabled="true" v-model="formData.isExistRefundOrderName"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="8">
            <el-form-item label="支付流水号">
              <el-input :disabled="true" v-model="formData.platformSerialNumber"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="10">
            <el-form-item label="第三方支付流水号" label-width="160px">
              <el-input :disabled="true" v-model="formData.thirdPartSerialNumber"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <h2 class="detail-content-title"><i class="icon-bg"></i><span>买家信息</span></h2>
        <el-row>
          <el-col :span="8">
            <el-form-item label="买家ID">
              <el-input :disabled="true" v-model="formData.customerId"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="买家姓名">
              <el-input :disabled="true" v-model="formData.receiverName"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="8">
            <el-form-item label="手机号">
              <el-input :disabled="true" v-model="formData.receiverPhone"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="电子邮箱">
              <el-input :disabled="true" v-model="formData.email"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <h2 class="detail-content-title"><i class="icon-bg"></i><span>充值商品信息</span></h2>
      <el-table
        :data="commodityTableDataList"
        :fit="true"
        width="100%"
      >
<!--        <el-table-column-->
<!--          prop="productId"-->
<!--          label="商品ID">-->
<!--        </el-table-column>-->
        <el-table-column
          prop="productName"
          label="商品名称">
        </el-table-column>
        <el-table-column
          :formatter="foramtterMoney"
          prop="productPrice"
          label="商品金额">
        </el-table-column>
      </el-table>
      <div v-if="this.formData.orderType !== 3">
        <h2 class="detail-content-title" style="margin-top: 20px;"><i class="icon-bg"></i><span>退款信息</span></h2>
        <el-table
          :data="refundTableDataList"
          :fit="true"
          style="width: 100%">
          <el-table-column
            prop="refundNumber"
            label="退款单号">
          </el-table-column>
          <el-table-column
            prop="createTime"
            width="180"
            label="申请退款时间">
          </el-table-column>
          <el-table-column
            prop="refundFinishTime"
            width="180"
            label="退款完成时间">
          </el-table-column>
          <el-table-column
            :formatter="foramtterMoney"
            prop="refundAmount"
            label="退款金额">
          </el-table-column>
          <el-table-column
            prop="refundStatus"
            :formatter="refundStatusFor"
            label="退款状态">
          </el-table-column>
          <el-table-column
            prop="reason"
            label="退款原因">
          </el-table-column>
        </el-table>
      </div>
    </section>
  </section>
</template>

<script>
/**
 * CRM 管理后台，帐户管理——充值记录详情页
 * 注意事项：
 * author:zhanghongda
 * create-time:2019.06.21
 * 产品版本：新后台系统v1.9.0（大版本3.9）
 * 功能信息：
 *  1，
 */
import comm from '@/assets/js/utils/comm.js';
import apiUrlConfig from '@/api/apiUrlConfig';
import axios from '@/assets/js/utils/request';

export default {
  data() {
    return {
      orderId: '', // 商品订单id
      formData: {
        orderNumber: '', // 商品订单号
        orderAmount: 1, // 订单金额
        couponAmount: 1, // 优惠券抵扣金额
        payAmount: 1, // 支付订单金额
        orderType: 0, // 订单类型,1->普通订单；2->优惠卷订单；3->兑换码订单
        orderTypeName: '', // 订单类型中文
        orderStatus: 0, // 订单状态
        orderStatusName: '', // 订单状态中文
        createTime: '', // 订单创建时间
        paymentTime: '', // 订单完成时间
        chargePayState: '', // 支付状态
        payStateName: '', // 支付状态中文
        payType: '', // 支付方式
        payTypeName: '', // 支付方式中文
        sourceType: '', // 支付终端
        sourceTypeName: '', // 支付终端中文
        prepayTime: '', // 支付发起时间
        payTime: '', // 支付完成时间
        actualPayment: '', // 实际支付金额
        isExistRefundOrder: '', // 退款情况
        isExistRefundOrderName: '', // 退款情况中文
        platformSerialNumber: '', // 支付流水号
        thirdPartSerialNumber: '', // 第三方支付流水号
        customerId: '', // 买家ID
        receiverName: '', // 买家姓名
        receiverPhone: '', // 买家电话
        email: '' // 电子邮箱
      },
      commodityTableDataList: [], // 商品信息数据列表
      refundTableDataList: [], // 退款信息数据列表
      bigImgDialogVisible: false, // 查看大图标志是否显示
      bigImgTimer: null, // 查看大图的定时器
      bigImgPath: '' // 查看大图的地址
    };
  },
  methods: {
    getDetailData() {
      // 添加 loading
      comm.openLoading('加载中...');
      axios({
        type: apiUrlConfig.getOrderDetail.type,
        url: apiUrlConfig.getOrderDetail.url,
        params: {
          orderId: this.orderId
        }
      }).then((res) => {
        comm.closeLoading();
        if (res && res.data && res.data.responseObject && res.data.responseObject.responseData) {
          let responseData = res.data.responseObject.responseData;
          let _orderDetailResult = responseData.orderDetail;
          let _refundInfo = responseData.refundInfo;
          let productList = [{
            productId: (_orderDetailResult.chargeSourceType === 2) ? '-' : _orderDetailResult.productId,
            productName: _orderDetailResult.productName,
            productPrice: _orderDetailResult.productPrice
          }];
          this.commodityTableDataList = this.commodityTableDataList.concat(productList);
          // 订单数据赋值
          this.formData.orderNumber = _orderDetailResult.chargeOrderNumber;
          // 交易类型
          if (_orderDetailResult.chargeType) {
            switch (_orderDetailResult.chargeType) {
              case 1:
                this.formData.orderTypeName = '充值-购买充值';
                break;
              case 2:
                this.formData.orderTypeName = '充值-赠送充值';
                break;
              case 3:
                this.formData.orderTypeName = '充值-补单充值';
                break;
            }
          }
          // 订单状态
          if (_orderDetailResult.chargeOrderState) {
            switch (_orderDetailResult.chargeOrderState) {
              case 1:
                this.formData.orderStatusName = '未付款';
                break;
              case 2:
                this.formData.orderStatusName = '未发货';
                break;
              case 3:
                this.formData.orderStatusName = '已发货';
                break;
              case 5:
                this.formData.orderStatusName = '已关闭';
                break;
              case 7:
                this.formData.orderStatusName = '已退货';
                break;
            }
          }
          // 支付状态
          if (_orderDetailResult.chargePayState) {
            this.formData.chargePayState = _orderDetailResult.chargePayState;
            switch (parseInt(_orderDetailResult.chargePayState)) {
              case 1:
                this.formData.payStateName = '未支付';
                break;
              case 2:
                this.formData.payStateName = '已撤销';
                break;
              case 3:
                this.formData.payStateName = '已支付';
                break;
              case 6:
                this.formData.payStateName = '已退款';
                break;
            }
          }
          // 支付终端
          if (_orderDetailResult.chargeSourceType) {
            switch (parseInt(_orderDetailResult.chargeSourceType)) {
              case 1:
                this.formData.sourceTypeName = 'APP-IOS';
                break;
              case 2:
                this.formData.sourceTypeName = 'APP-Android';
                break;
              case 3:
                this.formData.sourceTypeName = '微信公众号';
                break;
              case 4:
                this.formData.sourceTypeName = '微信小程序';
                break;
              case 5:
                this.formData.sourceTypeName = 'PC订单';
                break;
              case 6:
                this.formData.sourceTypeName = '线下收款';
                break;
            }
          }
          // 退款详情
          switch (parseInt(_orderDetailResult.refundState)) {
            case 0:
              this.formData.isExistRefundOrderName = '无退款';
              break;
            case 1:
              this.formData.isExistRefundOrderName = '有退款';
              break;
          }
          // 支付方式
          switch (parseInt(_orderDetailResult.chargePayType)) {
            case 1:
              this.formData.payTypeName = '支付宝APP支付';
              break;
            case 2:
              this.formData.payTypeName = '微信APP支付';
              break;
            case 3:
              this.formData.payTypeName = '苹果IAP支付';
              break;
            case 4:
              this.formData.payTypeName = '其他支付';
              break;
            case 5:
              this.formData.payTypeName = '兑换码支付';
              break;
            case 7:
              this.formData.payTypeName = '微信JSAPI支付';
              break;
          }
          this.formData.actualPayment = '￥' + _orderDetailResult.chargePayAmount;
          this.formData.payAmount = '￥' + _orderDetailResult.chargeOrderAmount;
          this.formData.createTime = _orderDetailResult.createTime;
          this.formData.paymentTime = _orderDetailResult.paymentTime;
          this.formData.prepayTime = _orderDetailResult.prepayTime;
          this.formData.payTime = _orderDetailResult.payTime;
          this.formData.platformSerialNumber = _orderDetailResult.platformSerialNumber;
          this.formData.thirdPartSerialNumber = _orderDetailResult.thirdPartSerialNumber;
          this.formData.customerId = _orderDetailResult.customerId;
          this.formData.receiverName = _orderDetailResult.receiverName;
          this.formData.receiverPhone = _orderDetailResult.receiverPhone;
          this.formData.isExistRefundOrder = _orderDetailResult.isExistRefundOrder;
          this.formData.email = _orderDetailResult.email;
          // 退款详情
          if (JSON.stringify(_refundInfo) !== '{}') {
            let refundInfo = [{
              refundNumber: _refundInfo.refundNumber,
              createTime: _refundInfo.createTime,
              refundFinishTime: _refundInfo.refundFinishTime,
              refundAmount: _refundInfo.refundAmount,
              refundStatus: _refundInfo.refundStatus,
              reason: _refundInfo.reason
            }];
            this.refundTableDataList = this.refundTableDataList.concat(refundInfo);
          }
        }
        else {
          this.$allin_confirm({title: '提示', content: '查询失败', type: 'notice'});
        }
      }).catch((err) => {
        comm.closeLoading();
        this.$allin_confirm({title: '提示', content: '查询失败', type: 'notice'});
        console.log('充值订单详情数据请求异常：', err);
      });
    },
    foramtterMoney(row, col, cellValue) {
      // 面额格式化
      if (cellValue) {
        return '￥' + cellValue;
      }
    },
    // 退款状态
    refundStatusFor(row) {
      switch (parseInt(row.refundStatus)) {
        case 0:
          return '无退款';
        case 1:
          return '有退款';
      }
    }
  },
  created() {
    if (this.$route.query.orderId) {
      this.orderId = this.$route.query.orderId;
    }
  },
  mounted() {
    if (this.orderId) {
      this.getDetailData();
    }
  }
};
</script>

<style scoped lang="scss">
  .commodity-order-detail-container {
    width: 1200px;
    margin: 0 auto;
    background: #F6F7FA;
    margin-top: 32px;
    h3 {
      font-family: PingFangSC-Semibold;
      font-size: 20px;
      color: #2C343A;
      letter-spacing: 0;
      line-height: 20px;
      margin-bottom: 25px;
    }
    .order-detail-header {
      margin-bottom: 25px;
      .box-card {
        padding: 20px 0;
        div {
          display: inline-block;
          margin: 0 80px;
          &:nth-child(1) {
            margin-left: 0;
          }
          span {
            margin-left: 20px;
            font-weight: bolder;
            font-size: 16px;
          }
        }
        .header-coupon-amount {
          span {
            color: #FF3399;
          }
        }
      }
    }
    .order-detail-content {
      background: #fff;
      padding: 20px;
      margin-bottom: 50px;
      box-sizing: border-box;
      .detail-content-title {
        margin-bottom: 20px;
        .icon-bg {
          background: #0687FF;
          width: 3px;
          display: inline-block;
          vertical-align: middle;
          height: 16px;
          border-radius: 1px;
          margin-right: 5px;
        }
        span {
          display: inline-block;
          vertical-align: middle;
        }
      }
      hr {
        margin-bottom: 30px;
      }
    }
    /*列表查看大图的大图区域*/
    .tableBigImg {
      font-size: 0;
      width: 336px;
      height: 336px;
      box-sizing: border-box;
      background: #ffffff;
      box-shadow: 0 5px 16px 0 rgba(20, 38, 95, 0.27);

      position: fixed;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      z-index: 2;
      img {
        width: 100%;
        height: 100%;
        vertical-align: top;
        border-radius: 3px 3px 0 0;
      }
      &.tableBigImg212 {
        height: 212px;
        img {
          height: 212px;
        }
      }
      &.tableBigImg464 {
        height: 464px;
        img {
          height: 464px;
        }
      }

    }
  }
</style>

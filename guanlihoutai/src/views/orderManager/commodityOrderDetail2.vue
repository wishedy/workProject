<template>
  <section class="commodity-order-detail-container">
    <h3>商品订单/详情页V2.0</h3>
    <section class="order-detail-header" v-if="formData.orderType !== 3">
      <el-card class="box-card">
        <div class="header-commodity-amount">商品金额<span>{{formData.totalAmount}}</span></div>
        -
        <div class="header-coupon-amount">优惠券扣减金额<span>{{formData.couponAmount}}</span></div>
        =
        <div class="header-pay-amount">实收金额<span>{{formData.payAmount}}</span></div>
      </el-card>
    </section>
    <section class="order-detail-content">
      <el-form class="content-for-order" label-width="120px">
        <h2 class="detail-content-title"><i class="icon-bg"></i><span>订单信息</span></h2>
        <el-row>
          <el-col :span="8">
            <el-form-item label="订单号">
              <el-input :disabled="true" v-model="orderNumber"></el-input>
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
            <el-form-item label="商品金额">
              <el-input :disabled="true" v-model="formData.totalAmount"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="优惠券扣减金额">
              <el-input :disabled="true" v-model="formData.couponAmount"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="支付订单金额">
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
            <el-form-item label="平台支付流水号">
              <el-input :disabled="true" v-model="formData.platformSerialNumber"></el-input>
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
            <el-form-item label="联系电话">
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
      <h2 class="detail-content-title"><i class="icon-bg"></i><span>商品信息</span></h2>
      <el-table
        :data="commodityTableDataList"
        :fit="true"
        width="100%"
      >
        <el-table-column
          prop="sortNo"
          width="200"
          label="商品图片预览">
          <template slot-scope="scope">
            <img src="/static/images/icons/icon-picture_hover_tiny.png"
                 class="bigImgShow"
                 v-if="scope.row.attUrl"
                 @mouseenter="smallImgMouseenter(scope.row)"
                 @mouseleave="smallImgMouseLeave"
            >
          </template>
        </el-table-column>
        <el-table-column
          prop="productName"
          label="商品名称">
        </el-table-column>
        <el-table-column
          prop="productId"
          label="商品ID">
        </el-table-column>
        <el-table-column
          prop="productTypeName"
          label="商品类型">
        </el-table-column>
        <el-table-column
          :formatter="foramtterMoney"
          prop="productPrice"
          label="单价">
        </el-table-column>
        <el-table-column
          prop="productCount"
          label="数量">
        </el-table-column>
        <el-table-column
          :formatter="foramtterMoney"
          prop="productTotalPrice"
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
            prop="returnAmount"
            label="退款金额">
          </el-table-column>
          <el-table-column
            prop="statusName"
            label="退款状态">
          </el-table-column>
        </el-table>
      </div>

    </section>
    <!--查看大图大图区域开始-->
    <div
      class="tableBigImg"
      v-if="bigImgDialogVisible"
      @mouseenter="bigImgMouseenter"
      @mouseleave="bigImgMouseLeave"
    >
      <img
        :src="bigImgPath"
      >
    </div>
    <!--查看大图大图区域结束-->
  </section>
</template>

<script>
/**
 * 功能描述：商品订单详情页
 * 参数说明：currencyType 需要加入此参数并设置其值为1，支付币类型：0现金 1余额（唯币）
 * 注意事项：// 测试用例注意：2.0 中只需要关注
 *          1）单位改为唯币
 *          2）支付方式改为 余额支付
 *          3）去掉第三方流水号
 *          4) 退款理由暂不显示
 *          PS:其余保持不变
 *
 * Create by YaoQiao on 2019-04-22
 */
import comm from '@/assets/js/utils/comm.js';
import apiUrlConfig from '@/api/apiUrlConfig';
import axios from '@/assets/js/utils/request';

export default {
  name: 'commodityOrderDetail',
  data() {
    return {
      orderId: '', // 商品订单id
      orderNumber: '', // 商品订单号
      formData: {
        totalAmount: 1, // 商品金额
        couponAmount: 1, // 优惠券抵扣金额
        payAmount: 1, // 支付订单金额
        orderType: 0, // 订单类型,1->普通订单；2->优惠卷订单；3->兑换码订单
        orderTypeName: '', // 订单类型中文
        orderStatus: 0, // 订单状态
        orderStatusName: '待付款', // 订单状态中文
        createTime: '', // 订单创建时间
        paymentTime: '', // 订单完成时间
        payStatus: '', // 支付状态
        payStateName: '', // 支付状态中文
        payType: '', // 支付方式
        payTypeName: '余额支付', // 支付方式中文
        sourceType: '', // 支付终端
        sourceTypeName: '', // 支付终端中文
        prepayTime: '', // 支付发起时间
        payTime: '', // 支付完成时间
        actualPayment: '', // 实际支付金额
        isExistRefundOrder: '', // 退款情况
        isExistRefundOrderName: '', // 退款情况中文
        platformSerialNumber: '', // 支付流水号
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
        type: apiUrlConfig.getShopOrderDetailById.type,
        url: apiUrlConfig.getShopOrderDetailById.url,
        params: {
          orderId: this.orderId,
          currencyType: 1 // 支付币类型：0现金 1余额（唯币）
        }
      }).then((res) => {
        comm.closeLoading();
        if (res && res.data && res.data.responseObject && res.data.responseObject.responseData) {
          let responseData = res.data.responseObject.responseData;
          let _orderDetailResult = responseData.orderDetailResult;
          // 订单数据赋值
          this.formData.orderType = _orderDetailResult.orderType;
          this.formData.totalAmount = _orderDetailResult.totalAmount + ' 唯币';
          this.formData.payAmount = _orderDetailResult.payAmount + ' 唯币';
          this.formData.orderTypeName = _orderDetailResult.orderTypeName;
          this.formData.orderStatusName = _orderDetailResult.orderStatusName;
          this.formData.createTime = _orderDetailResult.createTime;
          this.formData.paymentTime = _orderDetailResult.paymentTime;
          this.formData.payStateName = _orderDetailResult.payStateName;
          this.formData.actualPayment = this.formData.payAmount;
          this.formData.sourceTypeName = _orderDetailResult.sourceTypeName;
          this.formData.prepayTime = _orderDetailResult.prepayTime;
          this.formData.payTime = _orderDetailResult.payTime;
          this.formData.platformSerialNumber = _orderDetailResult.platformSerialNumber;
          this.formData.customerId = _orderDetailResult.customerId;
          this.formData.receiverName = _orderDetailResult.receiverName;
          this.formData.receiverPhone = _orderDetailResult.receiverPhone;
          this.formData.isExistRefundOrder = _orderDetailResult.isExistRefundOrder;
          this.formData.payTypeName = _orderDetailResult.payTypeName;
          this.formData.email = _orderDetailResult.email;
          // 退款情况
          if (_orderDetailResult.isExistRefundOrder === 0) {
            this.formData.isExistRefundOrderName = '无退款';
          }
          else if (_orderDetailResult.isExistRefundOrder === 1) {
            this.formData.isExistRefundOrderName = '有退款';
          }
          // 不同订单类型字段不同处理
          if (this.formData.orderType === 1) {
            // 普通订单
            this.formData.couponAmount = '-';
          }// 优惠券订单
          else if (this.formData.orderType === 2) {
            this.formData.couponAmount = _orderDetailResult.couponAmount + ' 唯币';
          }// 兑换码订单
          else if (this.formData.orderType === 3) {
            // 订单信息：优惠券金额显示为-，支付订单金额同商品金额，其他正常显示
            this.formData.couponAmount = '-';
            this.formData.payAmount = this.formData.totalAmount;
            // 支付信息：支付终端显示实际内容，其他字段均显示为-
            this.formData.payStateName = '-';
            this.formData.payTypeName = '-';
            this.formData.prepayTime = '-';
            this.formData.paymentTime = '-';
            this.formData.actualPayment = '-';
            this.formData.isExistRefundOrderName = '-';
            this.formData.platformSerialNumber = '-';
            this.formData.isExistRefundOrderName = '-';
          }

          this.commodityTableDataList = responseData.orderProductResultList;
          this.refundTableDataList = responseData.orderReturnApplyResultList;
        }
        else {
          this.$allin_confirm({ title: '提示', content: '查询失败', type: 'notice' });
        }
      }).catch((err) => {
        comm.closeLoading();
        this.$allin_confirm({ title: '提示', content: '查询失败', type: 'notice' });
        console.log('优惠券批次列表数据请求异常：', err);
      });
    },
    foramtterMoney(row, col, cellValue) {
      // 面额格式化
      return cellValue + ' 唯币';
    },
    // 鼠标滑过查看大图
    smallImgMouseenter(scopeRow) {
      let _this = this;
      if (_this.bigImgTimer) {
        clearTimeout(_this.bigImgTimer);
      }
      // 查看大图时,大图url按照规则对缩略图进行获取后获得
      let url = scopeRow.attUrl;
      if (url) {
        _this.bigImgPath = url;
        _this.bigImgDialogVisible = true;
      }
      else {
        _this.bigImgPath = '';
        _this.bigImgPathName = '';
      }
    },
    // 鼠标离开查看大图关闭
    smallImgMouseLeave() {
      let _this = this;
      _this.bigImgTimer = setTimeout(function() {
        _this.bigImgDialogVisible = false;
      }, 1000);
    },
    // 大图区域上的hover状态
    bigImgMouseenter() {
      if (this.bigImgTimer) {
        clearTimeout(this.bigImgTimer);
      }
    },
    // 离开大图区域
    bigImgMouseLeave() {
      this.bigImgDialogVisible = false;
    }
  },
  created() {
    if (this.$route.query.orderId) {
      this.orderId = this.$route.query.orderId;
      this.orderNumber = this.$route.query.orderNumber;
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

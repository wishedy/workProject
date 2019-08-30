<template>
  <section class="rechargeOrder-manager-main-container">
    <h3>充值记录</h3>
    <section class="order-manager-search-area">
      <el-form label-width="120px">
        <el-row>
          <el-col :span="24">
            <el-form-item label="选择时间">
              <el-select placeholder="创建时间" v-model="searchConditionData.timeType" style="padding-right: 20px">
                <el-option label="创建时间" value="0"></el-option>
                <el-option label="完成时间" value="1"></el-option>
              </el-select>
              <el-date-picker
                v-model="searchConditionSelectTime"
                type="daterange"
                range-separator="-"
                start-placeholder="不限"
                end-placeholder="不限"
                value-format="yyyy-MM-dd HH:mm:ss"
                :default-time="['00:00:00', '23:59:59']"
              >
              </el-date-picker>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="10">
            <el-form-item label="订单信息">
              <el-input placeholder="充值订单/平台支付流水/第三方支付流水" v-model="searchConditionData.orderInfo"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="10">
            <el-form-item label="用户信息">
              <el-input placeholder="用户ID/用户姓名/手机号/邮箱" v-model="searchConditionData.userInfo"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="8">
            <el-form-item label="交易类型">
              <el-select placeholder="全部" v-model="searchConditionData.chargeType">
                <el-option label="全部" value=""></el-option>
                <el-option label="充值-购买充值" value="1"></el-option>
                <el-option label="充值-赠送充值" value="2"></el-option>
                <el-option label="充值-补单充值" value="3"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="支付终端">
              <el-select
                placeholder="全部"
                v-model="searchConditionData.chargeSourceType"
              >
                <el-option label="全部" value=""></el-option>
                <el-option label="APP-IOS" value="1"></el-option>
                <el-option label="APP-Android" value="2"></el-option>
                <el-option label="微信公众号" value="3"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="支付方式">
              <el-select
                placeholder="全部"
                v-model="searchConditionData.chargePayType"
              >
                <el-option label="全部" value=""></el-option>
                <el-option label="支付宝APP支付" value="1"></el-option>
                <el-option label="微信APP支付" value="2"></el-option>
                <el-option label="苹果IAP支付" value="3"></el-option>
                <el-option label="微信JSAPI支付" value="7"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="8">
            <el-form-item label="订单状态">
              <el-select
                placeholder="全部"
                v-model="searchConditionData.chargeOrderState"
              >
                <el-option label="全部" value=""></el-option>
                <el-option label="未付款" value="1"></el-option>
                <el-option label="未发货" value="2"></el-option>
                <el-option label="已发货" value="3"></el-option>
                <el-option label="已关闭" value="5"></el-option>
                <el-option label="已退货" value="7"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="支付状态">
              <el-select
                placeholder="全部"
                v-model="searchConditionData.chargePayState"
              >
                <el-option label="全部" value=""></el-option>
                <el-option label="未支付" value="1"></el-option>
                <el-option label="已支付" value="3"></el-option>
                <el-option label="已撤销" value="2"></el-option>
                <el-option label="已退款" value="6"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="退款情况">
              <el-select
                placeholder="全部"
                v-model="searchConditionData.refundState"
              >
                <el-option label="全部" value=""></el-option>
                <el-option label="有退款" value="1"></el-option>
                <el-option label="无退款" value="0"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col>
            <el-form-item class="order-search-submit" style="float: right; margin-right: 50px;">
              <el-button @click="clearBtnOnClick">清空条件</el-button>
              <el-button @click="filterBtnOnClick">筛选</el-button>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </section>
    <section class="rechargeOrder-manager-allMoney">
      <div>
        <span>总充值金额：￥{{allMonryList.totalTopUp}}</span>
        <span>已支付金额：￥{{allMonryList.totalPay}}</span>
        <span>退款金额：￥{{allMonryList.totalRefund}}</span>
      </div>
    </section>
    <section class="order-manager-button">
      <el-row>
        <el-col>
          <el-button v-if="tableData.length>0" @click="exportOrderClick">
            <span class="el-icon-circle-plus"></span>
            <a href="javascript:void(0);">导出订单</a>
          </el-button>
        </el-col>
      </el-row>
    </section>
    <section class="order-manager-table">
      <el-table
        :data="tableData"
        :fit="true"
        style="width: 100%">
        <el-table-column
          prop="sortNo"
          width="80"
          label="序号">
        </el-table-column>
        <el-table-column
          prop="createTime"
          width="180"
          label="创建时间">
        </el-table-column>
        <el-table-column
          prop="paymentTime"
          width="180"
          label="完成时间">
        </el-table-column>
        <el-table-column
          :formatter="formatterTotalAmount"
          prop="chargeTotalAmount"
          width="100"
          label="充值金额">
        </el-table-column>
        <el-table-column
          width="120"
          :formatter="formatterOrderType"
          prop="chargeType"
          label="交易类型">
        </el-table-column>
        <el-table-column
          prop="chargeOrderNumber"
          width="200"
          label="充值订单号">
        </el-table-column>
        <el-table-column
          prop="platformSerialNumber"
          width="200"
          label="平台支付流水号">
        </el-table-column>
        <el-table-column
          prop="thirdPartSerialNumber"
          width="300"
          label="第三方支付流水号">
        </el-table-column>
        <el-table-column
          :formatter="formatterSourceType"
          prop="chargeSourceType"
          width="140"
          label="支付终端">
        </el-table-column>
        <el-table-column
          :formatter="formatterPayType"
          prop="chargePayType"
          width="120"
          label="支付方式">
        </el-table-column>
        <el-table-column
          :formatter="formatterOrderAmount"
          prop="chargeOrderAmount"
          width="140"
          label="订单金额">
        </el-table-column>
        <el-table-column
          :formatter="formatterPayAmount"
          prop="chargePayAmount"
          width="140"
          label="支付金额">
        </el-table-column>
        <el-table-column
          prop="customerId"
          width="140"
          label="用户ID">
        </el-table-column>
        <el-table-column
          prop="receiverName"
          width="100"
          label="用户姓名">
        </el-table-column>
        <el-table-column
          prop="receiverPhone"
          width="140"
          label="手机号">
        </el-table-column>
        <el-table-column
          prop="email"
          width="140"
          label="邮箱">
        </el-table-column>
        <el-table-column
          :formatter="formatterPayState"
          prop="chargePayState"
          width="100"
          label="支付状态">
        </el-table-column>
        <el-table-column
          :formatter="formatterOrderState"
          prop="chargeOrderState"
          width="100"
          label="订单状态">
        </el-table-column>
        <el-table-column
          :formatter="formatterRefundState"
          prop="refundState"
          width="100"
          label="退款状态">
        </el-table-column>
        <el-table-column
          prop="note"
          width="100"
          label="订单备注">
        </el-table-column>
        <el-table-column label="操作" width="100" fixed="right">
          <template slot-scope="scope">
            <el-button
              @keydown.native.prevent
              @click="tableDetailBtnOnClick(scope.row)"
            >
              查看
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </section>
    <el-row>
      <el-col>
        <section class="order-manager-pagination">
          <el-pagination
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page="paginationData.currentPage"
            :total="paginationData.total"
            :page-sizes="[10, 20, 30, 40]"
            :page-size="paginationData.pageSize"
            layout="total, prev, pager, next, jumper ,sizes"
          >
          </el-pagination>
        </section>
      </el-col>
    </el-row>
  </section>
</template>

<script>
/**
 * CRM 管理后台，帐户管理——充值记录列表页
 * 注意事项：
 * author:ZhangHongda
 * create-time:2019.06.21
 * 产品版本：新后台系统v1.9.0（大版本3.9）
 * 功能信息：
 *  1，筛选
 *  2，查看
 */
import comm from '@/assets/js/utils/comm.js';
import apiUrlConfig from '@/api/apiUrlConfig';
import axios from '@/assets/js/utils/request';

export default {
  data() {
    return {
      allMonryList: {
        totalTopUp: '0', // 充值总金额
        totalPay: '0', // 总支付金额
        totalRefund: '0' // 总退款金额
      },
      tableData: [],
      searchConditionData: {
        timeType: '0', // 时间类型，时间类型：0->创建时间；1->完成时间
        startTime: '', // 选择时间-开始时间
        endTime: '', // 选择时间-结束时间
        orderInfo: '', // 订单信息（商品订单号/商品名称/支付流水号）
        userInfo: '', // 用户信息（用户ID/用户姓名/手机号）
        chargeType: '', // 订单类型：1->普通订单；2->优惠卷订单；3->兑换码订单
        chargeSourceType: '', // 支付终端/渠道来源
        chargePayType: '', // 支付方式
        chargeOrderState: '', // 订单状态
        chargePayState: '', // 支付状态
        refundState: '' // 退款情况
      },
      searchConditionSelectTime: '',
      paginationData: {
        currentPage: 1,
        firstResult: 0,
        maxResult: 0,
        pageSize: 10, // 默认显示10条
        total: 0
      },
      exportData: {} // 导出数据参数，同获取订单列表参数一致
    };
  },
  methods: {
    getAllMonry() {
      axios({
        method: apiUrlConfig.getStatistics.type,
        url: apiUrlConfig.getStatistics.url,
        params: {}
      }).then((res) => {
        comm.closeLoading();
        if (res && res.data && res.data.responseObject && res.data.responseObject.responseData) {
          this.allMonryList = res.data.responseObject.responseData;
        }
        else {
          this.allMonryList = [];
        }
      }).catch((err) => {
        comm.closeLoading();
        this.$allin_confirm({title: '提示', content: '查询失败', type: 'notice'});
        console.log('充值记录总金额展示数据请求异常', err);
      });
    },
    getDataList() {
      // 获取时间
      if (Array.isArray(this.searchConditionSelectTime) && this.searchConditionSelectTime.length > 0) {
        this.searchConditionData.startTime = this.searchConditionSelectTime[0];
        this.searchConditionData.endTime = this.searchConditionSelectTime[1];
      }
      else {
        this.searchConditionData.startTime = '';
        this.searchConditionData.endTime = '';
      }
      // 获取数据列表
      this.paginationData.maxResult = this.paginationData.pageSize;
      this.paginationData.firstResult = (this.paginationData.currentPage - 1) * this.paginationData.pageSize;
      let data = {
        firstResult: this.paginationData.firstResult,
        maxResult: this.paginationData.maxResult
      };
      for (let key in this.searchConditionData) {
        if (this.searchConditionData[key] || this.searchConditionData[key] === 0) {
          data[key] = this.searchConditionData[key];
        }
      }
      this.exportData = data;
      // 添加 loading
      comm.openLoading('加载中...');
      axios({
        method: apiUrlConfig.getOrderList.type,
        url: apiUrlConfig.getOrderList.url,
        params: data
      }).then((res) => {
        comm.closeLoading();
        if (res && res.data && res.data.responseObject && res.data.responseObject.responseData) {
          let responseData = res.data.responseObject.responseData;
          this.tableData = responseData.items;
          this.paginationData.total = responseData.total;
        }
        else {
          this.tableData = [];
          this.paginationData.total = 0;
        }
      }).catch((err) => {
        comm.closeLoading();
        this.$allin_confirm({title: '提示', content: '查询失败', type: 'notice'});
        console.log('商品订单列表页数据请求异常', err);
      });
    },
    // 按钮点击事件处理函数 开始
    clearBtnOnClick() {
      for (var key in this.searchConditionData) {
        this.searchConditionData[key] = '';
      }
      // 清空条件按钮
      this.searchConditionSelectTime = '';
    },
    filterBtnOnClick() {
      // 筛选按钮点击处理函数
      // 设置分页数据
      this.paginationData.currentPage = 1;
      this.paginationData.firstResult = 0;
      this.getDataList();
      this.getAllMonry();
    },
    tableDetailBtnOnClick(row) {
      // 查看详情按钮点击处理函数
      let _url = this.$router.resolve({
        path: '/rechargeOrderDesc',
        query: { orderId: row.orderId }
      });
      window.open(_url.href, '_blank');
    },
    exportOrderClick() {
      comm.openLoading('导出中...');
      axios({
        method: apiUrlConfig.orderExportList.type,
        url: apiUrlConfig.orderExportList.url,
        params: this.exportData,
        responseType: 'blob',
        headers: {'ms-type': 'application/vnd.ms-excel'}
      }).then((res) => {
        comm.closeLoading();
        comm.downloadFileHandle(res.data, '充值记录');
      }).catch((err) => {
        comm.closeLoading();
        this.$allin_confirm({title: '提示', content: '导出失败', type: 'notice'});
        console.log(err);
      });
    },
    // 按钮点击事件处理函数 结束
    // 分页器相关事件处理函数 开始
    handleSizeChange(val) {
      // 每页显示条数变化
      this.paginationData.pageSize = val;
      this.getDataList();
      this.getAllMonry();
    },
    handleCurrentChange(val) {
      // 当前页变化
      this.paginationData.currentPage = val;
      this.getDataList();
      this.getAllMonry();
    },
    // 充值金额
    formatterTotalAmount(row) {
      // 订单金额格式化
      return row.chargeTotalAmount + '唯币';
    },
    // 分页器相关事件处理函数 结束
    // 表格格式化部分开始
    formatterOrderType(row) {
      // 订单类型格式化
      let _orderType = '';
      switch (row.chargeType) {
        case 1:
          _orderType = '充值-购买充值';
          break;
        case 2:
          _orderType = '充值-赠送充值';
          break;
        case 3:
          _orderType = '充值-补单充值';
          break;
        default:
          break;
      }
      return _orderType;
    },
    formatterSourceType(row) {
      // 支付终端格式化
      let _sourceType = '';
      switch (row.chargeSourceType) {
        case 1:
          _sourceType = 'APP-IOS';
          break;
        case 2:
          _sourceType = 'APP-Android';
          break;
        case 3:
          _sourceType = '微信公众号';
          break;
        case 4:
          _sourceType = '微信小程序';
          break;
        case 5:
          _sourceType = 'PC订单';
          break;
        case 6:
          _sourceType = '线下收款';
          break;
        default:
          break;
      }
      return _sourceType;
    },
    formatterPayType(row) {
      // 支付方式格式化
      let _payType = '';
      switch (row.chargePayType) {
        case 1:
          _payType = '支付宝APP支付';
          break;
        case 2:
          _payType = '微信APP支付';
          break;
        case 3:
          _payType = '苹果IAP支付';
          break;
        case 6:
          _payType = '微信H5支付';
          break;
        case 7:
          _payType = '微信JSAPI支付';
          break;
        default:
          break;
      }
      return _payType;
    },
    formatterPayState(row) {
      // 支付状态格式化
      let _payState = '';
      switch (row.chargePayState) {
        case 1:
          _payState = '未支付';
          break;
        case 2:
          _payState = '已撤销';
          break;
        case 3:
          _payState = '已支付';
          break;
        case 6:
          _payState = '已退款';
          break;
        default:
          break;
      }
      return _payState;
    },
    formatterOrderState(row) {
      // 订单状态格式化
      let _orderState = '';
      switch (row.chargeOrderState) {
        case 1:
          _orderState = '未付款';
          break;
        case 2:
          _orderState = '未发货';
          break;
        case 3:
          _orderState = '已发货';
          break;
        case 5:
          _orderState = '已关闭';
          break;
        case 7:
          _orderState = '已退货';
          break;
        default:
          break;
      }
      return _orderState;
    },
    formatterRefundState(row) {
      // 退款情况格式化
      let _refundState = '';
      switch (row.refundState) {
        case 0:
          _refundState = '无退款';
          break;
        case 1:
          _refundState = '有退款';
          break;
        default:
          break;
      }
      return _refundState;
    },
    formatterPayAmount(row) {
      // 订单金额格式化
      return '￥' + row.chargePayAmount;
    },
    formatterOrderAmount(row) {
      // 订单金额格式化
      return '￥' + row.chargeOrderAmount;
    }
    // 表格格式化部分结束
  },
  mounted() {
    // 初始化获取数据
    this.getDataList();
    this.getAllMonry();
    document.onkeydown = (e) => {
      if (e.keyCode === 13) {
        this.getDataList();
        this.getAllMonry();
      }
    };
  },
  destroyed() {
    document.onkeydown = null;
    comm.goBack();
  }
};
</script>
<style scoped lang="scss">
  .el-dialog {
    .dialog-title {
      font-family: PingFangSC-Medium;
      font-size: 20px;
      color: #222222;
      letter-spacing: 0;
      line-height: 24px;
      font-weight: bolder;
    }
    label {
      font-family: PingFangSC-Regular;
      font-size: 14px;
      color: #555555;
      letter-spacing: 0;
      line-height: 14px;
    }
  }
</style>
<style lang="scss">
  @import "components/scss/orderStyle";

  .refund-dialog {
    textarea {
      font-family: PingFangSC-Regular;
    }
  }

</style>

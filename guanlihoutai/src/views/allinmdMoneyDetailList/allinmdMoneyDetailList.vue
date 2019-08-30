<template>
  <section class="allMoneyList">
    <!--title位置-->
    <div class="TopTitle">唯币流水</div>
    <!--筛选box区域-->
    <section class="screeningBox">
      <div class="currItem">
        <span class="titleName">交易时间</span>
        <el-date-picker
          v-model="tradeTime"
          type="daterange"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          :default-time="['00:00:00','23:59:59']"
          value-format="yyyy-MM-dd HH:mm:ss"
        >
        </el-date-picker>
      </div>
      <div class="currItem">
        <span class="titleName">交易类型</span>
        <el-select v-model="searchForm.flowType">
          <el-option label="全部" value=""></el-option>
          <el-option label="充值-购买充值" value="1"></el-option>
          <el-option label="充值-赠送充值" value="2"></el-option>
          <el-option label="充值-补单充值" value="3"></el-option>
          <el-option label="核销" value="4"></el-option>
          <el-option label="充值撤销" value="6"></el-option>
          <el-option label="核销撤销" value="5"></el-option>
        </el-select>
      </div>
      <div class="currItem">
        <span class="titleName">交易终端</span>
        <el-select v-model="searchForm.terminalType">
          <el-option label="全部" value=""></el-option>
          <el-option label="APP-IOS" value="1"></el-option>
          <el-option label="APP-Android" value="2"></el-option>
        </el-select>
      </div>
      <div class="currItem">
        <span class="titleName">用户信息</span>
        <el-input class="txtInput" placeholder="用户ID/姓名/手机号/邮箱" v-model="searchForm.customerInfoStr"></el-input>
      </div>
      <div class="currItem">
        <span class="titleName">交易流水</span>
        <el-input class="txtInput" placeholder="" v-model="searchForm.platformSerialNumber"></el-input>
      </div>
      <aside class="btnBox">
        <p class="resetBtn" @click.stop="resetForm">清空条件</p>
        <p class="screeningBtn" @click.stop="submitForm">筛选</p>
      </aside>
    </section>
    <!--导出表格-->
    <el-button class="exportOrderBtn" v-if="tableData.length>0 &&tokenData.zuultoken!==null" @click="exportOrderClick">
      <span class="el-icon-circle-plus"></span>
      <a href="javascript:void(0);">导出</a>
    </el-button>
    <!--列表-->
    <section>
      <el-table
        ref="multipleTable"
        :data="tableData"
        style="width: 100%;margin-bottom: 20px"
        :default-sort = "{prop: 'createAdTime', order: 'descending'}"
      >
        <el-table-column
          prop="sortNo"
          label="序号"
          width="80"
        >
        </el-table-column>
        <el-table-column
          prop="createTime"
          label="交易时间"
          width="160"
          :formatter="dateForOne"
        >
        </el-table-column>
        <el-table-column
          prop="platformSerialNumber"
          label="交易流水号"
          width="180"
        >
        </el-table-column>
        <el-table-column
          prop="flowTypeName"
          label="交易类型"
          width="130"
        >
        </el-table-column>
        <el-table-column
          prop="orderAmount"
          width="100"
          label="唯币数"
        >
        </el-table-column>
        <el-table-column
          prop="balanceAmount"
          width="140"
          label="交易后账户余额"
        >
        </el-table-column>
        <el-table-column
          prop="terminalTypeName"
          width="130"
          label="交易终端"
        >
        </el-table-column>
        <el-table-column
          prop="customerId"
          label="用户ID"
          width="130"
        >
        </el-table-column>
        <el-table-column
          prop="fullName"
          label="用户姓名"
          width="130"
        >
        </el-table-column>
        <el-table-column
          prop="mobile"
          label="手机号"
          width="130"
        >
        </el-table-column>
        <el-table-column
          prop="email"
          label="邮箱"
          width="130"
        >
        </el-table-column>
      </el-table>
      <!--分页-->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="currentPage"
        :page-sizes="[10, 20, 30, 50, 100]"
        :page-size="maxResult"
        layout="total, prev, pager, next, jumper, sizes"
        :total="totalNum">
      </el-pagination>
    </section>
  </section>
</template>
<script>

/**
 * CRM 管理后台，帐户管理——唯币流水
 * 注意事项：
 * author:zhanghongda
 * create-time:2019.06.21
 * 产品版本：新后台系统v1.9.0（大版本3.9）
 * 功能信息：
 *  1，筛选
 *  2，导出excel
 */
import axios from '@/assets/js/utils/request';
import apiConfig from '@/api/apiUrlConfig';
import comm from '@/assets/js/utils/comm';
export default {
  data() {
    return {
      tradeTime: [], // 交易时间
      tradeTimeSub: [], // 提交时所用的时间
      // 筛选项里面选的内容
      searchForm: {
        startTime: '', // 交易时间
        endTime: '', // 结束时间
        flowType: '', // 交易类型
        terminalType: '', // 交易终端
        customerInfoStr: '', // 用户信息
        platformSerialNumber: '' // 交易流水号
      },
      // 真正使用的筛选条件
      searchFormSub: {
        // startTime: '', // 交易时间
        // endTime: '', // 结束时间
        // orderType: '', // 交易类型
        // walletSourceType: '', // 交易终端
        // customerInfoStr: '', // 用户信息
        // platformSerialNumber: '' // 交易流水号
      },
      axiosNum: 0, // 请求的个数，用来控制loading
      totalNum: 0, // 数据总数
      currentPage: 1, // 当前页
      firstResult: 0, // 第一条索引
      maxResult: 10, // 每页几条
      pageSize: 10, // 每页几条(分页组件)
      tableData: [], // 列表数据
      exportData: [], // 导出参数
      exportOrderUrl: '', // 导出参数
      tokenData: {
        zuultoken: '111111'
      }
    };
  },
  methods: {
    // 筛选点击
    submitForm() {
      // 点击筛选后将已经选择的项进行赋值，并筛选；为的是在修改了筛选条件但是没有点击筛选按钮情况下进行分页等操作数据显示问题。
      let _data = {};
      // 获取时间
      if (Array.isArray(this.tradeTime) && this.tradeTime.length > 0) {
        this.searchForm.startTime = this.tradeTime[0];
        this.searchForm.endTime = this.tradeTime[1];
      }
      else {
        this.searchForm.startTime = '';
        this.searchForm.endTime = '';
      }
      for (let key in this.searchForm) {
        if (this.searchForm[key] || this.searchForm[key] === 0) {
          _data[key] = this.searchForm[key];
        }
      }
      this.searchFormSub = _data;
      this.exportData = this.searchFormSub;
      this.firstResult = 0;
      this.currentPage = 1;
      this.getListFn();
    },
    // 清空筛选
    resetForm() {
      for (var key in this.searchForm) {
        this.searchForm[key] = '';
      }
      this.tradeTime = '';
    },
    // 获取列表数据
    getListFn() {
      // 传入的参数全部为点击筛选之后的参数
      let param = this.searchFormSub;
      param.firstResult = this.firstResult;
      param.maxResult = this.maxResult;
      let callbacks = (res) => {
        if (res && res.data && res.data.responseObject && res.data.responseObject.responseData) {
          this.tableData = res.data.responseObject.responseData.items;
          this.totalNum = res.data.responseObject.responseData.totalCount;
        }
        else {
          this.tableData = [];
          this.totalNum = 10;
        }
      };
      this.getListAxios(apiConfig.getFlowDetailList.url, param, callbacks);
    },
    exportOrderClick() {
      comm.openLoading('导出中...');
      this.exportData.firstResult = undefined;
      this.exportData.maxResult = undefined;
      axios({
        method: apiConfig.exportWalletMoneyList.type,
        url: apiConfig.exportWalletMoneyList.url,
        params: this.exportData,
        responseType: 'blob',
        headers: {'ms-type': 'application/vnd.ms-excel'}
      }).then((res) => {
        comm.closeLoading();
        comm.downloadFileHandle(res.data, '唯币流水订单');
      }).catch((err) => {
        comm.closeLoading();
        this.$allin_confirm({title: '提示', content: '导出失败', type: 'notice'});
        console.log(err);
      });
    },
    // 时间格式修改
    dateForOne(val) {
      if (val.createTime) {
        return val.createTime.substring(0, 19);
      }
    },
    // 交易后用户余额
    balanceAmountFor(val) {
      if (val.balanceAmount) {
        return val.balanceAmount + '唯币';
      }
    },
    // 修改每页条数
    handleSizeChange(val) {
      this.pageSize = val;
      this.maxResult = val;
      this.currentPage = 1; // 当前页
      this.firstResult = 0; // 第一条索引
      this.getListFn();
    },
    // 修改当前页码
    handleCurrentChange(val) {
      this.firstResult = (val - 1) * this.pageSize;
      this.currentPage = val;
      this.getListFn();
    },
    // 获取数据公共方法
    getListAxios(path, params, callback, tipMsg, type, errorCallback) {
      let _this = this;
      comm.openLoading('加载中...');
      _this.axiosNum++;
      if (type === 'post') {
        axios({
          method: 'post',
          url: path,
          data: params
        }).then((res) => {
          _this.axiosNum--;
          callback && callback(res);
          if (_this.axiosNum <= 0) {
            comm.closeLoading();
          }
        }).catch((e) => {
          errorCallback && errorCallback();
          _this.axiosNum--;
          if (_this.axiosNum <= 0) {
            comm.closeLoading();
          }
          this.$allin_confirm({title: '提示', content: tipMsg || '获取失败，请刷新重试', type: 'notice'});
          console.log('获取数据失败：', e);
        });
      }
      else {
        axios({
          method: 'get',
          url: path,
          params: params
        }).then((res) => {
          callback && callback(res);
          _this.axiosNum--;
          if (_this.axiosNum <= 0) {
            comm.closeLoading();
          }
        }).catch((e) => {
          errorCallback && errorCallback();
          _this.axiosNum--;
          if (_this.axiosNum <= 0) {
            comm.closeLoading();
          }
          this.$allin_confirm({title: '提示', content: tipMsg || '获取失败，请刷新重试', type: 'notice'});
          console.log('获取数据失败：', e);
        });
      }
    }
  },
  mounted() {
    this.getListFn(); // 列表页
    // 绑定键盘事件
    document.onkeydown = (e) => {
      if (e.keyCode === 13) {
        if (!this.bigImgDialogVisible) {
          this.submitForm(); // 触发提交按钮
        }
      }
    };
  },
  // 离开当前页面后执行
  destroyed: function() {
    comm.goBack();
  }
};
</script>
<style lang="scss" >
  .allMoneyList{
    width: 1200px;
    margin: 0 auto;

    // 导出按钮
    .exportOrderBtn{
      margin: 30px 0 30px;
      color: #4B67D6;
      border: 1px solid #4B67D6;
      border-radius: 3px;
    }
    /*title*/
    .TopTitle{
      font-size:20px;
      font-weight:600;
      color:rgba(44,52,58,1);
      line-height:20px;
      margin: 32px 0 20px 0;
    }

    /*筛选按钮*/
    .screeningBox{
    position: relative;
    width:1200px;
    height:200px;
    background:rgba(255,255,255,1);
    box-shadow:0 4px 10px 0 rgba(42,53,102,0.04);
    border-radius:3px;
    padding: 25px 15px;
    box-sizing: border-box;
      margin-bottom: 40px;
    .currItem{
      display: inline-block;
      margin-bottom: 22px;
      margin-left: 20px;
    }
    .titleName{
      margin-right: 10px;
      font-size: 14px;
    }
    .txtInput{
      width: 300px;
    }
    .btnBox{
      margin-top: 24px;
      //height: 32px;
      p{
        display: inline-block;
        position: absolute;
        vertical-align: middle;
        cursor: pointer;
      }
      .resetBtn{
        font-size:14px;
        font-weight:400;
        color:rgba(44,52,58,1);
        line-height:14px;
        margin-right: 20px;
        right: 124px;
        bottom: 32px;
      }
      .screeningBtn{
        right: 34px;
        bottom: 25px;
        width:90px;
        height:32px;
        border-radius:3px;
        border:1px solid rgba(75,103,214,1);
        box-sizing: border-box;
        line-height: 32px;
        font-size:14px;
        font-weight:400;
        color:rgba(75,103,214,1);
        text-align: center;
      }
    }
  }

    /*表格*/
    .el-table th .cell{
      font-weight: 600;
      color: #000000;
    }

    /*分页*/
    .el-pagination{
      text-align: center;
      margin-bottom: 20px;
    }
  }
</style>

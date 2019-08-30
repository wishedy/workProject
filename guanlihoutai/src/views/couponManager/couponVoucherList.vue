<template>
  <section class="coupon-manager-main-container">
    <h3>优惠券券号列表</h3>
    <section class="coupon-manager-search-area">
      <el-form label-width="120px">
        <el-row>
          <el-col :span="8">
            <el-form-item label="优惠券批次号">
              <el-input placeholder="优惠券批次号" v-model="searchConditionData.couponBatchCode"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="优惠券券号">
              <el-input placeholder="优惠券券号" v-model="searchConditionData.couponDetailCode"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="使用状态">
              <el-select
                size="medium"
                placeholder="全部"
                v-model="searchConditionData.useState"
              >
                <el-option label="全部" value=""></el-option>
                <el-option label="未使用" value="0"></el-option>
                <el-option label="已使用" value="1"></el-option>
                <el-option label="已过期" value="2"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col>
            <el-form-item class="coupon-search-submit" style="float: right; margin-right: 50px;">
              <el-button @click="clearBtnOnClick">清空条件</el-button>
              <el-button @click="filterBtnOnClick">筛选</el-button>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </section>
    <section class="coupon-manager-button">
      <el-row>
        <el-col :span="3">
          <el-button @click="createCouponBtnOnClick">
            <span class="el-icon-circle-plus"></span>创建优惠券
          </el-button>
        </el-col>
        <el-col :span="3" v-if="tableData.length>0">
          <el-button>
            <span class="el-icon-document"></span>
            <a href="javascript:void(0);" @click="exportOrderClick">导出券号列表</a>
          </el-button>
        </el-col>
      </el-row>
    </section>
    <section class="coupon-manager-table">
      <el-table
        :data="tableData"
        :fit="true"
        @cell-dblclick="copyContentOnDoubleClick"
        style="width: 100%">
        <el-table-column
          prop="id"
          width="80"
          label="序号">
        </el-table-column>
        <el-table-column
          prop="couponDetailCode"
          width="200"
          label="优惠券券号">
        </el-table-column>
        <el-table-column
          prop="couponName"
          width="180"
          label="优惠券名称">
        </el-table-column>
        <el-table-column
          width="200"
          prop="couponBatchCode"
          label="批次号">
        </el-table-column>
        <el-table-column
          :formatter="formatterCouponType"
          width="100"
          prop="couponType"
          label="优惠券类型">
        </el-table-column>
        <el-table-column
          :formatter="foramtterCouponDenomination"
          prop="couponDenomination"
          width="130"
          label="面额">
        </el-table-column>
        <el-table-column
          :formatter="formatterValidDate"
          prop="startTime"
          width="200"
          label="有效期">
        </el-table-column>
        <el-table-column
          :formatter="formatterUseState"
          prop="useState"
          width="100"
          label="券号状态">
        </el-table-column>
        <el-table-column
          prop="customerId"
          width="140"
          label="领取者ID">
        </el-table-column>
        <el-table-column
          prop="customerName"
          width="100"
          label="领取者姓名">
        </el-table-column>
        <el-table-column
          prop="useTime"
          width="180"
          label="使用时间">
        </el-table-column>
        <el-table-column
          prop="orderNumber"
          width="180"
          label="商品订单号">
        </el-table-column>
      </el-table>
    </section>
    <el-row>
      <el-col>
        <section class="coupon-manager-pagination">
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
 * 功能描述：优惠券券号列表
 * 参数说明：
 * 注意事项：
 *
 * Create by YaoQiao on 2019-04-22
 */
import comm from '@/assets/js/utils/comm.js';
import apiUrlConfig from '@/api/apiUrlConfig';
import axios from '@/assets/js/utils/request';

export default {
  name: 'couponVoucherList',
  data() {
    return {
      tableData: [],
      searchConditionData: {
        couponBatchCode: '', // 优惠券批次号
        couponDetailCode: '', // 优惠券券号
        useState: '' // 使用状态
      },
      searchConditionEffectiveTime: '',
      paginationData: {
        currentPage: 1,
        firstResult: 0,
        maxResult: 0,
        pageSize: 20, // 默认显示20条
        total: 0
      },
      exportData: {} // 导出数据参数，同获取列表参数一致
    };
  },
  methods: {
    getDataList() {
      // 如果没有输入优惠券批次号和优惠券权号，则不允许直接通过使用状态搜索
      if (this.searchConditionData.couponBatchCode === '' && this.searchConditionData.couponDetailCode === '') {
        this.$allin_confirm({title: '提示', content: '请输入批次号或券号查询', type: 'notice'});
      }
      else {
        // 获取数据列表
        this.paginationData.maxResult = this.paginationData.pageSize;
        this.paginationData.firstResult = (this.paginationData.currentPage - 1) * this.paginationData.pageSize;
        let data = {
          firstResult: this.paginationData.firstResult,
          maxResult: this.paginationData.maxResult
        };
        for (let key in this.searchConditionData) {
          if (this.searchConditionData[key] || this.searchConditionData[key] === '0') {
            data[key] = this.searchConditionData[key];
          }
        }
        this.exportData = data;
        // 添加 loading
        comm.openLoading('加载中...');
        axios({
          method: apiUrlConfig.getPageCouponDetailList.type,
          url: apiUrlConfig.getPageCouponDetailList.url,
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
          console.log('优惠券券号列表数据请求异常：', err);
        });
      }
    },
    clearBtnOnClick() {
      for (var key in this.searchConditionData) {
        this.searchConditionData[key] = '';
      }
    },
    filterBtnOnClick() {
      // 设置分页数据
      this.paginationData.currentPage = 1;
      this.paginationData.firstResult = 0;
      this.getDataList();
    },
    createCouponBtnOnClick() {
      let _url = this.$router.resolve({path: '/createCouponSelectList'});
      window.open(_url.href, '_blank');
    },
    // 分页器相关事件处理函数 开始
    handleSizeChange(val) {
      // 每页显示条数变化
      this.paginationData.pageSize = val;
      this.getDataList();
    },
    handleCurrentChange(val) {
      // 当前页变化
      this.paginationData.currentPage = val;
      this.getDataList();
    },
    // 分页器相关事件处理函数 结束
    copyContentOnDoubleClick(row, column) {
      // 批次号，领取者ID，商品订单号 双击可复制处理
      let _cellName = '';
      let _copyContent = '';
      switch (column.property) {
        case 'couponBatchCode':
          _cellName = '批次号';
          _copyContent = row.couponBatchCode;
          break;
        case 'customerId':
          _cellName = '领取者ID';
          _copyContent = row.customerId;
          break;
        case 'orderNumber':
          _cellName = '商品订单号';
          _copyContent = row.orderNumber;
          break;
        default:
          break;
      }
      if (_cellName) {
        let oInput = document.createElement('input');
        oInput.value = _copyContent;
        document.body.appendChild(oInput);
        oInput.select(); // 选择对象;
        document.execCommand('Copy'); // 执行浏览器复制命令
        this.$message({
          message: '已成功复制' + _cellName + '到剪切板',
          type: 'success'
        });
        oInput.remove();
      }
    },
    // 表格格式化部分开始
    foramtterCouponDenomination(row) {
      // 面额格式化
      return '￥' + row.couponDenomination;
    },
    formatterValidDate(row) {
      // 有效期格式化
      return row.startTime + '至' + row.endTime;
    },
    formatterUseState(row) {
      // 订单券号格式化
      let _useState = '';
      switch (row.useState) {
        case 0:
          _useState = '未使用';
          break;
        case 1:
          _useState = '已使用';
          break;
        case 2:
          _useState = '已过期';
          break;
        default:
          break;
      }
      return _useState;
    },
    formatterCouponType(row) {
      // 优惠券类型格式化
      let _couponType = '';
      switch (row.couponType) {
        case 0:
          _couponType = '通用优惠券';
          break;
        case 1:
          _couponType = '商品优惠券';
          break;
        default:
          break;
      }
      return _couponType;
    },
    formatterOrderNumber(row) {
      // 格式化商品订单列表
      // 如果是未使用状态，则显示为空
      if (row.useState === 0) {
        return '';
      }
      return row.orderNumber;
    },
    // 表格格式化部分结束
    exportOrderClick() {
      comm.openLoading('导出中...');
      axios({
        method: apiUrlConfig.exportVoucherDetailList.type,
        url: apiUrlConfig.exportVoucherDetailList.url,
        params: this.exportData,
        responseType: 'blob',
        headers: {'ms-type': 'application/vnd.ms-excel'}
      }).then((res) => {
        comm.closeLoading();
        comm.downloadFileHandle(res.data, '优惠券券号');
      }).catch((err) => {
        comm.closeLoading();
        this.$allin_confirm({ title: '提示', content: '导出失败', type: 'notice' });
        console.log(err);
      });
    }
  },
  created() {
    if (this.$route.query.couponBatchCode) {
      this.searchConditionData.couponBatchCode = this.$route.query.couponBatchCode;
    }
  },
  mounted() {
    // 初始化获取数据
    if (this.searchConditionData.couponBatchCode) {
      this.searchConditionData.useState = '0';
      this.getDataList();
    }

    document.onkeydown = (e) => {
      if (e.keyCode === 13) {
        this.getDataList();
      }
    };
  },
  destroyed() {
    document.onkeydown = null;
    comm.goBack();
  }
};
</script>

<style lang="scss">
  @import "./components/scss/couponBase";
</style>

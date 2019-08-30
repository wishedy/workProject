<template>
  <section class="coupon-manager-main-container">
    <h3>优惠券批次列表</h3>
    <section class="coupon-manager-search-area">
      <el-form label-width="120px">
        <el-row>
          <el-col :span="10">
            <el-form-item label="创建时间">
              <el-date-picker
                v-model="searchConditionCreateTime"
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
          <el-col :span="6">
            <el-form-item label="优惠券批次信息">
              <el-input placeholder="优惠券名称/批次号" v-model="searchConditionData.batchInfo"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="批次状态">
              <el-select
                placeholder="全部"
                v-model="searchConditionData.batchState"
              >
                <el-option label="全部" value=""></el-option>
                <el-option label="正常" value="0"></el-option>
                <el-option label="已废弃" value="1"></el-option>
                <el-option label="已过期" value="2"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="10">
            <el-form-item label="优惠券类型">
              <el-select
                placeholder="全部"
                v-model="searchConditionData.couponType"
              >
                <el-option label="全部" value=""></el-option>
                <el-option label="通用优惠券" value="0"></el-option>
                <el-option label="商品优惠券" value="1"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="申请部门">
              <el-select
                placeholder="全部"
                v-model="searchConditionData.applyDepartment"
              >
                <el-option label="全部" value=""></el-option>
                <el-option label="市场运营部" value="0"></el-option>
                <el-option label="商务部" value="1"></el-option>
                <el-option label="协会事业部" value="2"></el-option>
                <el-option label="测试部" value="3"></el-option>
                <el-option label="产品部" value="4"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="申请用途">
              <el-select
                placeholder="全部"
                v-model="searchConditionData.applyPurpose"
              >
                <el-option label="全部" value=""></el-option>
                <el-option label="渠道合作" value="0"></el-option>
                <el-option label="营销推广" value="1"></el-option>
                <el-option label="内部测试" value="2"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="10">
            <el-form-item label="发放类型">
              <el-select
                placeholder="全部"
                v-model="searchConditionData.publishType"
              >
                <el-option label="全部" value=""></el-option>
                <el-option label="前台领取" value="0"></el-option>
                <el-option label="后台发放" value="1"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="发放状态">
              <el-select
                placeholder="全部"
                v-model="searchConditionData.publishState"
              >
                <el-option label="全部" value=""></el-option>
                <el-option label="已发放" value="1"></el-option>
                <el-option label="未发放" value="0"></el-option>
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
        <el-col>
          <el-button @click="createCouponBtnOnClick"><span class="el-icon-circle-plus"></span>创建优惠券</el-button>
        </el-col>
      </el-row>
    </section>
    <section class="coupon-manager-table">
      <el-table
        :data="tableData"
        :fit="true"
        style="width: 100%"
        :cell-class-name="cellClassName"
        @cell-click="cellOnClick"
      >
        <el-table-column
          prop="id"
          width="80"
          label="序号">
        </el-table-column>
        <el-table-column
          prop="couponName"
          width="180"
          label="优惠券名称">
        </el-table-column>
        <el-table-column
          prop="couponTypeName"
          width="180"
          label="优惠券类型">
        </el-table-column>
        <el-table-column
          width="200"
          prop="couponBatchCode"
          label="批次号">
        </el-table-column>
        <el-table-column
          :formatter="foramtterCouponDenomination"
          prop="couponDenomination"
          label="面额">
        </el-table-column>
        <el-table-column
          prop="publishCount"
          width="100"
          label="发行量">
        </el-table-column>
        <el-table-column
          :formatter="formatterCouponTotal"
          prop="couponTotal"
          width="100"
          label="总额">
        </el-table-column>
        <el-table-column
          :formatter="formatterValidDate"
          prop="startTime"
          width="200"
          label="有效期">
        </el-table-column>
        <el-table-column
          :formatter="formatterPublishType"
          prop="publishType"
          width="80"
          label="发放类型">
        </el-table-column>
        <el-table-column
          :formatter="formatterBatchState"
          prop="batchState"
          width="100"
          label="批次状态">
        </el-table-column>
        <el-table-column
          :formatter="formatterPublishState"
          prop="publishState"
          width="100"
          label="发放状态">
        </el-table-column>
        <el-table-column
          prop="applyDepartmentName"
          width="100"
          label="申请部门">
        </el-table-column>
        <el-table-column
          prop="applyPurposeName"
          width="100"
          label="申请用途">
        </el-table-column>
        <el-table-column
          prop="opUser"
          width="100"
          label="创建人">
        </el-table-column>
        <el-table-column
          prop="createTime"
          width="180"
          label="创建时间">
        </el-table-column>
        <el-table-column label="操作" width="300" fixed="right">
          <template slot-scope="scope">
            <el-button
              @keydown.native.prevent
              @click="tableEditBtnOnClick(scope.row)"
            >
              编辑
            </el-button>
            <el-button
              v-if="checkBatchState(scope.row)"
              @click="tableDiscardBtnOnClick(scope.row)">废弃
            </el-button>
            <el-button
              v-if="checkBatchState(scope.row) && checkCanAssign(scope.row)"
              @keydown.native.prevent
              @click="tableAssignBtnOnClick(scope.row)"
              class="changeState"
            >
              发放
            </el-button>
            <el-button
              v-if="checkBatchState(scope.row) && !checkCanAssign(scope.row)"
              @keydown.native.prevent
              @click="tableAssignBtnOnClick(scope.row)"
              class="changeState remove"
            >
              取消发放
            </el-button>
          </template>
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
 * 功能描述：优惠券批次列表
 * 参数说明：
 * 注意事项：
 *
 * Create by YaoQiao on 2019-04-22
 */
import comm from '@/assets/js/utils/comm.js';
import apiUrlConfig from '@/api/apiUrlConfig';
import axios from '@/assets/js/utils/request';

export default {
  name: 'couponBatchList',
  data() {
    return {
      tableData: [],
      searchConditionData: {
        startTime: '', // 优惠券开始时间
        endTime: '', // 优惠券结束时间
        batchInfo: '', // 优惠券批次信息
        batchState: '0', // 批次状态,批次状态 0->正常,1->已废弃,2->已过期
        couponType: '', // 优惠券类型
        applyDepartment: '', // 申请部门
        applyPurpose: '', // 申请用途
        publishState: '', // 发放状态
        publishType: '' // 发放类型
      },
      searchConditionCreateTime: '',
      paginationData: {
        currentPage: 1,
        firstResult: 0,
        maxResult: 0,
        pageSize: 20, // 默认显示20条
        total: 0
      }
    };
  },
  methods: {
    getDataList() {
      // 获取时间
      if (Array.isArray(this.searchConditionCreateTime) && this.searchConditionCreateTime.length > 0) {
        this.searchConditionData.startTime = this.searchConditionCreateTime[0];
        this.searchConditionData.endTime = this.searchConditionCreateTime[1];
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
        if (this.searchConditionData[key] || this.searchConditionData[key] === '0') {
          data[key] = this.searchConditionData[key];
        }
      }
      // 添加 loading
      comm.openLoading('加载中...');
      axios({
        method: apiUrlConfig.getCouponBatchList.type,
        url: apiUrlConfig.getCouponBatchList.url,
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
        console.log('优惠券批次列表数据请求异常：', err);
      });
    },
    cellOnClick(row, column) {
      if (column.property === 'couponBatchCode') {
        let _url = this.$router.resolve({path: '/couponVoucherList', query: {couponBatchCode: row.couponBatchCode}});
        window.open(_url.href, '_blank');
      }
    },
    cellClassName(row) {
      if (row.column.property === 'couponBatchCode') {
        return 'coupon-batch-code-cell';
      }
    },
    clearBtnOnClick() {
      for (var key in this.searchConditionData) {
        this.searchConditionData[key] = '';
      }
      // 清空条件按钮
      this.searchConditionCreateTime = '';
    },
    filterBtnOnClick() {
      // 筛选按钮点击处理函数
      // 设置分页数据
      this.paginationData.currentPage = 1;
      this.paginationData.firstResult = 0;
      this.getDataList();
    },
    tableEditBtnOnClick(row) {
      let id = row.id;
      // 如果是通用优惠券
      if (row.couponType === 0) {
        let _url = this.$router.resolve({path: '/generalCouponDetail', query: {id: id}});
        window.open(_url.href, '_blank');
      }// 如果是商品优惠券
      else if (row.couponType === 1) {
        let _url = this.$router.resolve({path: '/commodityCouponDetail', query: {id: id}});
        window.open(_url.href, '_blank');
      }
    },
    tableDiscardBtnOnClick(row) {
      // 废弃按钮点击处理函数
      this.$allin_confirm({
        title: '提示',
        content: '废弃后该批次下未被领取优惠券将失效，且不可恢复，是否确认？',
        done: () => {
          // 更新数据
          comm.openLoading('加载中...');
          let data = {
            id: row.id,
            opStatus: 0
          };
          axios({
            method: apiUrlConfig.updateBatchState.type,
            url: apiUrlConfig.updateBatchState.url,
            data: data
          }).then((res) => {
            comm.closeLoading();
            if (res && res.data && res.data.responseObject && res.data.responseObject.responseCode === 'success') {
              let responseData = res.data.responseObject.responseData;
              let count = responseData.count;
              this.$message('已成功废弃废弃' + count + '条数据', {duration: 2000});
              this.getDataList();
            }
            else {
              this.$allin_confirm({title: '提示', content: '该批次下不存在未领取优惠券，废除失败', type: 'notice'});
              console.log('废弃优惠券失败');
            }
          }).catch((err) => {
            comm.closeLoading();
            this.$allin_confirm({title: '提示', content: '该批次下不存在未领取优惠券，废除失败', type: 'notice'});
            console.log('生成优惠券失败', err);
          });
        }
      });
    },
    tableAssignBtnOnClick(row) {
      // 发放/取消发放按钮点击处理函数
      let data = {
        id: row.id
      };
      let tipMessage = '';
      let errorMessage = '';
      let successMessage = '';
      // 如果是已发放,申请取消发放
      if (!this.checkCanAssign(row)) {
        data.opStatus = 2;
        tipMessage = '取消成功后该批次优惠券将不允许在前端领取，是否确认？';
        errorMessage = '取消发放优惠券失败';
        successMessage = '取消发放成功';
      }// 如果是未发放，申请发放
      else {
        // 如果是后台发放，则跳转至后台发放相关页面
        if (row.publishType === 1) {
          let _url = this.$router.resolve({ path: '/backgroundGrantDetail', query: { id: row.id } });
          return window.open(_url.href, '_blank');
        }
        else {
          data.opStatus = 1;
          tipMessage = '是否确认发放当前优惠券？';
          errorMessage = '该批次下不存在未领取优惠券，不允许发放空优惠券';
          successMessage = '发放成功';
        }
      }

      this.$allin_confirm({
        title: '提示',
        content: tipMessage,
        done: () => {
          // 更新数据
          comm.openLoading('加载中...');
          axios({
            method: apiUrlConfig.updateBatchState.type,
            url: apiUrlConfig.updateBatchState.url,
            data: data
          }).then((res) => {
            comm.closeLoading();
            if (res && res.data && res.data.responseObject && res.data.responseObject.responseCode === 'success') {
              this.$message(successMessage, {duration: 2000});
              this.getDataList();
            }
            else {
              this.$allin_confirm({title: '提示', content: errorMessage, type: 'notice'});
              console.log(errorMessage);
            }
          }).catch((err) => {
            comm.closeLoading();
            this.$allin_confirm({title: '提示', content: errorMessage, type: 'notice'});
            console.log(errorMessage, err);
          });
        }
      });
    },
    createCouponBtnOnClick() {
      // 创建优惠券
      let _url = this.$router.resolve({path: '/createCouponSelectList'});
      window.open(_url.href, '_blank');
    }, // 校验是否可进行发放/取消发放操作
    checkCanAssign(row) {
      // 如果是后台领取，则仅允许发放
      if (row.publishType === 1) {
        return true;
      }
      // 如果是已发放，则可以取消发放
      if (row.publishState === 1) {
        return false;
      }
      // 如果是未发放，则可以发放
      return true;
    }, // 校验批次状态是否正常
    checkBatchState(row) {
      // 如果正常，则允许查看、废弃、发放/取消发放等操作权限
      if (row.batchState === 0) {
        return true;
      }
      // 否则，只有查看操作权限
      return false;
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
    // 表格格式化部分开始
    foramtterCouponDenomination(row) {
      // 面额格式化
      return '￥' + row.couponDenominationStr;
    },
    formatterCouponTotal(row) {
      // 总额格式化
      return '￥' + (row.couponDenominationStr * row.publishCount).toFixed(2);
    },
    formatterValidDate(row) {
      // 有效期格式化
      return row.startTime + '至' + row.endTime;
    },
    formatterPublishType(row, col, cell) {
      // 发放类型格式化
      if (cell === 0) {
        return '前台领取';
      }
      else if (cell === 1) {
        return '后台发放';
      }
      return '';
    },
    formatterBatchState(row) {
      // 批次状态格式化
      let _batchState = '';
      switch (row.batchState) {
        case 0:
          _batchState = '正常';
          break;
        case 1:
          _batchState = '已废弃';
          break;
        case 2:
          _batchState = '已过期';
          break;
        default:
          break;
      }
      return _batchState;
    },
    formatterPublishState(row) {
      // 发放状态格式化
      let _publishState = '';
      switch (row.publishState) {
        case 0:
          _publishState = '未发放';
          break;
        case 1:
          _publishState = '已发放';
          break;
        default:
          break;
      }
      return _publishState;
    }
    // 表格格式化部分结束
  },
  mounted() {
    // 初始化获取数据
    this.getDataList();
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

  .coupon-batch-code-cell {
    cursor: pointer;
    text-decoration: underline;
    color: #4B67D6;
    .cell {
      color: #4B67D6 !important;
    }
  }
</style>

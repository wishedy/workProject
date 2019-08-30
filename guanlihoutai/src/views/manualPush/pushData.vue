<template>
  <section class="crm-manualPush crm-manualPush-manage">
    <!--添加手动推送标题开始-->
    <h1 class="crm-manualPush-title">推送整体数据</h1>
    <!--添加手动推送标题结束-->
    <template>
      <section class="crm-manualPush-handle">
        <el-form ref="form" :model="handleForm" label-width="100px">
          <el-form-item label="起止时间">
            <el-date-picker
              v-model="handleForm.pushDuringTime"
              type="datetimerange"
              range-separator="至"
              start-placeholder="开始日期"
              value-format="yyyy-MM-dd HH:mm:ss"
              end-placeholder="结束日期">
            </el-date-picker>
          </el-form-item>
          <el-form-item label="端口">
            <el-select v-model="handleForm.pushChannel" placeholder="请选择端口">
              <el-option label="IOS" value="1"></el-option>
              <el-option label="安卓(友盟)" value="2"></el-option>
              <el-option label="华为" value="3"></el-option>
            </el-select>
          </el-form-item>
          <!-- <el-form-item label="类型">
            <el-select v-model="handleForm.pushType" placeholder="请选择类型">
              <el-option label="自动" :value="1"></el-option>
              <el-option label="手动" :value="2"></el-option>
            </el-select>
          </el-form-item> -->
        </el-form>
        <section class="crm-patientsEvaluation-control">
          <div class="crm-reset-table" @click.stop="resetForm">重置</div>
          <div class="crm-filtrate-table" @click.stop="getList">筛选</div>
        </section>
      </section>
    </template>
    <section class="crm-manualPush-button">
      <el-row>
        <el-col>
          <el-button v-if="tableData.length>0">
            <span class="el-icon-circle-plus"></span>
            <a href="javascript:void(0);" @click="exportExcel">导出</a>
          </el-button>
        </el-col>
      </el-row>
    </section>
    <template>
      <section class="crm-manualPush-table">
        <el-table
          :data="tableData"
          width="100%"
          class="ev-table"
          :default-sort = "{prop: 'createTime', order: 'descending'}"
          ref="sortReset"
        >
          <el-table-column
            prop="statisticsTime"
            label="推送时间">
          </el-table-column>
          <el-table-column
            prop="pushChannel"
            :formatter="portFormatter"
            label="端口">
          </el-table-column>
          <el-table-column
            prop="pushNum"
            label="下发条数"
          >
          </el-table-column>
          <el-table-column
            prop="pushCustomerNum"
            label="下发会员数"
          >
          </el-table-column>
          <el-table-column
            prop="receiveNum"
            label="到达数量"
          >
          </el-table-column>
          <el-table-column
            prop="receiveRate"
            label="到达率">
          </el-table-column>
          <el-table-column
            label="点击数量"
            prop="pushClickNum">
          </el-table-column>
          <el-table-column
            label="点击率"
            prop="pushClickRate"
          >
          </el-table-column>
        </el-table>
      </section>
    </template>
    <template>
      <section class="crm-manualPush-pager">
        <div class="block ev-pages">
          <el-pagination
            class="al-bs-pagination"
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page="currentPage"
            :page-sizes="[10, 20, 30, 40]"
            :page-size="pageSize"
            align="center"
            layout="total, sizes, prev, pager, next, jumper"
            :total="totalCount" v-if="totalCount!=0">
          </el-pagination>
        </div>
      </section>
    </template>
  </section>
</template>
<script>
import api from '@/api/apiUrlConfig';
import comm from '@/assets/js/utils/comm.js';
import axios from '@/assets/js/utils/request';
export default {
  data() {
    return {
      pageSize: 20, // 每页几条
      currentPage: 1, // 当前页
      totalCount: 1, // 总条数
      firstResult: 0, // 根据条数跳转
      handleForm: {
        // pushType: '',
        pushChannel: '',
        startPushTime: '',
        endPushTime: '',
        pushDuringTime: []
      },
      tableData: [],
      exportData: {} // 导出订单参数
    };
  },
  created() {
    this.getBaseList();
  },
  methods: {
    getBaseList(requestParams) {
      // console.log(requestParams);
      var params;
      if (requestParams) {
        params = requestParams;
      }
      else {
        params = {
          firstResult: this.firstResult,
          maxResult: this.pageSize
        };
      }
      // console.log(params);
      axios({
        methods: api.getStatDailyList.type,
        url: api.getStatDailyList.url,
        params: params
      }).then((res) => {
        this.totalCount = res.data.responseObject.responseData.totalCount;
        let DataAll = res.data.responseObject.responseData.dataList;
        if (DataAll) {
          let resData = [];
          DataAll.forEach((opt, index) => {
            resData.push({
              createTime: opt.createTime,
              id: opt.id,
              pushClickNum: opt.pushClickNum !== '' ? opt.pushClickNum : '-',
              pushClickRate: opt.pushClickRate !== '' ? opt.pushClickRate : '-',
              pushCustomerNum: opt.pushCustomerNum !== '' ? opt.pushCustomerNum : '-',
              pushNum: opt.pushNum !== '' ? opt.pushNum : '-',
              pushChannel: opt.pushChannel !== '' ? opt.pushChannel : '-',
              statisticsTime: opt.statisticsTime !== '' ? opt.statisticsTime : '-',
              receiveNum: opt.receiveNum !== '' ? opt.receiveNum : '-',
              receiveRate: opt.receiveRate !== '' ? opt.receiveRate : '-'
            });
          });
          this.tableData = resData;
          this.exportData = params;
        }
      });
    },
    portFormatter(row) {
      return row.pushChannel === 1 ? 'IOS' : row.pushChannel === 2 ? '安卓(友盟)' : row.pushChannel === 3 ? '华为' : '-';
    },
    resetForm() {
      this.handleForm = {
        pushChannel: '',
        startPushTime: '',
        endPushTime: '',
        pushDuringTime: []
      };
    },
    getList() {
      this.currentPage = 1;
      this.startPushTime = !this.handleForm.pushDuringTime ? '' : this.handleForm.pushDuringTime[0];
      this.endPushTime = !this.handleForm.pushDuringTime ? '' : this.handleForm.pushDuringTime[1];
      let requestParams = {
        firstResult: 0,
        maxResult: this.pageSize,
        startPushTime: this.startPushTime,
        endPushTime: this.endPushTime,
        pushChannel: this.handleForm.pushChannel
      };
      this.getBaseList(requestParams);
    },
    handleSizeChange(val) {
      this.pageSize = val;
      this.currentPage = 1;
      this.firstResult = 0;
      this.startPushTime = !this.handleForm.pushDuringTime ? '' : this.handleForm.pushDuringTime[0];
      this.endPushTime = !this.handleForm.pushDuringTime ? '' : this.handleForm.pushDuringTime[1];
      let requestParams = {
        pushChannel: this.handleForm.pushChannel,
        startPushTime: !this.handleForm.pushDuringTime ? '' : this.handleForm.pushDuringTime[0],
        endPushTime: !this.handleForm.pushDuringTime ? '' : this.handleForm.pushDuringTime[1],
        firstResult: this.firstResult,
        maxResult: this.pageSize
      };
      this.getBaseList(requestParams);
    },
    handleCurrentChange(val) {
      this.currentPage = val;
      this.firstResult = (val - 1) * this.pageSize;
      let requestParams = {
        pushChannel: this.handleForm.pushChannel,
        startPushTime: !this.handleForm.pushDuringTime ? '' : this.handleForm.pushDuringTime[0],
        endPushTime: !this.handleForm.pushDuringTime ? '' : this.handleForm.pushDuringTime[1],
        firstResult: this.firstResult,
        maxResult: this.pageSize
      };
      this.getBaseList(requestParams);
    },
    exportExcel() {
      comm.openLoading('导出中...');
      // console.log(this.exportData);
      axios({
        method: api.exportStatDailyList.type,
        url: api.exportStatDailyList.url,
        params: this.exportData,
        responseType: 'blob',
        headers: {'ms-type': 'application/vnd.ms-excel'}
      }).then((res) => {
        comm.closeLoading();
        comm.downloadFileHandle(res.data, '已推送数据清单');
      }).catch((err) => {
        comm.closeLoading();
        this.$allin_confirm({title: '提示', content: '导出失败', type: 'notice'});
        console.log(err);
      });
    }
  }
};
</script>
<style lang="scss">
  @import "../../assets/scss/pages/manualPush/manualPush.scss";
</style>

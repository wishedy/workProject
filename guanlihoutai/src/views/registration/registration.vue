<template>
  <section class="registration-main-contains">
    <h1 class="registration-title">预约挂号</h1>
    <section class="search-form">
      <el-form ref="registrationForm" :model="searchForm">
        <el-row class="from-row">
          <el-col :span="6">
            <el-form-item label="订单编号" prop="orderId" class="el-form-label">
              <el-input
                v-model="searchForm.orderId"
                placeholder="请输入id"
                maxlength="13"
                @input.native="limmitNumber('orderId')"
                class="el-input-width"
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="用户id" prop="customerId" class="el-form-label">
              <el-input
                v-model="searchForm.customerId"
                placeholder="请输入用户id"
                class="el-input-width"
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="患者id" prop="patientId" class="el-form-label">
              <el-input
                v-model="searchForm.patientId"
                placeholder="请输入患者id"
                class="el-input-width"
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="患者姓名" prop="patientName" class="el-form-label">
              <el-input
                v-model="searchForm.patientName"
                placeholder="请输入姓名"
                maxlength="10"
                class="el-input-width"
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="患者手机号" prop="patientMobile" class="el-form-label">
              <el-input
                v-model="searchForm.patientMobile"
                maxlength="11"
                @input.native="limmitNumber('patientMobile')"
                placeholder="请输入手机号"
                class="el-input-width"
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="医生姓名" prop="doctorName" class="el-form-label">
              <el-input
                v-model="searchForm.doctorName"
                maxlength="10"
                placeholder="请输入姓名"
                class="el-input-width"
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="科室" prop="deptCode" class="el-form-label">
              <el-select v-model="searchForm.deptCode" placeholder="全部">
                <el-option label="全部" value=""></el-option>
                <el-option :label="item.deptName" :value="item.deptCode" v-for="(item,index) in deptList" :key="index"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="订单状态" prop="orderState" class="el-form-label">
              <el-select v-model="searchForm.orderState" placeholder="全部">
                <el-option label="全部" value=""></el-option>
                <el-option label="已就诊" value="1"></el-option>
                <el-option label="待就诊" value="0"></el-option>
                <el-option label="已取消" value="2"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="9">
            <el-form-item label="挂号日期" class="el-form-label">
              <el-date-picker
                v-model="orderTime"
                type="daterange"
                align="right"
                start-placeholder="不限"
                end-placeholder="不限"
                range-separator="到"
                value-format="yyyy-MM-dd HH:mm:ss"
                :default-time="['00:00:00', '23:59:59']"
              >
              </el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="时段" prop="clinicDuration" class="el-form-label">
              <el-select v-model="searchForm.clinicDuration" placeholder="全部">
                <el-option label="全部" value=""></el-option>
                <el-option label="上午" value="上午"></el-option>
                <el-option label="下午" value="下午"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="来源" prop="clinicDuration" class="el-form-label">
              <el-select v-model="searchForm.source" placeholder="全部">
                <el-option label="全部" value=""></el-option>
                <el-option label="唯医骨科" value="24"></el-option>
                <el-option label="重庆小程序" value="27"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="4" class="submitBtn-container">
            <el-form-item class="submitBtn">
              <el-button @click="resetForm">重置</el-button>
              <el-button @click="onSubmit">&nbsp;&nbsp;查询&nbsp;&nbsp;</el-button>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </section>
    <section class="table-list">
      <el-table
        :data="tableData"
        @row-dblclick="rowHandle"
        style="width: 100%"
      >
        <el-table-column
          prop="serialNumber"
          label="序号"
        >
        </el-table-column>
        <el-table-column
          prop="orderId"
          label="订单编号"
          width="130"
        >
        </el-table-column>
        <el-table-column
          prop="customerId"
          label="用户id"
          width="130"
        >
        </el-table-column>
        <el-table-column
          prop="patientId"
          label="患者id"
          width="130"
        >
        </el-table-column>
        <el-table-column
          prop="patientName"
          label="患者姓名"
          width="160"
        >
        </el-table-column>
        <el-table-column
          prop="patientMobile"
          label="患者手机号"
          width="120"
        >
        </el-table-column>
        <el-table-column
          prop="doctorName"
          label="医生姓名"
          width="160"
        >
        </el-table-column>
        <el-table-column
          label="科室"
          prop="deptName"
          width="80"
        >
        </el-table-column>
        <el-table-column
          prop="registerDate"
          label="挂号日期"
          width="100"
        >
        </el-table-column>
        <el-table-column
          label="时段"
          width="60"
          prop="clinicDuration"
        >
        </el-table-column>
        <el-table-column
          prop="orderState"
          label="订单状态"
          width="80"
        >
        </el-table-column>
        <el-table-column
          prop="source"
          label="来源"
          width="80"
        >
        </el-table-column>
      </el-table>
      <el-row class="pagination" v-if="total>10">
        <el-col :span="10" :offset="5">
          <el-pagination
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page="currentPage"
            :page-sizes="[10, 20, 30, 50, 100]"
            :page-size="pageSize"
            layout="total, sizes, prev, pager, next, jumper"
            :total="total">
          </el-pagination>
        </el-col>
      </el-row>
    </section>
    <el-dialog title="操作日志" :visible.sync="dialogFormVisible" class="el-dialog-contanier">
      <section class="content-container">
          <article class="content-item">
            <p class="content-title">挂号时间</p>
            <p class="content-text">{{dialogData.registerDateFull}}</p>
          </article>
        <article class="content-item">
          <p class="content-title">就诊时间</p>
          <p class="content-text">{{dialogData.visitDate}}</p>
        </article>
      </section>
    </el-dialog>
  </section>
</template>
<script>
import axios from '@/assets/js/utils/request.js';
import apiConfig from '@/api/apiUrlConfig';
import comm from '@/assets/js/utils/comm.js';

export default {
  data() {
    return {
      dialogFormVisible: false,
      searchForm: {
        orderId: '', // 订单编号
        customerId: '', // 用户ID
        patientId: '', // 患者ID
        patientName: '', // 患者名字
        patientMobile: '', // 手机号码
        doctorName: '', // 医生姓名
        deptCode: '', // 科室
        orderState: '', // 订单状态
        startTime: '', // 开始时间（2019-01-09 12:00:00）
        endTime: '', // 结束时间
        clinicDuration: '', // 时段
        source: '' // 来源
      },
      dialogData: {
        registerDateFull: '',
        visitDate: ''
      },
      deptList: [],
      orderTime: '', // 挂号日期
      tableData: [],
      tableParams: {
        firstResult: 0, // 分页参数0
        maxResult: 10 // 分页参数20
      },
      // 分页参数
      currentPage: 1, // 当前页
      pageSize: 10, // 每页条数
      total: 0 // 总数

    };
  },
  components: {},
  methods: {
    // 显示操作日志
    rowHandle(row) {
      this.dialogData.registerDateFull = row.registerDateFull;
      if (row.visitDate !== '0000-00-00 00:00:00') {
        this.dialogData.visitDate = row.visitDate;
      }
      else {
        this.dialogData.visitDate = '';
      }

      this.dialogFormVisible = true;
    },
    // 数字限制
    limmitNumber(value) {
      let _this = this;
      _this.$nextTick(() => {
        if (_this.searchForm[value] !== null && _this.searchForm[value] !== '') {
          _this.searchForm[value] = _this.searchForm[value].replace(/[^\d]/g, '');
        }
      });
    },
    // 获取科室列表
    getDeptList() {
      comm.openLoading('加载中...');
      axios({
        method: apiConfig.getDeptList.type,
        url: apiConfig.getDeptList.url,
        params: {}
      }).then((response) => {
        console.log(response, '444444444');
        comm.closeLoading();
        if (
          response &&
          response.data &&
          response.data.responseObject &&
          response.data.responseObject.responseData &&
          response.data.responseObject.responseData.dataList
        ) {
          let dataList = response.data.responseObject.responseData.dataList;
          this.deptList = dataList;
        }
        else {
          console.log(11);
          this.$allin_confirm({title: '提示', content: '获取科室失败', type: 'notice'});
        }
      }).catch((e) => {
        comm.closeLoading();
        this.$allin_confirm({title: '提示', content: '获取科室失败', type: 'notice'});
      });
    },
    // 获取表格数据
    getTableData() {
      comm.openLoading('加载中...');
      axios({
        method: apiConfig.registerList.type,
        url: apiConfig.registerList.url,
        params: this.tableParams
      }).then((response) => {
        comm.closeLoading();
        if (
          response &&
            response.data &&
            response.data.responseObject &&
            response.data.responseObject.responseData
        ) {
          let responseData = response.data.responseObject.responseData;
          if (responseData.dataList) {
            this.tableData = responseData.dataList;
            this.total = response.data.responseObject.responseData.dataTotal;
          }
          else {
            this.tableData = [];
            this.total = 0;
          }
        }
        else {
          this.total = 0;
          this.tableData = [];
          // this.$allin_confirm({title: '提示', content: '暂无数据，请更换筛选项', type: 'notice'});
        }
      }).catch((e) => {
        this.tableData = [];
        this.total = 0;
        comm.closeLoading();
        this.$allin_confirm({title: '提示', content: '查询失败', type: 'notice'});
      });
    },
    // 查询
    onSubmit() {
      //   startTime: '',//提交时间开始
      //   endTime: '',//提交时间结束
      if (Array.isArray(this.orderTime) && this.orderTime.length > 0) {
        this.searchForm.startTime = this.orderTime[0];
        this.searchForm.endTime = this.orderTime[1];
      }
      else {
        this.searchForm.startTime = '';
        this.searchForm.endTime = '';
      }

      // 数据为空不提交
      let newObj = {};
      for (let key in this.searchForm) {
        if (this.searchForm[key].toString()) {
          newObj[key] = this.searchForm[key];
        }
      }

      // 要将排序,开始索引,结束索引,每页包含数恢复初始值
      // 针对两个时间字段
      this.tableParams = this.deepExtend({}, {
        firstResult: 0,
        maxResult: 10
      }, newObj);
      // 恢复默认值
      this.pageSize = 10;
      this.currentPage = 1;
      console.log(this.searchForm);
      this.getTableData();
    },
    // form重置
    resetForm() {
      this.$refs['registrationForm'].resetFields();
      // 对时间组件进行重置
      this.orderTime = '';
      this.searchForm.startTime = '';
      this.searchForm.endTime = '';
    },

    // 深复制,需要第一个参数为 {}
    deepExtend(out) {
      out = out || {};
      for (let i = 1; i < arguments.length; i++) {
        let obj = arguments[i];

        if (!obj) {
          continue;
        }

        for (let key in obj) {
          if (obj.hasOwnProperty(key)) {
            if (typeof obj[key] === 'object') {
              out[key] = this.deepExtend(out[key], obj[key]);
            }
            else {
              out[key] = obj[key];
            }
          }
        }
      }
      return out;
    },
    /** **************分页组件方法**************/
    handleSizeChange(val) {
      this.pageSize = val;
      this.tableParams.maxResult = this.pageSize;

      this.tableParams.firstResult = 0;
      this.currentPage = 0;

      this.getTableData();
    },
    handleCurrentChange(val) {
      this.currentPage = val;
      this.tableParams.firstResult = (this.currentPage - 1) * this.pageSize;
      this.getTableData();
    }

  },
  mounted() {
    this.getDeptList();
    this.getTableData();
    // 绑定键盘事件
    document.onkeydown = (e) => {
      if (e.keyCode === 13) {
        this.onSubmit();
      }
    };
  },
  destroyed() {
    document.onkeydown = null;
    comm.goBack();
  },
  watch: {

  }
};
</script>

<style lang='scss'>
  .registration-main-contains {
    width: 1250px;
    margin: 20px auto;
    .registration-title{
      font-family: PingFangSC-Semibold;
      font-size: 20px;
      color: #222222;
      letter-spacing: 0;
      line-height: 20px;
      margin: 32px 0 25px;
    }
    .search-form {
      background: #fff;
      padding-top: 15px;
      margin-bottom: 30px;
      .from-row {
        padding-left: 20px;
      }
      .el-input-width{
        width: auto;
      }
      .el-input .el-input__inner{
        background: #F7F9FC ;
        border: 1px solid #E6E6E8;
        border-radius: 4px;
      }
      .submitBtn-container{
        margin-right: 20px;
        float: right;
      }
      .submitBtn {
        button {
          &:nth-of-type(1) {
            border: none;
          }
          &:nth-of-type(2) {
            color: #4B67D6;
            border: 1px solid #4B67D6;
            border-radius: 4px;
          }
        }
      }
    }
    .el-dialog-contanier{
      .el-dialog{
        min-width: 700px;
        max-width: 800px;
      }
    }
    .content-container{
      .content-item{
        font-size:14px;
        font-family:PingFangSC-Medium;
        font-weight:500;
        color:rgba(51,51,51,1);
        margin-bottom: 20px;
      }
      .content-title{
        display: inline-block;
        vertical-align: middle;
        margin-right: 20px;
      }
      .content-text{
        display: inline-block;
        vertical-align: middle;
        border:1px solid #ccc;
        padding: 10px 15px;
        min-width: 200px;
        min-height: 14px;
      }
    }
  }
</style>

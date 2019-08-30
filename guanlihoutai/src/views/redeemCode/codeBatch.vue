<template>
  <section class="codeBatch-main-contains">
    <h1 class="code-title">兑换码批次列表</h1>
    <section class="search-form">
      <el-form ref="codeBatchForm" :model="searchForm">
        <el-row class="from-row">
          <el-col :span="10">
            <el-form-item label="创建时间" class="el-form-label">
                <el-date-picker
                  v-model="createTime"
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
          <el-col :span="7">
            <el-form-item label="兑换码信息" prop="redeemCode" class="el-form-label">
              <el-input
                v-model="searchForm.redeemCode"
                placeholder="兑换码名称/批次号"
                class="el-input-width"
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="7">
            <el-form-item label="批次状态" prop="batchState" class="el-form-label">
              <el-select v-model="searchForm.batchState" placeholder="正常">
                <el-option label="全部" value=""></el-option>
                <el-option label="正常" value="0"></el-option>
                <el-option label="已冻结" value="1"></el-option>
                <el-option label="已过期" value="2"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row class="from-row">
          <el-col :span="7">
            <el-form-item label="发行类型" prop="publishType" class="el-form-label">
              <el-select v-model="searchForm.publishType" placeholder="全部">
                <el-option label="全部" value=""></el-option>
                <el-option label="电子码" value="0"></el-option>
                <el-option label="纸质码" value="1"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="7">
            <!--全部、市场运营部、商务部、协会事业部、测试部、产品部-->
            <el-form-item label="申请部门" prop="applyDepartment" class="el-form-label">
              <el-select v-model="searchForm.applyDepartment" placeholder="全部">
                <el-option label="全部" value=""></el-option>
                <el-option label="市场运营部" value="0"></el-option>
                <el-option label="商务部" value="1"></el-option>
                <el-option label="协会事业部" value="2"></el-option>
                <el-option label="测试部" value="3"></el-option>
                <el-option label="产品部" value="4"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="7">
            <!--全部、厂商购买、院方采购、内部测试-->
            <el-form-item label="申请用途" prop="applyPurpose" class="el-form-label">
              <el-select v-model="searchForm.applyPurpose" placeholder="全部">
                <el-option label="全部" value=""></el-option>
                <el-option label="厂商购买" value="0"></el-option>
                <el-option label="院方采购" value="1"></el-option>
                <el-option label="平台赠送" value="3"></el-option>
                <el-option label="内部测试" value="2"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="4" class="submitBtn-container">
            <el-form-item class="submitBtn">
              <el-button @click="resetForm">清空条件</el-button>
              <el-button @click="onSubmit">&nbsp;&nbsp;筛选&nbsp;&nbsp;</el-button>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </section>
    <section class="code-button">
      <el-row>
        <el-col>
          <el-button class="el-icon-circle-plus creat-button" @click="createCodeBtn"> 创建兑换码</el-button>
        </el-col>
      </el-row>
    </section>
    <section class="code-source-list">
      <el-table
        :data="tableData"
        style="width: 100%"
        @cell-click="goCodeDetail"
        :cell-class-name="cellClassName"
      >
        <el-table-column
          prop="id"
          label="序号"
        >
        </el-table-column>
        <el-table-column
          prop="redeemCodeName"
          label="兑换码名称"
          width="300"
        >
        </el-table-column>
        <el-table-column
          prop="redeemCodeBatchCode"
          label="批次号"
          width="190"
        >
        </el-table-column>
        <el-table-column
          label="面额"
          width="100"
          :formatter="formProductPrice"
        >
        </el-table-column>
        <el-table-column
          prop="productName"
          label="兑换商品"
          width="300"
        >
        </el-table-column>
        <el-table-column
          prop="publishCount"
          label="发行量"
        >
        </el-table-column>
        <el-table-column
          prop="total"
          label="总额"
          width="130"
          :formatter="formTotal"
        >
        </el-table-column>
        <el-table-column
          label="有效期"
          width="200"
          :formatter="fromTime"
        >
        </el-table-column>
        <el-table-column
          label="发行类型"
          :formatter="fromPublishType"
        >
        </el-table-column>
        <el-table-column
          label="批次状态"
          :formatter="fromBatchState"
        >
        </el-table-column>
        <el-table-column
          label="申请部门"
          width="90"
          :formatter="fromApplyDepartment"
        >
        </el-table-column>
        <el-table-column
          prop="applyPurpose"
          label="申请用途"
          :formatter="fromApplyPurpose"
        >
        </el-table-column>
        <el-table-column
          prop="opUser"
          label="创建人"
          width="100"
        >
        </el-table-column>
        <el-table-column
          prop="createTime"
          label="创建时间"
          width="180"
        >
        </el-table-column>
        <el-table-column
          fixed="right"
          width="430"
          label="操作"
          align="center"
        >
          <!--查看  冻结  导出全部信息  导出卡号-->
          <template slot-scope="scope">
                <el-button
                  class="viewBotton"
                  @click="handleEvent(scope.row,1)"
                >
                  查看
                </el-button>
            <el-button
              class="viewBotton"
              @click="handleEvent(scope.row,2,scope.$index)"
              v-if="scope.row.batchState===0"
            >
              冻结
            </el-button>
            <el-button
              class="viewBotton"
              @click="handleEvent(scope.row,5,scope.$index)"
              v-if="scope.row.batchState===1"
            >
              解冻
            </el-button>
            <a
              class="viewBottonOut"
              @click="handleEvent(scope.row,3,scope.$index)"
              href="javascript:void(0);"
            >
             导出全部信息
            </a>
            <a
              class="viewBottonOut"
              @click="handleEvent(scope.row,4,scope.$index)"
              href="javascript:void(0);"
            >
              导出卡号
            </a>
          </template>
        </el-table-column>
      </el-table>
      <el-row class="pagination" v-if="total>10">
        <el-col :span="10" :offset="5">
          <el-pagination
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page="currentPage"
            :page-sizes="[10, 20, 30, 40]"
            :page-size="pageSize"
            layout="total, sizes, prev, pager, next, jumper"
            :total="total">
          </el-pagination>
        </el-col>
      </el-row>
    </section>
  </section>
</template>
<script>
import axios from '@/assets/js/utils/request.js';
import apiConfig from '@/api/apiUrlConfig';
import comm from '@/assets/js/utils/comm.js';

export default {
  data() {
    return {
      searchForm: {
        redeemCode: '',
        createStartTime: '', // 开始时间（2019-01-09 12:00:00）
        createEndTime: '', // 结束时间
        batchState: '0', // 批次状态
        publishType: '', // 发行类型
        applyPurpose: '', // 申请用途
        applyDepartment: ''// 申请部门
      },
      createTime: '',
      tableData: [],
      tableParams: {
        firstResult: 0, // 分页参数0
        maxResult: 20, // 分页参数20
        batchState: '0'
      },
      // 分页参数
      currentPage: 1, // 当前页
      pageSize: 20, // 每页条数
      total: 0 // 总数

    };
  },
  components: {},
  methods: {
    goCodeDetail(row, column, cell, event) {
      if (column.property === 'redeemCodeBatchCode') {
        let _url = this.$router.resolve({
          path: '/codeNumber',
          query: {
            redeemCodeBatchCode: row.redeemCodeBatchCode
          }
        });
        window.open(_url.href, '_blank');
      }
    },
    // 导出全部信息、导出卡号
    outExcel(item, type) {
      comm.openLoading('导出中...');
      let data = {
        redeemCodeId: item.id,
        type: type
      };
      axios({
        method: apiConfig.exportRedeemDate.type,
        url: apiConfig.exportRedeemDate.url,
        params: data,
        responseType: 'blob',
        headers: {'ms-type': 'application/vnd.ms-excel'}
      }).then((res) => {
        comm.closeLoading();
        comm.downloadFileHandle(res.data, item.redeemCodeBatchCode);
      }).catch((err) => {
        comm.closeLoading();
        this.$allin_confirm({ title: '提示', content: '导出失败', type: 'notice' });
        console.log(err);
      });
    },
    // 批次号特殊类名
    cellClassName(row) {
      if (row.column.property === 'redeemCodeBatchCode') {
        return 'redeem-code-batch-code';
      }
    },
    // 面额
    formProductPrice(val) {
      if (val.productPrice) {
        return '￥' + val.productPrice;
      }
    },
    // 总额
    formTotal(val) {
      if (val.total) {
        return '￥' + val.total;
      }
    },
    // 发布类型
    fromPublishType(val) {
      if (val.publishType === 1) {
        return '纸质码';
      }
      else if (val.publishType === 0) {
        return '电子码';
      }
    },
    // 有效时间
    fromTime(val) {
      return val.startTime + '至' + val.endTime;
    },
    // 批次转态
    fromBatchState(val) {
      let str = '';
      switch (val.batchState) {
        case 0:
          str = '正常';
          break;
        case 1:
          str = '已冻结';
          break;
        case 2:
          str = '已过期';
          break;
      }
      return str;
    },
    // 申请用途
    fromApplyPurpose(val) {
      let str = '';
      switch (val.applyPurpose) {
        case 0:
          str = '厂商购买';
          break;
        case 1:
          str = '院方采购';
          break;
        case 2:
          str = '内部测试';
          break;
        case 3:
          str = '平台赠送';
          break;
      }
      return str;
    },
    // 申请部门
    fromApplyDepartment(val) {
      // 0->市场运营部,1->商务部,2->协会事业部,3->测试部,4->产品部
      let str = '';
      switch (val.applyDepartment) {
        case 0:
          str = '市场运营部';
          break;
        case 1:
          str = '商务部';
          break;
        case 2:
          str = '协会事业部';
          break;
        case 3:
          str = '测试部';
          break;
        case 4:
          str = '产品部';
          break;
      }
      return str;
    },
    // 获取表格数据
    getTableData() {
      comm.openLoading('加载中...');
      axios({
        method: apiConfig.getRedeemCodeList.type,
        url: apiConfig.getRedeemCodeList.url,
        params: this.tableParams
      }).then((response) => {
        console.log(response);
        comm.closeLoading();
        if (
          response &&
          response.data &&
          response.data.responseObject &&
          response.data.responseObject.responseData
        ) {
          let responseData = response.data.responseObject.responseData;
          if (responseData.items) {
            this.tableData = responseData.items;
            this.total = response.data.responseObject.responseData.total;
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
    createCodeBtn() {
      let _url = this.$router.resolve({
        path: '/createCode'
      });
      window.open(_url.href, '_blank');
    },
    handleEvent(item, index, rowIndex) {
      let _this = this;
      // 1-查看、2-冻结、3-导出全部信息、4-导出卡号、5-解冻
      switch (index) {
        case 1:
          let _url = _this.$router.resolve({
            path: '/createCode',
            query: {
              redeemCodeId: item.id
            }
          });
          window.open(_url.href, '_blank');
          break;
        case 2:
          _this.freezeCode(item, rowIndex);
          break;
        case 3:
          // 1导出卡号 2导出全部
          _this.outExcel(item, 2);
          break;
        case 4:
          _this.outExcel(item, 1);
          break;
        case 5:
          _this.unfreezeCode(item, rowIndex);
          break;
        default:
          break;
      }
    },
    // 冻结提示
    freezeCodeTip(item, rowIndex) {
      let _this = this;
      _this.$confirm('冻结后已发放的兑换码无法正常兑换，已兑换成功的课程仍可正常观看，是否确认？', '提示', {
        confirmButtonText: '确认',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        _this.freezeCodeApi(item, rowIndex, 1, (res) => {
          if (_this.searchForm.batchState.toString()) {
            _this.tableData.splice(rowIndex, 1);
          }
          else {
            _this.tableData[rowIndex].batchState = 1;
          }
          _this.$message({
            type: 'success',
            message: `已成功冻结${res.responseData.count}条数据`,
            onClose: () => {
              // _this.getTableData();
            }
          });
        });
      }).catch(() => {
      });
    },
    // 冻结/解冻接口
    freezeCodeApi(item, rowIndex, type, callback) {
      let _this = this;
      comm.openLoading('加载中...');
      axios({
        method: apiConfig.frozenOrThaw.type,
        url: apiConfig.frozenOrThaw.url,
        data: {
          redeemCodeId: item.id,
          type: type
        }
      }).then((response) => {
        comm.closeLoading();
        if (response && response.data && response.data.responseObject && response.data.responseObject.responseData) {
          if (response.data.responseObject.responseData.count) {
            callback && callback(response.data.responseObject);
          }
          else {
            if (type === 1) {
              _this.$message.error('冻结失败');
            }
            else {
              _this.$message.error('解冻失败');
            }
          }
        }
        else {
          if (type === 1) {
            _this.$message.error('冻结失败');
          }
          else {
            _this.$message.error('解冻失败');
          }
        }
      }).catch((e) => {
        comm.closeLoading();
        if (type === 1) {
          _this.$message.error('冻结失败');
        }
        else {
          _this.$message.error('解冻失败');
        }
      });
    },
    // 冻结判断该批次下是否存在未被使用码号
    freezeCode(item, rowIndex) {
      let _this = this;
      comm.openLoading('加载中...');
      axios({
        method: apiConfig.checkHaveNoUse.type,
        url: apiConfig.checkHaveNoUse.url,
        params: {
          redeemCodeId: item.id
        }
      }).then((response) => {
        comm.closeLoading();
        if (response && response.data && response.data.responseObject && response.data.responseObject.responseStatus) {
          if (response.data.responseObject.responseData) {
            _this.freezeCodeTip(item, rowIndex);
          }
          else {
            this.$alert('该批次下兑换码已全部被使用，不允许冻结', '提示', {
              confirmButtonText: '确定',
              callback: action => {

              }
            });
          }
        }
        else {
          this.$allin_confirm({title: '提示', content: '查询失败', type: 'notice'});
        }
      }).catch((e) => {
        comm.closeLoading();
      });
    },
    // 解冻提示
    unfreezeCode(item, rowIndex) {
      let _this = this;
      _this.$confirm('是否确认解冻该批次兑换码？', '提示', {
        confirmButtonText: '确认',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        _this.freezeCodeApi(item, rowIndex, 2, (res) => {
          if (_this.searchForm.batchState.toString()) {
            _this.tableData.splice(rowIndex, 1);
          }
          else {
            _this.tableData[rowIndex].batchState = 0;
          }
          _this.$message({
            type: 'success',
            message: `已成功解冻${res.responseData.count}条数据`,
            onClose: () => {
              // _this.getTableData();
            }
          });
        });
      }).catch(() => {
      });
    },
    // 查询
    onSubmit() {
      //   startTime: '',//提交时间开始
      //   endTime: '',//提交时间结束
      if (Array.isArray(this.createTime) && this.createTime.length > 0) {
        this.searchForm.createStartTime = this.createTime[0];
        this.searchForm.createEndTime = this.createTime[1];
      }
      else {
        this.searchForm.createStartTime = '';
        this.searchForm.createEndTime = '';
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
        maxResult: 20
      }, newObj);
      // 恢复默认值
      this.pageSize = 20;
      this.currentPage = 1;
      console.log(this.searchForm);
      this.getTableData();
    },
    // form重置
    resetForm() {
      this.$refs['codeBatchForm'].resetFields();
      this.searchForm.batchState = '';
      this.tableParams.batchState = '';
      // 对时间组件进行重置
      this.createTime = [];
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
    this.getTableData();
    // 绑定键盘事件
    document.onkeydown = (e) => {
      if (e.keyCode === 13) {
        if (!this.bigImgDialogVisible || this.videoDialogVisible || this.reviewDialogVisible || this.yunYunDetailDialogVisible || this.likeDialogVisible) {
          this.onSubmit();
        }
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
  .codeBatch-main-contains {
    width: 1200px;
    margin: 20px auto;
    .code-title{
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
        padding-left: 40px;
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
      .el-form-label{
        .el-form-item__label{
          margin-right: 20px;
        }
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
    .code-source-list{
      .el-table .redeem-code-batch-code{
        cursor: pointer;
        color: #4B67D6;
        text-decoration: underline;
      }
    }
    .code-button{
      margin: 30px 0 30px;
      .creat-button{
        color: #4B67D6;
        border: 1px solid #4B67D6;
        border-radius: 3px;
      }

    }
    .viewBotton{
      border: 1px solid #4B67D6;
      border-radius: 3px;
      color: #4B67D6;
    }
    .viewBottonOut{
      display: inline-block;
      line-height: 1;
      white-space: nowrap;
      cursor: pointer;
      background: #fff;
      -webkit-appearance: none;
      text-align: center;
      -webkit-box-sizing: border-box;
      box-sizing: border-box;
      outline: 0;
      margin: 0;
      -webkit-transition: .1s;
      transition: .1s;
      font-weight: 500;
      padding: 12px 20px;
      font-size: 14px;
      border: 1px solid #4B67D6;
      border-radius: 3px;
      color: #4B67D6;
      margin-left: 10px;
    }
  }
</style>

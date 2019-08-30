<template>
  <section class="codeNum-main-contains">
    <h1 class="code-title">兑换码码号列表</h1>
    <section class="search-form">
      <el-form ref="codeBatchForm" :model="searchForm">
        <el-row class="from-row">
          <el-col :span="7">
            <el-form-item label="兑换码批次号" prop="redeemCodeBatchCode" class="el-form-label">
              <el-input
                v-model="searchForm.redeemCodeBatchCode"
                placeholder="兑换码批次号"
                class="el-input-width"
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="7">
            <el-form-item label="兑换码码号" prop="redeemCodeDetailCode" class="el-form-label">
              <el-input
                v-model="searchForm.redeemCodeDetailCode"
                placeholder="兑换码码号"
                class="el-input-width"
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="7">
            <el-form-item label="兑换码状态" prop="useState" class="el-form-label">
              <el-select v-model="searchForm.useState" placeholder="未使用">
                <!--全部、未使用、已冻结、已使用、已过期-->
                <el-option label="全部" value=""></el-option>
                <el-option label="未使用" value="0"></el-option>
                <el-option label="已冻结" value="2"></el-option>
                <el-option label="已使用" value="1"></el-option>
                <el-option label="已过期" value="3"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="6" class="submitBtn-container">
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
    <section class="source-list">
      <el-table
        :data="tableData"
        style="width: 100%"
      >
        <el-table-column
          prop="sortNo"
          label="序号"
        >
        </el-table-column>
        <el-table-column
          prop="redeemCodeDetailCode"
          label="兑换码码号"
          width="110"
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
          prop="productName"
          label="兑换商品"
          width="300"
        >
        </el-table-column>
        <el-table-column
          prop="productPrice"
          label="商品价值(元)"
          width="100"
        >
        </el-table-column>

        <el-table-column
          label="有效期"
          :formatter="fromTime"
          width="200"
        >
        </el-table-column>
        <el-table-column
          label="兑换码状态"
          width="100"
          :formatter="fromUseState"
        >
        </el-table-column>
        <el-table-column
          prop="customerId"
          label="兑换者ID"
          width="100"
        >
        </el-table-column>
        <el-table-column
          prop="customerName"
          label="兑换者姓名"
          width="100"
        >
        </el-table-column>
        <el-table-column
          prop="useTime"
          label="兑换时间"
          width="180"
        >
        </el-table-column>
        <el-table-column
          fixed="right"
          width="100"
          label="操作"
          align="center"
        >
          <template slot-scope="scope">
            <el-button
              class="viewBotton"
              :class="{'active':scope.row.useState===1||scope.row.useState===3}"
              @click="handleBtn(scope.row,scope.$index)"
            >
              {{handleText(scope.row)}}
            </el-button>
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
        redeemCodeDetailCode: '', // 兑换码码号
        redeemCodeBatchCode: '', // 兑换码批次号
        useState: '' // 批次状态
      },
      tableData: [],
      tableParams: {
        firstResult: 0, // 分页参数0
        maxResult: 20 // 分页参数20
      },
      // 分页参数
      currentPage: 1, // 当前页
      pageSize: 20, // 每页条数
      total: 0 // 总数

    };
  },
  components: {},
  methods: {
    createCodeBtn() {
      let _url = this.$router.resolve({
        path: '/createCode'
      });
      window.open(_url.href, '_blank');
    },
    // 有效时间
    fromTime(val) {
      return val.startTime + '至' + val.endTime;
    },
    // 兑换码转态
    fromUseState(val) {
      let str = '';
      switch (val.useState) {
        case 0:
          str = '未使用';
          break;
        case 1:
          str = '已使用';
          break;
        case 2:
          str = '已冻结';
          break;
        case 3:
          str = '已过期';
          break;
      }
      return str;
    },
    // 操作文字
    handleText(item) {
      let str = '';
      switch (item.useState) {
        case 0:
          str = '冻结';
          break;
        case 1:
          str = '-';
          break;
        case 2:
          str = '解冻';
          break;
        case 3:
          str = '-';
          break;
      }
      return str;
    },
    // 操作事件
    handleBtn(item, index) {
      let _this = this;
      switch (item.useState) {
        case 0:
          // str='冻结';
          _this.freezeCodeTip(item, index);
          break;
        case 2:
          // str='解冻';
          _this.unfreezeCode(item, index);
          break;
        default:
          break;
      }
    },
    // 冻结提示
    freezeCodeTip(item, rowIndex) {
      let _this = this;
      _this.$confirm('冻结后已发放的兑换码无法正常兑换，是否确认？', '提示', {
        confirmButtonText: '确认',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        console.log('sdfds');
        _this.freezeCodeApi(item, rowIndex, 1, () => {
          if (_this.searchForm.useState.toString()) {
            _this.tableData.splice(rowIndex, 1);
          }
          else {
            _this.tableData[rowIndex].useState = 2;
          }
          _this.$message({
            type: 'success',
            message: '冻结成功',
            onClose: () => {
              // _this.getTableData();
            }
          });
        });
      }).catch(() => {
      });
    },
    // 解冻提示
    unfreezeCode(item, rowIndex) {
      let _this = this;
      _this.$confirm('是否确认解冻？', '提示', {
        confirmButtonText: '确认',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        _this.freezeCodeApi(item, rowIndex, 2, () => {
          if (_this.searchForm.useState.toString()) {
            _this.tableData.splice(rowIndex, 1);
          }
          else {
            _this.tableData[rowIndex].useState = 0;
          }
          _this.$message({
            type: 'success',
            message: '解冻成功',
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
        method: apiConfig.updateRedeemCodeState.type,
        url: apiConfig.updateRedeemCodeState.url,
        data: {
          id: item.itemId,
          type: type
        }
      }).then((response) => {
        comm.closeLoading();
        if (response && response.data && response.data.responseObject && response.data.responseObject.responseStatus) {
          callback && callback();
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
        console.log(e);
      });
    },
    // 获取表格数据
    getTableData() {
      comm.openLoading('加载中...');
      axios({
        method: apiConfig.getRedeemCodeItemList.type,
        url: apiConfig.getRedeemCodeItemList.url,
        params: this.tableParams
      }).then((response) => {
        comm.closeLoading();
        if (response && response.data && response.data.responseObject && response.data.responseObject.responseData) {
          let responseData = response.data.responseObject.responseData;
          if (responseData.items && responseData.items.length) {
            this.tableData = responseData.items;
            this.total = responseData.total;
          }
          else {
            this.tableData = [];
            this.total = 0;
            // this.$allin_confirm({title: '提示', content: '暂无数据，请更换筛选项', type: 'notice'});
          }
        }
        else {
          this.tableData = [];
          this.total = 0;
          // this.$allin_confirm({title: '提示', content: '暂无数据，请更换筛选项', type: 'notice'});
        }
      }).catch((e) => {
        comm.closeLoading();
        this.tableData = [];
        this.total = 0;
        this.$allin_confirm({title: '提示', content: '查询失败', type: 'notice'});
        console.log('拉取表格数据失败：', e);
      });
    },

    // 查询
    onSubmit() {
      if ((!this.searchForm.redeemCodeDetailCode) && (!this.searchForm.redeemCodeBatchCode)) {
        this.$allin_confirm({title: '提示', content: '请输入批次号或码号查询', type: 'notice'});
        return false;
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
      this.searchForm.useState = '';
      this.searchForm.redeemCodeBatchCode = '';
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
  created() {
    let redeemCodeBatchCode = this.$route.query.redeemCodeBatchCode;
    if (redeemCodeBatchCode) {
      this.searchForm.redeemCodeBatchCode = redeemCodeBatchCode;
      this.tableParams.redeemCodeBatchCode = redeemCodeBatchCode;
      this.searchForm.useState = '0';
      this.tableParams.useState = '0';
    }
  },
  mounted() {
    if (this.$route.query.redeemCodeBatchCode) {
      this.getTableData();
    }
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
  .codeNum-main-contains {
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
        margin-right: 10px;
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
      &.active{
        border: none;
      }
    }
  }
</style>

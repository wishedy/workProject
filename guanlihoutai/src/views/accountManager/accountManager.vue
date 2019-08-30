<template>
  <section class="account-main-contains">
    <h1 class="account-title">账号管理</h1>
    <section class="search-form">
      <el-form ref="accountForm">
        <el-row class="from-row">
          <el-col :span="8">
            <el-form-item label="医院名称" prop="hospital" class="el-form-label">
              <el-input
                v-model="hospital"
                placeholder="请输入医院名称"
                class="el-input-width"
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="4" class="submitBtn-container">
            <el-form-item class="submitBtn">
              <el-button @click="onSubmit">搜索</el-button>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </section>
    <section class="code-button">
      <el-row>
        <el-col>
          <el-button class="el-icon-circle-plus creat-button" @click="addAccount"> 新增账号</el-button>
        </el-col>
      </el-row>
    </section>
    <section class="table-list">
      <el-table
        :data="tableData"
        style="width: 100%"
      >
        <el-table-column
          prop="id"
          label="id"
        >
        </el-table-column>
        <el-table-column
          prop="hospitalName"
          label="医院名称"
        >
        </el-table-column>
        <el-table-column
          prop="initPwd"
          label="密码"
        >
        </el-table-column>
        <el-table-column
          :formatter="fromUserType"
          label="账号类型"
        >
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
    <el-dialog title="新增账号" :visible.sync="dialogFormVisible" class="el-dialog-contanier">
      <el-form :model="form">
        <el-form-item label="帐号类型">
          <el-select v-model="form.userType" placeholder="请选择帐号类型"  class="el-input-dialog">
            <el-option label="登记医院（用于登记需要上报的转诊单）" value="1"></el-option>
            <el-option label="接收医院（用于接收登记过来的转诊单）" value="2"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="医院名称">
          <el-input
            v-model.trim="form.name"
            autocomplete="off"
            placeholder="请输入医院名称"
            class="el-input-dialog"
          >
          </el-input>
          <span class="input-tip">点击确认添加后，密码将自动生成</span>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="submitAdd">确认添加</el-button>
      </div>
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
      hospital: '',
      tableData: [],
      tableParams: {
        hospitalName: '',
        firstResult: 0, // 分页参数0
        maxResult: 20 // 分页参数20
      },
      // 分页参数
      currentPage: 1, // 当前页
      pageSize: 20, // 每页条数
      total: 0, // 总数
      dialogFormVisible: false,
      form: {
        name: '',
        userType: ''
      }
    };
  },
  components: {},
  methods: {
    // 账号类型1-登记医院，2-接收医院
    fromUserType(val) {
      if (parseInt(val.userType, 10) === 1) {
        return '登记医院';
      }
      else if (parseInt(val.userType, 10) === 2) {
        return '接收医院';
      }
    },
    // 新增账号
    addAccount() {
      this.form.name = '';
      this.form.userType = '';
      this.dialogFormVisible = true;
    },
    // 确定添加
    submitAdd() {
      if (this.form.name && this.form.userType) {
        console.log(this.form);
        this.addUserApi();
      }
      else if (!this.form.name) {
        this.$message({
          duration: 2000,
          message: '请输入医院名称',
          type: 'error'
        });
      }
      else if (!this.form.userType) {
        this.$message({
          duration: 2000,
          message: '请选择医院类型',
          type: 'error'
        });
      }
    },
    // 添加账号API
    addUserApi() {
      comm.openLoading('加载中...');
      axios({
        method: apiConfig.addUser.type,
        url: apiConfig.addUser.url,
        data: {
          hospitalName: this.form.name,
          userType: this.form.userType,
          operator: localStorage.getItem('userLoginName'),
          operatorId: localStorage.getItem('userId')
        }
      }).then((response) => {
        console.log(response);
        comm.closeLoading();
        if (
          response &&
          response.data &&
          response.data.responseObject &&
          response.data.responseObject.responseStatus
        ) {
          this.$message({
            type: 'success',
            message: '添加成功',
            duration: 1000,
            onClose: () => {
              this.dialogFormVisible = false;
              this.getTableData();
            }
          });
        }
        else {
          if (response &&
            response.data &&
            response.data.responseObject &&
            response.data.responseObject.responseMessage &&
            response.data.responseObject.responseMessage === '该账号已经被注册'
          ) {
            this.$allin_confirm({title: '提示', content: '已有相同名字的医院，请修改后再添加', type: 'notice'});
          }
          else {
            this.$allin_confirm({title: '提示', content: '创建失败', type: 'notice'});
          }
        }
      }).catch((e) => {
        comm.closeLoading();
        this.$allin_confirm({title: '提示', content: '创建失败', type: 'notice'});
      });
    },
    // 获取表格数据
    getTableData() {
      comm.openLoading('加载中...');
      axios({
        method: apiConfig.getUserList.type,
        url: apiConfig.getUserList.url,
        params: this.tableParams
      }).then((response) => {
        console.log(response);
        comm.closeLoading();
        if (
          response &&
            response.data &&
            response.data.responseObject &&
            response.data.responseObject.responseStatus
        ) {
          let responseData = response.data.responseObject.responseData;
          if (responseData.dataList) {
            this.tableData = responseData.dataList;
            this.total = response.data.responseObject.responseData.dataCount;
          }
          else {
            this.tableData = [];
            this.total = 0;
          }
        }
        else {
          this.total = 0;
          this.tableData = [];
          this.$allin_confirm({title: '提示', content: '查询失败', type: 'notice'});
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
      this.tableParams.firstResult = 0;
      this.tableParams.hospitalName = this.hospital;
      // 恢复默认值
      this.pageSize = 20;
      this.currentPage = 1;
      this.getTableData();
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
  .account-main-contains {
    width: 1200px;
    margin: 20px auto;
    .account-title{
      font-family: PingFangSC-Semibold;
      font-size: 20px;
      color: #222222;
      letter-spacing: 0;
      line-height: 20px;
      margin: 32px 0 25px;
    }
    .code-button{
      margin: 30px 0 30px;
      .creat-button{
        color: #4B67D6;
        border: 1px solid #4B67D6;
        border-radius: 3px;
      }

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
      .submitBtn {
        button {
            color: #4B67D6;
            border: 1px solid #4B67D6;
            border-radius: 4px;
        }
      }
    }
    .el-dialog-contanier{
      .el-dialog{
        min-width: 700px;
        max-width: 900px;
      }
    }
    .el-input-dialog{
      /*width: auto;*/
      width: 280px;
      position: relative;
    }
    .input-tip{
      color: #999;
      margin-left: 20px;
    }
  }
</style>

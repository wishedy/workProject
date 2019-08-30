<template>
  <section>
    <el-form ref="searchForm" style="position: relative;" :model="searchForm" label-width="80px">
      <el-row>
        <el-col :span="10">
          <el-form-item label="医生姓名" prop="customerName">
            <el-input
              v-model="searchForm.doctorName"
              placeholder="请输入医生姓名"
            ></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="10" style="margin-left: 50px;">
          <el-form-item label="医生ID" prop="customerId">
            <el-input
              v-model="searchForm.doctorId"
              placeholder="请输入医生ID"
            ></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="14">
          <el-form-item label="医院名称" prop="hospitalName">
            <el-input
              v-model="searchForm.hospitalName"
              placeholder="请输入医院名称"
            ></el-input>
          </el-form-item>
        </el-col>

        <el-col :span="8" style="text-align: center;">
          <el-button type="primary" @click="submitForm('searchForm')">&nbsp;&nbsp;查询&nbsp;&nbsp;</el-button>
        </el-col>

      </el-row>
    </el-form>
    <section class="source-list">
      <el-table
        :data="tableData"
        ref="orderTable"
        style="width: 100%"
        class="intel-table"
        highlight-current-row>
        <el-table-column
          prop="doctorName"
          label="医生姓名"
        >
        </el-table-column>
        <el-table-column
          prop="doctorId"
          label="医生ID"
        >
        </el-table-column>
        <el-table-column
          prop="hospitalName"
          label="医院名称"
        >
        </el-table-column>
        <el-table-column
          prop="state"
          label="操作"
        >
          <template slot-scope="scope">
            <template >
              <el-button style="width: 74px; text-align: center; display: inline-block" v-if="+scope.row.state === 0" @keydown.native.prevent @click="handleStatus(scope.row)">添加</el-button>
              <el-button disabled style="width: 74px; text-align: center; display: inline-block" v-else>已添加</el-button>
            </template>
          </template>
        </el-table-column>
      </el-table>
    </section>
    <el-row class="pagination">
      <el-col>
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentPageChange"
          :current-page="currentPage"
          :page-sizes="[10, 20, 30, 40]"
          :page-size="pageSize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="total">
        </el-pagination>
      </el-col>
    </el-row>
  </section>
</template>

<script>
import axios from '@/assets/js/utils/request';
import apiConfig from '@/api/apiUrlConfig';
import comm from '@/assets/js/utils/comm';
export default {
  props: {
    deptId: {
      type: String,
      default: ''
    },
    doctorList: {
      type: Array
    }
  },
  data() {
    return {
      searchForm: {
        doctorName: '',
        doctorId: '',
        hospitalName: '',
        firstResult: 0,
        maxResult: 10,
        deptId: !this.deptId ? 0 : +this.deptId
      },
      tableData: [
        {
          doctorName: '骨科',
          doctorId: 10,
          hospitalName: 'ming',
          state: 1,
          medicalTitle: '主治医生'
        }
      ],

      // 分页
      currentPage: 1, // 当前页
      pageSize: 10, // 每页条数
      total: 0 // 总数
    };
  },
  mounted() {
    this.getTableData();
    // 对修改生列表的状态  添加、已添加
    this.tableData = this.tableData.map(item => {
      this.doctorList.forEach(val => {
        if (item.doctorId === val.doctorId) {
          item.state = 1;
        }
        else {
          item.state = 0;
        }
      });
      return item;
    });
  },
  watch: {
    // 监听医生列表的变化  对医生的添加 已添加的变价做出修改
    doctorList(newVal) {
      console.log(newVal, '787878');
      this.doctorList = newVal;
      this.getTableData();
    }
  },
  methods: {
    // 获取医生列表
    getTableData() {
      comm.openLoading('加载中...');
      axios({
        method: apiConfig.getchongqingDoctorList.type,
        url: apiConfig.getchongqingDoctorList.url,
        params: this.searchForm
      }).then((response) => {
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
            console.log(this.tableData);
            this.total = response.data.responseObject.responseData.totalCount;
            this.tableData = this.tableData.map(item => {
              this.doctorList.forEach(val => {
                if (item.doctorId === val.doctorId) {
                  item.state = 1;
                };
              });
              return item;
            });
          }
          else {
            this.tableData = [];
            this.total = 0;
          }
        }
        else {
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
    // 分页
    handleSizeChange(val) {
      this.pageSize = val;// 每页多少条
      this.currentPage = 1;// 每页多少条更改返回首页
      this.searchForm.firstResult = 0;// 当前传参
      this.searchForm.maxResult = this.currentPage * val;// 当前页最多
      // 分页参数变化重新请求列表接口
      this.getTableData();
    },
    handleCurrentPageChange(val) {
      this.currentPage = val;
      this.searchForm.firstResult = (this.currentPage - 1) * this.pageSize;
      this.getTableData();
    },
    submitForm(formName) {
      this.searchForm.firstResult = 0;// 当前传参
      this.searchForm.maxResult = 10;// 当前传参
      this.currentPage = 1; // 当前页
      this.pageSize = 10; // 每页条数
      this.total = 0;
      this.getTableData();
    },
    handleStatus(row) {
      if (+row.state === 0) {
        // 可添加 判断有没有存在
        this.tableData = this.tableData.map(item => {
          if (item.doctorId === row.doctorId) {
            item.state = 1;
          }
          return item;
        });
        this.$emit('addRow', row);
      }
    }
  }
};
</script>

<style scoped>
  .viewBotton {
    width: 140px;
    height: 30px;
    line-height: 30px;
    background: inherit;
    border: 1px solid #e4e4e4;
  }

  .pagination {
    text-align: center;
    margin-top: 28px;
  }
</style>

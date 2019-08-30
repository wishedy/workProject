<template>
  <section class="addDoctor">
    <el-form ref="addDocForm" style="position: relative;" :model="searchForm" label-width="80px">
      <el-row>
        <el-col :span="12" style="margin-left: 40px;">
          <el-form-item label="医生姓名">
            <el-input
              v-model="searchForm.customerId"
              placeholder="请输入医生姓名或医生ID"
            ></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-button style="margin-left: 10px; color: #4B67D6; border: 1px solid #4B67D6;" @click="searchDoc">
            搜索
          </el-button>
        </el-col>
      </el-row>
    </el-form>
    <section class="source-list">
      <el-table
        :data="tableData"
        style="width: 100%"
        ref="doctorTable"
        class="doctorTable"
        @selection-change="handleSelectionChange"
        @current-change="handleTableChange"
        highlight-current-row>
        <el-table-column
          type="selection"
          width="50">
        </el-table-column>
        <el-table-column
          prop="customerId"
          width="150"
          label="医生ID"
        >
        </el-table-column>
        <el-table-column
          prop="customerName"
          width="150"
          label="医生姓名"
        >
        </el-table-column>
        <el-table-column
          prop="company"
          label="所属医院"
        >
        </el-table-column>
        <el-table-column
          prop="expertise"
          label="擅治疾病"
        >
        </el-table-column>
      </el-table>
    </section>
    <section>
      <el-row class="pagination">
        <el-col :span="10" :offset="5">
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
    <section >
      <p class="title">请为医生添加智能匹配标签</p>
      <section class="tagBox">
        <span v-for="(item, i) in tagList" :key="i" @click="handleTag(item)" :style="item.isCheckeded ? 'border: 1px solid #3846dc' : ''" class="mytag">
          {{item.partName}}
        </span>
      </section>
    </section>
    <section class="tagConfirm">
      <el-button style="margin-left: 10px; color: #ddd; border: 1px solid #ddd;" @click="confirm" :disabled="!isBlue" :class="{'buttonBlue':isBlue }">
        确认添加
      </el-button>
      <el-button style="background: #A1A8C0;margin-left: 20px;" @click="cancel">
        取消
      </el-button>
    </section>
  </section>
</template>

<script>
import axios from '@/assets/js/utils/request';
import apiConfig from '@/api/apiUrlConfig';
import comm from '@/assets/js/utils/comm';
/**
 * 添加医生弹出框
 * 新增医生信息
 * 2019-07-05 丑晴
 * */
import elTag from './elTag';
export default {
  props: {
    tagDataList: {
      type: Array
    },
    isEmpty: {
      type: Boolean
    }
  },
  created() {
    // this.getTableData();
  },
  data() {
    return {
      searchForm: {
        customerId: '',
        firstResult: 0, // 分页参数 当页的数据条数
        maxResult: 10 // 分页参数  当页第一条数据的序号
      },
      tableData: [
      ],
      tagList: [], // 标签数组
      checkedTagList: [], // 选中的标签数组

      currentRow: null, // 表格单选操作
      // 分页
      currentPage: 1, // 当前页
      pageSize: 10, // 每页条数
      total: 0, // 总数
      isBlue: false
    };
  },
  methods: {
    searchDoc() {
      // 全部置空
      this.checkedTagList = [];
      this.isBlue = false;
      this.currentRow = null;
      this.tagList = this.tagList.map(item => {
        item.isCheckeded = false;
        return item;
      });

      this.searchForm.firstResult = 0;
      this.currentPage = 0;
      this.getTableData();
    },
    getTableData() {
      comm.openLoading('加载中...');
      axios({
        method: apiConfig.getDoctorSreachData.type,
        url: apiConfig.getDoctorSreachData.url,
        params: this.searchForm
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
            this.total = responseData.totalCount;
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
        // this.tableData = [];
        this.total = 0;
        comm.closeLoading();
        this.tableData = [];
        this.$allin_confirm({title: '提示', content: '查询失败', type: 'notice'});
      });
    },
    // 分页
    handleSizeChange(val) {
      this.pageSize = val;// 每页多少条
      this.currentPage = 1;// 每页多少条更改返回首页
      this.searchForm.firstResult = 0;// 当前传参
      this.searchForm.maxResult = this.currentPage * val;// 当前页最多

      this.currentRow = null;
      this.getTableData();
    },
    handleCurrentPageChange(val) {
      this.currentRow = null;
      this.currentPage = val;
      this.searchForm.firstResult = (this.currentPage - 1) * this.pageSize;
      this.getTableData();
    },
    // 表格单选按钮点击
    handleTableChange(val) {
      this.$refs.doctorTable.toggleRowSelection(val);
    },
    handleSelectionChange(val) {
      this.isBlue = true;
      if (val.length > 1) {
        this.$refs.doctorTable.clearSelection();
        this.$refs.doctorTable.setCurrentRow(val[1]);
        this.currentRow = val[0];
        return;
      }
      else if (val.length === 1) {
        this.currentRow = val[0];
        return;
      }
      // 没有选中的状态 全部置空
      this.checkedTagList = [];
      this.isBlue = false;
      this.currentRow = null;
      this.tagList = this.tagList.map(item => {
        item.isCheckeded = false;
        return item;
      });
      this.$forceUpdate();
    },
    handleTag(item) {
      if (!this.currentRow) {
        this.$allin_confirm({title: '提示', content: '请选择要添加的医生', type: 'notice'});
        return '';
      }
      item.isCheckeded = !item.isCheckeded;
      let checkedTagList = this.checkedTagList;
      checkedTagList = this.tagList.filter(item => item.isCheckeded);
      if (checkedTagList.length) this.isBlue = true;
      else this.isBlue = false;
      this.checkedTagList = checkedTagList;
      this.$forceUpdate();
    },
    // 添加医生提交
    confirm() {
      comm.openLoading('加载中...');
      axios({
        method: apiConfig.addDoctor.type,
        url: apiConfig.addDoctor.url,
        data: {
          customerId: this.currentRow.customerId,
          bodyPartId: this.checkedTagList.map(item => item.partId).join(',')
        }
      }).then((response) => {
        console.log(response);
        comm.closeLoading();
        if (
          response &&
          response.data &&
          response.data.responseObject &&
          +response.data.responseObject.responseCode === 0
        ) {
          this.$message({
            type: 'success',
            message: '添加成功',
            duration: 1000,
            onClose: () => {
              this.checkedTagList = [];
              this.currentRow = null;
              this.$emit('isOpen', false);
            }
          });
        }
        else {
          // this.checkedTagList = [];
          this.$allin_confirm({title: '提示', content: response.data.responseObject.responseMessage, type: 'notice'});
        }
      }).catch((e) => {
        comm.closeLoading();
        this.$allin_confirm({title: '提示', content: '添加失败', type: 'notice'});
      });
    },
    // 添加医生取消
    cancel() {
      this.initData();
      this.$emit('isOpen', false);
    },
    initData() {
      this.tagList = this.tagDataList;
      this.checkedTagList = [];
      this.tagList = this.tagList.map(item => {
        item.isCheckeded = false;
        return item;
      });
      this.currentRow = null;
      this.currentPage = 1; // 当前页
      this.pageSize = 10; // 每页条数
      this.total = 0; // 总数
      this.searchForm = {
        customerId: '',
        firstResult: 0, // 分页参数 当页的数据条数
        maxResult: 10 // 分页参数  当页第一条数据的序号
      };
    }
  },
  components: {
    elTag
  },
  mounted() {
    // 置空
    this.initData();
    this.getTableData();
  },
  watch: {
    isEmpty(val) {
      this.initData();
      this.getTableData();
    }
  }
};
</script>

<style lang="scss">
  .addDoctor {
    .source-list{
      padding: 10px 20px;
      margin-top: 20px;
    }
    .pagination{
      margin-top: 20px;
      margin-bottom: 40px;
    }

    .tagConfirm{
      margin-top: 20px;
      text-align: center;
    }

    .buttonBlue {
      color: rgb(75, 103, 214)!important;
      border: 1px solid rgb(75, 103, 214)!important;
    }

    .doctorTable {
      thead th:nth-child(1) {
        visibility: hidden;
      }
    }

    .title{
      margin: 0 0 20px 20px;
      color: #3846dc;
    }

    .tagBox{
      display: flex;
      flex-flow: wrap;
      margin-left: 20px;
      .mytag {
        background-color: #dddddd;
        border-radius: 20px;
        width: 150px;
        margin: 0 20px 20px 0;
        box-sizing: border-box;
        height: 50px;
        line-height: 50px;
        text-align: center;
      }
    }
  }
</style>

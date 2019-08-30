<template>
  <section class="order-sectionInfo">
    <h1 @click="handleClick">
      在线预约挂号科室信息-科室列表
    </h1>

    <section>
      <el-button style="float: right;margin-bottom: 15px"  type="primary" @click="handleEdit({id: ''})">新建科室</el-button>
    </section>

    <section class="source-list">
      <el-table
        :data="tableData"
        ref="orderTable"
        style="width: 100%"
        class="intel-table"
        highlight-current-row>
        <el-table-column
          prop="id"
          label="科室ID"
        >
        </el-table-column>
        <el-table-column
          prop="deptName"
          label="科室名称"
        >
        </el-table-column>
        <el-table-column
          prop="doctorCount"
          label="医生数量"
        >
        </el-table-column>
        <el-table-column
          label="操作"
          prop="state"
          width="300"
          style="text-align: center"
        >
          <template slot-scope="scope">
            <template >
              <el-button style="width: 74px; text-align: center; display: inline-block" v-if="+scope.row.state === 2"  class="viewBotton"  @keydown.native.prevent @click="handleStatus(scope.row)">上线</el-button>
              <span style="width: 74px; text-align: center; display: inline-block" v-if="+scope.row.state === 1" class="botton-info">已上线</span>
            </template>
            <template>
              <el-button
                style="margin: 0 5px"
                v-if="+scope.row.state === 1"
                @keydown.native.prevent
                @click="handleStatus(scope.row)"
                class="viewBotton">
                下线
              </el-button>
              <span
                style="margin: 0 8px"
                class="botton-info"
                v-if="+scope.row.state === 2"
                @keydown.native.prevent
              >
                已下线
              </span>
            </template>
            <el-button class="viewBotton" @click = "handleEdit(scope.row)" style="width: 74px; text-align: center; display: inline-block">
              编辑
            </el-button>
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
  data() {
    return {
      tableData: [
      ],
      searchForm: {
        hospitalId: 1, // 医院id 值传1
        firstResult: 0, // 分页参数 当页的数据条数
        maxResult: 10 // 分页参数  当页第一条数据的序号
      },

      // 分页
      currentPage: 1, // 当前页
      pageSize: 10, // 每页条数
      total: 0 // 总数
    };
  },
  mounted() {
    this.getTableData();
  },
  methods: {
    handleClick() {
    },
    // 获取科室列表数据
    getTableData() {
      comm.openLoading('加载中...');
      axios({
        method: apiConfig.getChongqingSectionList.type,
        url: apiConfig.getChongqingSectionList.url,
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
          console.log(responseData);
          if (responseData.dataList) {
            this.tableData = responseData.dataList;
            this.total = response.data.responseObject.responseData.totalCount;
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
        // 提示成功消息
        this.$allin_confirm({title: '提示', content: '查询失败', type: 'notice'});
      });
    },
    // 分页
    handleSizeChange(val) {
      console.log(val);
      this.pageSize = val;// 每页多少条
      this.currentPage = 1;// 每页多少条更改返回首页
      this.searchForm.firstResult = 0;// 当前传参
      this.searchForm.maxResult = this.currentPage * val;// 当前页最多
      // 分页参数变化重新请求列表接口
      this.getTableData();
    },
    handleCurrentPageChange(val) {
      console.log(val, '11111111111');
      this.currentPage = val;
      this.searchForm.firstResult = (this.currentPage - 1) * this.pageSize;
      console.log(this.searchForm.firstResult);
      this.getTableData();
    },
    handleEdit(row) {
      console.log('id===', row);
      this.$router.push({
        path: '/orderSectionInfoEdit',
        query: { id: row.id }
      });
    },
    handleStatus(row) {
      console.log('row', row.state);
      axios({
        method: apiConfig.chongqingupdcateDeptState.type,
        url: apiConfig.chongqingupdcateDeptState.url,
        data: {
          deptId: row.id,
          opUser: localStorage.getItem('userLoginName'),
          type: +row.state === 1 ? 2 : 1
        }
      }).then((response) => {
        if (
          response &&
          response.data &&
          response.data.responseObject &&
          response.data.responseObject.responseStatus
        ) {
          this.$message({
            type: 'success',
            message: '操作成功',
            duration: 1000,
            onClose: () => {
              this.getTableData();
            }
          });
        }
        else {
          this.$allin_confirm({title: '提示', content: '操作失败', type: 'notice'});
        }
      }).catch((e) => {
        comm.closeLoading();
        this.$allin_confirm({title: '提示', content: '操作失败', type: 'notice'});
      });
    }
  }
};

</script>

<style lang="scss">
  .order-sectionInfo {
    width: 1200px;
    margin: 20px auto;
    &  > h1 {
      font-family: PingFangSC-Semibold;
      font-size: 20px;
      color: #222222;
      letter-spacing: 0;
      line-height: 20px;
      margin: 32px 0 25px;
    }

    .pagination {
      text-align: center;
      margin-top: 28px;
    }
    //查看按钮
    .viewBotton {
      display: inline-block;
      text-align: center;
      padding: 0;
      width: 74px;
      height: 28px;
      line-height: 28px;
      font-family: PingFangSC-Regular;
      font-size: 13px;
      color: #4B67D6;
      letter-spacing: 0;
      border: 1px solid #4B67D6;
      border-radius: 3px;
    }
    .source-list {
      & .el-button {
        /*border: 0;*/
        /*background: none;*/
      }
    }
    .botton-info {
      display: inline-block;
      width: 74px;
      text-align: center;
    }
  }
</style>

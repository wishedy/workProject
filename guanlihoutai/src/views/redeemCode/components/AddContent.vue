<template>
  <section class="addContent">
    <el-dialog
      title="添加内容"
      width="1000px"
      :visible.sync="dialogVisible"
      @close="handleClose"
    >
      <div class="add-from">
        <el-input
          placeholder="内容名称/内容ID"
          class="content-input"
          v-model="tableParams.courseNameLike"
        ></el-input>
        <span class="search-button" @click="searchSub">查询</span>
      </div>
      <div class="select-content">
        <div class="choosed-text"><span v-if="currentProduct.courseName">已选"{{currentProduct.courseName}}"</span></div>
        <div class="search-button" @click="addContent">添加内容</div>
      </div>
      <el-table
        ref="multipleTable"
        :data="proListDatas"
        style="width: 90%;margin-left: 50px"
      >
        <!--展示数据时显示-->
        <el-table-column
          prop="nodeNum"
          label="选择"
          width="100"
        >
          <template slot-scope="scope">
            <el-radio
              v-model="templateRadio"
              :label="scope.row.id"
              @change.native="getRadioRow(scope.row)">&nbsp;
            </el-radio>
          </template>
        </el-table-column>
        <el-table-column
          prop="courseName"
          label="内容名称"
        >
        </el-table-column>
        <el-table-column
          :formatter="formatterCoursePriceElement"
          prop="coursePriceElementStr"
          label="售价"
        >
        </el-table-column>
        <el-table-column
          :formatter="formatterCourseTeacherVOList"
          prop="courseTeacherVOList"
          label="作者"
        >
        </el-table-column>
        <el-table-column
          :formatter="formatterCourseType"
          prop="courseType"
          label="上架类型"
        >
        </el-table-column>
        <el-table-column
          :formatter="formatterCourseState"
          prop="courseState"
          label="商品状态"
        >
        </el-table-column>
        <el-table-column
          label="视频数"
          :formatter="fromTotalNum"
        >
        </el-table-column>
      </el-table>
      <el-pagination
        style="text-align: center;margin: 20px 0 20px"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="currentPage"
        :page-sizes="[10, 20, 30, 50, 100]"
        :page-size="pageSize"
        layout="total, prev, pager, next, jumper, sizes"
        :total="total" v-if="total>10">
      </el-pagination>
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
      tableParams: {
        firstResult: 0, // 分页参数0
        maxResult: 10, // 分页参数10
        courseNameLike: ''
      },
      dialogVisible: true,
      axiosNum: 0,
      currentProduct: {

      }, // 当前选择的产品
      proListDatas: [],
      // 分页参数
      currentPage: 1, // 当前页
      pageSize: 10, // 每页条数
      total: 0, // 总数
      templateRadio: ''
    };
  },
  methods: {
    fromTotalNum(val) {
      return val.totalNum + ' 讲';
    },
    formatterCoursePriceElement(row, col, cell) {
      if (row.formatterCourseType === 1) {
        // 预告类型，则显示 '-'
        return '-';
      }
      return '￥' + cell;
    },
    formatterCourseTeacherVOList(row, col, cell) {
      if (row.formatterCourseType === 1) {
        // 预告类型，则显示 '-'
        return '-';
      }
      let _name = '';
      if (cell.length === 2) {
        _name = cell[0].customerName + ',' + cell[1].customerName;
      }
      else if (cell.length > 2) {
        _name = cell[0].customerName + ',' + cell[1].customerName + '等';
      }
      else if (cell.length === 1) {
        _name = cell[0].customerName;
      }
      return _name;
    },
    formatterCourseType(row, col, cell) {
      if (cell === 1) {
        return '预告';
      }
      else if (cell === 2) {
        return '售卖';
      }
    },
    formatterCourseState(row, col, cell) {
      if (cell === 1) {
        return '已上架';
      }
      else if (cell === 2) {
        return '未上架';
      }
    },
    addContent() {
      if (this.currentProduct.courseName) {
        this.$emit('addContent', this.currentProduct);
      }
      else {
        this.$message('请选择一条的数据');
      }
    },
    handleClose(done) {
      this.$emit('closeDalog', false);
    },
    // 搜索商品
    searchSub() {
      this.tableParams.firstResult = 0;
      this.currentPage = 1;
      this.currentProduct = {};
      this.templateRadio = '';
      this.addPointFn();
    },
    // 添加内容获取商品列表
    addPointFn() {
      let param = {
        firstResult: this.tableParams.firstResult,
        maxResult: this.tableParams.maxResult,
        courseNameOrId: this.tableParams.courseNameLike,
        courseType: 2,
        courseState: 1,
        isHaveCustomerName: true
      };
      axios({
        method: apiConfig.getCoursesList.type,
        url: apiConfig.getCoursesList.url,
        params: param
      }).then((res) => {
        comm.closeLoading();
        this.proListDatas = [];
        this.total = 0;
        if (res && res.data && res.data.responseObject && res.data.responseObject.responseData && res.data.responseObject.responseStatus) {
          if (res.data.responseObject.responseData.dataList && res.data.responseObject.responseData.dataList.length > 0) {
            this.proListDatas = res.data.responseObject.responseData.dataList;
            this.total = res.data.responseObject.responseData.totalCount;
          }
        }
      }).catch((e) => {
        comm.closeLoading();
        this.$allin_confirm({title: '提示', content: '获取失败，请刷新重试', type: 'notice'});
        console.log('获取数据失败：', e);
      });
    },
    // 选中某一个产品触发
    getRadioRow(row) {
      this.currentProduct = row;
    },
    /** **************分页组件方法**************/
    handleSizeChange(val) {
      this.pageSize = val;
      this.tableParams.maxResult = this.pageSize;

      this.tableParams.firstResult = 0;
      this.currentPage = 0;

      this.addPointFn();
    },
    handleCurrentChange(val) {
      this.currentPage = val;
      this.tableParams.firstResult = (this.currentPage - 1) * this.pageSize;
      this.addPointFn();
    },
    // 获取数据公共axios方法.
    getListAxios(path, params, callback, tipMsg, type, errorCallback) {
      comm.openLoading('加载中...');
      this.axiosNum++;
      if (type === 'post') {
        axios({
          method: 'post',
          url: path,
          data: params
        }).then((res) => {
          this.axiosNum--;
          callback && callback(res);
          if (this.axiosNum <= 0) {
            comm.closeLoading();
          }
        }).catch((e) => {
          errorCallback && errorCallback();
          this.axiosNum--;
          if (this.axiosNum <= 0) {
            comm.closeLoading();
          }
          this.$allin_confirm({title: '提示', content: tipMsg || '获取失败，请刷新重试', type: 'notice'});
          console.log('获取数据失败：', e);
        });
      }
      else {

      }
    }
  },
  mounted() {
    this.addPointFn();
  }
};
</script>

<style  lang="scss">
  .addContent{
    .add-from{
      .content-input{
        width: 300px;
        margin-left: 50px;
      }
    }
    .search-button{
      width: 100px;
      height: 32px;
      background: #3846dc;
      border-radius: 3px;
      line-height: 32px;
      font-size: 14px;
      font-weight: 500;
      color: white;
      margin-left: 30px;
      cursor: pointer;
      display: inline-block;
      vertical-align: middle;
      text-align: center;
    }
    .select-content{
      margin: 20px 0;
      padding-left: 50px;
      .choosed-text{
        display: inline-block;
        width: 656px;
        span{
          width: 656px;
          overflow: hidden;
          text-overflow: ellipsis;
          -webkit-line-clamp: 1;
          -webkit-box-orient: vertical;
          white-space: nowrap;
          display: inline-block;
          vertical-align: middle;
        }
      }
    }
  }
</style>

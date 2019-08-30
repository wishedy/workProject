<template>
  <section class="column-manager-main-container">
    <h3>付费课程列表</h3>
    <section class="column-manager-search-area">
      <el-form @keydown.enter="getTableData" label-width="120px" ref="activitySearchForm">
        <el-row>
          <el-col :span="9" class="search-area-anthology-name">
            <el-form-item label="课程ID">
              <el-input v-model="searchConditionData.courseId"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8" class="search-area-anthology-name">
            <el-form-item label="课程名称">
              <el-input v-model="searchConditionData.courseNameLike"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="上架类型">
              <el-select
                placeholder="请选择分组"
                v-model="searchConditionData.courseType"
              >
                <el-option label="全部" value=""></el-option>
                <el-option label="预告" value="1"></el-option>
                <el-option label="售卖" value="2"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="9">
            <el-form-item label="创建时间">
              <el-date-picker
                :default-time="['00:00:00','23:59:59']"
                end-placeholder="结束日期"
                range-separator="至"
                start-placeholder="开始日期"
                type="daterange"
                v-model="searchConditionCreateTime"
                value-format="yyyy-MM-dd HH:mm:ss"
              >
              </el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="商品状态">
              <el-select
                placeholder="请选择商品状态"
                required
                v-model="searchConditionData.courseState"
                value=""
              >
                <el-option label="全部" value=""></el-option>
                <el-option label="已上架" value="1"></el-option>
                <el-option label="未上架" value="2"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col>
            <el-form-item class="submitBtn" style="float: right; margin-right: 50px;">
              <el-button @click="resetForm">清空条件</el-button>
              <el-button @click="onSubmit">筛选</el-button>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </section>
    <section class="column-manager-button">
      <el-row>
        <el-col>
          <el-button @click="addCourse"><span class="el-icon-circle-plus"></span>创建付费课程</el-button>
        </el-col>
      </el-row>
    </section>
    <section class="source-list">
      <el-table
        :data="tableData"
        :default-sort="{prop: 'sortId', order: 'descending'}"
        :fit="true"
        :row-class-name="tableRowClassName"
        style="width: 100%"
      >
        <el-table-column
          align="center"
          label="序号"
          prop="serialId"
          width="70"
        >
        </el-table-column>
        <el-table-column
          align="left"
          label="课程名称"
          prop="courseName"
          width="300"
        >
          <template slot-scope="scope">
            <div style="float:left;width:60px;">
              <img :src="getImgUrl(scope.row)" style="width:52px; height:40px;">
            </div>
            <div style="float:left;width:200px;">
              {{ scope.row.courseName }}
            </div>
          </template>
        </el-table-column>
        <el-table-column
          label="课程ID"
          prop="id"
          width="100">

        </el-table-column>
        <el-table-column
          :formatter="courseTypeFormatter"
          align="center"
          header-align="center"
          label="上架类型"
          prop="courseType"
          width="80"
        >
        </el-table-column>
        <el-table-column
          align="center"
          header-align="center"
          label="更新讲数"
          width="200"
        >
          <template slot-scope="scope">
            <div v-if="scope.row.courseType === 1">-</div>
            <div v-else>
              <div v-if="scope.row.newestNum<scope.row.totalNum">已更新至{{ scope.row.newestNum }}讲 (持续更新中)</div>
              <div v-if="scope.row.newestNum==scope.row.totalNum">已更新至{{ scope.row.newestNum }}讲 (已完结)</div>
            </div>
          </template>
        </el-table-column>
        <el-table-column
          :formatter="canShowFormatter"
          align="center"
          header-align="center"
          label="总讲数"
          prop="totalNum"
          width="100"
        >
        </el-table-column>
        <el-table-column
          :formatter="priceFormatter"
          align="center"
          label="售价"
          prop="coursePriceElementStr"
          width="100"
        >
        </el-table-column>
        <el-table-column
          :formatter="courseStateFormatter"
          align="center"
          label="课程状态"
          prop="courseState"
          width="180"
        >
        </el-table-column>
        <el-table-column
          label="创建人"
          prop="opUser"
          width="180">
        </el-table-column>
        <el-table-column
          align="center"
          label="创建时间"
          prop="createTime"
          width="180"
        >
        </el-table-column>
        <el-table-column fixed="right"
                         label="操作"
                         width="280"
        >
          <template slot-scope="scope" style="display:flex;  justify-content:flex-end">
            <el-button @click="editCourse(scope.row)" @keydown.native.prevent class="source-list-btn">编辑</el-button>
            <el-button @click="manageContent(scope.row)" @keydown.native.prevent class="source-list-btn" v-if="scope.row.courseType !== 1">内容管理</el-button>
            <el-button @click="onSaleConfirm(scope.row)" v-if="scope.row.courseState==2" @keydown.native.prevent class="source-list-btn">上架</el-button>
          </template>
        </el-table-column>
      </el-table>
    </section>
    <el-row class="pagination" style="margin:20px 0">
      <el-col :offset="5" :span="10">
        <el-pagination
          :current-page="paginationData.currentPage"
          :page-size="paginationData.pageSize"
          :page-sizes="[10, 20, 30, 40]"
          :total="paginationData.total"
          @current-change="handleCurrentChange"
          @size-change="handleSizeChange"
          layout="total,sizes, prev, pager, next, jumper"
          v-show="paginationData.total>0"
        >
        </el-pagination>
      </el-col>
    </el-row>
  </section>
</template>

<script>
/**
 * 付费课程首页
 * 可以新增、编辑付费课程
 * 付费课程列表
 * 2019-04-22 刘宇涛
 * */
import axios from '@/assets/js/utils/request';
import apiUrl from '@/api/apiUrlConfig.js';
import comm from '@/assets/js/utils/comm.js';

export default {
  name: 'payCoursesIndex',
  data() {
    return {
      searchConditionCreateTime: '', // 创建时间
      searchConditionData: {
        courseType: '', // 上架类型
        courseState: '', // 商品状态
        courseNameLike: '', // 活动/专题名称
        courseId: '', // ID
        startTime: '', // 创建时间-开始时间
        endTime: '', // 创建时间-结束时间
        isValid: '' // 状态
      },
      // 分页参数
      paginationData: {
        currentPage: 1, // 当前页
        firstResult: 0,
        maxResult: 10,
        pageSize: 10, // 默认显示10条
        total: 0 // 总数
      },
      tableData: [],
      rules: {

      }
    };
  },
  mounted() {
    // 拉取表格数据
    this.getTableData();
    document.onkeydown = (e) => {
      if (e.keyCode === 13) {
        this.getTableData();
      }
    };
  },
  methods: {
    /*
    * 获取表格数据
    * */
    getTableData() {
      let _this = this;
      // 分页数据、排序方式
      let params = {
        firstResult: this.paginationData.firstResult,
        maxResult: this.paginationData.maxResult,
        sortType: this.sortType,
        columnName: this.columnName,
        columnId: this.columnId
      };

      for (let key in this.searchConditionData) {
        if (this.searchConditionData[key]) {
          params[key] = this.searchConditionData[key];
        }
      }
      // groupValue 会有为0的情况，防止其被过滤
      if (this.searchConditionData.groupValue === 0) {
        params.groupValue = 0;
      }
      comm.openLoading('加载中...');
      axios({
        url: apiUrl.getCoursesList.url,
        type: apiUrl.getCoursesList.type,
        params: params
      }).then(function(data) {
        comm.closeLoading();
        _this.tableData = data.data.responseObject.responseData.dataList;
        _this.paginationData.total = data.data.responseObject.responseData.totalCount;
      });
    },
    /*
    * 创建付费课程
    * */
    addCourse() {
      // this.$router.push({path: '/payCourseEdit?action=add'});
      window.open('/#/payCourseEdit?action=add');
    },
    resetForm() {
      for (let key in this.searchConditionData) {
        this.searchConditionData[key] = '';
      }
      // 对时间组件进行重置
      this.searchConditionCreateTime = '';
    },
    // 查询
    onSubmit() {
      if (Array.isArray(this.searchConditionCreateTime) && this.searchConditionCreateTime.length > 0) {
        this.searchConditionData.startTime = this.searchConditionCreateTime[0];
        this.searchConditionData.endTime = this.searchConditionCreateTime[1];
      }
      else {
        this.searchConditionData.startTime = '';
        this.searchConditionData.endTime = '';
      }

      this.paginationData.currentPage = 1;
      this.paginationData.firstResult = 0;

      this.getTableData();
    },
    handleSizeChange(val) {
      this.paginationData.maxResult = val;
      this.getTableData();
    },
    handleCurrentChange(val) {
      this.paginationData.currentPage = val;
      this.paginationData.firstResult = (val - 1) * this.paginationData.maxResult;
      this.getTableData();
    },
    /*
    *   上架类型格式化
    * */
    courseTypeFormatter(row, column, cellValue) {
      // 上架类型 1-预告 2-售卖
      return row.courseType === 1 ? '预告' : '售卖';
    },
    // 课程状态
    courseStateFormatter(row, column, cellValue) {
      return row.courseState === 1 ? '已上架' : '未上架';
    },
    priceFormatter(row, column, cellValue) {
      if (row.courseType === 1) {
        return '-';
      }
      return '￥' + row.coursePriceElementStr;
    }, // 格式化当前表格数据是否显示，如果是预告，则显示为 '-'
    canShowFormatter(row, column, cellValue) {
      if (row.courseType === 1) {
        return '-';
      }
      return cellValue;
    },
    tableRowClassName({row, rowIndex}) {
      // 把每一行的索引放进row
      row.index = rowIndex + 1;
    },
    getImgUrl(row) {
      if (row.collegeCourseAttachmentVOList && row.collegeCourseAttachmentVOList.length > 0) {
        return row.collegeCourseAttachmentVOList[0].attUrl;
      }
      else {
        return '';
      }
    },
    /*
    * 编辑课程
    * */
    editCourse(row) {
      // this.$router.push({path: '/payCourseEdit?action=edit&id=' + row.id});
      window.open('/#/payCourseEdit?action=edit&id=' + row.id);
    },
    /*
    * 跳转至管理内容
    * */
    manageContent(row) {
      this.$router.push({path: '/payCoursesContent?id=' + row.id});
    },
    /*
    * 上架确认
    * */
    onSaleConfirm(row) {
      let _this = this;
      console.log(row);
      let content = '';
      if (row.courseType === 2) { // 售卖课程若未关联课程进行提示
        if (row.newestNum === 0) {
          this.$allin_confirm({
            title: '提示',
            content: '当前付费课程内容为空，请先关联内容',
            type: 'notice',
            done: function() {
            }
          });
          return false;
        }
      }

      if (row.courseType === 1) {
        content = '上架后该专栏课程仅对外展示无法销售，是否上架？';
      }
      else { // 售卖
        content = '上架后该专栏课程将对外销售，是否上架？';
      }
      this.$allin_confirm({
        title: '提示',
        content: content,
        type: 'confirm',
        done: function() {
          let params = {
            id: row.id,
            courseState: 1,
            courseType: row.courseType
          };
          axios({
            url: apiUrl.updateCourseState.url,
            method: apiUrl.updateCourseState.type,
            data: params
          }).then(function(data) {
            comm.closeLoading();
            _this.getTableData();
          });
        }
      });
    },
    updateCourseState() {
      let _this = this;
      let params = {};
      axios({
        url: apiUrl.getCoursesList.url,
        type: apiUrl.getCoursesList.type,
        params: params
      }).then(function(data) {
        comm.closeLoading();
        _this.tableData = data.data.responseObject.responseData.dataList;
        _this.paginationData.total = data.data.responseObject.totalCount;
      });
    }
  }
};
</script>

<style scoped lang="scss">
  .column-manager-main-container {
    width: 1200px;
    margin: 0 auto;
    background: #F6F7FA;
    margin-top: 32px;

    h3 {
      ont-family: PingFangSC-Semibold;
      font-size: 20px;
      color: #2C343A;
      letter-spacing: 0;
      line-height: 20px;
      margin-bottom: 25px;
    }

    .column-manager-search-area {
      padding: 25px 0 0;
      background: #ffffff;
      box-shadow: 0 4px 10px 0 rgba(42, 53, 102, 0.04);
      border-radius: 4px;
      margin-bottom: 30px;

      .el-input .el-input__inner {
        background: #F7F9FC;
        border: 1px solid #E6E6E8;
        border-radius: 4px;
      }

      .column-search-submit {
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

    .column-manager-button {
      margin-bottom: 30px;

      button {
        color: #4B67D6;
        border: 1px solid #4B67D6;
        border-radius: 3px;

        span {
          padding-right: 2px;
        }
      }

    }

    .column-manager-table {
      margin-bottom: 30px;

      .el-table .cell {
        font-family: PingFangSC-Regular;
        font-size: 14px;
        color: #333333;
        letter-spacing: 0;
        line-height: 1.5;
      }

      th.is-leaf {
        font-weight: bold;
      }

      button {
        width: 74px;
        height: 28px;
        padding: 0;
        border: 1px solid #4B67D6;
        border-radius: 3px;
        font-family: PingFangSC-Regular;
        font-size: 13px;
        color: #4B67D6;
        letter-spacing: 0;

        //上下架按钮
        &.changeState {
          background: #EDF1FF;
          border: 1px solid #4B67D6;
          border-radius: 3px;
          font-family: PingFangSC-Regular;
          color: #4B67D6;
          font-size: 13px;
          letter-spacing: 0;
          line-height: 1.2;
          //下架按钮
          &.remove {
            background: #FFEBE3;
            border: 1px solid #FF7E4D;
            color: #FF7E4D;
          }
        }
      }

      .column-table-index-btn {
        background: #4B67D6;
        border-radius: 3px;
        font-family: PingFangSC-Regular;
        font-size: 13px;
        color: #FFFFFF;
        letter-spacing: 0;
        line-height: 13px;
      }
    }

    .column-manager-pagination {
      float: right;
    }

  }

  .column-manager-main-container {
    .search-area-anthology-name {
      /*margin-left: 22px;*/
    }
  }

  .source-list {
    .cell {
      font-family: PingFangSC-Regular;
      font-size: 14px;
      color: #333333;
      letter-spacing: 0;
      line-height: 1.2;
    }

    .headerClass {
      text-align: center;
    }

    .source-list-btn {
      width: 74px;
      height: 28px;
      padding: 0;
      border: 1px solid #4B67D6;
      border-radius: 3px;
      font-family: PingFangSC-Regular;
      font-size: 13px;
      color: #4B67D6;
      letter-spacing: 0;
    }

    .source-list-show-type {
      div {
        color: #4B67D6;
      }
    }

    .source-list-show-type-title {
      div {
        color: #333333;
      }
    }
  }

  .edit-dialog {
    .el-dialog__header .el-dialog__title {
      font-family: PingFangSC-Medium;
      font-size: 20px;
      color: #222222;
      letter-spacing: 0;
      line-height: 24px;
      font-weight: bolder;
    }

    .show-type-unselect {
      margin-left: 20px;
      color: #c0c4cc;
      cursor: pointer;
    }

    .column-course-img-tips {
      color: #999999;
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
</style>

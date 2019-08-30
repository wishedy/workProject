<template>
  <section class="column-manager-main-container">
    <h3>付费课程内容管理</h3>
    <section class="course-info">
      <div class="course-pic">
        <img :src="courseInfo.pcCoverPicUrl" alt="" style="width:200px; height:120px;">
      </div>
      <div class="course-detail">
        <el-row>
          <el-col class="left" :span="16">
            <div class="title">
              {{courseInfo.courseName}}
            </div>
            <div class="desc">
              {{courseInfo.courseDesc}}
            </div>
            <div class="course-state">
              当前状态:{{courseInfo.courseState==2?'未上架':'已上架'}}
            </div>
          </el-col>
          <el-col class="right" :span="6">
            <div class="btns">
              <el-button @click="editCourse">编辑</el-button>
              <el-button @click="onSaleConfirm" v-if="courseInfo.courseState==2">上架</el-button>
            </div>
            <div class="update-state">
              已更新至第{{courseInfo.newestNum}}讲（{{courseInfo.newestNum===courseInfo.totalNum?'已完结':'持续更新中'}}）
            </div>
          </el-col>
        </el-row>
      </div>
    </section>
    <section class="column-manager-button" v-if="courseInfo.newestNum<courseInfo.totalNum">
      <el-row>
        <el-col>
          <el-button @click="addContent"><span class="el-icon-circle-plus"></span>添加内容</el-button>
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
          label="内容名称"
          width="300"
        >
          <template slot-scope="scope">
            <div style="float:left;width:60px;">
              <img :src="scope.row.videoAttUrl" style="width:52px; height:40px;">
            </div>
            <div style="float:left;width:200px;">
              {{ scope.row.resourceName }}
            </div>
          </template>
        </el-table-column>
        <el-table-column
          :formatter="resourceTypeFormatter"
          align="center"
          label="内容类型"
          prop="resourceType"
          width="100"
        >
        </el-table-column>
        <el-table-column
          :formatter="contentTypeFormatter"
          align="center"
          label="付费类型"
          prop="resourceType"
          width="120"
        >
        </el-table-column>
        <el-table-column
          :formatter="payTypeFormatter"
          align="center"
          label="是否支持试看"
          prop="resourceType"
          width="120"
        >
        </el-table-column>
        <el-table-column
          label="添加人"
          prop="opUser"
          width="180">
        </el-table-column>
        <el-table-column
          align="center"
          label="添加时间"
          prop="createTime"
          width="180"
        >
        </el-table-column>
        <el-table-column fixed="right"
                         label="操作"
                         width="340"
                      align="center"
        >
          <template slot-scope="scope" style="display:flex; justify-content: center">
            <el-button @click="upSort(scope.row)" v-if="!isFirst(scope.$index)" @keydown.native.prevent class="source-list-btn">上移</el-button>
            <el-button @click="downSort(scope.row)" v-if="!isLast(scope.$index)" @keydown.native.prevent class="source-list-btn">下移</el-button>
            <el-button @click="confirmRemove(scope.row)" @keydown.native.prevent class="source-list-btn">移除</el-button>
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

    <el-dialog
      :center=true
      :lock-scroll=false
      :title="addContentDialogData.title"
      :visible.sync="addContentDialogData.visible"
      custom-class="edit-dialog"
      top="10vh"
      v-if="addContentDialogData.visible"
      width="880px"
    >
      <section >
        <el-row>
          <el-col :span="12">
            <el-input type="text" style="width:100%" v-model="addContentDialogData.keyWord" placeholder="内容名称或内容ID"></el-input>
          </el-col>
          <el-col :span="4" :offset="1">
            <el-button @click="searchBtnOnClick">搜索</el-button>
          </el-col>
        </el-row>
        <section class="source-list">
          <el-table
            :data="addContentDialogData.rowData"
            :default-sort="{prop: 'sortId', order: 'descending'}"
            :fit="true"
            :row-class-name="tableRowClassName"
            style="width: 100%"
            @selection-change="handleSelectionChange"
          >
            <el-table-column
              align="center"
              label="选择"
              prop="index"
              width="80"
              type="selection"
            >
            </el-table-column>
            <el-table-column
              align="left"
              label="内容名称"
              width="410"
              prop="resourceName"
            >

            </el-table-column>
            <el-table-column
              :formatter="resourceTypeFormatter"
              align="center"
              label="内容类型"
              prop="resourceType"
              width="100"
            >
            </el-table-column>
            <el-table-column
              :formatter="contentTypeFormatter"
              align="center"
              header-align="center"
              label="付费类型"
              prop="payType"
              width="100"
            ></el-table-column>
            <el-table-column
            :formatter="payTypeFormatter"
            align="center"
            header-align="center"
            label="是否支持试看"
            prop="payType"
            width="140"
          ></el-table-column>
          </el-table>
          <el-row class="pagination" style="margin:20px 0">
            <el-col :span="10">
              <el-pagination
                :current-page="addContentDialogData.paginationData.currentPage"
                :page-size="addContentDialogData.paginationData.pageSize"
                :page-sizes="[10, 20, 30, 40]"
                :total="addContentDialogData.paginationData.total"
                @current-change="handleDialogCurrentChange"
                @size-change="handleDialogSizeChange"
                layout="total,sizes, prev, pager, next, jumper"
                v-show="addContentDialogData.paginationData.total>0"
              >
              </el-pagination>
            </el-col>
          </el-row>
        </section>
      </section>
      <section style="clear:both; height:50px; margin-top:20px;">
          <span slot="footer" class="dialog-footer">
            <el-button @click="addContentDialogData.visible = false">取 消</el-button>
            <el-button type="primary" @click="saveContent">确 定</el-button>
          </span>
      </section>
    </el-dialog>
  </section>
</template>

<script>
import axios from '@/assets/js/utils/request';
import apiUrl from '@/api/apiUrlConfig.js';
import comm from '@/assets/js/utils/comm.js';
import apiUrlConfig from '../../api/apiUrlConfig';

/*
* 付费课程内容管理
* 刘宇涛 2019-04-23
* */

export default {
  name: 'courseContentManage',
  data() {
    return {
      id: '',
      tableData: [],
      submitting: false,
      courseInfo: {
        courseName: '',
        id: '',
        pcCoverPicUrl: ''
      },
      // 分页参数
      paginationData: {
        currentPage: 1, // 当前页
        firstResult: 0,
        maxResult: 10,
        pageSize: 10, // 默认显示10条
        total: 0 // 总数
      },
      // 添加内容对话框
      addContentDialogData: {
        title: '添加内容',
        visible: false,
        keyWord: '',
        rowData: [],
        multiSelection: [],
        paginationData: {
          currentPage: 1, // 当前页
          firstResult: 0,
          maxResult: 10,
          pageSize: 10, // 默认显示10条
          total: 0 // 总数
        }
      }
    };
  },
  mounted() {
    this.courseInfo.id = this.$route.query.id;
    this.getCourseContentList();
    this.getCourseDetail();
  },
  methods: {
    addContent() {
      this.addContentDialogData.keyWord = '';
      this.addContentDialogData.rowData = [];
      this.addContentDialogData.visible = true;
      this.addContentDialogData.paginationData.firstResult = 0;
      this.addContentDialogData.paginationData.maxResult = 10;
      this.addContentDialogData.paginationData.currentPage = 1;
      this.addContentDialogData.paginationData.total = 0;
      this.searchContent();
    },
    // 获取课程信息
    getCourseDetail() {
      let _this = this;
      axios({
        url: apiUrl.getCourseDetail.url + '/' + _this.courseInfo.id,
        type: apiUrl.getCourseDetail.type
      }).then(function(data) {
        comm.closeLoading();
        _this.courseInfo = Object.assign({}, _this.courseInfo, data.data.responseObject.responseData);
        _this.getPcCoverPic(data);
      });
    },
    isFirst(index) {
      return index === 0;
    },
    isLast(index) {
      return (this.paginationData.currentPage - 1) * this.paginationData.pageSize + index + 1 === this.paginationData.total;
    },
    // 获取课程内容列表
    getCourseContentList() {
      let _this = this;
      let params = {
        firstResult: this.paginationData.firstResult,
        maxResult: this.paginationData.maxResult,
        sortType: this.sortType,
        columnName: this.columnName,
        courseId: this.courseInfo.id
      };
      axios({
        url: apiUrl.getCourseContentList.url,
        type: apiUrl.getCourseContentList.type,
        params: params
      }).then(function(data) {
        comm.closeLoading();
        _this.tableData = data.data.responseObject.responseData.dataList;
        _this.paginationData.total = data.data.responseObject.responseData.totalCount;
      });
    },
    // 付款类型解析
    payTypeFormatter(row, column, cellValue) {
      // 1 免费 2 付费
      return row.payType === 1 ? '支持试看' : '付费后可看';
    },
    // 内容类型
    contentTypeFormatter(row, column, cellValue) {
      return row.collegeCourseState === 1 ? '付费' : '免费';
    },
    // 资源类型解析
    resourceTypeFormatter(row, column, cellValue) {
      console.log('fck');
      // 1 免费 2 付费
      return row.resourceType === 1 ? '视频' : '';
    },
    tableRowClassName({row, rowIndex}) {
      // 把每一行的索引放进row
      row.index = rowIndex + 1;
    },
    handleSizeChange(val) {
      this.paginationData.maxResult = val;
      this.getCourseContentList();
    },
    handleCurrentChange(val) {
      this.paginationData.currentPage = val;
      this.paginationData.firstResult = (val - 1) * this.paginationData.maxResult;
      this.getCourseContentList();
    },
    handleDialogSizeChange(val) {
      this.addContentDialogData.paginationData.maxResult = val;
      this.searchContent();
    },
    handleDialogCurrentChange(val) {
      this.addContentDialogData.paginationData.currentPage = val;
      this.addContentDialogData.paginationData.firstResult = (val - 1) * this.paginationData.maxResult;
      this.searchContent();
    },
    // 上移
    upSort(row) {
      let _this = this;
      let params = {
        resourceList:
            [{
              id: row.id,
              sortId: row.sortId,
              courseId: _this.courseInfo.id,
              sortType: 1
            }]
      };
      axios({
        url: apiUrl.updateCourseContentState.url,
        method: apiUrl.updateCourseContentState.type,
        data: params
      }).then(function(data) {
        comm.closeLoading();
        _this.getCourseContentList();
      });
    },
    // 下移
    downSort(row) {
      let _this = this;
      let params = {
        resourceList:
          [{
            id: row.id,
            sortId: row.sortId,
            courseId: _this.courseInfo.id,
            sortType: 2
          }]
      };
      axios({
        url: apiUrl.updateCourseContentState.url,
        method: apiUrl.updateCourseContentState.type,
        data: params
      }).then(function(data) {
        comm.closeLoading();
        _this.getCourseContentList();
      });
      // TODO
    },
    // 确认移除内容
    confirmRemove(row) {
      let _this = this;

      // 较验是否最后一个，上架后，最后一个视频不允许删除，最少保留一个。
      if (_this.courseInfo.courseState === 1) { // 已上架
        if (_this.courseInfo.newestNum === 1) {
          this.$allin_confirm({
            title: '提示',
            content: ' 当前视频为关联付费课程下唯一商品，不支持删除',
            type: 'notice',
            done: function() {
            }
          });
          return;
        }
      }

      this.$allin_confirm({
        title: '提示',
        content: '移除后，购买此课程用户将无法查看此视频，是否确认？',
        done: function() {
          let params = {
            resourceList: [{
              id: row.id,
              isValid: false,
              courseId: _this.courseInfo.id
            }]
          };
          axios({
            url: apiUrl.updateCourseContentState.url,
            method: apiUrl.updateCourseContentState.type,
            data: params
          }).then(function(data) {
            comm.closeLoading();
            _this.getCourseContentList();
            _this.getCourseDetail();
          });
        }
      });
    },
    searchBtnOnClick() {
      this.addContentDialogData.multiSelection = [];
      this.addContentDialogData.paginationData.firstResult = 0;
      this.addContentDialogData.paginationData.currentPage = 1;
      this.addContentDialogData.paginationData.total = 0;
      this.searchContent();
    },
    searchContent() {
      let _this = this;
      let params = {
        resourceName: _this.addContentDialogData.keyWord,
        visitSiteId: 25,
        firstResult: _this.addContentDialogData.paginationData.firstResult,
        maxResult: _this.addContentDialogData.paginationData.maxResult
      };
      axios({
        url: apiUrl.searchContentList.url,
        type: apiUrl.searchContentList.type,
        params: params
      }).then(function(data) {
        comm.closeLoading();
        _this.addContentDialogData.rowData = data.data.responseObject.responseData.dataList;
        _this.addContentDialogData.paginationData.total = data.data.responseObject.responseData.totalCount;
      });
    },
    // 确认添加内容
    saveContent() {
      let _this = this;
      let contents = [];
      let sortId = 1;

      this.addContentDialogData.multiSelection.map(function(item, index) {
        contents.push({
          resourceName: item.resourceName,
          resourceType: item.resourceType,
          resourceId: item.videoId,
          sortId: sortId++,
          courseId: _this.courseInfo.id,
          opUser: localStorage.getItem('userLoginName')
        });
      });
      // 未选
      if (contents.length === 0) {
        this.$allin_confirm({
          title: '提示',
          content: '请选择要加入课程的内容',
          type: 'notice',
          done: function() {
          }
        });
        return;
      }
      // 选超
      if (contents.length > (_this.courseInfo.totalNum - _this.courseInfo.newestNum)) {
        this.$allin_confirm({
          title: '提示',
          content: '选中的内容数量超出可添加的数量！',
          type: 'notice',
          done: function() {
          }
        });
        return;
      }
      let params = {
        resourceList: contents
      };

      if (this.submitting) {
        return false;
      }
      this.submitting = true;

      axios({
        url: apiUrl.updateCourseContentState.url,
        method: apiUrl.updateCourseContentState.type,
        data: params
      }).then(function(data) {
        comm.closeLoading();
        _this.submitting = false;

        _this.addContentDialogData.visible = false;
        _this.getCourseContentList();
        _this.getCourseDetail();
      });
    },
    // 复选框变更时
    handleSelectionChange(val) {
      this.addContentDialogData.multiSelection = val;
    },
    // 编辑课程
    editCourse() {
      let _this = this;
      // this.$router.push({path: '/payCourseEdit?action=edit&id=' + _this.id});
      window.open('/#/payCourseEdit?action=edit&id=' + _this.courseInfo.id);
    },
    // 上架确认
    onSaleConfirm() {
      let _this = this;
      if (this.courseInfo.courseType === 2) { // 售卖课程若未关联课程进行提示
        if (this.courseInfo.newestNum === 0) {
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

      let content = '上架后该专栏课程将对外销售，是否上架？';
      if (_this.courseInfo.courseType === 1) {
        content = '上架后该专栏课程仅对外展示无法销售，是否上架？';
      }
      this.$allin_confirm({
        title: '提示',
        content: content,
        type: 'confirm',
        done: function() {
          let params = {
            id: _this.courseInfo.id,
            courseState: 1,
            courseType: _this.courseInfo.courseType
          };
          axios({
            url: apiUrl.updateCourseState.url,
            method: apiUrl.updateCourseState.type,
            data: params
          }).then(function(data) {
            comm.closeLoading();
            _this.tableData = data.data.responseObject.responseData.dataList;
            _this.paginationData.total = data.data.responseObject.totalCount;
            window.location.reload();
          });
        }
      });
    },
    // 获取 pc 封面图
    getPcCoverPic(data) {
      let _this = this;
      if (data.data.responseObject.responseData.pcCoverPic.length > 0) {
        _this.courseInfo.pcCoverPicUrl = apiUrlConfig.imgServer_img05.url + data.data.responseObject.responseData.pcCoverPic[0].attUrl;
      }
      else {
        _this.courseInfo.pcCoverPicUrl = '';
      }
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
      font-family: PingFangSC-Semibold;
      font-size: 20px;
      color: #2C343A;
      letter-spacing: 0;
      line-height: 20px;
      margin-bottom: 25px;
    }

    .course-info{

      background: #ffffff;
      padding:20px;
      height: 140px;
      margin-bottom: 20px;
      .course-pic{
        float: left;
        width: 200px;
        height: 120px;
        border:1px solid #eeeeee;
        margin-right: 20px;
      }
      .course-detail{
        margin-left:220px;
        .left{
          .title{
            color:#333333;
            font-size:14px;
          }
          .desc{
            color:#777777;
            margin-top:20px;
            font-size:12px;
          }
          .course-state{
            color:#777777;
            margin-top:20px;
            font-size:12px;
          }
        }
        .right{
          .btns{
            display:flex;
            justify-content: flex-end;
          }
          .update-state{
            text-align:right;
            margin-top: 60px;
            color:#999999;
          }
        }
        .title{

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

  .source-list {
    margin-top: 20px;
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
  .dialog-footer{
    float:right;
  }
</style>

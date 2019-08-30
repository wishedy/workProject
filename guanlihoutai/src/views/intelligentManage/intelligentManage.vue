<template>
  <section class="intelligent-main">
    <h1>智能推荐管理</h1>
    <section class="sreach-content">
      <el-form ref="searchForm" style="position: relative;" :model="searchForm" label-width="80px">
        <el-row>
          <el-col :span="9">
            <el-form-item label="添加时间" prop="createTime">
              <el-col :span="11">
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
              </el-col>
            </el-form-item>
          </el-col>
          <el-col :span="6" style="margin-left: 50px;">
            <el-form-item label="医生ID" prop="customerId">
              <el-input
                v-model="searchForm.customerId"
                placeholder="请输入医生ID"
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="6" style="margin-left: 40px;">
            <el-form-item label="医生姓名" prop="customerName">
              <el-input
                v-model="searchForm.customerName"
                placeholder="请输入医生姓名"
              ></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="6">
            <el-form-item label="上线状态" prop="status">
              <el-select
                v-model="searchForm.status"
                placeholder="不限"
              >
                <el-option label="全部" value="10"></el-option>
                <el-option label="已屏蔽" value="2"></el-option>
                <el-option label="已上线" value="1"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="标签" prop="bodyPartId">
                <el-select
                  v-model="searchForm.bodyPartId"
                  placeholder="不限"
                >
                  <el-option label="全部" value=""></el-option>
                  <el-option v-for="(item, i) in tagDataList" :key="i" :label="item.partName" :value="item.partId"></el-option>
                </el-select>
            </el-form-item>
          </el-col>
        </el-row>

        <section class="submitBtn">
          <el-button @click="resetForm('searchForm')">清空条件</el-button>
          <el-button @click="submitForm('searchForm')">&nbsp;&nbsp;检索&nbsp;&nbsp;</el-button>
        </section>
      </el-form>
    </section>
    <section class="intelligent-button">
      <el-row>
        <el-col :span="9">
          <span>智能推荐医生池</span>
          <el-button @click="addDoctor" style="margin-left: 20px;"><span class="el-icon-circle-plus"></span>添加医生</el-button>
          <el-button @click="delRow">删除</el-button>
        </el-col>
      </el-row>
      <el-button style="position: absolute; right: 35px; top: 0;" @click="viewTaglibrary">查看标签库</el-button>
    </section>

    <section class="source-list">
      <el-table
        :data="tableData"
        ref="intelTable"
        @selection-change="handleSelectionChange"
        @current-change="handleTableChange"
        style="width: 100%"
        class="intel-table"
        highlight-current-row>
        <el-table-column
          type="selection"
          width="50">
        </el-table-column>
        <el-table-column
          type="index"
          label="标号"
          width="50">
        </el-table-column>
        <el-table-column
          prop="customerId"
          label="医生ID"
          width="130">
        </el-table-column>
        <el-table-column
          prop="customerName"
          label="医生姓名"
          width="100">
        </el-table-column>
        <el-table-column
          prop="company"
          label="所属医院"
          width="150">
        </el-table-column>
        <el-table-column
          prop="createTimeStr"
          label="添加时间"
          width="120">
        </el-table-column>
        <el-table-column
          prop="expertise"
          label="擅治疾病"
          width="180">
        </el-table-column>
        <el-table-column
          prop="bodyPartId"
          label="标签"
          width="150">
          <template slot-scope="scope">
            <el-popover
              v-if="scope.row && scope.row.bodyPartId"
              ref="popover1"
              placement="top-start"
              width="400"
              trigger="hover">
                <section class="etag-box">
                  <span v-for="(item, i) in handleTagdata(scope.row)" :key="i" :class="i === 2 ? 'noMarRight mytag' : 'mytag'"  @click="editTag(scope.row)">
                    {{item.partName ? item.partName : ''}}
                  </span>
                </section>
                <span slot="reference" @click="editTag(scope.row)">
                  {{handleTagStr(scope.row)}}
                </span>
            </el-popover>
            <span v-else slot="reference" @click="editTag(scope.row)" style="display: inline-block; min-width: 200px; min-height: 30px;">
                {{handleTagStr(scope.row)}}
              </span>
          </template>
        </el-table-column>
        <el-table-column
          label="推荐分值"
          width="100">
          <template slot-scope="scope">
            <el-input class="nameInput" v-model="scope.row.recommendScore" @focus="handleFoucs(scope.row)" @blur="handleScore(scope.row)" :style="scope.row.isBorder ? 'border: 1px solid #ccc' : ''"  maxlength="10"></el-input>
          </template>
        </el-table-column>
        <el-table-column
          width="180"
          label="操作"
          style="text-align: center"
        >
          <template slot-scope="scope">

              <template v-if="+scope.row.status === 1">
                <span style="width: 74px; text-align: center; display: inline-block">已上线</span>
              </template>
              <template v-else>
                <el-button
                @keydown.native.prevent
                @click="handleStatus(scope.row)"
                class="viewBotton">
                  上线
                </el-button>
              </template>
              <template v-if="+scope.row.status === 2">
                <span style="width: 74px; text-align: center; display: inline-block">已屏蔽</span>
              </template>
              <template v-else>
                <el-button
                  @click="handleStatus(scope.row)"
                  @keydown.native.prevent
                  class="viewBotton"
                >
                屏蔽
                </el-button>
              </template>
          </template>
        </el-table-column>
      </el-table>
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

    <!-- 查看标签库 -->
    <el-dialog
      title="查看标签库"
      :visible.sync="tagDialogVisible"
      custom-class="tagDialog"
      width="756px"
    >
      <section>
        <el-tag :isEdit="false" :dataList="tagDataList" :showTags="[]"></el-tag>
      </section>
    </el-dialog>

    <!--  添加医生  -->
    <el-dialog
      title="添加医生"
      :visible.sync="addDoctorDialogVisible"
      custom-class="addDoctorDialog"
      width="1000px"
      :close-on-click-modal="false"
      @open="handleOpen"
    >
      <add-doctor :tagDataList="tagDataList" @isOpen="openDoctor" :isEmpty="isEmpty"></add-doctor>
    </el-dialog>

    <!--  编辑标签  -->
    <el-dialog
      title="修改标签"
      :visible.sync="editTagDialogVisible"
      custom-class="editTagDialog"
      width="756px"
    >
      <section>
        <el-tag @dataList="getArrEtag" :dataList="tagDataList" :showTags="currentRowTagData"></el-tag>
      </section>

      <section class="tagConfirm">
        <el-button style="margin-left: 10px; color: #4B67D6; border: 1px solid #4B67D6;" @click="confirmEditTag">
          保存
        </el-button>
      </section>
    </el-dialog>
  </section>
</template>

<script>
import axios from '@/assets/js/utils/request';
import apiConfig from '@/api/apiUrlConfig';
import comm from '@/assets/js/utils/comm';
import addDoctor from './addDoctor';
import elTag from './elTag';
/**
 * 快速问诊-急速问诊推荐医生
 * 可以查询、添加医生、增加查看标签
 * 极速咨询医生智能推荐
 * 2019-07-04 丑晴
 * */
export default {
  data() {
    return {
      searchForm: {
        startTimeStr: '', // 添加时间-开始
        endTimeStr: '', // 添加时间-结束
        customerId: '', // 医生id
        customerName: '', // 医生姓名
        status: '10', // 上线状态（1-已上线，2-已屏蔽，10-全部）
        bodyPartId: '', // 标签id
        firstResult: 0, // 分页参数 当页的数据条数
        maxResult: 10 // 分页参数  当页第一条数据的序号
      },

      createTime: [],

      tagList: [], // 编辑的标签数组

      tagDataList: [ // 标签列表
      ],

      // 分页
      currentPage: 1, // 当前页
      pageSize: 10, // 每页条数
      total: 0, // 总数

      tableData: [], // 列表数据

      currentRow: null, // 表格单选操作
      currentRowTagData: [], // 标签修改操作 当前选中的tag
      currentTagRow: null, // 当前修改的标签行

      tagDialogVisible: false, // 标签库弹框是否显示
      addDoctorDialogVisible: false, // 添加医生弹框是否显示
      editTagDialogVisible: false, // 编辑标签是否显示

      isEmpty: false // 添加医生数据是否置空
    };
  },

  methods: {
    getTableData() {
      comm.openLoading('加载中...');
      axios({
        method: apiConfig.getDoctorList.type,
        url: apiConfig.getDoctorList.url,
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
            this.total = response.data.responseObject.responseData.totalCount;
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
    getListByLevel() {
      axios({
        method: apiConfig.getMapListByLevel.type,
        url: apiConfig.getMapListByLevel.url,
        params: {
          treeLevel: 2,
          isValid: 1,
          firstResult: 0,
          maxResult: 999
        }
      }).then((response) => {
        if (response && response.data && response.data.responseObject && response.data.responseObject.responseData) {
          let responseData = response.data.responseObject.responseData;
          const tagDataList = responseData.dataList;
          this.tagDataList = tagDataList;
        }
      });
    },
    // 添加医生
    addDoctor() {
      this.addDoctorDialogVisible = true;
    },
    // 添加医生弹窗关闭
    openDoctor() {
      this.addDoctorDialogVisible = false;
      this.getTableData();
    },
    // 查看标签库
    viewTaglibrary() {
      this.tagDialogVisible = true;
    },
    // 重置
    resetForm(formName) {
      this.$refs[formName].resetFields();
      // 对时间组件进行重置
      this.createTime = [];
      this.searchForm.startTimeStr = '';
      this.searchForm.endTimeStr = '';
    },

    // 提交表单
    submitForm(formName) {
      if (this.createTime && this.createTime.length) {
        this.searchForm.startTimeStr = this.createTime[0];
        this.searchForm.endTimeStr = this.createTime[1];
      }
      else {
        this.searchForm.startTimeStr = '';
        this.searchForm.endTimeStr = '';
      }
      this.searchForm.firstResult = 0;
      this.currentPage = 0;
      this.getTableData();
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
    handleTableChange(val) {
      this.$refs.intelTable.toggleRowSelection(val);
    },
    handleSelectionChange(val) {
      if (val.length > 1) {
        this.$refs.intelTable.clearSelection();
        this.$refs.intelTable.setCurrentRow(val[1]);
        this.currentRow = val[0];
        return;
      }
      else if (val.length === 1) {
        this.currentRow = val[0];
        return;
      }
      this.currentRow = null;
    },
    // 删除表格行
    delRow() {
      if (!this.currentRow) {
        this.$allin_confirm({title: '提示', content: '请选择要删除的行', type: 'notice'});
        return;
      }

      axios({
        method: apiConfig.delDoctor.type,
        url: apiConfig.delDoctor.url,
        data: {
          id: this.currentRow.id
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
              this.currentRow = null;
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
    },
    handleFoucs(row) {
      row.isBorder = true;
    },
    handleScore(row) {
      row.isBorder = false;
      // 输入0-5位数字
      axios({
        method: apiConfig.updateDoctor.type,
        url: apiConfig.updateDoctor.url,
        data: {
          id: row.id,
          recommendScore: row.recommendScore,
          bodyPartId: row.bodyPartId,
          status: row.status
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
              this.getTableData(); // 操作完状态没有修改成功。。
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
    },
    handleStatus(row) {
      axios({
        method: apiConfig.updateDoctor.type,
        url: apiConfig.updateDoctor.url,
        data: {
          id: row.id,
          recommendScore: row.recommendScore,
          bodyPartId: row.bodyPartId,
          status: +row.status === 1 ? 2 : 1
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
              this.getTableData(); // 操作完状态没有修改成功。。
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
    },
    editTag(row) {
      this.editTagDialogVisible = true;
      this.currentTagRow = row;
      this.currentRowTagData = row.bodyPartId.split(',');
      this.$forceUpdate();
    },
    handleTagStr(row) { // 处理标签显示的数据
      if (!this.tagDataList.length && !row && !row.bodyPartId) return;
      let str = row.bodyPartId;
      const arr = str.split(',');
      let arr2 = [];
      arr.forEach(item => {
        const obj = this.tagDataList.find(i => +item === +i.partId);
        if (obj) arr2.push(obj.partName);
      });
      let str2 = '';
      str2 = arr2.join(',');
      return str2;
    },
    handleTagdata(row) { // 处理标签显示的数据
      if (!this.tagDataList.length && !row && !row.bodyPartId) return;
      let str = row.bodyPartId;
      const arr = str.split(',');
      let arr2 = [];
      arr.forEach(item => {
        const obj = this.tagDataList.find(i => +item === +i.partId);
        if (obj) arr2.push(obj);
      });
      return arr2;
    },
    getArrEtag(arr) {
      this.tagList = arr;
    },
    confirmEditTag() {
      axios({
        method: apiConfig.updateDoctor.type,
        url: apiConfig.updateDoctor.url,
        data: {
          id: this.currentTagRow.id,
          recommendScore: this.currentTagRow.recommendScore,
          bodyPartId: this.tagList.map(item => item.partId).join(','),
          status: this.currentTagRow.status
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
              this.currentTagRow = null;
              this.editTagDialogVisible = false;
              this.getTableData(); // 操作完状态没有修改成功。。
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
    },
    handleOpen() {
      // 打开弹框之前的回调
      this.isEmpty = !this.isEmpty;
    }
  },
  mounted() {
    this.getListByLevel();
    this.getTableData();
  },
  components: {
    addDoctor,
    elTag
  }
};
</script>

<style lang="scss">
  .intelligent-main{
    width: 1200px;
    margin: 20px auto;

    .intel-table{
      thead th:nth-child(1) {
        visibility: hidden;
      }
    }
    & > h1 {
      font-family: PingFangSC-Semibold;
      font-size: 20px;
      color: #222222;
      letter-spacing: 0;
      line-height: 20px;
      margin: 32px 0 25px;
    }

    .sreach-content {
      padding: 25px 0 0;
      box-shadow: 0 4px 10px 0 rgba(42, 53, 102, 0.04);
      border-radius: 4px;
      margin-bottom: 30px;
      background-color: #ffffff;

      .submitBtn {
        position: absolute;
        bottom: 20px;
        right: 60px;
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

    .intelligent-button {
      position: relative;
      margin-bottom: 30px;
    }

    .source-list {
      /*表头样式*/
      .el-table__header .cell,.el-table__fixed-header-wrapper .cell{
        font-family: PingFangSC-Medium;
        font-size: 14px;
        color: #111111;
        letter-spacing: 0;
        line-height: 1.1;

        &:last-of-type{
          text-align: center;
        }
      }
      .el-table__row {
        td{
          text-align: center;
          .cell {
            font-family: PingFangSC-Regular;
            font-size: 14px;
            color: #333333;
            letter-spacing: 0;
            line-height: 1.2;
          }

          &:last-of-type{
            text-align: center;
          }
        }
      }
      .pagination {
        margin-top: 28px;
      }

      //查看按钮
      .viewBotton {
        padding: 0;
        width: 74px;
        height: 28px;
        font-family: PingFangSC-Regular;
        font-size: 13px;
        color: #4B67D6;
        letter-spacing: 0;
        line-height: 13px;
        border: 1px solid #4B67D6;
        border-radius: 3px;
      }
    }

    .pagination {
      text-align: center;
    }

    .tagDialog {
    }
  }
  .etag-box{
    display: flex;
    flex-flow: wrap;
    margin-left: 20px;
    .mytag {
      background-color: #dddddd;
      border-radius: 20px;
      width: 150px;
      margin: 0 40px 20px 0;
      box-sizing: border-box;
      height: 50px;
      line-height: 50px;
      text-align: center;
    }
  }
  .tagConfirm{
    margin-top: 20px;
    text-align: center;
  }

  .nameInput{
    >input {
      border: 0!important;
      padding: 0;
      background: none!important;
    }
  }
</style>

<template>
  <section class="main">
    <h1 class="TopTitle">唯币调整</h1>

    <section class="form-content">
      <div class="center">
        <div class="tip">
          仅限IOS端账户唯币调整使用，暂仅支持增加唯币
        </div>
        <el-form :model="formData"
                 :rules="rules"
                 :label-position="'left'"
                 label-width="110px"
                 ref="orderForm"
                 class="form-container">
          <h2 class="code-info-title"><i class="icon-bg"></i><span>调整信息</span></h2>
          <el-form-item label="充值唯币数" prop="chargeTotalAmount">
            <el-input
              type="input"
              min="1"
              v-model.trim="formData.chargeTotalAmount"
              maxlength="8"
              max="8"
              class="el-input-width el-input-name"
            ></el-input>
            币
          </el-form-item>
          <el-form-item label="调整原因" prop="note">

            <el-input
              maxlength="20"
              class="el-input-width el-input-name"
              v-model.trim="formData.note"></el-input>

          </el-form-item>

          <div style="margin-top: 80px;"/>

          <h2 class="code-info-title"><i class="icon-bg"></i><span>用户信息</span></h2>
          <el-form-item label="用户姓名" prop="teacherList">
            <div class="teacher-tag-list">
              <el-tag
                class="el-tag-item"
                v-for="(teacher,index) in formData.courseTeacherVOList"
                :key="index"
                :type="''"
                closable
                @close="handleRemoveTag(teacher)"
              >
                {{teacher.customerName}}
              </el-tag>
            </div>
            <el-button @click="openTeacher" class="btn-add-teacher">添加用户</el-button>
          </el-form-item>

          <el-row>
            <el-col :span="24" :offset="4">
              <el-button class="publishBtn" type="primary" @click="submitForm">
                提交
              </el-button>
            </el-col>
          </el-row>
        </el-form>
      </div>
    </section>
    <el-dialog
      :center=true
      :lock-scroll=false
      :title="teacherDialogData.title"
      :visible.sync="teacherDialogData.visible"
      custom-class="edit-dialog"
      top="18vh"
      v-if="teacherDialogData.visible"
      width="770px"
    >
      <section>

        <el-row>
          <el-col :span="12">
            <el-input type="text" v-model="teacherDialogData.customerId" name="customerId"
                      placeholder="用户ID/用户姓名"></el-input>
          </el-col>
          <el-col :span="5" :offset="1">
            <el-button @click="searchBtnOnClick">搜索</el-button>
          </el-col>
        </el-row>
        <section class="source-list">
          <el-table
            ref="multipleTable"
            :data="teacherDialogData.rowData"
            :default-sort="{prop: 'sortId', order: 'descending'}"
            :fit="true"
            :row-class-name="tableRowClassName"
            style="width: 100%"
            @select="handleSelectionChange"
          >
            <el-table-column
              align="center"
              label="选择"
              prop="index"
              width="150"
              type="selection"
            >
            </el-table-column>
            <el-table-column
              align="center"
              label="用户ID"
              prop="customerId"
              width="250"
            >
            </el-table-column>
            <el-table-column
              align="center"
              header-align="center"
              label="用户姓名"
              prop="fullName"
              width="250">
            </el-table-column>
          </el-table>
        </section>
      </section>
      <el-row class="pagination" style="margin:20px 0">
        <el-col :span="7">
          <el-pagination
            :current-page="teacherDialogData.paginationData.currentPage"
            :page-size="teacherDialogData.paginationData.pageSize"
            :page-sizes="[10, 20, 30, 40]"
            :total="teacherDialogData.paginationData.total"
            @current-change="handleCurrentChange"
            @size-change="handleSizeChange"
            layout="total,sizes, prev, pager, next, jumper"
            v-show="teacherDialogData.paginationData.total>0"
          >
          </el-pagination>
        </el-col>
      </el-row>
      <section style="clear:both; height:50px; margin-top:20px;">
          <span slot="footer" class="dialog-footer">
            <el-button @click="teacherDialogData.visible = false">取 消</el-button>
            <el-button type="primary" @click="saveTeacherList">确 定</el-button>
          </span>
      </section>

    </el-dialog>
  </section>
</template>

<script>
/*
      * 唯币调整
      * */

import apiUrlConfig from '@/api/apiUrlConfig';
import axios from '@/assets/js/utils/request';
import comm from '@/assets/js/utils/comm.js';
import validator from '@/assets/js/utils/validator';

export default {
  name: 'weiMoneyAdjustment',
  components: {},
  data() {
    return {
      formData: {
        chargeTotalAmount: null,
        adjustReason: '',
        courseTeacherVOList: [],
        teacherList: []
      },
      rules: {
        chargeTotalAmount: [{
          required: true,
          message: '请输入充值唯币数',
          trigger: 'blur'
        }, {
          validator: validator.isPositiveInteger,
          message: '唯币数必须为正整数',
          trigger: 'blur'
        },
        {
          min: 0, max: 8, message: '最多8位数', trigger: 'blur'
        }
        ],
        note: [
          {min: 0, max: 20, message: '最多20个字符', trigger: 'blur'}
        ],
        teacherList: [{
          required: true,
          message: ' 请选择目标用户',
          trigger: ''
        }]
      },
      teacherDialogData: {
        title: '添加用户',
        visible: false,
        keyword: '',
        rowData: [],
        multiSelection: [],

        // 分页参数
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
  computed: {
    customerIds() {
      return this.formData.teacherList.join(',');
    }
  },
  methods: {
    // 唯币调整提交
    submitForm() {
      let _this = this;
      this.$refs.orderForm.validate((valid) => {
        if (valid) {
          this.$allin_confirm({
            title: '提示',
            content: '是否确认唯币调整申请？',
            done: function() {
              let params = {
                customerIdList: _this.customerIds,
                chargeTotalAmount: _this.formData.chargeTotalAmount,
                operator: localStorage.getItem('userLoginName'),
                note: _this.formData.note,
                chargeType: 2 // 2-赠送充值,3-补单充值
              };

              if (_this.note) { // 调整原因非必填
                params.note = _this.note;
              }
              axios({
                url: apiUrlConfig.weiMoneyRecharge.url,
                method: apiUrlConfig.weiMoneyRecharge.type,
                data: params
              }).then(function(res) {
                comm.closeLoading();
                if (res && res.data && res.data.responseObject && res.data.responseObject.responseStatus) {
                  // 提交成功
                  _this.$allin_confirm({title: '提示', content: '唯币调整成功', type: 'notice'});
                  _this.formData = {
                    chargeTotalAmount: null,
                    adjustReason: '',
                    courseTeacherVOList: [],
                    teacherList: []
                  };
                }
                else {
                  _this.$allin_confirm({title: '提示', content: '唯币调整失败', type: 'notice'});
                }
              });
            }
          });
        }
      });
    },
    // 打开讲师筛选
    openTeacher() {
      this.teacherDialogData.visible = true;
      // 清空当前已选择的讲师
      this.teacherDialogData.multiSelection = [];
      this.teacherDialogData.customerId = '';
      this.teacherDialogData.paginationData.firstResult = 0;
      this.teacherDialogData.paginationData.maxResult = 10;
      this.teacherDialogData.paginationData.currentPage = 1;
      this.searchTeacher();
    },
    searchBtnOnClick() {
      this.teacherDialogData.paginationData.firstResult = 0;
      this.teacherDialogData.paginationData.currentPage = 1;
      this.teacherDialogData.multiSelection = [];
      this.searchTeacher();
    },
    searchTeacher() {
      let _this = this;

      let params = {
        customerId: _this.teacherDialogData.customerId,
        visitSiteId: 25,
        firstResult: _this.teacherDialogData.paginationData.firstResult,
        maxResult: _this.teacherDialogData.paginationData.maxResult

      };
      if (!_this.teacherDialogData.customerId) {
        params.customerId = null;
      }

      axios({
        url: apiUrlConfig.searchTeacherList.url,
        method: apiUrlConfig.searchTeacherList.type,
        params: params
      }).then(function(data) {
        comm.closeLoading();
        _this.updateCheckboxTitle();
        _this.teacherDialogData.rowData = data.data.responseObject.responseData.dataList;
        _this.teacherDialogData.paginationData.total = data.data.responseObject.responseData.totalCount;

        _this.teacherDialogData.multiSelection = _this.teacherDialogData.multiSelection.concat(_this.formData.courseTeacherVOList);
        setTimeout(() => {
          _this.upkeepSelected();
        }, 500);
      });
    },
    // 讲师搜索弹窗里的分页处理-每页总数变化
    handleSizeChange(val) {
      this.teacherDialogData.paginationData.maxResult = val;
      this.searchTeacher();
    },
    // 讲师搜索弹窗里的分页处理-跳转某页
    handleCurrentChange(val) {
      this.teacherDialogData.paginationData.currentPage = val;
      this.teacherDialogData.paginationData.firstResult = (val - 1) * this.teacherDialogData.paginationData.maxResult;
      this.searchTeacher();
    },
    tableRowClassName({row, rowIndex}) {
      // 把每一行的索引放进row
      row.index = rowIndex + 1;
    },
    // 确认添加医师
    saveTeacherList() {
      let _this = this;

      _this.formData.courseTeacherVOList = [];
      _this.formData.teacherList = [];

      let teacherTagList = _this.formData.courseTeacherVOList;
      let teacherList = _this.formData.teacherList;
      if (this.teacherDialogData.multiSelection.length > 0) {
        this.teacherDialogData.multiSelection.map(function(item, index) {
          if (_this.checkTeacherNoRepeat(item.customerId, teacherTagList, 1)) {
            teacherTagList.push({
              customerName: item.fullName || item.customerName,
              customerId: item.customerId
            });
          }
          if (_this.checkTeacherNoRepeat(item.customerId, teacherList, 2)) {
            teacherList.push(item.customerId.toString());
          }
        });

        _this.$set(_this.formData, 'teacherTagList', teacherTagList);
        _this.$set(_this.formData, 'teacherList', teacherList);

        this.teacherDialogData.visible = false;
        this.$refs.orderForm.validateField('teacherList');
      }
      else {
        this.$message('请选择需要添加的用户');
      }
    },
    // 判断讲师是否重复，根据 customerId 判断,如果没有重复，则返回 true
    // dataList 分为两种，一种是object的数组 ，一种是 customerId 的数组
    // type ,1 表示 object 对象数组，2 表示 customerId 数组
    checkTeacherNoRepeat(customerId, dataList, type) {
      for (let i = 0, len = dataList.length; i < len; i++) {
        if (type === 1) {
          if (customerId.toString() === dataList[i].customerId.toString()) {
            return false;
          }
        }
        else if (type === 2) {
          if (customerId.toString() === dataList[i]) {
            return false;
          }
        }
      }
      return true;
    },
    // 正反选处理，原因：element-ui selection-change对翻页不能实现累加，每次都是批量操作当前。
    // 存在删除，不存在添加
    handleSelectionChange(val, row) {
      let isExist = false;
      let temp = this.teacherDialogData.multiSelection;
      temp.forEach((item, index) => {
        if (row.customerId === item.customerId) {
          isExist = true;
          temp.splice(index, 1);
        }
      });

      // 不存在
      if (!isExist) {
        temp.push(row);
      }
    },
    // 删除讲师回调
    handleRemoveTag(teacher) {
      this.formData.courseTeacherVOList.splice(this.formData.courseTeacherVOList.indexOf(teacher), 1);
      this.formData.teacherList.splice(this.formData.teacherList.indexOf(teacher.customerId), 1);
    },
    // 校正elementUI type多选时不能更改标题
    updateCheckboxTitle() {
      document.querySelector('.cell').innerText = '选择';
    },
    // 选择状态保持, 1.当被选择过后，翻页后，又翻回来数据显示/ 2.当选择过后，再点击添加用户
    upkeepSelected() {
      // 已选择过的数据
      let selectData = this.teacherDialogData.multiSelection;
      // 当前列表数据
      let tableData = this.$refs.multipleTable.data;

      // 勾选
      tableData.forEach((item, index) => {
        selectData.forEach((sItem, sIndex) => {
          if (item.customerId === sItem.customerId) {
            this.$refs.multipleTable.toggleRowSelection(tableData[index], true);
          }
        });
      });
    }
  }
};
</script>

<style lang="scss" scoped>
@import "../../assets/scss/pages/editDetailEUI/euiReset.scss";

.main {
  width: 1200px;
  margin: 0 auto;
  padding-top: 1px;
  .form-content {
    /*width: 1200px;*/
    margin: 36px auto 36px;
    padding: 36px 0 5px;
    background: #ffffff;
    width: 1200px;
    .center {
      width: 1100px;
      margin: 0 auto;
      input, textarea {
        background: rgba(247, 249, 252, 1);
        border-radius: 3px;
      }
      .tip {
        width: 90%;
        height: 50px;
        line-height: 50px;
        background: #DFEEF9;
        border: 1px solid #49B6DA;
        margin: 20px 0;
        padding-left: 20px;
        color: #333333;
        font-size: 14px;
      }

      .code-title {
        font-family: PingFangSC-Semibold;
        font-size: 20px;
        color: #222222;
        letter-spacing: 0;
        line-height: 20px;
        margin: 32px 0 25px;
      }
      .el-form-item {
        width: 600px;
        .el-input {
          position: relative;
          font-size: 14px;
          display: inline-block;
        }
      }
      .el-input-width {
        width: 360px;
      }

      .el-tag-item {
        margin-left: 5px;
        margin-bottom: 5px;
      }
      .btn-add-teacher {
        margin-left: 10px;
      }

      .teacher-tag-list {
        width: 360px;
        height: 90px;
        border: 1px solid #eeeeee;
        border-radius: 5px;
        float: left;
        overflow: scroll;

      }
      .code-info-title {
        margin-bottom: 20px;

        .icon-bg {
          background: #0687FF;
          width: 3px;
          display: inline-block;
          vertical-align: middle;
          height: 16px;
          border-radius: 1px;
          margin-right: 5px;
        }
        span {
          display: inline-block;
          vertical-align: middle;
        }
      }
    }
  }
  .TopTitle {
    font-size: 20px;
    font-weight: 600;
    color: rgba(44, 52, 58, 1);
    line-height: 20px;
    margin: 32px 0 20px 0;
  }

}

</style>

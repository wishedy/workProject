<template>
  <section class="column-manager-main-container">
    <h3>{{title}}</h3>
    <section class="column-manager-search-area">
      <el-form @keydown.enter="getTableData" label-width="120px">
        <el-row>
          <el-col :span="4" class="search-area-anthology-name">
            <el-form-item label="用户认证等级">
              <el-select
                placeholder="请选择分组"
                v-model="searchConditionData.customerAuthState"
              >
                <el-option label="不限" value=""></el-option>
                <el-option label="v0" value="0"></el-option>
                <el-option label="v1" value="1"></el-option>
                <el-option label="v2" value="2"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="5" class="search-area-anthology-name">
            <el-form-item label="触发条件" label-width="120px">
              <el-input v-model="searchConditionData.eventName"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="5" class="search-area-anthology-name">
            <el-form-item label="标题">
              <el-input v-model="searchConditionData.pushTitle"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="5" class="search-area-anthology-name">
            <el-form-item label="文案">
              <el-input v-model="searchConditionData.pushMessageTemplate"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="4">
            <el-form-item label="状态">
              <el-select
                placeholder="请选择状态"
                v-model="searchConditionData.isValid"
              >
                <el-option label="不限" value=""></el-option>
                <el-option label="上架" value="1"></el-option>
                <el-option label="下架" value="0"></el-option>
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
          prop="id"
          width="70"
        >
        </el-table-column>
        <el-table-column
          :formatter="customerAuthFormatter"
          align="center"
          label="用户认证等级"
          prop="customerAuthState"
          width="120"
        >

        </el-table-column>
        <el-table-column
          label="触发条件"
          prop="eventName"
          align="left"
          width="160">

        </el-table-column>
        <el-table-column
          align="left"
          header-align="center"
          label="发送条件"
          prop="pushCondition"
          width="260"
        >
        </el-table-column>
        <el-table-column
          align="center"
          header-align="center"
          label="标题"
          width="200"
          prop="pushTitle"
        >
        </el-table-column>
        <el-table-column
          align="left"
          header-align="center"
          label="文案"
          prop="pushMessageTemplate"
          width="220"
        >
        </el-table-column>
        <el-table-column
          align="center"
          label="对应人群"
          prop="receivePeople"
          width="100"
        >
        </el-table-column>
        <el-table-column
          align="center"
          label="发送时间"
          prop="pushTime"
          width="180"
        >
        </el-table-column>
        <el-table-column
          :formatter="isValidFormatter"
          label="状态"
          prop="isValid"
          width="60">
        </el-table-column>
        <el-table-column
          align="center"
          label="对照组"
          prop="controlGroup"
          width="110"
        >
        </el-table-column>
        <el-table-column
          align="center"
          label="落地页"
          prop="redirectUrlName"
          width="180"
        >
        </el-table-column>
        <el-table-column fixed="right"
                         label="操作"
                         width="200"
        >
          <template slot-scope="scope" style="display:flex;  justify-content:flex-end">
            <el-button @click="editPush(scope.row)" @keydown.native.prevent class="source-list-btn">编辑</el-button>

            <el-button @click="onSaleConfirm(scope.row)" v-if="scope.row.isValid==0" @keydown.native.prevent
                       class="source-list-btn">上架
            </el-button>
            <el-button @click="onSaleConfirm(scope.row)" v-if="scope.row.isValid==1" @keydown.native.prevent
                       class="source-list-btn-down">下架
            </el-button>
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
      :visible.sync="ifPopupWindow"
      width="700px"
      :show-close=true
      :lock-scroll=true
      :modal=true
      :center=true
      :title="'编辑'"
    >
      <el-form
        label-width="100px"
        :model="editDialogData.rowData"
        ref="editForm"
        :rules="rules"
        class="edit-dialog-area"
      >
        <el-row>
          <el-col :span="14">
            <el-form-item label="标题" label-width="108px" prop="pushTitle">
              <el-input class="edit-dialog-title" v-model="editDialogData.rowData.pushTitle" placeholder="输入标题"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="14">
            <el-form-item label="内容" label-width="108px" prop="pushMessageTemplate">
              <el-input
                type="textarea"
                rows="4"
                resize="none"
                style="width:420px"
                v-model="editDialogData.rowData.pushMessageTemplate"
                placeholder="输入内容"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24" :offset="4">
            <el-button class="publishBtn" type="primary" @click="saveEdit">
              确认
            </el-button>
          </el-col>
        </el-row>
      </el-form>
    </el-dialog>
  </section>

</template>

<script>
/**
 * 名称：
 * 说明：
 * 作者：刘宇涛
 * 时间：2019/6/25
 */

import axios from '@/assets/js/utils/request';
import apiUrl from '@/api/apiUrlConfig.js';
import comm from '@/assets/js/utils/comm.js';

export default {
  name: 'pushListManage',
  props: {
    type: Number
  },
  computed: {
    'title': function() {
      return this.type === 1 ? '自动推送列表' : '自动召回列表'; // 推送为1 召回为0
    }
  },
  data() {
    let checkLengthValidator = function(rule, value, callback) {
      if (comm.getByteLen(value) > 100) {
        callback(new Error('长度不能超过100个英文字符，或50个汉字'));
      }
      else {
        callback();
      }
    };
    return {
      ifPopupWindow: false,
      searchConditionCreateTime: '', // 创建时间
      searchConditionData: {
        customerAuthState: '', // 用户认证等级
        eventName: '', // 触发事件
        pushTitle: '', // 标题
        pushMessageTemplate: '', // 文案
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
      editDialogData: {
        visible: false,
        rowData: {
          id: null,
          pushTitle: '', // 标题
          pushMessageTemplate: '' // 内容
        }
      },
      tableData: [],
      rules: {
        pushTitle: [
          {required: true, message: '标题不能为空', trigger: 'blur'},
          {validator: checkLengthValidator}
        ],
        pushMessageTemplate: [
          {required: true, message: '内容不能为空', trigger: 'blur'},
          {validator: checkLengthValidator}
        ]
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
    // 保存编辑
    saveEdit() {
      this.$refs.editForm.validate((vaild) => {
        if (vaild) {
          const _this = this;
          let data = {
            baseId: this.editDialogData.rowData.id, //
            pushTitle: this.editDialogData.rowData.pushTitle, // 标题
            pushMessageTemplate: this.editDialogData.rowData.pushMessageTemplate // 内容
          };

          this.tools().openLoading();
          axios({
            url: apiUrl.updatePushMessageTemplate.url,
            method: apiUrl.updatePushMessageTemplate.type,
            data: data
          }).then((res) => {
            _this.tools().closeLoading();
            if (res.data.responseObject.responseStatus) {
              _this.$allin_confirm({title: '提示', content: '编辑成功', type: 'notice'});
              _this.closePopupWindow();
            }
            else {
              _this.$allin_confirm({title: '提示', content: '编辑失败', type: 'notice'});
            }
            _this.getTableData();
          });
        }
        else {
          return false;
        }
      });
    },
    closePopupWindow() {
      this.ifPopupWindow = false;
      for (let key in this.editDialogData.rowData) {
        this.editDialogData.rowData[key] = '';
      }
    },
    tools() {
      return {
        _superThis: this,
        openLoading() {
          this._superThis.loading = this._superThis.$loading({
            lock: true,
            text: '加载中...',
            spinner: 'el-icon-loading',
            background: 'rgba(0, 0, 0, 0.7)'
          });
        },
        closeLoading() {
          this._superThis.loading.close();
        }
      };
    },
    customerAuthFormatter(row) {
      switch (row.customerAuthState) {
        case 0:
          return '未认证';
        case 1:
          return 'V1以上';
        case 2:
          return 'V2认证';
      }
    },
    isValidFormatter(row) {
      return row.isValid === 1 ? '上架' : '下架';
    },
    /*
  * 获取表格数据
  * */
    getTableData() {
      let _this = this;
      // 分页数据、排序方式
      let params = {
        firstResult: this.paginationData.firstResult,
        maxResult: this.paginationData.maxResult,
        type: _this.type
      };

      for (let key in this.searchConditionData) {
        if (this.searchConditionData[key]) {
          params[key] = this.searchConditionData[key];
        }
      }
      params.type = _this.type;
      comm.openLoading('加载中...');
      axios({
        url: apiUrl.autoPushList.url,
        type: apiUrl.autoPushList.type,
        params: params
      }).then(function(data) {
        comm.closeLoading();
        _this.tableData = data.data.responseObject.responseData.dataList;
        _this.paginationData.total = data.data.responseObject.responseData.totalCount;
      });
    },
    resetForm() {
      for (let key in this.searchConditionData) {
        this.searchConditionData[key] = '';
      }
    },
    // 查询
    onSubmit() {
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
    tableRowClassName({row, rowIndex}) {
      // 把每一行的索引放进row
      row.index = rowIndex + 1;
    },
    /*
    * 编辑推送
    * */
    editPush(row) {
      this.ifPopupWindow = true;
      this.editDialogData.rowData.id = row.id;
      this.editDialogData.rowData.pushTitle = row.pushTitle;
      this.editDialogData.rowData.pushMessageTemplate = row.pushMessageTemplate;
    },
    /*
    * 上架确认
    * */
    onSaleConfirm(row) {
      let _this = this;
      console.log(row);
      let content = '';
      // 状态（0-下架，1-上架）
      if (row.isValid === 0) {
        content = '上架后策略将执行，是否上架？';
      }
      else { // 售卖
        content = '下架后策略将不执行，是否下架？';
      }
      this.$allin_confirm({
        title: '提示',
        content: content,
        type: 'confirm',
        done: function() {
          let params = {
            id: row.id,
            isValid: row.isValid ? 0 : 1
          };
          axios({
            url: apiUrl.updatePushMessageState.url,
            method: apiUrl.updatePushMessageState.type,
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

<style scoped lang='scss'>
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

  .source-list-btn-down {
    width: 74px;
    height: 28px;
    padding: 0;
    border-radius: 3px;
    font-family: PingFangSC-Regular;
    font-size: 13px;
    letter-spacing: 0;
    background: #FFEBE3;
    border: 1px solid #FF7E4D;
    color: #FF7E4D;
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

.edit-dialog-area {
  .edit-dialog-title {
    width: 420px;
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

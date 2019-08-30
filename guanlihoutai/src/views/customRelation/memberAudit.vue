<template>
  <section class="main-container-audit">
    <AuditSearchArea
      @onSubmit="onSubmit"
      :isAdmin="isAdmin"
    ></AuditSearchArea>

    <section class="auditList">
      <h2>{{isAdmin?"全部审核列表":"待审核列表"}}（{{tableData.totalCount || 0}}）</h2>
      <el-table
        :data="tableData.dataList"
        style="width: 100%"
        @sort-change='tableChange'
        @row-dblclick="rowClick"
        :row-class-name="tableRowClassName"
      >
        <el-table-column
          prop="id"
          label="序号"
        >
        </el-table-column>
        <el-table-column
          prop="customerId"
          width="150"
          label="用户ID"
        >
        </el-table-column>
        <el-table-column
          prop="fullName"
          label="姓名"
        >
        </el-table-column>
        <el-table-column
          prop="company"
          width="160px"
          label="医院"
        >
        </el-table-column>
        <el-table-column
          prop="medicalTitleId"
          label="职称"
          width="120px"
          :formatter="medicalTitleIdFormatter"
        >
        </el-table-column>
        <el-table-column
          prop="createTime"
          label="提交时间"
          width="180"
          sortable="custom"
          :sort-orders="['ascending', 'descending']"
          :formatter="lastUpdateTimeFormatter"
        >
        </el-table-column>
        <el-table-column
          prop="mobile"
          label="手机号"
        >
        </el-table-column>
        <el-table-column
          prop="email"
          label="邮箱"
          width="180"
        >
        </el-table-column>
        <el-table-column
          prop="uniteIsValid"
          label="账号状态"
          :formatter="isValidFormatter"
        >
        </el-table-column>
        <el-table-column
          prop="auditType"
          label="提交类型"
          :formatter="auditTypeFormatter"
        >
        </el-table-column>

        <el-table-column
          prop="showState"
          label="认证状态"
          :formatter="showStateFormatter"
          v-if="isAdmin"
          width="180"
        >
        </el-table-column>
        <el-table-column
          prop="auditChangeState"
          label="变更状态"
          :formatter="auditChangeStateFormatter"
        >
        </el-table-column>
        <el-table-column
          prop="refuseReason"
          label="拒绝原因"
          width="120"
        >
        </el-table-column>
        <el-table-column
          prop="auditState"
          label="处理状态"
          width="100"
          v-if="isAdmin"
          :formatter="auditStateFormatter"
        >
        </el-table-column>
        <el-table-column
          prop="auditor"
          label="处理人"
          v-if="isAdmin"
        >
        </el-table-column>
        <el-table-column
          width="200"
          prop="auditTime"
          label="处理时间"
          sortable="custom"
          :sort-orders="['ascending', 'descending']"
          :formatter="auditTimeFormatter"
          v-if="isAdmin"
        >
        </el-table-column>
        <el-table-column
          prop="auditRemark"
          width="150"
          label="备注">
        </el-table-column>
      </el-table>
      <el-row class="auditPagination">
        <el-col :span="10" :offset="5">
          <AuditPagination
            :total="tableData.totalCount"
            :currentPage="currentPage"
            @sizeChange="sizeChange"
            @currentChange="currentChange"
            :pageSize = "pageSize"
            v-if="tableData.totalCount>pageSize"
          ></AuditPagination>  <!--totalCount小于pageSize时不不显示-->
        </el-col>
      </el-row>

    </section>
  </section>
</template>

<script>
import axios from '@/assets/js/utils/request.js';
import comm from '@/assets/js/utils/comm.js';
import AuditSearchArea from './components/AuditSearchArea';
import AuditPagination from './components/AuditPagination';

import {getPageOperation} from '@/assets/js/utils/auth';
import apiConfig from '@/api/apiUrlConfig';

export default {
  name: 'memberAudit',
  data() {
    return {
      tableData: [],
      isAdmin: false, // 具有管理员权限/对应处理人
      currentPage: 1, // 第几页
      pageSize: 10, // 每页几条
      params: {
        firstResult: 0,
        maxResult: 10,
        sortType: 1,
        roleType: '', // roleType:"OP721" 管理员 // roleType:"OP722" 处理人权限代码
        auditState: '' // 通过处理人筛选
      }
    };
  },
  computed: {},
  components: {
    AuditSearchArea,
    AuditPagination
  },
  methods: {
    getTableData() {
      comm.openLoading('加载中...');
      let ajaxParams = {};

      for (var key in this.params) {
        if (this.params[key].toString()) {
          ajaxParams[key] = this.params[key];
        }
      }
      ajaxParams.auditRoleList = 1;
      axios({
        method: apiConfig.memberAuditList.type,
        url: apiConfig.memberAuditList.url,
        params: ajaxParams
      }).then((response) => {
        if (response && response.data && response.data.responseObject && response.data.responseObject.responseData) {
          this.tableData = response.data.responseObject.responseData;
        }
        comm.closeLoading();
      });
    },
    onSubmit(options) {
      options.auditState && (this.params.auditState = options.auditState);
      if (!this.isAdmin) {
        options.auditState = 1;
      };
      // 要将排序,开始索引,结束索引,每页包含数恢复初始值
      this.params = Object.assign({
        firstResult: 0,
        maxResult: 10,
        sortType: 1,
        roleType: this.params.roleType // roleType:"OP721" 管理员 // roleType:"OP722" 处理人权限代码
      }, options);

      this.pageSize = 10;
      this.currentPage = 1;

      this.getTableData();
    },
    sizeChange(val) {
      this.pageSize = val;
      this.params.maxResult = val;

      this.getTableData();
    },
    currentChange(val) {
      this.currentPage = +val;
      this.params.firstResult = (+val - 1) * this.pageSize;

      this.getTableData();
    },
    showStateFormatter(row, column, cellValue) {
      let value = parseInt(row.showState),
        valueDesc = '',
        roleTitle = '',
        roleId = row.roleId;
        // 展示认证状态（ 0-(其他状态)、1-(v1通过)、2-(v1拒绝)、3-(v2通过)、4-(v2拒绝)、5-v1待审核）
      switch (value) {
        case 0:
          valueDesc = '';
          break;
        case 1:
          valueDesc = 'v1通过';
          break;
        case 2:
          valueDesc = 'v1拒绝';
          break;
        case 3:
          valueDesc = 'v2通过';
          break;
        case 4:
          valueDesc = 'v2拒绝';
          break;
        case 5:
          valueDesc = 'v1待审核';
          break;
        default:
          valueDesc = '';
          break;
      }

      switch (roleId) {
        case '':
          roleTitle = '';
          break;
        case '5':
        case '6':
        case '11':
          roleTitle = '医生';
          break;
        case '12':
          roleTitle = '护士';
          break;
        case '7':
          roleTitle = '医学生';
          break;
        case '13':
          roleTitle = '医助';
          break;
        default:
          roleTitle = '';
          break;
      }
      return roleTitle + valueDesc;
    },
    auditChangeStateFormatter(row, column, cellValue) {
      var valueDesc = '';

      // 审核类型(1-首次提交2-变更提交3-补全信息4-重新提交)
      if (parseInt(row.auditType) === 2) {
        // 变更状态（1-未处理2-变更通过3-变更拒绝）
        switch (parseInt(cellValue)) {
          case 0:
            valueDesc = '';
            break;
          case 1:
            valueDesc = '未处理';
            break;
          case 2:
            valueDesc = '变更通过';
            break;
          case 3:
            valueDesc = '变更拒绝';
            break;
          default:
            valueDesc = '';
            break;
        }
      }
      else {
        valueDesc = '';
      }

      return valueDesc;
    },
    medicalTitleIdFormatter(row, column, cellValue) {
      // 职称id(1-住院医师、2-主治医师、3-副主任医师、4-主任医师、5-讲师、6-副教授、7-教授、8-硕士生导师、9-博士生导师、10-医学生、11-护士、12-护师、13-其它)
      var value = parseInt(row.medicalTitleId);
      var valueDesc = '';
      switch (value) {
        case 1:
          valueDesc = '住院医师';
          break;
        case 2:
          valueDesc = '主治医师';
          break;
        case 3:
          valueDesc = '副主任医师';
          break;
        case 4:
          valueDesc = '主任医师';
          break;
        case 5:
          valueDesc = '讲师';
          break;
        case 6:
          valueDesc = '副教授';
          break;
        case 7:
          valueDesc = '教授';
          break;
        case 8:
          valueDesc = '硕士生导师';
          break;
        case 9:
          valueDesc = '博士生导师';
          break;
        case 10:
          valueDesc = '医学生';
          break;
        case 11:
          valueDesc = '护士';
          break;
        case 12:
          valueDesc = '护师';
          break;
        case 13:
          valueDesc = '主管护师';
          break;
        case 14:
          valueDesc = '副主任护师';
          break;
        case 15:
          valueDesc = '主任护师';
          break;
        case 16:
          valueDesc = '医助';
          break;
        case 17:
          valueDesc = '其它';
          break;
        default:
          valueDesc = '';
          break;
      }
      return valueDesc;
    },
    auditStateFormatter(row, column, cellValue) {
      // 处理状态（1-未处理2-已处理 ）
      var value = parseInt(row.auditState);
      var valueDesc = '';
      switch (value) {
        case 1:
          valueDesc = '未处理';
          break;
        case 2:
          valueDesc = '已处理';
          break;
        default:
          valueDesc = '';
          break;
      }
      return valueDesc;
    },
    isValidFormatter(row, column, cellValue) {
      var value = parseInt(row.uniteIsValid);
      // 1 有效
      var valueDesc = '';
      switch (value) {
        case 1:
          valueDesc = '有效';
          break;
        default:
          valueDesc = '无效';
          break;
      }
      return valueDesc;
    },
    lastUpdateTimeFormatter(row, column, cellValue) {
      if (row.createTime.length) {
        return row.createTime.substring(0, row.createTime.length - 2);
      }
    },
    auditTimeFormatter(row, column, cellValue) {
      if (row.auditTime.length) {
        return row.auditTime.substring(0, row.auditTime.length - 2);
      }
    },
    auditTypeFormatter(row, column, cellValue) {
      // 审核类型(1-首次提交2-变更提交3-补全信息4-重新提交)
      var value = parseInt(row.auditType);
      var valueDesc = '';
      switch (value) {
        case 1:
          valueDesc = '首次提交';
          break;
        case 2:
          valueDesc = '变更提交';
          break;
        case 3:
          valueDesc = '补全信息';
          break;
        case 4:
          valueDesc = '重新提交';
          break;
        default:
          valueDesc = '';
          break;
      }
      return valueDesc;
    },
    // 排序
    tableChange(column, prop, order) {
      this.currentPage = 1; // 回退到第一页
      if (column.prop === 'createTime') {
        this.params.sortType = column.order === 'ascending' ? 2 : 1;
      }
      else if (column.prop === 'auditTime') {
        this.params.sortType = column.order === 'ascending' ? 4 : 3;
      }

      this.getTableData();
    },
    tableRowClassName({row, rowIndex}) {
      // 把每一行的索引放进row
      row.index = rowIndex;
    },
    rowClick(row, column, cell, event) {
      if (parseInt(row.uniteIsValid) !== 0) {
        // 存储状态
        localStorage.setItem('memberAuditIndex', parseInt(row.index));
        if (this.params && this.params.auditState) {
          localStorage.setItem('auditState', this.params.auditState);// 区分全部列表还是审核列表
        }
        localStorage.setItem('memberAuditCurrentData', JSON.stringify({
          auditType: row.auditType,
          customerId: row.customerId,
          showState: row.showState,
          resourceId: row.resourceId, // 变更id
          auditId: row.id, // 审核主键id用于信息变更
          params: this.params
        }));

        localStorage.setItem('memberAuditIndexObject', JSON.stringify({
          currentPage: this.currentPage, // 第几页
          pageSize: this.pageSize, /// 每页条数
          firstResult: this.params.firstResult,
          maxResult: this.params.maxResult,
          sortType: this.params.sortType
        }));

        if (parseInt(row.auditType) === 2) {
          this.$router.push({
            path: '/memberAuditChangeDetail'
          });
        }
        else {
          this.$router.push({
            path: '/memberAuditDetail'
          });
        }
      }
      else {
        this.$message.info('此数据无效');
      }
    }
  },
  beforeMount() {
    // roleType:"OP721" 管理员
    // roleType:"OP722" 处理人权限代码
    let pageOperation = getPageOperation(this.$route.path);
    this.params.roleType = 'OP' + pageOperation;
    this.params.auditState = pageOperation !== 721 ? 1 : '';
    this.isAdmin = pageOperation === 721;
  },
  mounted() {
    localStorage.removeItem('auditState');// 区分全部列表还是审核列表 做一次数据清空
    if (localStorage.getItem('memberAuditIndexObject')) {
      let memberAuditIndexObject = JSON.parse(localStorage.getItem('memberAuditIndexObject'));
      this.currentPage = +memberAuditIndexObject.currentPage;
      this.pageSize = +memberAuditIndexObject.pageSize;
      this.params.firstResult = +memberAuditIndexObject.firstResult;
      this.params.maxResult = +memberAuditIndexObject.maxResult;
      this.params.sortType = memberAuditIndexObject.sortType;
    }
    this.getTableData();
  }
};
</script>

<style lang="scss">
  .el-table th.is-leaf {
    font-weight: bold;
  }

  .main-container-audit {
    width: 1200px;
    margin: 20px auto 0;
    background: #F6F7FA;
    .auditList {
      h2 {
        font-family: PingFangSC-Semibold;
        font-size: 20px;
        color: #2C343A;
        letter-spacing: 0;
        line-height: 20px;
        margin-bottom: 25px;
      }

      .el-table .cell {
        font-family: PingFangSC-Regular;
        font-size: 14px;
        color: #333333;
        letter-spacing: 0;
        text-align: center;
      }
      .auditPagination {
        padding: 30px 0;
      }
      .el-table__empty-block {
        color: #555555;
        font-size: 16px;
      }
    }
  }

</style>

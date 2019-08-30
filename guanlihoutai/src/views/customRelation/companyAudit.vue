<template>
  <section class="main-container-company">
    <CompanySearchArea @onSubmit="onSubmit" :isAdmin="isAdmin"></CompanySearchArea>
    <section class="companyList">
      <h2>{{isAdmin?"全部审核列表":"待审核列表"}}（{{tableData.totalCount || 0}}）</h2>
      <el-table
        :data="tableData.dataList"
        style="width: 100%"
        @sort-change="tableChange"
        @row-dblclick="rowClick"
        :row-class-name="tableRowClassName"
      >
        <el-table-column prop="id" label="序号"></el-table-column>
        <el-table-column prop="customerId" width="150" label="用户ID"></el-table-column>
        <el-table-column prop="fullName" label="姓名"></el-table-column>
        <el-table-column prop="company" width="160px" label="企业"></el-table-column>
        <el-table-column prop="brandName" label="服务品牌" width="120px"></el-table-column>
        <el-table-column
          prop="type"
          label="类别"
          width="120px"
          :formatter="medicalTitleIdFormatter"
        ></el-table-column>
        <el-table-column
          prop="createTime"
          label="提交时间"
          width="180"
          sortable="custom"
          :sort-orders="['ascending', 'descending']"
          :formatter="lastUpdateTimeFormatter"
        ></el-table-column>
        <el-table-column width="140px" prop="mobile" label="手机号"></el-table-column>
        <el-table-column prop="email" label="邮箱" width="180"></el-table-column>
        <el-table-column prop="uniteIsValid" label="账号状态" :formatter="isValidFormatter"></el-table-column>
        <el-table-column prop="auditType" label="提交类型" :formatter="auditTypeFormatter"></el-table-column>
        <el-table-column
          prop="showState"
          label="认证状态"
          :formatter="showStateFormatter"
          v-if="isAdmin"
          width="130"
        ></el-table-column>
        <el-table-column
          v-if="isAdmin"
          prop="auditChangeState"
          label="变更状态"
          :formatter="auditChangeStateFormatter"
        ></el-table-column>
        <el-table-column v-if="isAdmin" prop="refuseReason" label="拒绝原因" width="120"></el-table-column>
        <el-table-column
          prop="auditState"
          label="处理状态"
          width="100"
          v-if="isAdmin"
          :formatter="auditStateFormatter"
        ></el-table-column>
        <el-table-column prop="auditor" label="处理人" v-if="isAdmin"></el-table-column>
        <el-table-column
          width="200"
          prop="auditTime"
          label="处理时间"
          sortable="custom"
          :sort-orders="['ascending', 'descending']"
          :formatter="auditTimeFormatter"
          v-if="isAdmin"
        ></el-table-column>
        <el-table-column prop="auditRemark" width="150" label="备注"></el-table-column>
      </el-table>
      <el-row class="auditPagination">
        <el-col :span="10" :offset="5">
          <AuditPagination
            :total="tableData.totalCount"
            :currentPage="currentPage"
            @sizeChange="sizeChange"
            @currentChange="currentChange"
            :pageSize="pageSize"
            v-if="tableData.totalCount>pageSize"
          ></AuditPagination>
          <!--totalCount小于pageSize时不不显示-->
        </el-col>
      </el-row>
    </section>
  </section>
</template>

<script>
/**
 * 功能描述：本页面主要是对厂商审核管理页面
 * 页面分为两个大块，根据个人身份分为全部审核列表和待审核列表
 * 功能上：分为条件搜索和列表展示连部分，上面搜索下面会进行列
 * 表展示，分页，列表每一条双击会跳转到新的详情页面，四种状态
 * 只有在变更提交时会跳转到/companyAuditChangeDetail页面，其
 * 它类型跳转都会跳到/companyAuditDetail页面。
 */
import axios from '@/assets/js/utils/request.js'; // axios向后台请求
import comm from '@/assets/js/utils/comm.js'; // 进行loading开始和结束操作

import CompanySearchArea from './components/CompanyAudit/CompanySearchArea'; // 调用查询组件
import AuditPagination from './components/AuditPagination'; // 调用分页组件

import { getPageOperation } from '@/assets/js/utils/auth'; // 获取权限编码组件
import apiConfig from '@/api/apiUrlConfig'; // 接口连接

export default {
  name: 'companyAudit',
  data() {
    return {
      tableData: [],
      isAdmin: false, // 具有管理员权限/对应处理人
      currentPage: 1, // 第几页
      pageSize: 10, // 每页几条
      params: { // 初始化fetch列表数据默认传参
        firstResult: 0,
        maxResult: 10,
        sortType: 1,
        roleType: '', // roleType:"OP721" 管理员  roleType:"OP722" 处理人权限代码
        auditState: '', // 通过处理人筛选
        auditRoleList: '0,3,2' // 这是厂家类型字段，默认0->所有类型，1->厂商，2->经销商
      },
      hideMedId: false // 用来隐藏存放medId标识
    };
  },
  computed: {},
  components: {
    CompanySearchArea,
    AuditPagination
  },
  beforeMount() {
    // roleType:"OP721" 管理员
    // roleType:"OP722" 处理人权限代码
    let pageOperation = getPageOperation(this.$route.path);
    this.params.roleType = 'OP' + pageOperation;
    this.params.auditState = pageOperation !== 721 ? 1 : '';
    this.isAdmin = pageOperation === 721;
    // this.isAdmin = false; //测试代码
  },
  mounted() {
    localStorage.removeItem('companyState'); // 区分全部列表还是审核列表 做一次数据清空
    if (localStorage.getItem('companyAuditIndexObject')) {
      let memberAuditIndexObject = JSON.parse(
        localStorage.getItem('companyAuditIndexObject')
      );
      this.currentPage = memberAuditIndexObject.currentPage;
      this.pageSize = memberAuditIndexObject.pageSize;
      this.params.firstResult = memberAuditIndexObject.firstResult;
      this.params.maxResult = memberAuditIndexObject.maxResult;
      this.params.sortType = memberAuditIndexObject.sortType;
    }
    this.getTableData();
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

      axios({
        method: apiConfig.companyAuditList.type,
        url: apiConfig.companyAuditList.url,
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
      }
      // 要将排序,开始索引,结束索引,每页包含数恢复初始值
      this.params = Object.assign(
        {
          firstResult: 0,
          maxResult: 10,
          sortType: 1,
          roleType: this.params.roleType, // roleType:"OP721" 管理员 // roleType:"OP722" 处理人权限代码
          auditRoleList: '0,3,2'
        },
        options
      );

      this.pageSize = 10;
      this.currentPage = 1;

      this.getTableData();
    },
    sizeChange(val) {
      // 分页大小变换
      this.pageSize = val;
      this.params.maxResult = val;

      this.getTableData();
    },
    currentChange(val) {
      // 当前页变化
      this.currentPage = val;
      this.params.firstResult = (val - 1) * this.pageSize;

      this.getTableData();
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
    tableRowClassName({ row, rowIndex }) {
      // 把每一行的索引放进row
      row.index = rowIndex;
    },
    rowClick(row, column, cell, event) {
      if (parseInt(row.uniteIsValid) !== 0) {
        // 存储状态
        localStorage.setItem('companyAuditIndex', parseInt(row.index));
        if (this.params && this.params.auditState) {
          localStorage.setItem('companyState', this.params.auditState); // 区分全部列表还是审核列表   -这里有个坑，得改名-
        }
        localStorage.setItem(
          'companyAuditCurrentData',
          JSON.stringify({
            auditType: row.auditType,
            customerId: row.customerId,
            showState: row.showState,
            resourceId: row.resourceId, // 变更id
            auditId: row.id, // 审核主键id用于信息变更
            params: this.params,
            medId: row.medId // 新加的medId
          })
        );

        localStorage.setItem(
          'companyAuditIndexObject',
          JSON.stringify({
            currentPage: this.currentPage, // 第几页
            pageSize: this.pageSize, /// 每页条数
            firstResult: this.params.firstResult,
            maxResult: this.params.maxResult,
            sortType: this.params.sortType
          })
        );

        if (parseInt(row.auditType) === 2) {
          this.$router.push({
            path: '/companyAuditChangeDetail'
          });
        }
        else {
          this.$router.push({
            path: '/companyAuditDetail'
          });
        }
      }
      else {
        this.$message.info('此数据无效');
      }
    },
    showStateFormatter(row, column, cellValue) {
      let value = parseInt(row.showState),
        valueDesc = '';
      // 展示认证状态（ 1-(v1通过)、2-(v1拒绝)）
      switch (value) {
        case 5:
          valueDesc = '审核中';
          break;
        case 1:
          valueDesc = 'v1通过';
          break;
        case 2:
          valueDesc = 'v1拒绝';
          break;
        default:
          valueDesc = '';
          break;
      }

      return valueDesc;
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
      var value = parseInt(row.type);
      var valueDesc = '';
      switch (value) { // 类型有厂商和经销商两类，如果不知道类型就不填 2是厂商，3是经销商
        case 2:
          valueDesc = '厂商';
          break;
        case 3:
          valueDesc = '经销商';
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
        case 0:
          valueDesc = '无效';
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
    }
  }
};
</script>

<style lang="scss" scoped>
.el-table th.is-leaf {
  font-weight: bold;
}

.main-container-company {
  width: 1200px;
  margin: 20px auto 0;
  background: #f6f7fa;
  .companyList {
    h2 {
      font-family: PingFangSC-Semibold;
      font-size: 20px;
      color: #2c343a;
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

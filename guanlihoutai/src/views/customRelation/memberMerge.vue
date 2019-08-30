<template>
  <section class="main-memberMerge-container">
    <MergeSearchArea
      @onSubmit="onSubmit"
      :isAdmin="isAdmin"
    ></MergeSearchArea>
    <section class="auditList">
      <h2>{{isAdmin?"全部合并列表":"待合并列表"}}（{{tableData.totalCount || 0}}）</h2>
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
          prop="mainCustomerId"
          width="150"
          label="用户ID"
        >
        </el-table-column>
        <el-table-column
          prop="fullName"
          width="120"
          label="姓名"
        >
        </el-table-column>
        <el-table-column
          prop="company"
          width="180px"
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
        >
        </el-table-column>
        <el-table-column
          prop="mobile"
          label="手机号"
          width="120"
        >
        </el-table-column>
        <el-table-column
          prop="email"
          label="邮箱"
          width="170"
        >
        </el-table-column>

        <el-table-column
          prop="uniteIsValid"
          label="账号状态"
          width="120"
          :formatter="isValidFormatter"
        >
        </el-table-column>
        <!--根据枚举值返回不同状态-->
        <el-table-column
          prop="mergeState"
          label="合并状态"
          width="120"
          v-if="isAdmin"
          :formatter="mergeStateFormatter"
        >
        </el-table-column>
        <el-table-column
          prop="mergeType"
          label="合并类型"

          :formatter="mergeTypeFormatter"
        >
        </el-table-column>

        <el-table-column
          prop="opUser"
          label="处理人"
          width="150"
          v-if="isAdmin"
        >
        </el-table-column>
        <el-table-column
          width="200"
          prop="dealTime"
          label="处理时间"
          sortable="custom"
          :sort-orders="['ascending', 'descending']"
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
            v-if="tableData.totalCount>pageSize"
          ></AuditPagination>  <!--totalCount小于pageSize时不不显示-->
        </el-col>
      </el-row>
    </section>
  </section>
</template>
<script>
import axios from '@/assets/js/utils/request';

import AuditPagination from './components/AuditPagination';
import MergeSearchArea from './components/MergeSearchArea';

import {getPageOperation} from '@/assets/js/utils/auth';
import apiConfig from '@/api/apiUrlConfig';

export default {
  name: 'memberMerge',
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
        roleType: '' // roleType:"OP721" 管理员 // roleType:"OP722" 处理人权限代码
      }
    };
  },
  computed: {
  },
  components: {
    MergeSearchArea,
    AuditPagination
  },
  methods: {
    getTableData() {
      if (!this.params.roleType) throw new Error('权限字段缺失');
      if (this.params.roleType === 'OP722') {
        this.params.mergeState = 1;
      }
      axios({
        method: apiConfig.getMergeAccountList.type,
        url: apiConfig.getMergeAccountList.url,
        params: this.params
      }).then((response) => {
        this.tableData = response.data.responseObject.responseData;
      });
    },
    onSubmit(options) {
      console.log('查询表单options=========');
      console.log(options);

      // 要将排序,开始索引,结束索引,每页包含数恢复初始值
      this.params = Object.assign({
        firstResult: 0,
        maxResult: 10,
        sortType: 1,
        roleType: this.params.roleType, // roleType:"OP721" 管理员 // roleType:"OP722" 处理人权限代码
        auditState: this.params.auditState // 通过处理人筛选
      }, options);
      this.pageSize = 10;
      this.currentPage = 1;
      this.setQueryParamsInLocalStorage(this.params);
      this.getTableData();
    },
    sizeChange(val) {
      console.log('mergeTable sizechange');
      this.pageSize = val;
      this.params.maxResult = val;
      this.setQueryParamsInLocalStorage(this.params);
      this.getTableData();
    },
    currentChange(val) {
      this.currentPage = val;
      console.log('auditTalbe currentChange', val);
      this.params.firstResult = (val - 1) * this.pageSize;
      console.log(this.pageSize);
      this.getTableData();
    },
    tableRowClassName({row, rowIndex}) {
      // 把每一行的索引放进row
      row.index = rowIndex;
    },
    setQueryParamsInLocalStorage(params) {
      localStorage.setItem('mergeListQueryParams', JSON.stringify(params));
    },
    mergeStateFormatter(row, column) {
      let value = parseInt(row.mergeState);
      let valueDesc = '';
      // 合并状态(1-待合并2-已合并3-v1通过4-v1拒绝5-v2通过6-v2拒绝)
      switch (value) {
        case 1:
          valueDesc = '待合并';
          break;
        case 2:
          valueDesc = '已合并';
          break;
        case 3:
          valueDesc = 'v1通过';
          break;
        case 4:
          valueDesc = 'v1拒绝';
          break;
        case 5:
          valueDesc = 'v2通过';
          break;
        case 6:
          valueDesc = 'v2拒绝';
          break;
        default:
          valueDesc = '';
          break;
      }
      return valueDesc;
    },
    medicalTitleIdFormatter(row, column, cellValue, index) {
      // 职称id(1-住院医师、2-主治医师、3-副主任医师、4-主任医师、5-讲师、6-副教授、7-教授、8-硕士生导师、9-博士生导师、10-医学生、11-护士、12-主任医师、13-其它)
      let value = parseInt(row.medicalTitleId);
      let valueDesc = '';
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
          //          case 5:
          //            valueDesc = "讲师";
          //            break;
          //          case 6:
          //            valueDesc = "副教授";
          //            break;
          //          case 7:
          //            valueDesc = "教授";
          //            break;
          //          case 8:
          //            valueDesc = "硕士生导师";
          //            break;
          //          case 9:
          //            valueDesc = "博士生导师";
          //            break;
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
        default:
          valueDesc = '';
          break;
      }
      return valueDesc;
    },
    isValidFormatter(row, column, cellValue, index) {
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
    mergeTypeFormatter(row, column, cellValue, index) {
      console.log(row);
      // 合并类型(1-用户发起2-运营发起)
      let value = parseInt(row.mergeType);
      let valueDesc = '';
      switch (value) {
        case 1:
          valueDesc = '用户发起';
          break;
        case 2:
          valueDesc = '运营发起';
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
        this.getTableData();
      }
      else if (column.prop === 'dealTime') {
        this.params.sortType = column.order === 'ascending' ? 4 : 3;
        this.getTableData();
      }
      this.setQueryParamsInLocalStorage(this.params);
    },
    rowClick(row, column, cell, event) {
      let t = this;
      if (this.isAdmin && row.mergeState === 2) { // 管理员， 已合并，不能进入
        t.$message.info('该记录已合并！');
        return;
      }
      this.$store.commit('setCurrentMergeRow', row);
      localStorage.setItem('mergeListFirstResult', this.params.firstResult);
      localStorage.setItem('currentPage', this.currentPage);
      localStorage.setItem('mergeListMaxResult', this.params.maxResult);
      localStorage.setItem('mergeListEditingIndex', row.index);
      localStorage.setItem('mergeListQueryParams', JSON.stringify(this.params));
      console.log(this.$store.state.currentMergeRow);
      this.$router.push({
        path: '/memberMergeDetail'
      });
    }
  },
  beforeCreate() {
  },
  created() {
  },
  beforeMount() {
    let pageOperation = getPageOperation(this.$route.path);
    this.params.roleType = 'OP' + pageOperation;
    // roleType:"OP721" 管理员
    // roleType:"OP722" 处理人权限代码
    this.isAdmin = pageOperation === 721;
    // 审核状态(未审核列表传-1、全部列表不传该字段)
    // 非管理员获取未审核列表
    // auditState 不能传空
    !this.isAdmin && (this.auditState = 1);

    console.log('权限代码', this.params.roleType, '是否管理员', this.isAdmin, '获取aduitState', this.auditState);
  },
  mounted() {
    console.log('开始拉取数据!');
    if (localStorage.getItem('mergeListFirstResult')) {
      this.currentPage = parseInt(localStorage.getItem('currentPage'));
      this.params.firstResult = parseInt(localStorage.getItem('mergeListFirstResult'));
      this.params.maxResult = parseInt(localStorage.getItem('mergeListMaxResult'));
      localStorage.removeItem('mergeListFirstResult');
      localStorage.removeItem('mergeListMaxResult');
    }
    if (sessionStorage.getItem('mergeListFormData')) {
      this.onSubmit(JSON.parse(sessionStorage.getItem('mergeListFormData')));
    }
    else {
      this.getTableData();
    }
  },
  beforeUpdate() {

  },
  updated() {

  },
  beforeDestroy() {

  }

};
</script>

<style lang="scss">

  .main-memberMerge-container {
    width: 1200px;
    margin: 0 auto;
    background: #F6F7FA;
    margin-top: 20px;
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
        line-height: 1.5;
        text-align: center;
      }
      .auditPagination {
        padding: 30px 0;
      }
    }
  }

</style>

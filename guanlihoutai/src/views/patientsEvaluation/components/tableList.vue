<template>
  <section class="crm-patientsEvaluation-table">
    <el-table
      :data="dataList"
      width="100%"
      class="ev-table"
      @sort-change="sortTableTypeChange"
      @selection-change="handleSelectionChange"
      :default-sort = "{prop: 'createTime', order: 'descending'}"
      ref="sortReset"
    >
      <el-table-column
        type="selection"
        v-if="batchOnOff"
        width="55">
      </el-table-column>
      <el-table-column
        prop="id"
        :formatter="formatteId"
        label="编号"
        sortable="custom"
        :sort-orders="['descending','ascending']"
      >
      </el-table-column>
      <el-table-column
        prop="patientCustomerId"
        label="用户ID"
      >
      </el-table-column>
      <el-table-column
        prop="patientName"
        label="就诊人"
      >
      </el-table-column>
      <el-table-column
        prop="doctorId"
        label="医生ID"
      >
      </el-table-column>
      <el-table-column
        prop="doctorName"
        label="医生姓名"
      >
      </el-table-column>
      <el-table-column
        prop="createTime"
        label="评价时间"
        sortable="custom"
        :sort-orders="['descending','ascending']"
      >
      </el-table-column>
      <el-table-column
        prop="status"
        label="审核状态"
        :formatter="formatteStaus"
        sortable="custom"
        :sort-orders="['descending','ascending']"
      >
      </el-table-column>
      <el-table-column
        label="评分"
        width="60">
        <template slot-scope="scope">
          <el-popover trigger="hover" placement="left">
            <EvaluatePanel
              :score="formatteService(scope.row.serviceStar)"
              :tag="scope.row.tag"
              :thoughts="scope.row.thoughts"></EvaluatePanel>
            <div slot="reference" class="name-wrapper">
              {{ formatteService(scope.row.serviceStar) }}
            </div>
          </el-popover>
        </template>
      </el-table-column>
      <el-table-column
        label="操作"
        width="200"
      >
        <template slot-scope="scope" fixed="right">
          <div class="shield" v-if="parseInt(scope.row.status)===2"><!--已屏蔽的状态下-->
              <div class="crm-patientsEvaluation-pass" @click.stop="changeOneselfAudit({auditData:scope.row,auditType:1})">修改为通过</div>
              <div class="crm-patientsEvaluation-normal">已屏蔽</div>
          </div>
          <div class="pass" v-if="parseInt(scope.row.status)===1"><!--已通过的状态下-->
              <div class="crm-patientsEvaluation-normal">已通过</div>
              <div class="crm-patientsEvaluation-shield" @click.stop="changeOneselfAudit({auditData:scope.row,auditType:2})">修改为屏蔽</div>
          </div>
          <div class="normal" v-if="parseInt(scope.row.status)===0"><!--新提交的状态下-->
              <div class="crm-patientsEvaluation-pass" @click.stop="changeOneselfAudit({auditData:scope.row,auditType:1})">通过</div>
              <div class="crm-patientsEvaluation-shield" @click.stop="changeOneselfAudit({auditData:scope.row,auditType:2})">屏蔽</div>
          </div>
        </template>
      </el-table-column>
    </el-table>
  </section>
</template>
<script>
import EvaluatePanel from './evaluatePanel';
import axios from 'axios';//
import comm from '@/assets/js/utils/comm';
import { createNamespacedHelpers } from 'vuex';
const { mapGetters, mapActions } = createNamespacedHelpers('PatientsEvaluation');
const xhrPath = '/mcall/tocure/patient/score/update/';
export default {
  components: {
    EvaluatePanel
  },
  computed: {
    ...mapGetters(['batchOnOff', 'dataList', 'selectOnOff', 'auditType', 'batchAuditOnOff', 'auditData', 'pageIndex', 'pageSize', 'auditDataLen'])
  },
  watch: {
    auditType(n) {
      let _this = this;
      let auditOnOff = parseInt(n, 10) !== -1;// 确定是要修改
      if (auditOnOff) {
        if (_this.batchAuditOnOff) {
          // 批量修改
          if (_this.selectOnOff) {
            let tipsWord = `确认${parseInt(n, 10) === 1 ? '通过' : '屏蔽'}该${_this.auditDataLen}条数据    `;
            _this.$allin_confirm({
              content: tipsWord,
              type: 'confirm',
              done: () => {
                _this.postAuditEdit();// 提交审核编辑
              },
              cancel: () => {
                _this.resetAuditType();// 重置审核类型
              }
            });
          }
          else {
            _this.$message.error(`请选择您要${parseInt(n, 10) === 1 ? '通过' : '屏蔽'}的数据`);
            _this.resetAuditType();// 重置审核类型
          }
        }
        else {
          // 单独修改
          _this.postAuditEdit();// 提交审核编辑
        }
      }
    }
  },
  methods: {
    ...mapActions(['changeOneselfAudit', 'changeBatchAudit', 'changeSelectOnOff', 'resetAudit', 'changeTriggerGetList', 'resetAuditType', 'changeSortType']),
    handleSelectionChange(val) {
      let _this = this;
      _this.changeBatchAudit({
        auditData: val
      });
      _this.changeSelectOnOff((val.length > 0));
    },
    sortTableTypeChange(column) {
      let _this = this;
      let _or = column.order;
      let sortId = 3;
      // 默认传1-修改时间降序2-修改时间升序3主键降序4主键升序5问题数降序6问题数升序7答案数降序8答案数升序
      switch (column.prop) {
        case 'id':// 锦囊排序
          sortId = (_or === 'descending') ? '1' : '2';// 降序，反之升序
          break;
        case 'createTime':// 问题总数排序
          sortId = (_or === 'descending') ? '3' : '4';// 降序，反之升序
          break;
        case 'status':// 答案排序
          sortId = (_or === 'descending') ? '5' : '6';// 降序，反之升序
          break;
      }
      _this.changeSortType(sortId);
    },
    postAuditEdit() { // 提交审核编辑
      let _this = this;
      console.log(_this.auditData);
      axios({
        method: 'POST',
        url: xhrPath,
        params: {paramJson: JSON.stringify(_this.auditData)}
      }).then((res) => {
        if (res && res.data && res.data.responseObject && res.data.responseObject.responseStatus) {
          // 数据修改成功
          _this.resetAudit();// 初始化页面数据
          _this.changeTriggerGetList();// 重新获取列表
        }
        else {
          // 数据修改失败

        }
      }).catch((e) => {
        console.log('获取数据失败：', e);
      });
    },
    formatteService(score) {
      return comm.checkInvalid(score) ? 0 : parseInt(score);
    },
    formatteId(row) {
      return (parseInt(row.id));
    },
    formatteStaus(row) {
      let resultStr = '';
      switch (parseInt(row.status)) {
        case 0:
          resultStr = '待审核';
          break;
        case 1:
          resultStr = '已通过';
          break;
        case 2:
          resultStr = '已屏蔽';
          break;
      }
      return resultStr;
    }
  }
};
</script>

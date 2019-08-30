<template>
  <section class="crm-patientsEvaluation-handle">
    <el-form ref="form" :model="handleForm" label-width="100px">
      <el-form-item label="用户ID">
        <el-input v-model="handleForm.patientCustomerId" placeholder="请输入用户ID"></el-input>
      </el-form-item>
      <el-form-item label="就诊人姓名">
        <el-input v-model="handleForm.patientName" placeholder="请输入就诊人姓名"></el-input>
      </el-form-item>
      <el-form-item label="医生ID">
        <el-input v-model="handleForm.doctorId" placeholder="请输入被评价医生ID"></el-input>
      </el-form-item>
      <el-form-item label="医生姓名">
        <el-input v-model="handleForm.doctorName" placeholder="请输入医生姓名"></el-input>
      </el-form-item>
      <el-form-item label="评价时间">
      <el-date-picker
        v-model="handleForm.evaluationTime"
        type="daterange"
        range-separator="至"
        start-placeholder="开始日期"
        end-placeholder="结束日期">
      </el-date-picker>
      </el-form-item>
      <el-form-item label="审核状态">
          <el-select v-model="handleForm.status" placeholder="审核状态">
            <el-option label="全部" value="3"></el-option>
            <el-option label="待审核" value="0"></el-option>
            <el-option label="已通过" value="1"></el-option>
            <el-option label="已屏蔽" value="2"></el-option>
          </el-select>
      </el-form-item>
    </el-form>
    <section class="crm-patientsEvaluation-control">
      <div class="crm-reset-table" @click.stop="resetForm">重置</div>
      <div class="crm-filtrate-table" @click.stop="getList">筛选</div>
    </section>
  </section>
</template>
<script>
import comm from '@/assets/js/utils/comm.js';
import { createNamespacedHelpers } from 'vuex';
const { mapActions } = createNamespacedHelpers('PatientsEvaluation');
export default {
  data() {
    return {
      handleForm: {
        patientCustomerId: '',
        patientName: '',
        doctorId: '',
        doctorName: '',
        status: '',
        evaluationTime: ''
      }
    };
  },
  methods: {
    ...mapActions(['saveGetListForm', 'changeTriggerGetList', 'changePageIndex', 'changePageSize']),
    resetForm() {
      let _this = this;
      _this.handleForm = {
        patientCustomerId: '',
        patientName: '',
        doctorId: '',
        doctorName: '',
        status: '',
        evaluationTime: ''
      };
      _this.saveGetListForm({});
    },
    getList() { // 点击搜索列表数据
      let _this = this;
      let resultJson = {};
      let createTime = (dateObj, type) => {
        let timeStr = '';
        let addZero = (str) => {
          if (parseInt(str, 10) < 10) {
            return '0' + parseInt(str, 10);
          }
          else {
            return parseInt(str, 10);
          }
        };

        type === 0 ? timeStr = dateObj.getFullYear() + '-' + addZero(dateObj.getMonth() + 1) + '-' + addZero(dateObj.getDate()) + ' ' + addZero(dateObj.getHours()) + ':' + addZero(dateObj.getMinutes()) + ':' + addZero(dateObj.getSeconds()) : timeStr = dateObj.getFullYear() + '-' + addZero(dateObj.getMonth() + 1) + '-' + addZero(dateObj.getDate()) + ' ' + 23 + ':' + 59 + ':' + 59;
        return timeStr;
      };
      if (!comm.checkInvalid(_this.handleForm.evaluationTime)) {
        resultJson.startTime = createTime(_this.handleForm.evaluationTime[0], 0);
        resultJson.endTime = createTime(_this.handleForm.evaluationTime[1], 1);
      }
      if (!comm.checkInvalid(_this.handleForm.patientCustomerId)) {
        resultJson.patientCustomerId = _this.handleForm.patientCustomerId;
      }
      if (!comm.checkInvalid(_this.handleForm.patientName)) {
        resultJson.patientName = _this.handleForm.patientName;
      }
      if (!comm.checkInvalid(_this.handleForm.doctorId)) {
        resultJson.doctorId = _this.handleForm.doctorId;
      }
      if (!comm.checkInvalid(_this.handleForm.doctorName)) {
        resultJson.doctorName = _this.handleForm.doctorName;
      }
      if (!comm.checkInvalid(_this.handleForm.status)) {
        resultJson.status = _this.handleForm.status;
      }
      _this.changePageIndex(1);
      _this.changePageSize(20);
      _this.saveGetListForm(resultJson);
      _this.changeTriggerGetList();
    }
  }
};
</script>

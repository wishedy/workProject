<template>
  <section class="searchArea" :class="{ height250: isAdmin }">
    <el-form ref="auditForm" :model="form" label-width="80px">
      <el-row>
        <el-col :span="!isAdmin ? 5 : 6">
          <el-form-item label="姓名" prop="fullNameLike" >
            <el-input v-model="form.fullNameLike" placeholder="请输入姓名"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="企业" prop="companyLike" >
            <el-input v-model="form.companyLike" placeholder="请输入企业"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="6" >
          <el-form-item label="用户ID" prop="customerId">
            <el-input v-model="form.customerId" placeholder="请输入ID"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="6" v-if="!isAdmin">
          <el-form-item label="品牌" prop="brandLike" >
            <el-input v-model="form.brandLike" placeholder="请输入品牌"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="5">
          <el-form-item label="类别" prop="type" >
            <el-select v-model="form.type" placeholder="不限">
              <el-option label="不限" value="0,2,3"></el-option>
              <el-option label="厂商" value="2"></el-option>
              <el-option label="经销商" value="3"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="9" style="height:62px;">
          <el-form-item label="提交时间" >
            <el-col :span="11">
              <el-date-picker
                v-model="lastUpdateTime"
                type="daterange"
                align="right"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
                value-format="yyyy-MM-dd HH:mm:ss"
                :default-time="['00:00:00', '23:59:59']"
              >
              </el-date-picker>
            </el-col>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="手机号" prop="mobileLike" >
            <el-input v-model="form.mobileLike" placeholder="请输入手机号"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="7" :style="!isAdmin ? '' : 'margin-left:18px;'">
          <el-form-item label="邮箱" prop="emailLike" >
            <el-input v-model="form.emailLike" placeholder="请输入邮箱"></el-input>
          </el-form-item>
        </el-col>
      <!-- </el-row>
      <el-row> -->
        <el-col :span="5">
          <el-form-item label="账号状态" prop="uniteIsValid" >
            <el-select v-model="form.uniteIsValid" placeholder="不限">
              <el-option label="不限" value=""></el-option>
              <el-option label="有效" value="1"></el-option>
              <el-option label="无效" value="0"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="6" style="margin-left: 52px;">
          <el-form-item label="提交类型" prop="auditType" >
            <el-select
              v-model="form.auditType"
              placeholder="不限"
              style="width:187px;"
            >
              <el-option label="不限" value=""></el-option>
              <el-option label="首次提交" value="1"></el-option>
              <el-option label="变更提交" value="2"></el-option>
              <el-option label="补全信息" value="3"></el-option>
              <el-option label="重新提交" value="4"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="6" v-if="isAdmin">
          <!--todo 字段-->
          <el-form-item label="认证状态" prop="showState" >
            <el-select
              v-model="form.showState"
              placeholder="不限"
              required
            >
              <!--todo 字段审核-->
              <el-option label="不限" value=""></el-option>
              <el-option label="厂商审核中" value="1"></el-option>
              <el-option label="厂商认证V1通过" value="2"></el-option>
              <el-option label="厂商V1拒绝" value="3"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="5" v-if="isAdmin">
          <!--todo 字段-->
          <el-form-item label="变更状态" prop="changeState" style="marginLeft:1px;">
            <el-select
              v-model="form.changeState"
              placeholder="不限"
              required
            >
              <el-option label="不限" value=""></el-option>
              <el-option label="未处理" value="1"></el-option>
              <el-option label="变更通过" value="2"></el-option>
              <el-option label="变更拒绝" value="3"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="5" v-if="isAdmin">
          <el-form-item
            label="处理人"
            prop="auditorLike"
          >
            <el-input v-model="form.auditorLike" placeholder="输入处理人"></el-input>
          </el-form-item>
        </el-col>

        <el-col :span="7" v-if="isAdmin" style="margin-left: 52px;">
          <el-form-item label="处理时间" >
            <el-col :span="11">
              <el-date-picker
                v-model="auditTime"
                type="daterange"
                align="right"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
                value-format="yyyy-MM-dd HH:mm:ss"
                :default-time="['00:00:00', '23:59:59']"
                >
              </el-date-picker>
            </el-col>
          </el-form-item>
        </el-col>
        <el-col :span="5" v-if="isAdmin" style="marginLeft:115px;">
          <!--处理状态（1-未处理2-已处理 ）-->
          <el-form-item label="处理状态" prop="auditState" >
            <el-select
              v-model="form.auditState"
              placeholder="不限"
              required
            >
              <el-option label="不限" value=""></el-option>
              <el-option label="未处理" value="1"></el-option>
              <el-option label="已处理" value="2"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="6" style="margin-right: 10px;float: right;">
          <el-form-item class="submitBtn">
            <el-button @click="resetForm">清空条件</el-button>
            <el-button  @click="onSubmit">&nbsp;&nbsp;筛选&nbsp;&nbsp;</el-button>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
  </section>
</template>

<script>
import medicalConfForRole from '../MedicalConfForRole';
export default {
  name: 'CompanySearchArea',
  data() {
    return {
      form: {
        // 表单查询时,需要初始化开始和结束
        fullNameLike: '',
        companyLike: '',
        brandLike: '', // 品牌字段
        type: '0,2,3', // 厂商类型 2是厂商 3是经销商
        createTimeGt: '', // 提交时间开始
        createTimeLt: '', // 提交时间结束
        changeState: '', // 变更状态
        mobileLike: '',
        emailLike: '',
        uniteIsValid: '',
        customerId: '',
        auditType: '', // -1首次提交2-变更提交3-补全信息4-重新提交
        showState: '', //  <!--认证状态(-1-无认证信息、0-二次提交认证、1-认证通过、2-运营确认、3-认证拒绝7-执业医师申请 8-执业医师确认 9-执业医师拒绝)-->
        auditorLike: '', // 处理人
        auditTimeGt: '', // 处理时间开始
        auditTimeLt: '', // 处理时间结束
        auditState: '' // 处理状态（1-未处理2-已处理 ）
      },
      lastUpdateTime: '',
      auditTime: '',
      medicalTitleList: medicalConfForRole('')
    };
  },
  components: {

  },
  methods: {
    onSubmit() {
      if (Array.isArray(this.lastUpdateTime) && this.lastUpdateTime.length > 0) {
        this.form.createTimeGt = this.lastUpdateTime[0];
        this.form.createTimeLt = this.lastUpdateTime[1];
      }

      if (Array.isArray(this.auditTime) && this.auditTime.length > 0) {
        this.form.auditTimeGt = this.auditTime[0];
        this.form.auditTimeLt = this.auditTime[1];
      }

      var newObj = {};
      for (var key in this.form) {
        if (this.form[key].toString()) {
          newObj[key] = this.form[key];
        }
      }

      // showState 认证状态替换
      if (newObj.showState === '1') {
        newObj.stateIdList = '0,1';
      }
      else if (newObj.showState === '2') {
        newObj.stateIdList = '2,7';
      }
      else if (newObj.showState === '3') {
        newObj.stateIdList = '3';
      }
      delete newObj.showState;
      this.$store.commit('setComponyAuditSearchData', newObj);
      this.$emit('onSubmit', newObj);
    },
    resetForm() {
      this.$refs['auditForm'].resetFields();

      // 对时间组件进行重置
      this.lastUpdateTime = [];
      this.auditTime = [];
      this.form.auditTimeGt = '';
      this.form.auditTimeLt = '';
      this.form.createTimeGt = '';
      this.form.createTimeLt = '';
      this.form.auditState = '';
    }
  },
  watch: {

  },
  props: {
    'isAdmin': {
      type: Boolean
    }
  },
  beforeMount() {

  },
  mounted() {
    // 从store中获取搜索历史
    let ComponyAuditSearchData = this.$store.state.ComponyAuditSearchData;
    for (let key in ComponyAuditSearchData) {
      this.form[key] = ComponyAuditSearchData[key];
    }

    if (ComponyAuditSearchData.createTimeGt && ComponyAuditSearchData.createTimeLt) {
      this.lastUpdateTime = [];
      this.lastUpdateTime[0] = ComponyAuditSearchData.createTimeGt;
      this.lastUpdateTime[1] = ComponyAuditSearchData.createTimeLt;
    }

    if (ComponyAuditSearchData.auditTimeGt && ComponyAuditSearchData.auditTimeLt) {
      this.auditTime = [];
      this.auditTime[0] = ComponyAuditSearchData.auditTimeGt;
      this.auditTime[1] = ComponyAuditSearchData.auditTimeLt;
    }

    // 如果存在 搜索数据 则调用一次父级搜索
    if (Object.keys(ComponyAuditSearchData).length > 0) {
      this.$emit('onSubmit', ComponyAuditSearchData);
    }

    // 绑定键盘事件
    document.onkeydown = (e) => {
      if (e.keyCode === 13) {
        this.onSubmit();
      }
    };
  },
  destroyed() {
    document.onkeydown = null;
  }
};
</script>
<style lang="scss" scoped>
  //搜索区域样式
  .searchArea {
    padding: 25px 0 0;
    background: #FFFFFF;
    box-shadow: 0 4px 10px 0 rgba(42, 53, 102, 0.04);
    border-radius: 4px;
    margin-bottom: 30px;
    .submitBtn{
      button{
        &:nth-of-type(1){
         border: none;
        }
        &:nth-of-type(2){
          color: #4B67D6;
          border: 1px solid #4B67D6;
          border-radius: 4px;
        }
      }
    }

    .marginLeft95{
      margin-left: 95px;
    }

    .height250{
      height:250px;
    }
     .el-input__inner:not(.el-date-editor){
      background: #F7F9FC ;
      border: 1px solid #E6E6E8;
      border-radius: 4px;
    }

  }

</style>
<style scoped lang="scss">
  .el-select-dropdown__item {
    padding-left: 40px;
    position: relative;
    border-bottom: 1px solid rgba(230,230,232,0.3);
    &:last-of-type{
      border-bottom:none;
    }

    &:before {
      background-size: 16px 16px;
      background:  url(/static/images/icons/icon-unselected.png) center center no-repeat;
      content: "";
      display: block;
      width: 40px;
      height: 100%;
      position: absolute;
      opacity: 1;
      left: 0;
      top: 50%;
      transform: translateY(-50%);
    }

    &.selected:before {
      background-size: 16px 16px;
      background:  url(/static/images/icons/icon-selected.png) center center no-repeat;
    }
  }
</style>

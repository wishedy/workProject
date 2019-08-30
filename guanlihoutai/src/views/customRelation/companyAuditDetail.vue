<template>
  <section class="main-container">
    <h2>基本信息</h2>
    <section class="center-content">
      <h2 v-if="isNoData">无待审核内容</h2>
      <el-form ref="form" :model="authMap" :rules="rules" label-width="80px"   v-if="!isNoData">
        <el-row>
          <el-col :span="6">
            <el-form-item label="姓名">
              <el-input v-model="authMap.fullName" @blur="stateChange('fullName')"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="类别" prop="type">
              <el-select
                v-model="authMap.type"
                placeholder="请选择类别"
                @change="stateChange('type')"
              >
<!--                <el-option label="请选择类别" :value="0"></el-option>-->
                <el-option label="厂商" :value="2"></el-option>
                <el-option label="经销商" :value="3"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8" style="width:408px;">
            <CompanyBrand :brandName="authMap.brandNameList"
                          :company="hName"
                          :chooseBrandName="chooseBrandName"
                          @sendMyBrandName="getMyBrandName"
                          @sendBrandId="getBrandId"
            />
          </el-col>

        </el-row>
        <el-row>
          <el-col :span="8" style="">
            <Company ref="hospital"
                      :companyId="String(companyId)"
                      :ifModeFollowForm="ifModeFollowForm"
                      :ifSingleStyle="ifSingleStyle"
                      @setModeFollowForm="setModeFollowForm"
                      @setCompanyName= "setHospitalName"
                      @setCompanyId="getCompanyId"
                      :hName="hName" />
          </el-col>
        </el-row>
      </el-form>
      <CertImgShowHorizon
        :attList="attList"
        :customerId="customerId"
        :isNeedEdit ='true'
        :ifBoolean="ifBoolean"
        @setAttRecDateParams ="setAttRecDateParams"
        v-if="!isNoData"
      ></CertImgShowHorizon>
    </section>
    <section class="bottomBtn"  v-if="!isNoData">
      <!--todo 角色字段-->
      <el-button
        type="success"
        @click="updateAuthState(2)"
        round
      >
        V1通过
      </el-button>
      <el-button
        type="danger"
        @click="v1RefuseOnClick"
        round
      >
        V1拒绝
      </el-button>
    </section>
    <RefuseCertDialog :canShow="refuseData.canShow" :setTitle="refuseData.title"
                      :contentSelectList="refuseData.contentSelectList"
                      :questionSelectList="refuseData.questionSelectList"
                      @closeDialog="refuseData.canShow = false"
                      @confirmHandle="refuseConfirmHandle"
    ></RefuseCertDialog>
  </section>
</template>

<script>
import axios from '@/assets/js/utils/request.js';
import apiConfig from '@/api/apiUrlConfig';
import tipMessage from '@/components/common/tipMessage/Message.js';
import CertImgShowHorizon from '@/views/customRelation/components/CertImgShowHorizon.vue';
import Company from '@/views/customRelation/components/Company/Company.vue';
import RefuseCertDialog from '@/views/customRelation/components/RefuseCertDialog.vue';
import Vue from 'vue';
import comm from '@/assets/js/utils/comm';

import CompanyBrand from './components/CompanyAudit/CompanyBrand';

Vue.use(tipMessage);
export default {
  name: 'companyAuditDetail',
  data() {
    return {
      authMap: {
        fullName: '', // 全称
        type: '', // 类别Id
        brandNameList: [], // 与企业绑定的数组
        brandId: '' // 品牌ID
      },
      currentBrandName: '', // 提交时当前的绑定品牌名
      isNoData: false, // 没有新数据了
      oldAuthMap: {}, // 用于后期比对
      attList: [],
      hName: '', // 医院名称  新旧时用 调用者加hName newHName
      companyId: '', // 医院名称ID
      ifSingleStyle: true, // true为单体样式
      ifModeFollowForm: 0, // 医院  初使显示1已验证/ 0添加医院
      rules: {
      },
      opIP: '',
      customerId: '',
      isChange: false, // 判断信息是否有修改
      refuseData: { // 拒绝信息
        state: -1,
        canShow: false,
        title: '',
        contentSelectList: [],
        questionSelectList: []
      },
      isNewDataFlag: false,
      loading: null,
      // 证件时间参数设置,用于v1通过
      attRecDateParams: {

      },
      ifBoolean: true, // 判断图片右侧显示类型 名称还是类型
      chooseBrandName: '' // 被选中的品牌
    };
  },
  components: {
    CertImgShowHorizon, // 图片显示组件
    RefuseCertDialog, // 拒绝对话框
    Company, // 企业组件
    CompanyBrand // 关联品牌组件
  },
  methods: {
    getBrandId(val) {
      this.authMap.brandId = val;
      console.log(val, 'getBrandId');
    },
    getMyBrandName(state) { // 获取品牌修改后的名称
      this.currentBrandName = state;
      this.isChange = true;
    },
    setModeFollowForm(state) { // 设置医院改变的状态
      this.ifModeFollowForm = state;
    },
    setHospitalName(hName) { // 设置医院名字和ID
      this.hName = hName;
    },
    getCompanyId(val) {
      this.companyId = val;
    },
    getBaseData() { // 获取数据
      comm.openLoading('加载中...');
      axios({
        method: apiConfig.getCompanyAuditDetail.type,
        url: apiConfig.getCompanyAuditDetail.url,
        params: {
          customerId: this.customerId,
          id: this.auditId
        }
      }).then((response) => {
        comm.closeLoading();
        if (response.data.responseObject.responseData.dataList) {
          let authMap = response.data.responseObject.responseData.dataList.authMap;

          this.authMap.fullName = authMap.fullName ? authMap.fullName : '';
          this.authMap.type = (authMap.type === 2 || authMap.type === 3) ? authMap.type : ''; // 类型字段，根据后台的规定字段再做调整
          this.authMap.brandNameList = authMap.brandNameList ? authMap.brandNameList : []; // 类型字段，根据后台的规定字段再做调整

          this.hName = authMap.company;
          this.companyId = authMap.companyId;
          this.ifModeFollowForm = authMap.isShow; // 链条时检查一下这个字段
          this.authMapBackUp = authMap;
          this.chooseBrandName = response.data.responseObject.responseData.dataList.brandName;

          this.attList = response.data.responseObject.responseData.dataList.attList;
          this.attListBackup = JSON.parse(JSON.stringify(this.attList));
          for (let i = 0; i < this.attList.length; i++) {
            this.attList[i].isChangePage = false;
          }
        }
      });
      // 获取拒绝原因
      this.getRefuseMapList();
    },
    getNext() {
      this.isNewDataFlag = true;
      this.isChange = false;
      var _this = this;
      let auditState = localStorage.getItem('companyState'); // 区分全部列表还是审核列表

      if (auditState === '1') {
        _this.params.firstResult = parseInt(_this.params.firstResult);
      }
      else {
        _this.params.firstResult = parseInt(_this.params.firstResult) + 1;
      }
      _this.params.auditState = 1; // 只获取待审核的数据
      axios({
        method: apiConfig.companyAuditList.type,
        url: apiConfig.companyAuditList.url,
        params: this.params
      }).then((response) => {
        // 存储状态
        if (response && response.data && response.data.responseObject && response.data.responseObject.responseData && response.data.responseObject.responseData.dataList) {
          // let auditIsValid = response.data.responseObject.responseData.dataList[0].isValid;

          localStorage.setItem('companyAuditCurrentData', JSON.stringify({
            auditType: response.data.responseObject.responseData.dataList[0].auditType,
            customerId: response.data.responseObject.responseData.dataList[0].customerId,
            params: _this.params,
            auditId: response.data.responseObject.responseData.dataList[0].id,
            resourceId: response.data.responseObject.responseData.dataList[0].resourceId,
            showState: response.data.responseObject.responseData.dataList[0].showState
          }));
          // 更新auditState
          // let auditStateNew = response.data.responseObject.responseData.dataList[0].auditState;
          let auditTypeeNew = response.data.responseObject.responseData.dataList[0].auditType;
          // localStorage.setItem("auditState",auditStateNew);

          // 审核类型(1-首次提交2-变更提交3-补全信息4-重新提交)
          if (parseInt(auditTypeeNew) === 2) {
            comm.closeLoading();
            this.$router.push({
              path: '/companyAuditChangeDetail'
            });
          }
          else {
            this.customerId = response.data.responseObject.responseData.dataList[0].customerId;
            this.auditType = response.data.responseObject.responseData.dataList[0].auditType;
            this.resourceId = response.data.responseObject.responseData.dataList[0].resourceId;
            this.auditId = response.data.responseObject.responseData.dataList[0].id;
            this.getBaseData();
          }
        }
        else {
          this.isNoData = true;
          comm.closeLoading();
          return false;
        }
      });
    },
    checkAuthMapDiff() { // 对数据进行比对，看看用户是否有修改
      var diffObj = {};
      for (var key in this.authMap) {
        if (this.authMap[key] !== this.oldAuthMap[key]) {
          diffObj[key] = this.authMap[key];
        }
      }
      return diffObj;
    },
    getIp() {
      axios({
        method: apiConfig.getIp.type,
        url: apiConfig.getIp.url,
        params: {}
      }).then((response) => {
        if (response.data && response.data.success) {
          this.opIP = response.data.visitorIP.substring(7, response.data.visitorIP.length);
        }
      }
      );
    },
    stateChange(key) { // 有修改改变状态
      if (this.isNewDataFlag) {
        this.isNewDataFlag = false;
      }
      else {
        if (this.authMapBackUp[key] !== this.authMap[key]) {
          !this.isChange && (this.isChange = true);
        }
      }
    },
    setParamsAttList() { // 传参时重置 并清除未改动的
      const attList = this.attList;
      const attListBackup = this.attListBackup;
      for (let x = attList.length; x > -1; x--) {
        let exist = false;
        for (let z in attListBackup) {
          if (Object.prototype.toString.call(attList[x]) === '[object Object]') {
            // 图片或者attCode都有可能发生变化
            if (attListBackup[z].attType === attList[x].attType && attListBackup[z].attPositionType === attList[x].attPositionType && (attListBackup[z].id !== attList[x].id || attListBackup[z].attCode !== attList[x].attCode)) {
              delete attList[x].attPath;
              delete attList[x].attPositionType;
              delete attList[x].attType;
              delete attList[x].index;
              delete attList[x].isFirst;
              exist = true;
            }
          }
        }
        if (!exist) {
          attList.splice(x, 1);
        }
      }
    },
    // 设置证书时间 v1/v2通过时传递
    setAttRecDateParams(data) {
      for (let key in data) {
        this.attRecDateParams[key] = data[key];
      }
    },
    // v1 通过 拒绝
    updateAuthState(state, refuseData) {
      if (!this.authMap.type && this.refuseData.state !== 3) {
        this.$tipMessage(true, 'info', '请选择类别', this.$el.getAttribute('class'), 0);
        return false;
      }
      let _this = this;
      comm.openLoading('审核中...');
      this.setParamsAttList();
      let newData = Object.assign({ // _this.checkAuthMapDiff(),
        userLoginName: localStorage.getItem('userLoginName'),
        fullName: this.authMap.fullName, // string 姓名
        type: this.authMap.type, // 厂商类型
        companyId: this.companyId, // string医院id
        brandId: this.authMap.brandId, // 新增品牌ID
        companyName: this.hName, // string医院
        oldAttCodeList: this.attList, // 备份
        // newAttCodeList: this.setParamsAttList("new", this.attList), // 图编号组
        opIP: this.opIP,
        visitSiteId: 25,
        state: state,
        customerId: this.customerId,
        auditId: this.auditId,
        brandName: this.currentBrandName,
        isShow: this.ifModeFollowForm, // 新增的判断企业是否已验证
        roleId: 15
      }, refuseData);
        // 如果是 v1 通过 则传递 证件时间 拒绝时不传递
      if (state === 2 || state === 8) {
        newData = Object.assign(newData, this.attRecDateParams);
      }

      if (state === 3) { // 如果是拒绝 角色改成14
        newData.roleId = 14;
      }
      axios({
        method: apiConfig.updateAuthState.type,
        url: apiConfig.updateAuthState.url,
        data: newData
      }).then((response) => {
        _this.getNext();
      });
    },
    // 获取拒绝原因
    getRefuseMapList() {
      const _this = this;
      // 获取拒绝问题数据
      axios({
        method: apiConfig.getRefuseMapList.type,
        url: apiConfig.getRefuseMapList.url,
        params: {
          scene: 8,
          customerId: _this.customerId,
          roleId: 14
        }
      }).then((res) => {
        const responseMessage = res.data.responseObject.responseMessage;
        const data = res.data.responseObject.responseData;
        if (!responseMessage && data && data.dataList && data.dataList.length > 0) {
          _this.refuseData.questionSelectList = data.dataList;
        }
      }).catch((e) => {
        console.log('获取拒绝问题数据失败：', e);
      });
      // 获取拒绝内容数据
      axios({
        method: apiConfig.getRefuseMapList.type,
        url: apiConfig.getRefuseMapList.url,
        params: {
          scene: 7,
          customerId: _this.customerId,
          roleId: 14
        }
      }).then((res) => {
        const responseMessage = res.data.responseObject.responseMessage;
        const data = res.data.responseObject.responseData;
        if (!responseMessage && data && data.dataList && data.dataList.length > 0) {
          _this.refuseData.contentSelectList = data.dataList;
        }
      }).catch((e) => {
        console.log('获取拒绝内容数据失败：', e);
      });
    },
    v1RefuseOnClick() { // V1拒绝
      this.refuseData.canShow = true;
      this.refuseData.title = 'V1拒绝';
      this.refuseData.state = 3;
    },
    refuseConfirmHandle(data) { // 确认拒绝理由
      const state = this.refuseData.state;
      if (state !== -1 && data.refuseList.length > 0) {
        this.updateAuthState(state, data);
      }
      // 关闭拒绝弹窗
      this.refuseData.canShow = false;
    }
  },
  watch: {
    // 如果 `attList` 发生改变，这个函数就会运行
    authMap: function(newVal, oldVal) {
      this.oldAuthMap = JSON.parse(JSON.stringify(newVal));
      this.authMap = newVal;
    },
    isChange(newVal, oldVal) {
      if (this.isChange) {
        this.$tipMessage(true, 'info', '审核通过后，修改信息将保存', this.$el.getAttribute('class'), 0);
      }
      else {
        this.$tipMessage(false, 'info', '审核通过后，修改信息将保存', this.$el.getAttribute('class'), 0);
      }
    },
    // 监听医院名字变化
    hName: function(newVal, oldVal) {
      // oldVal 有值
      if (this.isNewDataFlag) {
        this.isNewDataFlag = false;
      }
      else {
        if (oldVal) {
          if (this.authMapBackUp.companyId !== this.authMap.companyId) {
            !this.isChange && (this.isChange = true);
          };
        }
      }
    }
  },
  beforeMount() {
    this.customerId = JSON.parse(localStorage.getItem('companyAuditCurrentData')) && JSON.parse(localStorage.getItem('companyAuditCurrentData')).customerId;
    this.params = JSON.parse(localStorage.getItem('companyAuditCurrentData')) && JSON.parse(localStorage.getItem('companyAuditCurrentData')).params;
    this.auditType = JSON.parse(localStorage.getItem('companyAuditCurrentData')) && JSON.parse(localStorage.getItem('companyAuditCurrentData')).auditType;
    this.memberAuditIndex = localStorage.getItem('companyAuditIndex') ? localStorage.getItem('companyAuditIndex') : '';
    this.auditId = JSON.parse(localStorage.getItem('companyAuditCurrentData')) && JSON.parse(localStorage.getItem('companyAuditCurrentData')).auditId;
    this.params.firstResult = parseInt(this.params.firstResult) + parseInt(this.memberAuditIndex);
    this.params.maxResult = 1;
  },
  mounted() {
    // 审核类型(1-首次提交2-变更提交3-补全信息4-重新提交)
    if (parseInt(this.auditType) === 2) {
      this.$router.push({
        path: '/componyAuditChangeDetail'
      });
    }
    this.getBaseData();
    this.getIp();
  }
};
</script>

<style lang="scss" >
  .main-container {
    width: 1200px;
    margin: 0 auto;
    h2 {
      font-family: PingFangSC-Semibold;
      font-size: 20px;
      color: #2C343A;
      letter-spacing: 0;
      line-height: 20px;
      margin: 36px 0 25px;
      padding: 0 160px;
    }

    .center-content {
      width: 880px;
      margin: 0 auto;
      background: #FFFFFF;
      box-shadow: 0 4px 10px 0 rgba(42, 53, 102, 0.04);
      border-radius: 4px;
      padding: 30px 0;
      margin-bottom: 20px;
      //验证通过按钮
      .hospitalState {
        span {
          display: inline-block;
          height: 40px;
          line-height: 40px;
          padding: 0 16px;
          opacity: 0.8;
          background: #E9F7E9;
          border-radius: 4px;
          margin-left: 15px;
          font-family: PingFangSC-Regular;
          font-size: 14px;
          color: #52CC64;
          letter-spacing: 0;
        }

        &.addHospital span {
          background: #EDF1FF;
          color: #4B67D6;
        }
      }
    }
    .bottomBtn {
      text-align: right;
      margin-bottom: 30px;
    }
    .el-input:not(.attCode) input{
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

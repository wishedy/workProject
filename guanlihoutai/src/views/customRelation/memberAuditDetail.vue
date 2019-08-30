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
            <el-form-item label="性别">
              <el-select v-model="authMap.sexId" placeholder="请选择性别" @change="stateChange('sexId')">
                <el-option label="男" value="1"></el-option>
                <el-option label="女" value="2"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="5">
            <el-form-item label="角色" prop="roleId" >
              <el-select
                v-model="authMap.roleId"
                placeholder="不限"
                @change="stateChange('roleId')"
              >
                <el-option label="医生" value="6"></el-option>
                <el-option label="护士" value="12"></el-option>
                <el-option label="医助" value="13"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="5">
            <el-form-item label="职称" prop="medicalTitleShowId">
              <!--职称id(1-住院医师、2-主治医师、3-副主任医师、4-主任医师、5-讲师、6-副教授、7-教授、8-硕士生导师、9-博士生导师、10-医学生、11-护士、12-主任医师、13-其它)-->
              <el-select
                v-model="authMap.medicalTitleShowId"
                placeholder="请选择职称"
                @change="stateChange('medicalTitleShowId')"
              >
                <el-option
                  v-for="(item, index)  in medicalTitleList"
                  :label="item.medicalTitle"
                  :value="item.id"
                  :key="index"
                >
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="6">
            <el-form-item label="备案状态" prop="isRecord">
              <el-select v-model="authMap.isRecord" placeholder="请选择状态" @change="stateChange('sexId')">
                <!--//是否备案（0-未备案1-备案中2-已备案3-无需备案4-备案失败）-->
                <el-option label="未备案" :value="0"></el-option>
                <el-option label="备案中" :value="1"></el-option>
                <el-option label="已备案" :value="2"></el-option>
                <el-option label="无需备案" :value="3"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <!--<el-col :span="8">-->
            <!--<el-form-item label="医院">-->
              <!--<el-input v-model="authMap.company"></el-input>-->
            <!--</el-form-item>-->
          <!--</el-col>-->
          <el-col :span="8" style="" v-if="parseInt(authMap.medicalTitleShowId) != 10">
            <Hospital ref="hospital"
                      :hNameId="hNameId"
                      :ifModeFollowForm="ifModeFollowForm"
                      :ifSingleStyle="ifSingleStyle"
                      @setModeFollowForm="setModeFollowForm"
                      @setHospitalName= "setHospitalName"
                      :hName="hName" />
            <!--<div :class="authMap.isVerify === 1 ? 'hospitalState' :'hospitalState addHospital'">-->
              <!--<span v-if="authMap.isVerify=== 1">已验证</span>-->
              <!--<span v-if="authMap.isVerify=== 0" @click="addHospital">添加医院</span>-->
            <!--</div>-->
          </el-col>

          <!--学校-->
          <el-col :span="8" v-if="parseInt(authMap.medicalTitleShowId) == 10">
            <el-form-item label="学校">
              <el-input v-model="authMap.schoolName" readonly="readonly"  ></el-input>
            </el-form-item>
          </el-col>

          <el-col :span="8" :offset="2" >
            <el-form-item label="头像" class="formlogoUrl">
              <img :src="authMap.logoUrl" alt="">
              <span @click="formlogoUrlOnClick">上传头像<i></i></span>
              <input
                type="file"
                @change="formlogoUrlInputChangeHandle"
                ref="img_upload"
                style="display: none"
              >
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <CertImgShowHorizon
        :attList="attList"
        :customerId="customerId"
        :isNeedEdit ='true'
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
        type="success"
        @click="updateAuthState(8)"
        round
        v-if="parseInt(authMap.roleId) !== 12 && parseInt(authMap.roleId) !== 13"
      >
        V2通过
      </el-button>
      <el-button
        type="danger"
        @click="v1RefuseOnClick"
        round
        v-if="parseInt(authMap.roleId) !== 13"
      >
        V1拒绝
      </el-button>
      <el-button
        type="danger"
        round
        @click="v2RefuseOnClick"
        v-if="parseInt(authMap.roleId) !== 12 && parseInt(authMap.roleId) !== 13"
      >
        V2拒绝
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
import Hospital from '@/views/customRelation/components/Hospital/Hospital.vue';
import RefuseCertDialog from '@/views/customRelation/components/RefuseCertDialog.vue';
import Vue from 'vue';
import comm from '@/assets/js/utils/comm';
import medicalConfForRole from './components/MedicalConfForRole';

Vue.use(tipMessage);
export default {
  name: 'memberAuditDetail',
  data() {
    return {
      authMap: {
        fullName: '',
        sexId: '',
        medicalTitleShowId: '',
        company: '',
        schoolName: '',
        schoolId: '',
        logoUrl: '',
        isRecord: '', // 是否备案,
        roleId: '' // todo 添加角色字段
      },
      isNoData: false, // 没有新数据了
      medicalTitleList: medicalConfForRole[''], // 职称下拉列表
      medicalTitleIdFormatter: {}, // 用于通过id查找medicalTitleList
      oldAuthMap: {}, // 用于后期比对
      attList: [],
      hName: '',
      hNameId: '',
      ifSingleStyle: true,
      ifModeFollowForm: 0,
      rules: {
      },
      opIP: '',
      customerId: '',
      isChange: false,
      refuseData: {
        state: -1,
        canShow: false,
        title: '',
        contentSelectList: [],
        questionSelectList: []
      },
      isNewDataFlag: false,
      loading: null,
      formlogoUrlFileData: {

      },
      // 证件时间参数设置,用于v1/v2通过
      attRecDateParams: {

      }
    };
  },
  components: {
    CertImgShowHorizon,
    RefuseCertDialog,
    Hospital
  },
  methods: {
    setModeFollowForm(state) {
      this.ifModeFollowForm = state;
    },
    setHospitalName(hName, hNameId) {
      this.hName = hName;
      this.hNameId = hNameId;
    },
    getBaseData() {
      comm.openLoading('加载中...');
      axios({
        method: apiConfig.getMemberAuditDetail.type,
        url: apiConfig.getMemberAuditDetail.url,
        params: {
          customerId: this.customerId
        }
      }).then((response) => {
        comm.closeLoading();
        if (response.data.responseObject.responseData.dataList) {
          let authMap = response.data.responseObject.responseData.dataList.authMap;

          this.authMap.fullName = authMap.fullName ? authMap.fullName : '';
          this.authMap.sexId = authMap.sexId ? authMap.sexId : '';
          this.authMap.medicalTitleShow = authMap.medicalTitleShow;
          this.authMap.company = authMap.company ? authMap.company : '';
          this.authMap.schoolName = authMap.schoolName || '';
          this.authMap.schoolId = authMap.schoolId || '';
          this.authMap.logoUrl = authMap.logoUrl || '';
          this.authMap.isRecord = authMap.isRecord;
          this.authMap.roleId = authMap.roleId || '';

          // 5,6,11 都是医生角色
          if (authMap.roleId === '5' || authMap.roleId === '11') {
            this.authMap.roleId = '6';
          }

          this.medicalTitleList = medicalConfForRole(authMap.roleId);
          this.authMap.medicalTitleShowId = authMap.medicalTitleShowId || '';

          this.hName = this.authMap.company;
          this.hNameId = authMap.companyId;
          this.ifModeFollowForm = authMap.isVerify;
          this.authMapBackUp = authMap;

          this.attList = response.data.responseObject.responseData.dataList.attList;
          this.attListBackup = JSON.parse(JSON.stringify(this.attList));
          for (let i = 0; i < this.attList.length; i++) {
            this.attList[i].isChangePage = false;
          }

          // 初始化后开始监听
          this.$watch('authMap.roleId', this.roleIdWatchHandle);
        }
      });
      // 获取拒绝原因
      this.getRefuseMapList();
    },
    getNext() {
      this.isNewDataFlag = true;
      this.isChange = false;
      var _this = this;
      let auditState = localStorage.getItem('auditState');

      if (auditState === '1') {
        _this.params.firstResult = parseInt(_this.params.firstResult);
      }
      else {
        _this.params.firstResult = parseInt(_this.params.firstResult) + 1;
      }
      // 用于过滤厂商用户
      _this.params.auditRoleList = 1;
      _this.params.auditState = 1; // 只获取待审核的数据
      axios({
        method: apiConfig.memberAuditList.type,
        url: apiConfig.memberAuditList.url,
        params: this.params
      }).then((response) => {
        // 存储状态
        if (response && response.data && response.data.responseObject && response.data.responseObject.responseData && response.data.responseObject.responseData.dataList) {
          // let auditIsValid = response.data.responseObject.responseData.dataList[0].isValid;

          localStorage.setItem('memberAuditCurrentData', JSON.stringify({
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
              path: '/memberAuditChangeDetail'
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
    addHospital() {

    },
    checkAuthMapDiff() {
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
    // 有修改改变状态
    stateChange(key) {
      // 如果角色改变,则职称状态清空
      // if(key === "roleId"){
      //   this.authMap.medicalTitleShowId = ""
      // }
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
            if (
              parseInt(attListBackup[z].attType) === parseInt(attList[x].attType) &&
              parseInt(attListBackup[z].attPositionType) === parseInt(attList[x].attPositionType) &&
              (
                parseInt(attListBackup[z].id) !== parseInt(attList[x].id) ||
                parseInt(attListBackup[z].attCode) !== parseInt(attList[x].attCode)
              )
            ) {
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
    // v1,v2 通过 拒绝
    updateAuthState(state, refuseData) {
      if (!this.authMap.medicalTitleShowId) {
        this.$message.error('请选择职称');
        return;
      }
      let _this = this;
      comm.openLoading('审核中...');
      this.setParamsAttList();

      // 当前选中的职称列表
      let medicalTitleListFormatter = {},
        nowMedicalTitleList = medicalConfForRole(this.authMap.roleId);
      for (let i = 0; i < nowMedicalTitleList.length; i++) {
        medicalTitleListFormatter[nowMedicalTitleList[i].id] = nowMedicalTitleList[i].medicalTitle;
      }
      this.medicalTitleIdFormatter = medicalTitleListFormatter;

      let newData = Object.assign({ // _this.checkAuthMapDiff(),
        userLoginName: localStorage.getItem('userLoginName'),
        fullName: this.authMap.fullName, // string 姓名
        medicalTitleId: this.authMap.medicalTitleShowId, // string职称id
        medicalTitle: this.medicalTitleIdFormatter && this.authMap.medicalTitleShowId && (this.authMap.medicalTitleShowId + '_' + this.medicalTitleIdFormatter[this.authMap.medicalTitleShowId]), // string职称
        companyId: this.hNameId, // string医院id
        company: this.hName, // string医院
        oldAttCodeList: this.attList, // 备份
        // newAttCodeList: this.setParamsAttList("new", this.attList), // 图编号组
        sexId: this.authMap.sexId,
        sex: (parseInt(this.authMap.sexId) === 1 ? '男' : '女'),
        opIP: this.opIP,
        visitSiteId: 25,
        state: state,
        customerId: this.customerId,
        auditId: this.auditId,
        schoolId: this.authMap.schoolId,
        schoolName: this.authMap.schoolName,
        roleId: this.authMap.roleId
      }, refuseData);

        // 如果是 v1/v2 通过 则传递 证件时间,备案状态 拒绝不传递
      if (state === 2 || state === 8) {
        newData = Object.assign(newData, this.attRecDateParams, {
          isRecord: this.authMap.isRecord
        });
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
          scene: 3,
          customerId: _this.customerId
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
          scene: 2,
          customerId: _this.customerId
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
    }, // V1拒绝
    v1RefuseOnClick() {
      this.refuseData.canShow = true;
      this.refuseData.title = 'V1拒绝';
      this.refuseData.state = 3;
    }, // V2拒绝
    v2RefuseOnClick() {
      this.refuseData.canShow = true;
      this.refuseData.title = 'V2拒绝';
      this.refuseData.state = 9;
    }, // 确认拒绝理由
    refuseConfirmHandle(data) {
      const state = this.refuseData.state;
      if (state !== -1 && data.refuseList.length > 0) {
        this.updateAuthState(state, data);
      }
      // 关闭拒绝弹窗
      this.refuseData.canShow = false;
    },

    /*
      *
      * 图片上传
      **/
    formlogoUrlOnClick() {
      if (this.isLoading) return false;
      this.$refs['img_upload'].click();
    },
    formlogoUrlInputChangeHandle(evt) {
      let file = evt.target.files[0];
      if (file) {
        if (!this.formatCheck(file)) {
          return false;
        }
      }
      else return false;
      // 获取图片数据
      this.formlogoUrlFileData.extName = file.type;
      this.formlogoUrlFileData.file = file;
      const render = new FileReader();
      render.onload = (e) => {
        this.formlogoUrlFileData.fileContent = render.result;
        this.formlogoUrlUploadImg();
      };
      render.readAsDataURL(file);
    },
    formatCheck(file) {
      // 图片仅支持JPG/JPEG/PNG格式
      const typeTrue = file.type === 'image/jpeg' || file.type === 'image/jpg' || file.type === 'image/png';
      // 图片大小不超过5M
      const sizeTrue = file.size / 1024 / 1024 < 5;
      if (!typeTrue) {
        this.$message.error('上传图片仅支持JPG/JPEG/PNG格式');
        return false;
      }
      else if (!sizeTrue) {
        this.$message.error('上传图片大小不超过5M');
        return false;
      }
      return true;
    },

    formlogoUrlUploadImg() {
      comm.openLoading('图片上传中...');
      axios({
        method: apiConfig.memberAuditDetailLogoUrl.type,
        url: apiConfig.memberAuditDetailLogoUrl.url,
        data: {
          fileContent: this.formlogoUrlFileData.fileContent.split(',')[1],
          extName: this.formlogoUrlFileData.extName.split('/')[1],
          logoType: 4,
          logoSpec: 0,
          refId: this.customerId
        }
      }).then((res) => {
        if (res && res.data.responseObject && res.data.responseObject.responseStatus === true && res.data.responseObject.responseData) {
          comm.closeLoading();
          this.authMap.logoUrl = res.data.responseObject.responseData.logoUrl;
          // 格式化数据
          this.$message.info('图片上传成功！');
        }
        else {
          comm.closeLoading();
          this.$message.error('图片上传失败！');
        }
      }).catch(() => {
        comm.closeLoading();
        this.$message.error('图片上传失败！');
      });
    },
    roleIdWatchHandle(newVal, oldVal) {
      this.medicalTitleList = medicalConfForRole(newVal);
      this.authMap.medicalTitleShowId = medicalConfForRole(newVal)[0].id;
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
    this.customerId = JSON.parse(localStorage.getItem('memberAuditCurrentData')) && JSON.parse(localStorage.getItem('memberAuditCurrentData')).customerId;
    this.params = JSON.parse(localStorage.getItem('memberAuditCurrentData')) && JSON.parse(localStorage.getItem('memberAuditCurrentData')).params;
    this.auditType = JSON.parse(localStorage.getItem('memberAuditCurrentData')) && JSON.parse(localStorage.getItem('memberAuditCurrentData')).auditType;
    this.memberAuditIndex = localStorage.getItem('memberAuditIndex') ? localStorage.getItem('memberAuditIndex') : '';
    this.auditId = JSON.parse(localStorage.getItem('memberAuditCurrentData')) && JSON.parse(localStorage.getItem('memberAuditCurrentData')).auditId;
    this.params.firstResult = parseInt(this.params.firstResult) + parseInt(this.memberAuditIndex);
    this.params.maxResult = 1;
  },
  mounted() {
    // 审核类型(1-首次提交2-变更提交3-补全信息4-重新提交)
    if (parseInt(this.auditType) === 2) {
      this.$router.push({
        path: '/memberAuditChangeDetail'
      });
    }
    this.getBaseData();
    this.getIp();
  }
};
</script>

<style lang="scss">
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
      //头像
      .formlogoUrl{
        img{
          width:40px;
          height:40px;
          border: none;
          vertical-align:middle;
          border-radius:50px;
        }
        span{
          display: inline-block;
          width:106px;
          height:36px;
          line-height: 36px;
          border-radius:4px;
          border:1px solid #E6E6E8;
          font-size:14px;
          font-family:PingFangSC-Regular;
          font-weight:400;
          color:rgba(75,103,214,1);
          position: relative;
          text-align: left;
          padding-left: 12px;
          box-sizing: border-box;
          cursor: pointer;
          i:before {
            background-size: 20px 16px;
            background: url(/static/images/icons/icon-logoUrl.jpg) center center no-repeat;
            content: "";
            display: block;
            width: 20px;
            height: 16px;
            position: absolute;
            opacity: 1;
            right: 5px;
            top: 50%;
            transform: translateY(-50%);
          }
        }

        input {
          display: none;
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

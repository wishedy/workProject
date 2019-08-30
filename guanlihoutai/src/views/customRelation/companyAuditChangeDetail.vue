<template>
  <section class="main-container">
    <h2>基本信息</h2>

    <section class="center-content">
      <h2 v-if="isNoData">无待审核内容</h2>
      <el-form ref="form" :model="baseList" :rules="rules" label-width="80px" v-if="!isNoData">
        <!--老的-->
        <el-row>
          <el-col :span="6">
            <el-form-item :label="baseList.fullName || (!baseList.fullName&& ! baseList.updateFullName)? '姓名':''">
              <el-input
                v-model="baseList.fullName"
                readonly="readonly"
                v-if="baseList.fullName || (!baseList.fullName&& ! baseList.updateFullName)"
              >
              </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="类别" prop="type">
              <el-select
                v-model="baseList.type"
                placeholder="请选择类别"
                @change="stateChange('type')"
              >
<!--                <el-option label="不限" :value="0"></el-option>-->
                <el-option label="厂商" :value="2"></el-option>
                <el-option label="经销商" :value="3"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="6" style="width:408px;">
            <!-- <el-form-item :label="baseList.brandName || (!baseList.brandName&& ! baseList.updateBrandName)? '服务品牌':''">
              <el-input
                v-model="baseList.brandName"
                readonly="readonly"
                v-if="baseList.brandName || (!baseList.brandName&& ! baseList.updateBrandName)"
              >
              </el-input>
            </el-form-item> -->

            <CompanyBrand :brandName="baseList.brandNameList"
                          :company="baseList.workplace"
                          @sendMyBrandName="getMyBrandName"
                          @sendBrandId="getBrandId"
            />
          </el-col>
        </el-row>
        <!--新的-->
        <el-row>
          <el-col
            :span="6"
            :class="{update: baseList.fullName ||  baseList.updateFullName != baseList.fullName}"
          >
            <el-form-item
              :label="baseList.updateFullName &&  baseList.updateFullName != baseList.fullName ? '姓名':''"
            >
              <el-input
                v-model="baseList.updateFullName"
                readonly="readonly"
                v-if="baseList.updateFullName && baseList.updateFullName != baseList.fullName"
              >
              </el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <!--老的-->
        <el-row>
          <el-col :span="8">
            <el-form-item :label="baseList.workplace || (!baseList.workplace&& ! baseList.updateWorkplace)? '企业':''">
              <el-input
                v-model="baseList.workplace"
                readonly="readonly"
                v-if="baseList.workplace || (!baseList.workplace&& ! baseList.updateWorkplace)"
              ></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <!--新内容-->
        <el-row>

          <el-col
            :span="8"
            :class="{update: baseList.workplace ||  baseList.updateWorkplace != baseList.workplace}"
          >
            <el-form-item :label="baseList.updateWorkplace &&  baseList.updateWorkplace != baseList.workplace ? '企业':''">
              <el-input
                v-model="baseList.updateWorkplace"
                readonly="readonly"
                v-if="baseList.updateWorkplace && baseList.updateWorkplace != baseList.workplace"
              ></el-input>
            </el-form-item>
          </el-col>

        </el-row>

      </el-form>
      <!--isNeedEidt 是否需要编辑-->
      <CertImgShowHorizon
        :attList="attList"
        :isNeedEdit ='false'
        :customerId ='customerId'
        :ifBoolean="ifBoolean"
        v-if="!isNoData"
        :pageName ='companyAuditChangeDetail'
      ></CertImgShowHorizon>
    </section>
    <section class="bottomBtn" v-if="!isNoData">
      <!--变更项(1-v1变更通过、2-v1变更拒绝、3-v2变更通过、4-v2审核通过、5-v2变更拒绝）-->
      <el-button
        type="success"
        @click="updateAuthState(1)"
        round
      >
        变更通过
      </el-button>
      <el-button
        type="danger"
        round
        @click="changeRefuseOnClick(2)"
      >
        变更拒绝
      </el-button>
    </section>
    <RefuseCertDialog :canShow="refuseData.canShow" :setTitle="refuseData.title"
                      :contentSelectList="refuseData.contentSelectList"
                      :questionSelectList="refuseData.questionSelectList"
                      :ifBoolean="ifBoolean"
                      @closeDialog="refuseData.canShow = false"
                      @confirmHandle="refuseConfirmHandle"
    ></RefuseCertDialog>

  </section>
</template>

<script>
import axios from '@/assets/js/utils/request.js';
import comm from '@/assets/js/utils/comm.js';
import apiConfig from '@/api/apiUrlConfig';
import tipMessage from '@/components/common/tipMessage/Message.js';

import CertImgShowHorizon from '@/views/customRelation/components/CertImgShowHorizon.vue';
import RefuseCertDialog from '@/views/customRelation/components/RefuseCertDialog.vue';
import CompanyBrand from './components/CompanyAudit/CompanyBrand';

import Vue from 'vue';
Vue.use(tipMessage);

export default {
  name: 'companyAuditChangeDetail',
  data() {
    return {
      baseList: {
        'fullName': '',
        'updateFullName': '',
        'type': '', // 类别自定义字段，链条时修改
        'workplace': '',
        'updateWorkplace': '',
        'brandNameList': [], // 服务品牌列表
        'currentBrandName': '', // 当前选中的品牌
        'brandId': ''
      },
      isNoData: false, // 没有新数据了
      oldAuthMap: {}, // 用于后期比对
      attList: [],
      showState: '',
      // 展示认证状态 showState=0(其他状态)、showState=1(v1通过)、showState=2(v1拒绝)、showState=3(v2通过)、showState=4(v2拒绝)
      rules: {
      },
      opIP: '',
      customerId: '',
      resourceId: '', // 变更信息
      isChange: false,
      refuseData: { // 拒绝数据
        state: -1,
        canShow: false,
        title: '',
        contentSelectList: [],
        questionSelectList: []
      },
      loading: null,
      medId: '',
      ifBoolean: true, // 传给图片，在变更页时不让点击改变图片
      companyAuditChangeDetail: 'memberAuditChangeDetail'
    };
  },
  components: {
    CertImgShowHorizon,
    RefuseCertDialog,
    CompanyBrand
  },
  methods: {
    getMyBrandName(state) { // 获取品牌修改后的名称
      this.baseList.currentBrandName = state;
      this.isChange = true;
    },
    getBrandId(val) {
      this.baseList.brandId = val;
    },
    // 获取基础信息
    getBaseData() {
      comm.openLoading('加载中...');
      axios({
        method: apiConfig.getCompanyAuditChangeDetail.type,
        url: apiConfig.getCompanyAuditChangeDetail.url,
        params: {
          customerId: this.customerId,
          reviseId: this.resourceId,
          id: this.auditId
        }
      }).then((response) => {
        if (response && response.data && response.data.responseObject && response.data.responseObject.responseData && response.data.responseObject.responseData.dataList && response.data.responseObject.responseData.dataList.baseList && response.data.responseObject.responseData.dataList.AttList) {
          //   "fullName": "",
          //   "updateFullName": "整测测",
          let dataList = response.data.responseObject.responseData.dataList;
          let baseListData = dataList.baseList && dataList.baseList[0];
          // 如果有值
          if (baseListData) {
            this.baseList.fullName = baseListData.fullName;
            this.baseList.updateFullName = baseListData.updateFullName;
            this.baseList.type = (baseListData.type === 2 || baseListData.type === 3) ? baseListData.type : '';// 类别自定义字段，链条时修改
            this.baseList.brandNameList = baseListData.brandNameList; // 类别自定义字段，链条时修改
            this.baseList.workplace = baseListData.workplace;
            this.baseList.updateWorkplace = baseListData.updateWorkplace;
          }

          let newList = [], item, newItem;

          // 新老数据的区别仅为是否有isNew属性,isNew为true,则为新数据
          for (let i = 0; i < dataList.AttList.length; i++) {
            item = dataList.AttList[i];

            // 默认存在的数据都有老数据
            item.isNew = false;
            item.isChangePage = true;
            newList.push(item);
            // 如果有任意一个变更值不为空,则认为是有新数据
            if (!!item.updateAttCode || !!item.updateAttFormat || !!item.updateAttPath || !!item.updateAttType) {
              newItem = {};
              newItem.isNew = true;
              newItem.isChangePage = true;
              // 重新深复制
              for (var key in item) {
                newItem[key] = item[key];
              }
              // attCode 与 updateAttCode 不相等   attPath updateAttPath 不相等
              if (!(newItem.attCode === newItem.updateAttCode && newItem.attPath === newItem.updateAttPath)) {
                newItem.isNew = true;
                newList.push(newItem);
              }
            }
          }
          this.attList = newList;
        }
        comm.closeLoading();
      }).catch((e) => {
        comm.closeLoading();
        console.log('拉取表格数据失败：', e);
      });
      // 获取拒绝原因
      this.getRefuseMapList();
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
    showStateFormatter(row, column, cellValue) {
      let value = parseInt(row.type),
        valueDesc = '';
      // 展示认证状态（ 2-(v1通过)、3-(v1拒绝)）
      switch (value) {
        case 0:
          valueDesc = '不限';
          break;
        case 2:
          valueDesc = '厂家';
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
    // 有修改改变状态
    stateChange() {
      !this.isChange && (this.isChange = true);
    },
    // 审核变更_v1、v2审核通过/拒绝  与memberAudit接口一样保持不变
    updateAuthState(state, refuseData) {
      if (!this.baseList.type && this.refuseData.state !== 3) {
        this.$tipMessage(true, 'info', '请选择类别', this.$el.getAttribute('class'), 0);
        return false;
      }
      comm.openLoading('审核中...');
      this.isChange = false;
      axios({
        method: apiConfig.updateAudit.type,
        url: apiConfig.updateAudit.url,
        data: Object.assign({
          customerId: this.customerId,
          opIP: this.opIP,
          visitSiteId: 25,
          updateAuthState: state,
          resourceId: this.resourceId,
          auditId: this.auditId,
          auditor: localStorage.getItem('userLoginName'),
          type: this.baseList.type, // 新增加两个字段传过去，一个是类型，一个是品牌名
          brandName: this.baseList.currentBrandName,
          brandId: this.baseList.brandId,
          medId: this.medId,
          roleId: 15
        }, refuseData)
      }).then((response) => {
        // 拉取下一条
        this.getNext(response);
      });
    },
    // 拉取下一条
    getNext() {
      var _this = this;
      let auditState = localStorage.getItem('companyState');
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
            showState: response.data.responseObject.responseData.dataList[0].showState,
            auditId: response.data.responseObject.responseData.dataList[0].id,
            resourceId: response.data.responseObject.responseData.dataList[0].resourceId,
            params: _this.params
          }));
          // 更新auditState
          // let auditStateNew = response.data.responseObject.responseData.dataList[0].auditState;
          let auditTypeeNew = response.data.responseObject.responseData.dataList[0].auditType;

          // 审核类型(1-首次提交2-变更提交3-补全信息4-重新提交)
          if (parseInt(auditTypeeNew) !== 2) {
            comm.closeLoading();
            this.$router.push({
              path: '/companyAuditDetail'
            });
          }
          else {
            // 是当前页则 重新 赋值 状态,并重新拉取基础数据
            this.customerId = response.data.responseObject.responseData.dataList[0].customerId;
            this.auditType = response.data.responseObject.responseData.dataList[0].auditType;
            this.resourceId = response.data.responseObject.responseData.dataList[0].resourceId;
            this.auditId = response.data.responseObject.responseData.dataList[0].id;
            this.showState = response.data.responseObject.responseData.dataList[0].showState;
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
    // 获取拒绝原因
    getRefuseMapList() {
      const _this = this;
      // 获取拒绝问题数据
      axios({
        method: apiConfig.getRefuseMapList.type,
        url: apiConfig.getRefuseMapList.url,
        params: {
          scene: 8,
          customerId: this.customerId,
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
          customerId: this.customerId,
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
    changeRefuseOnClick(data) {
      this.refuseData.state = data;
      this.refuseData.canShow = true;
      this.refuseData.title = '变更拒绝';
    },
    // 确认拒绝理由
    refuseConfirmHandle(data) {
      const state = this.refuseData.state;
      if (state !== -1 && data.refuseList.length > 0) {
        this.updateAuthState(state, data);
      }
      // 关闭拒绝弹窗
      this.refuseData.canShow = false;
    }
  },
  watch: {
    isChange(newVal, oldVal) {
      if (this.isChange) {
        this.$tipMessage(true, 'info', '变更通过后，修改信息将保存', this.$el.getAttribute('class'), 0);
      }
      else {
        this.$tipMessage(false, 'info', '变更通过后，修改信息将保存', this.$el.getAttribute('class'), 0);
      }
    }
  },
  beforeMount() {
    this.medId = JSON.parse(localStorage.getItem('companyAuditCurrentData')) && JSON.parse(localStorage.getItem('companyAuditCurrentData')).medId;
    this.customerId = JSON.parse(localStorage.getItem('companyAuditCurrentData')) && JSON.parse(localStorage.getItem('companyAuditCurrentData')).customerId;
    this.params = JSON.parse(localStorage.getItem('companyAuditCurrentData')) && JSON.parse(localStorage.getItem('companyAuditCurrentData')).params;
    this.auditType = JSON.parse(localStorage.getItem('companyAuditCurrentData')) && JSON.parse(localStorage.getItem('companyAuditCurrentData')).auditType;
    this.showState = JSON.parse(localStorage.getItem('companyAuditCurrentData')) && JSON.parse(localStorage.getItem('companyAuditCurrentData')).showState;
    this.resourceId = JSON.parse(localStorage.getItem('companyAuditCurrentData')) && JSON.parse(localStorage.getItem('companyAuditCurrentData')).resourceId;
    this.auditId = JSON.parse(localStorage.getItem('companyAuditCurrentData')) && JSON.parse(localStorage.getItem('companyAuditCurrentData')).auditId;
    this.memberAuditIndex = localStorage.getItem('companyAuditIndex') ? localStorage.getItem('companyAuditIndex') : '';
    this.params.firstResult = parseInt(this.params.firstResult) + parseInt(this.memberAuditIndex);
    this.params.maxResult = 1;
  },
  mounted() {
    // 如果type 不对跳转至对应页面
    if (parseInt(this.auditType) !== 2) {
      console.log('跳转了新页面!');
      this.$router.push({
        path: '/companyAuditDetail'
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

      .update .el-input__inner {
        border: 4px solid red;
      }

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

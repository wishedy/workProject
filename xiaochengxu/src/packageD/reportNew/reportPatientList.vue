<!--我的就诊人列表页面-->
<template>
  <div>
    <div class="head">
      请选择就诊人，让我知道您是谁
    </div>
    <section class="patient-list">
      <section class="patient" :class="{'non-start':item.stateText==''}" v-for="(item,index) in patientList" :key="index" @click="selectPatient(item)">
        <div class="name">
          <span class="patient-name">{{item.patientName}}</span>
          <span class="patient-info">&nbsp;&nbsp;{{item.patientSex==1?"男":"女"}}&nbsp;&nbsp;{{item.patientAge}}岁</span>
        </div>
        <div class="state" v-if="item.stateText!=''">
          {{item.stateText}}
        </div>
        <!-- 健康卡标识 -->
        <section class="patientItem-card" v-if="false"></section>
      </section>
    </section>
    <form action="" @submit="formSubmit" report-submit="true">
      <button class="add-patient" @click="addPatient" formType="submit">
        <img src="https://m.allinmed.cn/static/image/mp/index/1.2.0/add.png" alt="">
        添加就诊人
      </button>
    </form>
    <logo-loading v-if="loading"></logo-loading>
  </div>
</template>

<script type="text/ecmascript-6">
  import api from "common/js/util/util";
  import getReportList from "common/js/report/getReportList";//获取跳转路径
  import storage from "localStorage";
  import logoLoading from 'components/LogoLoading';
  import dataLog from "common/js/dataLog/dataLog";
  import sendFormId from "common/js/HttpRequest/sendFormId";

  import {createNamespacedHelpers} from 'vuex';
  const {mapState, mapActions, mapMutations} = createNamespacedHelpers('reportNew');

  const XHRList = {
    getPatientList: api.httpEnv() + '/mcall/customer/patient/baseinfo/v1/getPatientList/',  // 获取就诊人
    getPath: api.httpEnv() + '/mcall/patient/report/content/v2/getReportList/',  // 跳转/获取报道信息页
  };

  export default {
    name: "reportPatientList",
    data() {
        return {
          loading:0,
          patientList:[],
          doctorId:'',
          customerId:'',
          isCoverCity:false,   // 定位城市 默认不在范围内 或 定位失败
        }
    },
    computed:{
      ...mapState(['reportId','doctorCustomerId','patientId','caseId','customerId','doctorId'])
    },
    onLoad(options){
      wx.removeStorageSync('backIndex');
      if(options.doctorId){
        this.doctorId = options.doctorId;
      }else{
        this.doctorId = this.doctorCustomerId;
      }
      if( options.patientCustomerId){
        this.customerId = options.patientCustomerId;
      }else{
        this.customerId = storage.getItem("userId");
      }
      if(!this.customerId){
        wx.redirectTo({
          url: '/packageD/doctorHome/doctorHome?scene='+this.doctorId
        })
      }
    },
    onShow(){
      let _this = this;
      _this.loading=0;
      // api
      // .getLocationCity({
      //   name: "北京市"
      // })
      // .then(res => {
      //   console.log(res);
      //   if ((!res.isfail&&res.isCover)) {
      //     // 定位城市在 所属范围
      //     _this.isCoverCity = true;  // 定位城市
      //   }
      // });
      _this.getPatientList();
      dataLog.enterBrowse({
        resourceId:JSON.stringify({
          doctorId:_this.doctorCustomerId
        })
      })
    },
    onHide(){
      dataLog.leaveBrowse();
    },
    components:{
      logoLoading
    },
    methods:{
      ...mapMutations(['setCaseId','setReportId','setPatientId']),
      formSubmit(e) {
        sendFormId(e.target.formId);
      },
      // 获取就诊人列表
      getPatientList(){
        let _this = this;
        _this.loading++;
        api.ajax({
          url: XHRList.getPatientList,
          method: "POST",
          data: {
            patientCustomerId: this.customerId,
            doctorId: this.doctorId,
            firstResult: 0,
            maxResult: 100,
          },
          done(res) {
            _this.loading--;
            if (res && res.responseObject&&res.responseObject.responseData) {
              _this.patientList = res.responseObject.responseData.dataList;
              for (let i = 0; i < _this.patientList.length; i++) {
                  let item = _this.getState(_this.patientList[i].reportState);
                  _this.patientList[i].stateText = item.text;
                  _this.patientList[i].imgSrc = item.imgSrc;
              }
            }
          }
        }, "loading")
      },
      //添加新就诊人
      addPatient(){
        let _this=this;
        dataLog.createTrack({ // 就诊人列表页面 点击“新增就诊人”
          actionId: 14227,
          browseType:149,
          pushMessageId:JSON.stringify({doctorId:_this.doctorId})
        });
        this.setPatientId(""); // 清空vuex中的patientId

        if (this.isCoverCity) {
          // 银川地区 健康卡用户少于5个
          wx.showModal({
            title: '温馨提醒',
            content: '领取居民健康卡有利于医生了解您的病 情，建议为本人领取。',
            showCancel:false,
            cancelText : '跳过',
            cancelColor: '#555555',
            confirmText: '确认',
            confirmColor: '#00BEAF',
            success: function(res) {
              if (res.confirm) {
                // 确认
                wx.navigateTo({
                  url:`/packageD/healthCard/healthCardRecognition?from=reportNew`
                })
              } else if (res.cancel) {
                // 取消
              }
            }
          })
        } else {
          // 其他
          wx.navigateTo({
            url: '/packageD/reportNew/reportAddPatient?customerId=' + this.customerId
          });
        }
      },
      // 选择一位患者
      // 报到状态;1-未开始 2未完成 3完成
      selectPatient(patient){
        let _this = this;
        _this.setCaseId(patient.caseId);
        _this.setReportId(patient.reportId);
        _this.setPatientId(patient.patientId);
        dataLog.createTrack({
          actionId: 14228,
          browseType:149,
          pushMessageId:JSON.stringify({doctorId:_this.doctorCustomerId,patientId:patient.patientId,reportState:patient.reportState})
        });
        if (this.isCoverCity) {
          // 银川地区 未注册健康卡
          wx.showModal({
            title: '温馨提醒',
            content: '领取居民健康卡有利于医生了解您的病 情，建议为本人领取。',
            // showCancel:false,
            cancelText : '跳过',
            cancelColor: '#555555',
            confirmText: '确认',
            confirmColor: '#00BEAF',
            success: function(res) {
              if (res.confirm) {
                wx.navigateTo({
                  url:`/packageD/healthCard/healthCardRecognition?from=reportNew`
                })
              } else if (res.cancel) {
                _this.reportStateGoto(patient);
              }
            }
          })
        } else {
          // 其他
          _this.reportStateGoto(patient);
        }
      },
      reportStateGoto(patient){
        let _this = this;
        switch (patient.reportState){
            case 1: // 未开始
              if(patient.isIdCardExist){  // 有身份证 进入就诊信息-就诊方式页面
                wx.navigateTo({
                  url: '/packageD/reportNew/patientInfo'
                });
              }else{
                // 若无身份证号 进入【新建就诊人页面】，自动添加该患者姓名
                wx.navigateTo({
                  url: '/packageD/reportNew/reportAddPatient?patientName=' + patient.patientName+ '&province='+ patient.province + '&city='+patient.city+'&reportState=1'
                });
              }
              break;
            // 未完成
            case 2:
              // 有身份证 进入就诊信息-就诊方式页面
              if(patient.isIdCardExist) {
                _this.getReportPath(patient.reportId)
              }
              //若无身份证号，进入至【新建就诊人页面】
              else{
                wx.navigateTo({
                  url: '/packageD/reportNew/reportAddPatient?patientName=' + patient.patientName+'&reportState=2'
                });
              }
              break;
            case 3: // 已完成
              wx.navigateTo({
                url: `/packageA/imSceneDoctor/imSceneDoctor?caseId=${patient.caseId}&doctorCustomerId=${_this.doctorCustomerId}&patientId=${patient.patientId}&reportId=${patient.reportId}&from=report`
              });
              break;
            default:
              break;
          }
      },
      // 根据当前报到状态，获取报到页面路径
      getReportPath(reportId){
        let _this=this,
            paramData={
              reportId:reportId
            };
        _this.loading++;
        getReportList(paramData).then((res)=>{
          _this.loading--;
          console.log(res)
          if(res.miniPath){
            wx.navigateTo({
              url: '/'+res.miniPath
            });
          }
        });
      },
      // 根据报到状态返回状态提示文字
      getState(state){
        let result;
        console.log("getState")
        switch (state) {
          case 1:
            result = {imgSrc:'https://m.allinmed.cn/static/image/mp/index/1.2.0/unstart.png' ,text:''};  // 报到未开始
            break;
          case 2:
            result = {imgSrc:'https://m.allinmed.cn/static/image/mp/index/1.2.0/uncomplete.png',text:'报到未完成，点击完善信息'};
            break;
          case 3:
            result = {imgSrc:'https://m.allinmed.cn/static/image/mp/index/1.2.0/complete.png',text:'报到已完成，点击这里和医生沟通'};
            break;
          default:
            result = {imgSrc:'https://m.allinmed.cn/static/image/mp/index/1.2.0/unstart.png' ,text:'报到未开始'};
            break;
        }
        console.log(result);
        return result;
      }
    }
  }
</script>

<style lang="scss" scoped>
    .head{
      font-size:40px;
      text-align: center;
      padding-top: 38px;
      font-weight:bold;
    }

    .add-patient{
      margin-top: 54px;
      text-align: center;
      color: #00B9AD;
      font-weight:bold;
      padding-bottom: 80px;
      background-color: #ffffff;
      img{
        width: 32px;
        height: 32px;
        vertical-align: middle;
        margin-bottom:4px;
      }
    }

    .patient-list{
      margin-top: 64px;
      .patient{
        position: relative;
        margin: auto;
        margin-bottom: 26px;
        width:526px;
        box-sizing: border-box;
        background: #F5F7F7;
        padding:28px 32px;
        border:1px solid #E9F0EF;
        border-radius:8px;
        &.non-start{  // 未开始的文字居中。
          // .name{
          //   margin-top:22px;
          // }
        }
        // &.hover-class{
        //   background:rgba(0,185,173,0.1);
        //   box-shadow:0 6px 28px 0 rgba(129,146,149,0.3);
        //   border-radius:8px;
        //   border:1px solid rgba(0,185,173,1);
        //   padding:23px 32px;
        // }
        .name{
          color: #000;
          font-size:32px;
          .patient-name{
            font-weight:bold;
            display: inline-block;
            vertical-align: middle;
            max-width: 216px;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
            color: #00ABA0;
            font-size: 36px;
          }
          .patient-info{
            display: inline-block;
            vertical-align: middle;
            color: #00ABA0;
            font-size: 36px;
          }
        }
        .state{
          color: #90A5A4;
          font-size:26px;
          line-height: 28px;
          height: 28px;
          margin-top: 20px;
        }
        .patientItem-card{
          width:94px;
          height: 34px;
          position: absolute;
          top: 16px;
          right: 0;
          background: url("http://m.allinmed.cn/static/image/mp/index/1.4.0/label.png") no-repeat center;
          background-size: 100% 100%;
        }
      }
    }
</style>

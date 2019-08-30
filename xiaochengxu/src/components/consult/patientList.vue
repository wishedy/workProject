<template>
  <section class="sticky-wrapper">
    <NormalLoading v-if="loading" ></NormalLoading>
    <section class="main-inner">
      <section class="main-inner-content" v-if="isMOblie===1">
        <!--头部-->
        <header class="find-doctor-head">
          <p class="find-doctor-head-tips">{{headTitle}}</p>
        </header>
        <!--患者列表-->
        <section class="patient-list">
          <section class="patient-list-item" v-for="(item, index) in patientList" :class="{'on':currentIndex == index}" v-show="gotPatient" :key="index">
            <figcaption :class="{'women':item.patientSex==2}" @click="toSelectPart(index)" v-if="mobileOnOff">
              <span class="name">{{item.fullName}}</span>
              <span class="sex"> {{item.patientSex == 1?'男':'女'}}</span>
              <span class="age">  {{item.patientAge+'岁'}}</span>
            </figcaption>
            <button :class="{'women':item.patientSex==2}" open-type="getPhoneNumber" @getphonenumber="toSelectPart(index,$event)" v-if="!mobileOnOff">
              <span class="name">{{item.fullName}}</span>
              <span class="sex"> {{item.patientSex == 1?'男':'女'}}</span>
              <span class="age">  {{item.patientAge+'岁'}}</span>
            </button>
          </section>
        </section>
        <section class="add-patient-box" @click="addFun()">
            <form class="add-patient-btn" @submit="formSubmit" report-submit="true">
               <button class="add-btn" type="submit" formType="submit"><i class="icon-add"></i>添加就诊人</button>
            </form>
        </section>
      </section>
      <section class="main-inner-content" v-if="isMOblie===2">
        <!--头部-->
        <header class="find-doctor-head no-phone">
          <img src="https://m1.allinmed.cn/static/image/mp/index/1.6.0/success.png"/>
          <p class="find-doctor-head-tips">医生已收到您的病情描述<br/>选择就诊人后您就可以与医生沟通啦～</p>
        </header>
        <section class="add-patient-box">
          <form class="add-patient-btn" @submit="formSubmit" report-submit="true">
            <button class="add-btn" type="submit" formType="submit" open-type="getPhoneNumber" @getphonenumber="getCoustmerId">选择就诊人</button>
          </form>
        </section>
      </section>
    </section>

    <Toast :content="toastContent" v-if="toastShow"></Toast>
  </section>
</template>

<script type="text/ecmascript-6">
  /**
   * @Desc：患者选择
   * @Usage:
   * @Notify：
   * @Depend：
   *
   * Created by Qiangkailiang/Lichenyang/gubowen on 18/6/11.
   * upDate by liChenYang on 18/08/13
   */
  import api from 'common/js/util/util';
  import localStorage from "localStorage"
  import {mapActions, mapGetters} from "vuex";
  import NormalLoading from "components/loading";
  import Toast from "components/toast";
  import sendFormId from "common/js/HttpRequest/sendFormId";
  import getPhoneAuthorization from 'common/js/miniUtil/GetPhoneAuthorization';
  import dataLog from "dataLog";
  const XHRList = {
    patientInfo: api.httpEnv() + "/mcall/customer/patient/baseinfo/v1/getMapList/", // 获取患者个人信息
    addPatient: api.httpEnv() + "/mcall/customer/patient/relation/v1/create/",//增加患者
    addPatientNew: api.httpEnv() + '/mcall/patient/customer/unite/v1/mobileBungWeixinV2/',//手机号换绑微信/微信绑定手机号(找医生-)
    updatePatient: api.httpEnv() + "/mcall/customer/patient/relation/v1/update/",//修改和删除患者
    patientList: api.httpEnv() + "/mcall/customer/patient/relation/v1/getMapList/",//患者列表
    getPhone: api.httpEnv() + "/mcall/patient/customer/unite/v1/getById/",//获取患者绑定的手机号
  };

  export default {
    data() {
      let mobileOnOff = getPhoneAuthorization.checkPhoneNumber();
      return {
        isMOblie:-1,
        mobileOnOff:mobileOnOff,
        loading:false, // 控制 loading 的显示隐藏
        patientList: [], // 患者列表
        currentIndex: -1, // 第几个患者
        gotPatient: false, // 是否获取到患者列表
        selectFlag:false, // 是否选择了患者，用于点击防抖；
      }
    },
    components:{
      NormalLoading,
      Toast
    },
    computed: {
      ...mapGetters([ 'toastContent', 'toastShow','patientMessage','updatePatientList'])
    },
    watch : {
      updatePatientList (newVal, oldVal) {
        console.log('需要更新患者列表');
        this.getPatientList();
      },
      userInfoEnd(newVal,oldVal){
        console.log(newVal);
        console.log('获取到信息');
        let _this = this;
        _this.mobileOnOff = getPhoneAuthorization.checkPhoneNumber();
      }
    },
    onLoad () {
      this.mobileOnOff = getPhoneAuthorization.checkPhoneNumber();
      if(this.mobileOnOff){
        this.isMOblie=1;
      }else {
        this.isMOblie=2;
      }
      this.currentIndex = -1; // 重置选项
      this.selectFlag = false;
      this.patientList = [];
      if(this.mobileOnOff){
        this.phoneNumber();
      }

      wx.onNetworkStatusChange((res) => {
        this.loading = false;
        console.log("netStatus:");
        console.log(res);
        if (res && !!res.isConnected) {
          this.getPatientList();
        } else {

        }
      });

    },
    mounted() {
      let _this = this;
      _this.mobileOnOff = getPhoneAuthorization.checkPhoneNumber();
    },
    methods: {
      ...mapActions([ 'showToast', 'setPatientMessage', 'setUpdatePatient', 'setIsLogin','userInfoEnd']),
      phoneNumber(){
        this.mobileOnOff = getPhoneAuthorization.checkPhoneNumber();
        this.getPatientList();
        this.setPatientMessage({});
        this.setUpdatePatient({});
        localStorage.removeItem("freshCache");
        localStorage.removeItem("_amChannel");

        localStorage.removeItem("patientMessage");
        localStorage.removeItem("questionDetail");
        localStorage.removeItem("questionOneDes");
        localStorage.removeItem("questionTwoDes");
      },
      /** 发送formId */
      formSubmit(e) {
        sendFormId(e.target.formId);
      },
      /** 获取患者列表 */
      getPatientList() {
        const _this = this;
        this.gotPatient = false;
        this.loading = true;
        let _data = {
          customerId:localStorage.getItem("userId"),
          isValid: "1",
          firstResult: "0",
          maxResult: "9999",
        };
        if (_this.scene == 'report') {
          _data.caseType = '14';
          _data.doctorId=localStorage.getItem("doctorId");
        }
        api.ajax({
          url: XHRList.patientList,
          method: "POST",
          data: _data,
          done(param) {
            _this.gotPatient = true;
            _this.count = param.responseObject.responseData.totalCount;
            if (param.responseObject.responseMessage == "NO DATA") {
              console.log("没有患者");
              _this.setIsLogin(true);
              _this.$emit("redirectPatientCb");
            } else {
              param.responseObject.responseData.dataList.forEach((e, i) => {
                e.fullName = e.patientName.length > 4 ? e.patientName.substring(0, 4) + '...' : e.patientName;
              });
              _this.patientList = param.responseObject.responseData.dataList.reverse();
            }
            _this.loading = false;
          },
          fail(err) {
            console.log(err);
          }
        })
      },
      /** 添加患者按钮 */
      addFun() {
        if(this.scene == "consult"){
          dataLog.createTrack({
            actionId: 14158,
            browseType:"107",
            opDesc:"患者选择-快速咨询（小程序）"
          });
        }else if(this.scene == "findDoctor"){
          dataLog.createTrack({
            actionId: 14158,
            browseType:"90",
            opDesc:"选择就诊人-找医生（小程序）"
          });
        }
        this.setUpdatePatient({});
        this.toAddPatient();
      },
      /** 去往添加患者 */
      toAddPatient() {
        this.setIsLogin(true);
        console.log("toAddPatient");
        this.$emit("addPatientCb");
      },
      // 未授权获取手机号吗
      getCoustmerId(info){
        let _this=this;
        if(info){
          let e = info.mp;
          console.log(e);
          getPhoneAuthorization.init({
            info:e,
            cancelBack(){
              console.log('未获取用户手机号');
            },
            successBack(){
              _this.phoneNumber();
            }
          });
        }else{
          _this.phoneNumber();
        }
      },
      /** 去选择部位 */
      toSelectPart(index,info) {
        console.log(info);
        let _this = this;
        let originalFunc = ()=>{
          _this.currentIndex = index;
          if (_this.selectFlag) return;
          _this.selectFlag = true;
          _this.setPatientMessage( {
            partId:'',
            userId: localStorage.getItem("userId"),
            sex: parseInt(_this.patientList[index].patientSex),
            age: _this.patientList[index].patientAge,
            patientId: _this.patientList[index].patientId,
            patientName: _this.patientList[index].patientName,
            count: _this.count,
            height: _this.patientList[index].height ? _this.patientList[index].height : "",
            weight: _this.patientList[index].weight ? _this.patientList[index].weight : ""
          });

          if (_this.patientList[index].mobile.length) {
            _this.$emit("selectPatientCb",_this.patientList[index]);
          } else {
            dataLog.createTrack({
              actionId: 14157,
              keyword:_this.patientList[index].patientName
            });
            _this.showToast('请先完善患者信息');
            _this.setUpdatePatient({
              patientId: _this.patientList[index].patientId,
              patientName: _this.patientList[index].patientName,
              sex: parseInt(_this.patientList[index].patientSex),
            });
            _this.toAddPatient();
          }
          _this.selectFlag = false;
        };
        if(info){
          let e = info.mp;
          console.log(e);
          getPhoneAuthorization.init({
            info:e,
            cancelBack(){
              console.log('未获取用户手机号');
            },
            successBack(){
              originalFunc();
            }
          });
        }else{
          originalFunc();
        }


      },
    },
    props: {
      headTitle:{
        type:String,
        default:'完善病情资料后，我们将推荐优质医生为您提供咨询服务。'
      },
      scene:{
        type:String,
        default:"consult"
      }
    }
  };
</script>
<style lang="scss">
  html, body {
    width: 100%;
    height: 100%;
  }

  .sticky-wrapper {
    height: auto;
    min-height: 100%;
    box-sizing: border-box;
  }

  .main-inner {
    /*width: 100%;*/
    background: #fff;
    height: 100%;
    /*padding: 0 30px;*/

  }

  .main-inner-content {
    overflow: hidden;
    position: relative;
  }

  // 患者自己找医生进来的头部
  .find-doctor-head {
    padding: 60px 66px 18px;
    &.no-phone{
      text-align: center;
      padding: 26px;
      img{
        width:240px;
        height:240px;
        margin-bottom: 68px;
        margin-top: 60px;
      }
    }
    .find-doctor-head-tips {
      font-size: 40px;
      color: #222222;
      font-weight: bold;
      opacity: 1;
      letter-spacing: 1px;
    }
  }
  .patient-list {
    font-size: 0;
  }

  .patient-list-item {
    box-sizing: border-box;
    display: inline-block;
    vertical-align: middle;
    padding: 0 100px;
    width: 100%;
    & > figcaption {
      border: 1px solid #CCCCCC;
      box-sizing: border-box;
      width: 100%;
      margin-top: 30px;
      font-size: 32px;
      height: 100px;
      /*min-width: 164px;*/
      /*max-width: 338px;*/
      padding: 34px 0 34px 118px;
      /*border: 1px solid #EDEDED;*/
      line-height: 1;
      border-radius: 10px;
      background: url("https://m.allinmed.cn/static/image/mp/consult/boy@2x.png") no-repeat 40px center;
      background-size: 40px 40px;
      font-weight: bold;
      .name {
        border-left: 1px solid #CCCCCC;
        padding-left: 40px;
        height: 36px;
        font-size: 32px;
        color: #444444;
        letter-spacing: 0;
        line-height: 36px;
        margin-right: 20px;
      }
      .sex {
        margin-right: 20px;
      }
      &.women {
        background: url("https://m.allinmed.cn/static/image/mp/consult/girl@2x.png") no-repeat 40px center;
        background-size: 40px 40px;
        .name {
          border-left: 1px solid #CCCCCC;
        }
      }
    }
    &.on {
      & > figcaption {
        border: 1px solid #2EA9FE;
        background-color: rgba(217, 239, 255, 1);
        &.women {
          border: 1px solid #FE8178;
          background-color: rgba(240, 214, 209, 0.5);
        }
      }
    }
  }

  .add-patient-box {
    border-radius: 16px;
    background-color: white;
    margin-bottom: 70px;
    margin-top: 60px;
    width: 100%;
    padding: 0 100px;
    box-sizing: border-box;
    /*有患者列表时的添加患者*/
    .add-patient-btn {
      text-align: center;
      display: block;
      border: 1px solid #2EA9FE;
      border-radius: 10px;
      font-size: 32px;
      color: #2EA9FE;
      line-height: 100px;
      height: 100px;
      position: relative;
      .add-btn {
        background: #2EA9FE;
        padding: 0;
        margin: 0;
        font-size: 32px;
        line-height: 100px;
        color: #fff;
      }
      .icon-add {
        content: '';
        display: inline-block;
        width: 40px;
        height: 40px;
        // background: url("https://m.allinmed.cn/static/image/img00/findDoctor/add.png") no-repeat;
        background: url("https://m1.allinmed.cn/static/image/mp/index/1.6.0/add-white.png") no-repeat;
        background-size: 100% 100%;
        vertical-align: sub;
        margin-right: 10px;
      }
    }
  }
</style>

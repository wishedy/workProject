<template>
  <div class="report" :class="[{'bgWhite':successFlag},{'bgWhite':authorizationFlag},{'bgGray':successFlag&&!authorizationFlag}]">
    <ul v-if="!successFlag&&!authorizationFlag">
      <li v-for="(item,index) in dataList" :key="index" @click="goTo(item)">
        <div class="doctorInfo">
          <image :src="item.doctorUrl"></image>
          <div class="baseInfo">
            <div class="info"><span class="name">{{item.doctorName}}</span><span>{{item.medicalTitle}}</span></div>
            <div class="company">{{item.company}}</div>
          </div>
        </div>
        <div class="patientInfo">
          <div v-if="item.patientName.length>0" class="mb10"><label class="patientName">患者姓名</label><span>{{item.patientName}}</span></div>
          <div v-if="item.reportState ==0"><label>系统提示</label><span class="InfoContent">{{item.messageContent}}</span></div>
          <!--<div v-if="item.patient.type =='fenzhens'"><label >分诊医生</label><span>{{item.patient.message}}</span></div>-->
          <div v-if="item.reportState ==1"><label>{{item.doctorName}}</label><span class="InfoContent">{{item.messageContent}}</span></div>
          <div v-if="item.reportState ==2"><label>{{item.messageName}}</label><span class="InfoContent">{{item.messageContent}}</span></div>
          <div class="arrow"></div>
        </div>
      </li>
    </ul>
    <div class="success" v-if="successFlag&&!authorizationFlag">
      <img src="/static/images/bg-icon@2x.png"/>
      <h3 class="title">暂无报到医生</h3>
      <p class="text">请扫描就诊时医生提供的报到二维码与医生快速建立联系</p>
    </div>
    <ensureConfirm v-if="ensureShow" :ensureParams="ensureParams" @ensureClickEvent="goToSetting"></ensureConfirm>
    <div class="authorization" v-if="authorizationFlag">
      <img src="/static/images/report/authorization.png"/>
      <div class="text">获取信息失败，请先授权</div>
      <button @getuserinfo="getAuthorize" open-type="getUserInfo">去授权</button>
    </div>
  </div>
</template>
<script>
  import api from "common/js/util/util"
  import miniLogin from "common/js/miniUtil/miniLogin";
  import ensureConfirm from "components/ensure";

  const XHRList = {
    getSession: api.httpEnv() + "/mcall/wx/api/v1/jscode2session/",
    doctorInfo: api.httpEnv() + "/mcall/customer/auth/v1/getMapById/"
  };
  export default {
    data() {
      return {
        dataList: [],
        successFlag: false,
        ensureShow: false,
        ensureParams: {
          content: "唯医骨科需获取您的授权信息，以方便您后续使用",
          ensure: "确定"
        },
        authorizationFlag: true,
        toPatient:''
      }
    },
    computed: {},
    components: {
      ensureConfirm
    },
    methods: {
      messageType(item) {
        // let message = '';
        // switch (item.patient.type) {
        //   case 'message':
        //     message = '系统提示';
        //     break;
        //   case 'fenzhen':
        //     message = '分诊医生';
        //     break;
        //   case 'doctor' :
        //     console.log(item.doctor.name);
        //     message = item.doctor.name;
        //     break;
        //   default :
        //     message = '系统提示';
        // }
        // this.messageTypeShow = message;
      },
      goTo(item) {
        let patientId = item.patientId;
        let reportId = item.reportId;
        let caseId = item.caseId;
        let doctorCustomerId = item.doctorId;
        console.log(item)
        wx.removeStorageSync("alreadyCreateIm");
        wx.setStorageSync("patientInfo",JSON.stringify({
          patientName: item.patientName,
          patientId: item.patientId,
          patientSex: item.patientSex,
          patientAge: item.patientAge
        }));
        if (item.reportState == 1||item.reportState == 2) {
          // wx.removeStorageSync("qrHasClosed");
          wx.setStorageSync("reportId",reportId+"");
          wx.setStorageSync("patientId",patientId);
          wx.setStorageSync("caseId",caseId);
          wx.setStorageSync('doctorId',doctorCustomerId);
          wx.navigateTo({
            url: '/packageA/imSceneDoctor/imSceneDoctor?caseId=' + caseId + '&doctorCustomerId=' + doctorCustomerId + '&patientId=' + patientId + '&reportId=' + reportId + '&from=reportList'
          })
        } else {
          wx.setStorageSync("reportId",reportId+"");
          wx.setStorageSync("patientId",patientId);
          wx.setStorageSync("caseId",caseId);
          wx.setStorageSync('doctorId',doctorCustomerId);
          wx.navigateTo({
            url: '../../packageD/questionDesc/questionDesc'
          })
        }
      },
      getMyDoctorList() {
        let _this = this;
        api.codeRecord("/pages/report/report");
        if(_this.toPatient){
          wx.navigateTo({
            url: '/pages/addPatient/addPatient'
          });
        }
        api.ajax({
          url: api.httpEnv() + '/mcall/patient/report/improvement/v1/getMapByCustomerId/',
          method: "POST",
          data: {
            customerId: wx.getStorageSync("userId"),
            isValid: '1',
            visitSiteId: api.getSiteId()
          },
          done(res) {
            if (res.responseObject.responseStatus) {
              if (res.responseObject.responseData&& res.responseObject.responseData.data_list) {


                res.responseObject.responseData.data_list.forEach((ele,index)=>{
                  if(ele.patientName.length>4){
                    ele.patientName=ele.patientName.substr(0,4)+'...'
                  }
                  if(ele.doctorName&&ele.doctorName.length>10){
                    ele.doctorName=ele.doctorName.substr(0,10)+'...'
                  }
                  // if(ele.messageName&&ele.messageName.length>4){
                  //   ele.messageName=ele.messageName.substr(0,4)+'...'
                  // }
                });



                _this.dataList = res.responseObject.responseData.data_list;

                if (_this.dataList.length == 0) {
                  _this.successFlag = true;
                }
              }else{
                _this.successFlag = true;
              }
            }
          }, fail(error) {
            console.log(error);
          }
        })
      },
      // getUserInfo() {
      //   let _this = this;
      //   wx.getSetting({
      //     success: function (res) {
      //       console.log(res);
      //       if (res.authSetting['scope.userInfo']) {
      //         miniLogin({
      //           successCallBack: function (res) {
      //             if (res.data.responseObject.responseStatus) {
      //               _this.getMyDoctorList();
      //             }
      //           }
      //         });
      //       } else {
      //         _this.goToSetting();
      //       }
      //     }
      //   })
      //
      //
      // },
      // openSetting(res){
      //     console.log(res);
      // },
      goToSetting() {
        let _this = this ;
        // wx.getSetting({
        //   success: (res) => {
        //     if (res && res.authSetting["scope.userInfo"]) {
        //       _this.getLoginInfo();
        //     }else{
              wx.openSetting({
                success(res){
                  if(res&&res.authSetting["scope.userInfo"]){
                    _this.getLoginInfo();
                  }
                },
                fail(error){
                    console.log(error);
                }
              })
        //     }
        //   },fail:(error)=>{
        //     console.log(error)
        //   }
        // })

      },
      getAuthorize(obj) {
        if (obj.target.userInfo) {
          this.ensureShow = false;

          this.getLoginInfo();
        } else {
          this.ensureShow = true;
        }
      },
      getLoginInfo() {
        let _this = this;
        _this.authorizationFlag = false;
        _this.ensureShow = false;
        miniLogin({
          successCallBack: function (res) {
            if (res.data.responseObject.responseData.mobile && res.data.responseObject.responseData.mobile.trim().length > 0) {
              _this.getMyDoctorList();
            }else{
              wx.redirectTo({
                url: '/pages/login/login?backPage=report'
              });
            }
          }
        });
      },
      getDoctorInfo(){
        api.ajax({
          url: XHRList.doctorInfo,
          method: "POST",
          data: {
            customerId: wx.getStorageSync("doctorId"),
            logoUseFlag: 3
          },
          done(res) {
            if (res && res.responseObject.responseData && res.responseObject.responseData.dataList) {
              let doctorMain = res.responseObject.responseData.dataList[0];
              wx.setStorageSync("doctorName", doctorMain.authMap.fullName);
            }
          }
        })
      }
    },
    onLoad(options) {
      console.log("onLoad");
      let _this = this ;
      if (decodeURIComponent(options.scene) == "undefined") {
      } else {
        //  _this.toPatient = decodeURIComponent(options.scene);
          wx.setStorageSync("doctorId",  decodeURIComponent(options.scene));
          api.codeRecord(options.scene.toString());
        _this.getDoctorInfo();
      }
      api.codeRecord("/pages/report/report");


      wx.getSetting({
        success: (res) => {
          console.log(res);
          if (res && res.authSetting["scope.userInfo"]) {
            _this.getLoginInfo();
          }else{

          }
        },fail:(error)=>{
          console.log(error)
        }
      })
    }
  };
</script>
<style lang="scss" scoped>
  @import '../../../static/scss/base.scss';

  .report {
    background: #F2F4F7;
    min-height: 100%;
    padding: 20px 20px 0;
    box-sizing: border-box;
    float: left;
    width: 100%;
    &.bgWhite {
      background: #fff;
      padding: 212px 20px 0;
      height: 100%;
    }
    &.bgGray{
      padding-top: 240px;
      background: #F2F4F7;
    }
    ul {

      li {
        background: #fff;
        margin-bottom: 20px;
        padding: 32px;
        box-shadow: 0 8px 20px 0 rgba(37, 56, 77, 0.04);
        border-radius: 8px;
        box-sizing: border-box;
        width: 100%;
        float: left;
        .doctorInfo {
          padding-bottom: 20px;
          font-size: 28px;
          color: #909090;
          letter-spacing: 0;
          line-height: 28px;
          border-bottom: 2px solid #F8F8F8;

          image {
            width: 64px;
            height: 64px;
            margin-right: 20px;
            float: left;
            border-radius: 50%;
          }
          .baseInfo {
            @include clearfix();
            display: inline-block;
            overflow: hidden;
            width: 80%;
            .info {
              margin-bottom: 12px;
              .name {
                color:#666666;
                margin-right: 16px;
              }
            }
            .company {
              line-height: 28px;
              width: 100%;

              overflow: hidden;
              text-overflow: ellipsis;
              white-space: nowrap;
            }

          }

        }
        .patientInfo {

          position: relative;
          padding: 32px 80px 0 0;
          .mb10 {
            margin-bottom: 24px;
          }
          label {
            font-size: 32px;
            color: #909090;
            letter-spacing: 0;
            line-height: 32px;
            float: left;
            display: inline-block;
            text-align: right;
            padding-right: 20px;
            min-width: 128px;
          }
          .patientName{
            width: 128px;
          }
          span {
            /*overflow: hidden;*/
            font-size: 32px;
            color: #222222;
            letter-spacing: 0;
            line-height: 32px;
            vertical-align: top;
            margin-left: 148px;
            display: block;
            font-weight: bold;
          }
          .arrow {
            width: 16px;
            height: 26px;
            background: url("https://m.allinmed.cn/static/image/wxmp/report/arrow_doctor_list.png") no-repeat;
            background-size: contain;
            position: absolute;
            right: 20px;
            top: 50%;
            margin-top: 3px;
          }
          .InfoContent{
              overflow: hidden;
              text-overflow: ellipsis;
              white-space: nowrap;
          }
        }
      }

    }
    .success {
      image {
        width: 332px;
        height: 168px;
        display: block;
        margin: 0 auto 46px;
      }
      .title{
        font-size: 36px;
        color: #222222;
        text-align: center;
      }
      .text {
        width: 521px;
        margin: 22px auto;
        font-size: 32px;
        color: #666666;
        letter-spacing: 0;
        text-align: center;
      }
    }
    .authorization{
      background: #fff;
      image {
        width: 360px;
        height: 256px;
        display: block;
        margin: 0 auto 28px;
      }
      .text {
        font-size:28px;
        color: #888888;
        letter-spacing: 0;
        line-height: 28px;
        text-align: center;
        margin-bottom:140px;
      }
      button{
        width:400px;
        height:100px;
        border:2px solid #12D5A8;
        border-radius: 50px;
        line-height: 100px;
        color:#11D5A7;
        display: block;
        margin:0 auto;
      }
    }
  }
</style>

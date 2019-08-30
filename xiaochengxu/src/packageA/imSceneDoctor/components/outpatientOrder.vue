<template>
  <section class="outpatient-order-inner">
    <header class="outpatient-order-header">
      <h2>请选择当天具体时间<span>(单选)</span></h2>
    </header>
    <section class="outpatient-order-info-content">
      <section class="info-container select-time">
        <ul class="time-list" data-alcode-mod='769' data-alcode-item-selector=".time-item">
          <li class="time-item am" data-alcode='e191' v-if="timeinterval == 'AL' || timeinterval == 'AM'" :class="{'selected':timeSeleted==1}" @click="timeSeleted = 1">{{params.month + '-' + params.day}} {{params.weekDay}} 上午</li>
          <li class="time-item pm" data-alcode='e191' v-if="timeinterval == 'AL' || timeinterval == 'pm'" :class="{'selected':timeSeleted==2}" @click="timeSeleted = 2">{{params.month + '-' + params.day}} {{params.weekDay}} 下午</li>
        </ul>
      </section>
      <h3 class="info-title">就诊人信息</h3>
      <section class="info-container patient-info">
        <ul class="patient-info-list" data-alcode-mod='770'>
          <li class="patient-info-item">
            <span class="patient-info-item-left">患者姓名</span>
            <span class="patient-info-item-right">{{patientInfo.patientName}}</span>
          </li>
          <li class="patient-info-item">
            <span class="patient-info-item-left">身份证</span>
            <span class="patient-info-item-right">{{certificateCodeEncrypt}}</span>
          </li>
          <li class="patient-info-item" @click="changeNumber()" data-alcode='e189'>
            <span class="patient-info-item-left phone">手机号</span>
            <span class="patient-info-item-right" v-if="!changePhone"><span class="phone-number">{{telphoneNumber}}</span><span class="change">修改</span></span>
            <span class="patient-info-item-right" v-else>
              <input ref="phoneInput" name="telphoneNumber" v-model="telphoneNumber" class="phone-input" @input="onInput()" @blur="validate()" type="tel" v-validate="'required|mobile'" placeholder="便于接收重要信息">
            </span>
          </li>
        </ul>
      </section>
      <section class="info-container pay-way">
        <span class="pay-way-left">支付方式</span>
        <span class="pay-way-right">去医院支付</span>
      </section>
      <section class="info-container order-tips">
        <p class="order-tips-top">挂号费以医院挂号窗口为主,平台不收取任何费用</p>
        <section class="order-tips-bottom">
          <p class="order-tips-bottom-title">就诊须知：</p>
          <p class="order-tips-bottom-item">停诊将短信通知，请保持手机畅通</p>
          <p class="order-tips-bottom-item">实名制预约，就诊人信息不符将无法取号</p>
        </section>
      </section>
      <section data-alcode-mod='771'>
        <footer data-alcode='e190' v-if="timeSeleted != -1" class="order-submit on" @click="submitForm()">提交</footer>
        <footer v-if="timeSeleted == -1" class="order-submit off">提交</footer>
      </section>
    </section>
    <transition name="fade">
      <Toast :content="toastTips" v-if="toastShow"></Toast>
    </transition>
  </section>
</template>

<script>
  /**
   * @Desc：门诊邀约选择
   * @Usage:
   * @Notify：
   * @Depend：
   *
   * Created by lichenyang on 2018/5/4.
   */
  import Toast from "components/toast"; // toast 框提示组件

  import {createNamespacedHelpers} from "vuex";
  const {mapState} = createNamespacedHelpers('imSceneDoctor');

  import api from 'common/js/util/util';
  import getPatientBase from "common/js/HttpRequest/getPatientBase";

  const XHRList = {
    updateMobile: "/mcall/customer/patient/baseinfo/v1/updateMobile/", // 更新患者手机号
    createOrder: "/mcall/customer/clinic/v1/create/", // 创建预约单
  };

  export default {
    data() {
      return {
        patientInfo:{}, // 患者数据
        params:{}, // 上个路由传过来的参数
        changePhone:false, // 是否修改手机号
        mobileError:false, // 手机号是否有错误
        telphoneNumber:0, // 用户手机号
        toastTips:"", // toast框提示的内容
        toastShow:"", // toast框是否显示
        timeSeleted:-1, // 预约时间选择
        timeinterval:"", // 预约时间展示
      }
    },
    methods: {
      // 修改手机号
      changeNumber () {
        this.changePhone = true;
        setTimeout(() => {
          this.$refs.phoneInput.focus();
        }, 100);
      },
      // 控制手机号输入
      onInput () {
        let content = this.telphoneNumber
          .split("")
          .filter((item, index) => {
            return /^[0-9]*$/.test(item) && index < 11;
          })
          .join("");
        this.telphoneNumber = content;
      },
      // 失焦验证
      validate() {
        this.$validator.validateAll().then(result => {
          console.log(result);
          if (result) {
            this.mobileError = false;
          } else {
            this.mobileError = true;
            console.log(this.$validator.errors);
            this.showToast(this.$validator.errors.items[0].msg)
          }
          this.changePhone = false;
        });
      },
      // 提交表单
      submitForm () {
        if (this.mobileError) {
          this.showToast();
        } else {
          this.updateMobile();
        }
      },
      // 提交预约单信息
      updateMobile () {
        let that = this;
        api.ajax({
          url: XHRList.updateMobile,
          method: "POST",
          data: {
            isValid: 1,                           // string 是   1
            mobile: this.telphoneNumber,                 //  手机号
            patientId: api.getPara().patientId,                       //  string 是  用户id
          },
          beforeSend(config) {

          },
          done(param) {
            console.log(param);
            if (param.responseObject.responseStatus && param.responseObject) {
              that.createOrder();
            } else {
              that.showToast('手机号修改保存失败');
            }
          },
          fail(err) {
            console.log(err);
          }
        })
      },
      // 获取患者数据
      getPatientBase() {
        return getPatientBase({
          patientId: api.getPara().patientId,
        }).then(data => {
          if (data.responseObject && data.responseObject.responseData) {
            let dataList = data.responseObject.responseData.dataList;
            this.patientInfo={
              patientName: dataList[0].patientName,
              age: dataList[0].patientAge,
              sexName: dataList[0].patientSex == 1 ? "男" : "女",
              idcardStatus : dataList[0].idcardStatus === "0" ? false : true,
              certificateCode: dataList[0].certificateCode,
              mobile: dataList[0].mobile,
            };
            this.telphoneNumber=this.patientInfo.mobile;
          }
        });
      },
      // 创建预约单
      createOrder () {
        let that = this;
        let scheduleid;
        if (this.timeinterval.length == 1) {
          scheduleid = this.params.scheduleid[0];
        } else {
          scheduleid = this.params.scheduleid[this.timeSeleted-1];
        }
        api.ajax({
          url: XHRList.createOrder,
          method: "POST",
          data: {
            customerId:api.getPara().doctorCustomerId, //string	是	医生id
            patientId: api.getPara().patientId, //	string	是	患者id
            fullName:that.targetMsg.nick, // 医生名字
            mobile:that.telphoneNumber, // 患者手机号
            isValid:1,	// string	是	是否有效
            hospitalId: that.targetMsg.companyId, //	string	是	医院id
            hospitalName: that.targetMsg.hospital, //	string	是	医院名称
            clinicTime :`${this.params.year}-${this.params.month}-${this.params.day}`, //	string	是	就诊时间
            visitSiteId:api.getSiteId(), // string	是	站点
            status:"1",	// string	是	状态，传1		1
            caseId: api.getPara().caseId,// string	是	病例id
            clinicType:"1", // string	是	门诊预约类型（1-预约中2-预约失败3-预约成功）		1
            timeType:this.timeSeleted, //string	是	门诊预约类型（1-上午2-下午3-全天）
            clinicCode:"", //string	是	门诊预约码
            scheduleid:scheduleid, // 排班id，
            cardno:this.patientInfo.certificateCode, // 身份证号
            // cardno:142703199303112755, // 身份证号
          },
          beforeSend(config) {

          },
          done(param) {
            console.log(param);
            if (param.responseObject.responseStatus && param.responseObject) {
              if (param.responseObject.responsePk == '0') {
                that.showToast(param.responseObject.responseMessage)
              } else {
                sessionStorage.setItem('sendOrderMsg', JSON.stringify({
                  clinicId:param.responseObject.responsePk,
                  patientName:that.patientInfo.patientName,
                  patientSex:that.patientInfo.sexName,
                  patientAge:that.patientInfo.age,
                  patientIdNum:that.certificateCodeEncrypt,
                  clinicTime:`${that.params.year}-${that.params.month}-${that.params.day}`,
                  weekDay:that.params.weekDay,
                  clinicType:'1',
                  timeType:that.timeSeleted == 1 ? '上午':'下午',
                }));
                that.$router.push({
                  name: "baseIm",
                });
              }
            } else {
              console.log('失败');
            }
          },
          fail(err) {
            console.log(err);
          }
        })
      },
      //显示Toast提示
      showToast(text) {
        !!text && (this.toastTips = text);
        this.toastShow = true;
        setTimeout(() => {
          this.toastShow = false;
        }, 2000);
      },
      // 页面初始化
      mountedInit () {
        const dict = {
          en: {
            custom: {
              //手机号的验证
              telphoneNumber: {
                required: "请补全手机号",
                mobile: "请输入正确的手机号码"
              },
            }
          }
        };
        this.$validator.localize(dict);
        this.getPatientBase(); // 获取患者信息
      }
    },
    activated () {
      this.params = JSON.parse(localStorage.getItem('calenderParams'));
      this.timeSeleted = -1;
      document.title = '预约门诊';
      if (this.params.timeinterval.length == 1) {
        this.timeinterval = this.params.timeinterval[0];
      } else if (this.params.timeinterval.length == 2) {
        this.timeinterval = 'AL';
      }
    },
    mounted() {
      this.mountedInit();
    },
    components: {
      Toast,
    },
    computed: {
      ...mapState(['targetMsg']),
      // 将身份证号加密
      certificateCodeEncrypt () {
        if (this.patientInfo.certificateCode && this.patientInfo.certificateCode.length) {
          return this.patientInfo.certificateCode.substr(0,3) + '***********' + this.patientInfo.certificateCode.substr(-4,4);
        } else {
          return "";
        }
      }
    }
  }
</script>

<style lang="scss">
  .outpatient-order-inner{
    background-color: #F2F4F7;
    width: 100%;

  }

  .outpatient-order-header{
    padding-top: 76px;
    padding-bottom: 102px;
    background-image: linear-gradient(0deg, #01D1C2 5%, #039D94 92%);
    padding-left: 48px;
    box-sizing: border-box;
    & > h2{
      font-size: 48px;
      font-weight: normal;
      color: #FFFFFF;
      > span {
        font-size: 36px;
        color: #A3EBE6;
      }
    }
  }

  // 底部提交按钮
  .order-submit{
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    font-size: 32px;
    line-height: 98px;
    text-align: center;
    color: #FFFFFF;
    &.on{
      background: #2EA9FE;
    }
    &.off{
      background: #CCCCCC;
    }
  }


  .outpatient-order-info-content{
    position: relative;
    top: -62px;
    padding: 0 20px;
    padding-bottom: 98px;
    .info-container{
      background: #FFFFFF;
      border-radius: 8px;
      padding: 0 28px;
      &.select-time{
        box-shadow: 0 6px 14px 0 rgba(37,56,77,0.08);
        font-size: 38px;
        color: #222222;
        .time-list{
          .time-item{
            padding: 26px 0;
            position: relative;
            &::before {
              content: "";
              display: inline-block;
              width: 32px;
              height: 32px;
              margin-right: 12px;
              vertical-align: -1px;
            }
            &.am{
              &::before{
                background: url("/static/image/imScene/am_off.png") no-repeat center;
                background-size: contain;
              }
            }
            &.pm{
              &::before{
                background: url("/static/image/imScene/pm_off.png") no-repeat center;
                background-size: contain;
              }
            }
            &::after{
              content: "";
              display: block;
              width: 40px;
              height: 40px;
              position: absolute;
              box-sizing: border-box;
              background: url("/static/image/imScene/select_no.png") no-repeat center;
              background-size: contain;
              right: 0;
              top: 50%;
              margin-top: -20px;
            }
            &.selected{
              color: #29A3A3;
              &.am{
                &::before{
                  background: url("/static/image/imScene/am_on.png") no-repeat center;
                  background-size: contain;
                }
              }
              &.pm{
                &::before{
                  background: url("/static/image/imScene/pm_on.png") no-repeat center;
                  background-size: contain;
                }
              }
              &::after{
                background: url("/static/image/imScene/label_succes.png") no-repeat center;
                background-size: contain;
              }
            }
          }
          .time-item + .time-item{
            border-top: 1px solid #F5F5F5;
          }
        }
      }
      &.patient-info{
        box-shadow: 0 4px 10px 0 rgba(37,56,77,0.04);
        .patient-info-list{
          .patient-info-item{
            line-height: 112px;
            font-size: 30px;
            color: #AAAAAA;
            @include clearfix();
            .patient-info-item-left{
              float: left;
              &.phone{
                font-size: 32px;
                color: #444444;
              }
            }
            .patient-info-item-right{
              float: right;
              .phone-number{
                color: #333333;
                &::after {
                  content: "";
                  display: inline-block;
                  width: 1px;
                  height: 32px;
                  background: #F5F5F5;
                  margin:0 32px;
                  vertical-align: -4px;
                }
              }
              .change{
                color: #29A3A3;
              }
              .phone-input{
                text-align: right;
                border: none;
                font-size: 30px;
                color: #333333;
              }
            }
          }
          .patient-info-item + .patient-info-item{
            border-top: 1px solid #F5F5F5;
          }
        }
      }
      &.pay-way{
        box-shadow: 0 4px 10px 0 rgba(37,56,77,0.04);
        @include clearfix();
        font-size: 32px;
        margin-top: 16px;
        line-height: 128px;
        .pay-way-left{
          float: left;
          color: #444444;
        }
        .pay-way-right{
          float: right;
          color: #AAAAAA;
        }
      }
      &.order-tips{
        box-shadow: 0 4px 10px 0 rgba(37,56,77,0.04);
        margin-top: 16px;
        .order-tips-top{
          // line-height: 110px;
          padding: 36px 0;
          font-size: 30px;
          color: #E34F52;
          border-bottom: 1px solid #F0F0F0;
        }
        .order-tips-bottom{
          font-size: 30px;
          line-height: 1;
          padding: 40px 0 48px;
          .order-tips-bottom-title{
            color: #444444;
          }
          .order-tips-bottom-item{
            color: #909090;
            padding-left: 20px;
            @include clearfix();
            &::before {
              content: "";
              display: block;
              float: left;
              width: 8px;
              height: 8px;
              border-radius: 20px;
              background: #C7C7C7;
              margin-left: -20px;
              margin-top: 11px;
            }
            &:nth-child(2){
              margin-top: 32px;
            }
            &:nth-child(3){
              margin-top: 20px;
            }
          }
        }
      }
    }
    .info-title{
      font-size: 32px;
      color: #555555;
      margin: 48px 0 28px;
      &::before {
        content: "";
        display: inline-block;
        width: 6px;
        height: 20px;
        margin:0 12px;
        background: #2EA9FE;
        font-weight: normal;
      }
    }
  }

</style>

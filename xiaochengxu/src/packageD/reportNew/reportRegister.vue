<template>
  <section class="out-box">
    <section class="doctorInfoBox">
      <img :src="doctorMessage.logoUrl" alt="" class="doctorLogo">
      <div class="doctorInfo">
        <p class="doctorInfoTop">
          <span class="doctorName">{{doctorMessage.fullNameClip}}</span>
          <span class="doctorTitle">{{doctorMessage.medicalTitle}}</span>
        </p>
        <p class="doctorHospital">{{doctorMessage.company}}</p>
      </div>
    </section>
    <section class="loginRegisterBox">
      <article class="phoneInputBox">
        <aside>手机号</aside>
        <figure class="InputBox phone-box">
          <input
            type="number"
            placeholder="请输入手机号"
            @blur="blurValid('phoneMessage','tel')"
            @input="onKeyPress()"
            v-model="phoneMessage"
            placeholder-class="placeholderClass"
            :cursor-spacing=100
          >
          <i v-if="clearPhone" class="icon-clear" @click='clearMessage("phoneMessage")'></i>
        </figure>
      </article>
      <article class="phoneInputBox">
        <aside>验证码</aside>
        <figure class="InputBox code-box">
          <input
            type="number"
            placeholder="请输入"
            @blur="blurValid('codeMessage','code')"
            @input="codeKeyPress()"
            v-model="codeMessage"
            class='codeInput'
            placeholder-class="placeholderClass"
            :cursor-spacing=100
          >
          <i v-if="clearCode" class="icon-clear" @click='clearMessage("codeMessage")'></i>
        </figure>
        <span v-if="!countShow" class="getCode" @click="getCodeApi()">{{getCodeText}}</span>
        <span v-else class="codeCountdown" :class="{'hasContent':codeMessage.length>0}"><i>{{codeTime}}</i>秒后重新获取</span>
      </article>
      <article class="tphoneTips">*手机号仅{{doctorMessage.fullName}}医生可见</article>
    </section>
    <form  class="go-next" @submit="formSubmit" report-submit="true">
      <button class="loginButton" :class="{'next':codeMessage.length && phoneMessage.length}" :disabled='loading || !codeMessage.length && !phoneMessage.length' @click="validLogin()" formType="submit">下一步</button>
      <section class="stipulation">点击按钮表示您同意<i @click="goLoginRule()">《唯医骨科用户注册协议》</i></section>
    </form>
    <LogoLoading v-if="loading"></LogoLoading>
  </section>
</template>

<script>
  /**
   * @Desc：
   * @Usage:
   * @Notify：
   * @Depend：
   *
   * Created by lichenyang on 2018/5/15.
   */
  /**************************Common Methods*************************/
  import WxValidate from "common/js/util/wxValidate";
  /**************************Axios Http Requests*************************/
  import LogoLoading from 'components/LogoLoading';
  import sendCode from "common/js/auth/sendCode"; // 发送验证码
  import getOpenId from "common/js/auth/getOpenId"; // 获取openId
  import validCodeLogin from "common/js/auth/validCodeLogin"; // 验证验证码
  import bindMobile from "common/js/auth/bindMobile"; // 绑定手机号
  import checkBlackList from "common/js/auth/checkBlackList";//校验是否是黑名单用户
  import sendFormId from "common/js/HttpRequest/sendFormId";
  import getPatientList from "common/js/HttpRequest/getPatientList"; // 获取患者列表；
  import dataLog from "dataLog";
  let timerCode = null; // 定时器

  import {createNamespacedHelpers} from "vuex";
  const {mapState} = createNamespacedHelpers('reportNew');

  const XHRList = {
    updateCode:""
  };

  export default {
    name: "index",
    data() {
      return {
        unionId:'',// 微信 unionId
        openId:'',// 微信 openId
        validateObj: {}, // 验证插件对象
        phoneMessage: "", // 手机号码
        codeMessage: "", // 验证码
        tipsMsg: "", // 提示话术
        codeId: "", // 验证码验证id
        wxCode: "", // 微信临时code
        toastImg: {
          wifi: "/static/images/login/wifi@2x.png.png",
          success: "/static/image/success.png"
        },
        countShow: false, // 倒计时计数是否显示
        getCodeText: "获取验证码",
        codeTime: 60, // 验证码有效时间
        toastShow: false, // toastShow 是否显示
        sendCodeFlag: false, // 设置多次点击发送验证码判断
        loading:false,
      };
    },
    methods: {
      /** 发送formId */
      formSubmit(e) {
        if (this.loading) return;
        sendFormId(e.target.formId);
      },
      init() {
        const _this = this;
        this.unionId = wx.getStorageSync('unionId');
        this.openId = wx.getStorageSync('openId');
        _this.doctorId = wx.getStorageSync("doctorId");
        // 验证字段的规则
        const rules = {
          tel: {
            required: true,
            tel: true
          },
          code: {
            required: true
          }
        };
        // 验证字段的提示信息，若不传则调用默认的信息
        const messages = {
          tel: {
            required: "请输入手机号",
            tel: "请输入正确的手机号"
          },
          code: {
            required: "请输入验证码"
          }
        };
        this.wxValidate = new WxValidate(rules, messages);
      },
      // 清空消息
      clearMessage(type) {
        this[type] = "";
      },
      //11位手机号截取
      onKeyPress() {
        let content = this.phoneMessage
          .split("")
          .filter((item, index) => {
            return /^[0-9]*$/.test(item) && index < 11;
          })
          .join("");
        this.phoneMessage = content;
      },
      //4位验证码截取
      codeKeyPress(event, name) {
        let content = this.codeMessage
          .split("")
          .filter((item, index) => {
            return /^[0-9]*$/.test(item) && index < 4;
          })
          .join("");
        this.codeMessage = content;
      },
      // 失焦验证
      blurValid(message, type) {
        return this.wxValidate.checkForm(this[message], type).then(result => {
          if (!result) {
            this.showToast(this.wxValidate.errorList[0].msg);
          }
          return result;
        });
      },
      // 登录按钮验证
      validLogin() {
        let _this=this;
        dataLog.createTrack({
          actionId: 14224,
          browseType:146,
          pushMessageId:JSON.stringify({doctorId:_this.doctorId})
        });
        if (this.loading) return;

        this.blurValid("phoneMessage", "tel").then(result => {
          if (result) {
            _this.isCheckBlack('login');
          } else {
            _this.loginApi();
          }
        });

      },
      //登录API
      loginApi(){
        this.loading = true;
        this.wxValidate
          .checkAll({
            tel: this.phoneMessage,
            code: this.codeMessage
          })
          .then(result => {
            if (result) {
              // this.getWxCode();
              this.submitForm();
            } else {
              this.loading = false;
              this.showToast(this.wxValidate.errorList[0].msg);
            }
          });
      },
      // 获取微信临时code
      getWxCode() {
        wx.login({
          success: res => {
            console.log(res);
            this.wxCode = res.code;
            this.openId();
          },
          fail: err => {
            console.log("获取微信临时code失败");
            console.log(err);
          }
        });
      },
      // 获取openid
      openId() {
        getOpenId(this.wxCode).then(res => {
          console.log(res);
        });
      },
      // 调用验证方法，传入参数 e 是 form 表单组件中的数据
      submitForm() {
        validCodeLogin({
          validCode: this.codeMessage,
          codeId: this.codeId,
          account: this.phoneMessage,
          typeId: 3
        }).then(res => {
          console.log(res);
          if (res.responseObject.responseStatus) {
            if (res.responseObject.responseData) {
              let {responseObject:{responseData:{uniteNameWeixin,uniteNickname,uniteFlagWeixin}}} = res;

              if (uniteFlagWeixin) {
                if (this.unionId != uniteNameWeixin) {
                  this.loading = false;
                  this.showModal({
                    content:"该手机号码已被“" + uniteNickname +"”占用，是否更换绑定为当前微信?",
                    success: (res) =>{
                      if (res.confirm) {
                        console.log('用户点击确定');
                        this.loading = true;
                        this.bindPhone();
                      } else if (res.cancel) {
                        console.log('用户点击取消')
                      }
                    },
                  });
                } else {
                  this.goNextPage();
                  console.log('验证成功');
                }
              } else {
                this.bindPhone();
              }
            }
          } else {
            // 如果是新手机号，则进行绑定
            if (res.responseObject.responseCode == '0B0010') {
              this.bindPhone();
            } else {
              this.loading = false;
              this.showToast(res.responseObject.responseMessage);
            }
          }
        });
      },
      // 去添加患者；
      goNextPage(){
        const _this = this;
        getPatientList().then(param => {
          if (param.responseObject.responseMessage == "NO DATA") {
            console.log("没有患者");
            wx.redirectTo({
              url: `/packageD/reportNew/reportAddPatient`
            });
          } else {
            wx.redirectTo({
              url: `/packageD/reportNew/reportPatientList`
            });
          }
        }).catch( err => {
          console.log(err)
        }).finally( () => {
          _this.loading = false;
        })
      },
      // 绑定手机号
      bindPhone () {
        console.log('我要绑定手机号');
        bindMobile({
          account: this.phoneMessage,
          encryptedData: wx.getStorageSync('encryptedData'),
          sessionKey: wx.getStorageSync('sessionKey'),
          iv: wx.getStorageSync('iv'),
          visitSiteId:'24'
        }).then( res => {
          console.log(res);
          if (res.responseObject.responseStatus) {
            wx.setStorageSync("userId",res.responseObject.responsePk);
            this.goNextPage();
            api.codeRecord();
          }
        });
      },
      //校验是否是黑名单用户
      isCheckBlack(type){
        let _this=this;
        checkBlackList({
          mobile:_this.phoneMessage,
          customerId:wx.getStorageSync('userId'),
          doctorId:_this.doctorCustomerId,
        }).then(res=>{
          if(
            res&&
            res.responseObject&&
            res.responseObject.responseData&&
            res.responseObject.responseData.dataList&&
            res.responseObject.responseData.dataList.length>0
          ){//是黑名单用户
            let dataList=res.responseObject.responseData.dataList[0];
            if(dataList.isBlack){
              wx.showToast({
                title:'该账号违规，暂时无法登录',
                icon:'none'
              });
            }else if(dataList.isShielded){
              wx.showToast({
                title:'与医生沟通时触发敏感词汇，无法向该医生报到',
                icon:'none'
              });
            }else {
              if(type=='login'){
                _this.loginApi();
              }else {
                _this.sendCodeApi();
              }
            }

          }else{
            if(type=='login'){
              _this.loginApi();
            }else {
              _this.sendCodeApi();
            }

          }
        })
      },
      //获取验证码
      getCodeApi() {
        // dataLog.createTrack({
        //   actionId: 14134,
        // });
        let _this = this;
        if (_this.sendCodeFlag) return;
        _this.sendCodeFlag = true;
        this.blurValid("phoneMessage", "tel").then(result => {
          if (result) {
            _this.isCheckBlack();
          } else {
            _this.sendCodeFlag = false;
          }
        });
      },
      sendCodeApi(){
        let _this=this;
        sendCode({
          account: this.phoneMessage,
        })
          .then(res => {
            const data = res;
            console.log(data);
            if (
              data.responseObject.responsePk !== 0 &&
              data.responseObject.responseStatus
            ) {
              this.showToast(
                "验证码已发送",
                "success",
                _this.toastImg.success
              );
              _this.sendCodeFlag = false;
              _this.countDown(60);
              _this.codeId = data.responseObject.responsePk;
            } else {
              this.showToast(data.responseObject.responseMessage);
            }
          })
          .catch(err => {
            console.log(err);
            this.showToast(
              "网络信号差，建议您稍后再试",
              "success",
              _this.toastImg.wifi
            );
          });
      },
      // toast 框提示
      showToast(text, icon = "none", image = "") {
        this.tipsMsg = text;
        if (!this.toastShow) {
          this.toastShow = true;
          wx.showToast({
            title: this.tipsMsg,
            icon,
            image
          });
          setTimeout(() => {
            this.toastShow = false;
            wx.hideToast();
          }, 2000);
        }
      },
      // confirm 框提示
      showModal({ title = "", content,success = () =>{} } = paramObj) {
        wx.showModal({
          title,
          content,
          success,
        });
      },
      //验证码倒计时
      countDown(time) {
        let _this = this;
        let _codeTime = time;
        this.countShow = true;
        _this.codeTime = _codeTime--;
        // _this.getCode = false;
        timerCode = setInterval(() => {
          if (_codeTime > 0) {
            _this.codeTime = _codeTime--;
          } else {
            // _this.getCode = true;
            _this.codeTime = 0;
            this.countShow = false;
            _this.getCodeText = "重新获取";
            clearInterval(timerCode);
          }
        }, 1000);
      },
      // 跳转到唯医互联网骨科协议
      goLoginRule() {
        // dataLog.createTrack({
        //   actionId: 14136,
        //   browseType: "86",
        //   opDesc: "快速登录注册页（小程序）"
        // });
        wx.navigateTo({
          url: "/pages/loginRule/loginRule"
        });
      }
    },
    onLoad(){
      this.phoneMessage = '';
      this.codeMessage = '';
      let query = this.$root.$mp.query.from;
    },
    onUnload(){
      this.phoneMessage = '';
      this.codeMessage = '';
      this.getCodeText = '获取验证码';
      this.countShow = false;
      this.sendCodeFlag = false;
      clearTimeout(timerCode);
    },
    onShow(){
      dataLog.enterBrowse();
    },
    onHide(){
      dataLog.leaveBrowse();
    },
    mounted() {
      this.init();
    },
    computed: {
      ...mapState(['doctorMessage','doctorCustomerId']),
      // 清除手机号的按钮是否展示
      clearPhone() {
        if (this.phoneMessage.length === 11) {
          return true;
        } else {
          return false;
        }
      },
      // 清除验证码的按钮是否展示
      clearCode() {
        if (this.codeMessage.length === 4) {
          return true;
        } else {
          return false;
        }
      }
    },
    components: {
      LogoLoading,
    }
  };
</script>

<style lang="scss" scoped>
  .out-box {
    min-height: 100%;
    background-color: #fff;
    position: relative;
    .go-next{
      position: absolute;
      bottom: 96px;
      width: 100%;
      .loginButton {
        display: block;
        width: 520px;
        line-height: 96px;
        color: #fff;
        background: #CCCCCC;
        border-radius: 8px;
        margin: 0px auto;
        box-sizing: border-box;
        text-align: center;
        font-size: 36px;
        border: none;
        &.next{
          background: #00B9AD;
        }
        &::after,&::before{
          border : none;
        }
      }
      .stipulation {
        display: block;
        color: #a0a0a0;
        font-size: 28px;
        margin-top: 48px;
        text-align: center;
        font-weight: normal;
        i {
          display: inline-block;
          color: #00B9Ad;
        }
      }
    }
  }
  .doctorInfoBox {
    display: flex;
    padding: 60px 60px 0;
    align-items: center;
    .doctorLogo {
      width: 96px;
      height: 96px;
      border-radius: 50%;
    }
    .doctorInfo {
      margin-left: 24px;
      .doctorName {
        color: #25324D;
        font-size: 34px;
      }
      .doctorTitle {
        margin-left: 20px;
        color: #9DA3AF;
        font-size: 30px;
      }
      .doctorHospital{
        color: #9DA3AF;
        font-size: 30px;
      }
    }
  }
  .loginRegisterBox {
    padding: 80px 70px 0;
    .phoneInputBox {
      height: 134px;
      line-height: 140px;
      border-bottom: 1px solid #D8D8D8;
      font-size: 0;
      position: relative;
      & > aside {
        display: inline-block;
        vertical-align: middle;
        width: 196px;
        font-size: 34px;
        color: #666666;
        letter-spacing: 0;
        /*line-height: 34px;*/
      }
      .getCode {
        position: absolute;
        right: 0px;
        top: 0;
        font-size: 34px;
        color: #2FC5BD;
        letter-spacing: 0;
        &::after {
          content: "";
          height: 30px;
          width: 4px;
          background: #ccc;
          position: absolute;
          left: -14px;
          top: 50%;
          margin-top: -15px;
        }
      }
      .codeCountdown {
        position: absolute;
        right: 0px;
        top: 0;
        font-size: 34px;
        color: #777;
        letter-spacing: 0;
        i {
          display: inline-block;
        }
      }
      & > .InputBox {
        position: relative;
        display: inline-block;
        vertical-align: middle;
        /*width: 440px;*/
        font-size: 34px;
        max-width: 380px;
        color: #666666;
        &.birth-box {
          width: 50%;
        }
        &.code-box {
          width: 50%;
        }
        input[disabled] {
          color: #555;
        }
        .icon-clear {
          display: inline-block;
          position: absolute;
          width: 54px;
          height: 54px;
          top: 50%;
          margin-top: -27px;
          right: 150px;
          z-index: 5;
          background: url("https://m.allinmed.cn/static/image/img00/login/close_button.png") center center no-repeat;
          background-size: 38px 38px;
          &::after{
            display: block;
            content: '';
            position: absolute;
            top: -10px;
            left: -10px;
            right: -10px;
            bottom: -10px;
          }
        }

        .contentMessage {
          color: #AAAAAA;
          &.on {
            color: #222222;
          }
        }

        ::-webkit-input-placeholder { /* WebKit browsers */
          color: #AFAFAF;
        }
        :-moz-placeholder { /* Mozilla Firefox 4 to 18 */
          color: #AFAFAF;
          opacity: 1;
        }
        ::-moz-placeholder { /* Mozilla Firefox 19+ */
          color: #AFAFAF;
          opacity: 1;
        }
        :-ms-input-placeholder { /* Internet Explorer 10+ */
          color: #AFAFAF;
        }

        & > input {
          width: 250px;
          height: 100%;
          border: none;
          outline: none;
          /*padding: 26px 30px;*/
          background: none;
          color: #222;
          font-size: 34px;
        }
        & > .codeInput {
          width: 110px;
        }
        &.phone-box {
          width: 380px;
          .icon-clear {
            right: 70px;
          }
        }
      }
    }
    @include clearfix();
    font-size: 40px;
    color: #aaaaaa;
    box-sizing: border-box;
    .tphoneTips{
      margin-top:30px;
      font-size: 34px;
      color: #FC746A;
    }
    p {
      width: 100%;
      border: 1px solid #898989;
      box-sizing: border-box;
      padding: 36px 30px;
      border-radius: 10px;
      font-size: 34px;
      input {
        outline: none;
        border: none;
        color: #101010;
        height: 100%;
        &.hasContent {
          font-size: 40px;
        }
        .placeholderClass {
          color: #aaaaaa;
          font-weight: normal;
        }
      }
      &.phoneInput {
        margin-top: 36px;
        position: relative;
        @include clearfix();
        & > input {
          width: 100%;
          float: left;
          &.hasContent {
            width: 440px;
          }
        }
        .icon-clear {
          display: block;
          position: absolute;
          width: 54px;
          height: 54px;
          top: 50%;
          margin-top: -27px;
          right: 30px;
          background: url("https://m.allinmed.cn/static/image/img00/login/close_button.png")
          center center no-repeat;
          background-size: 38px 38px;
        }
      }
      &.codeInput {
        margin-top: 40px;
        @include clearfix();
        position: relative;
        & > input {
          width: 220px;
          float: left;
        }
        .icon-clear {
          display: inline-block;
          position: absolute;
          width: 54px;
          height: 54px;
          top: 50%;
          margin-top: -27px;
          right: 280px;
          background: url("https://m.allinmed.cn/static/image/img00/login/close_button.png")
          center center no-repeat;
          background-size: 38px 38px;
        }
        &.password {
          .icon-clear {
            right: 83px;
          }
        }
        span {
          width: 38%;
          float: right;
          text-align: right;
        }
        .getCode {
          color: #29a3a3;
          margin-top: 4px;
          &.hasContent {
            margin-top: 16px;
          }
        }
        .codeCountdown {
          width: 50%;
          color: #777777;
          margin-top: 4px;
          i {
            display: inline-block;
          }
        }
      }
    }
    .stipulation {
      display: block;
      color: #a0a0a0;
      font-size: 24px;
      margin-top: 20px;
      font-weight: normal;
      i {
        display: inline-block;
        color: #00D9ad;
      }
    }
  }
</style>

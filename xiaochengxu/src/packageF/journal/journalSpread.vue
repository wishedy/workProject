<template>
  <section class="spread-box">
    <section class="spread-main">
      <div class="doctor-info-box">
        <img class="doctor-icon" :src="doctorInfo.logoUrl.length?doctorInfo.logoUrl:'https://m.allinmed.cn/static/image/img00/doctorMain/doc_logo.png'" alt="">
        <div class="doctor-info">
          <p class="doctor-info-top">
            <span class="doctor-name">
              {{doctorInfo.customerName}}
            </span>
            <span class="doctor-title">
              {{doctorInfo.medical}}
            </span>
          </p>
          <p class="doctor-info-hospital">
            {{doctorInfo.company}}
          </p>
        </div>
      </div>
      <p class="spread-tips">
        请输入手机号，方便与您联系
      </p>
      <section class="login-box">
        <article class="add-patient-content-item">
          <aside>手机号</aside>
          <figure class="add-patient-input ">
            <input type="number" @blur="validateBlur('phone')"
                   @input="inputMaxLength('phone',11)"
                   placeholder-style='color:rgb(170,170,170)'
                   placeholder="请输入手机号码" name="phone" v-model="phone">
          </figure>
        </article>
        <article class="add-patient-content-item">
          <aside>验证码</aside>
          <figure class="add-patient-input code-box">
            <input class='codeInput' type="number" @blur="validateBlur('codeText')"
                   @input="inputMaxLength('codeNumber',4)"
                   placeholder-style='color:rgb(170,170,170)'
                   placeholder="请输入" name="codeInput" v-model="codeNumber">
            <i class="icon-clear" v-if='codeNumber.length' @click.stop='clearTextCode()'></i>
          </figure>
          <span class="codeText" v-if="codeTime<=0" @click.stop="getCodeApi()">{{codeText}}</span>
          <span class="codeCountdown" :class="{'hasContent':codeNumber.length>0}"
                v-if="codeTime>0"><i>{{codeTime}}</i><i>秒后重新获取</i></span>
        </article>
      </section>
      <p class="login-tips">*手机号仅对医生本人可见</p>
    </section>
    <section class="next-box">
      <div class="next-btn" @click="validate()">下一步</div>
      <div class="next-tips">
        点击按钮表示您同意唯医
        <span class="next-agreement" @click="goPageRule()">《唯医骨科用户注册协议》</span>
      </div>
    </section>
    <section class="journal-maskers" v-if="authorizationFlag">
      <section class="journal-confirmBox-inner">
        <article class="journal-confirmBox-content"><p>需要您的授权，才能为您提供更好的服务</p></article>
        <footer class="journal-confirmBox-btns">
          <button class="journal-confirmBox-ensureBtn" @getuserinfo="getAuthorize" open-type="getUserInfo">去授权</button>
        </footer>
      </section>
    </section>
    <ensureConfirm v-if="ensureShow" :ensureParams="ensureParams" @ensureClickEvent="goToSetting"></ensureConfirm>
    <NormalLoading v-if="loading"></NormalLoading>
    <Toast :content="toastContent" v-if="toastShow"></Toast>
  </section>
</template>
<script>
  import api from 'common/js/util/util';
  import Toast from "components/toast";
  import NormalLoading from "components/loading";
  import ensureConfirm from "components/ensure";
  /**************************Axios Http Requests*************************/
  import SendCode from "common/js/auth/sendCode"; // 发送验证码
  import validCodeLogin from "common/js/auth/validCodeLogin"; // 验证验证码
  import bindMobile from "common/js/auth/bindMobile";
  import miniLogin from "common/js/miniUtil/miniLogin";
  import getDoctorBaseMsg from "common/js/HttpRequest/getDoctorBaseMsg"; // 获取医生信息
  import getDiaryStatistics from "common/js/HttpRequest/getDiaryStatistics"; // 获取日记数量
  import createJournal from "common/js/HttpRequest/createJournal"; // 创建日记接口

  let timerCode = null; // 发送验证码倒计时

  export default {
    name: 'journalSpread',
    data() {
      return {
        phone:'',
        codeNumber:'',
        loading:false,
        toastContent:'',
        toastShow:false,
        codeTime: 0,
        codeText: "获取验证码",
        authorizationFlag:false, // 用户是否授权
        ensureShow:false, // 打开设置提示
        ensureParams: {
          content: "唯医骨科需获取您的授权信息，以方便您后续使用",
          ensure: "确定",
          type:"openSetting"
        },
        doctorId:0,
        doctorInfo:{
          logoUrl:'',
        }, // 医生信息
      }
    },
    computed: {

    },
    watch: {},
    components: {
      Toast,
      NormalLoading,
      ensureConfirm
    },
    onLoad (options) {
      if (options.scene) {
        this.doctorId = options.scene;
        this.checkAuthorize();
        this.getDoctorMsg();
      } else {
        console.log('医生ID没有传过来！！！');
      }
    },
    methods: {
      // 检测是否授权；
      checkAuthorize(){
        let that = this;
        wx.getSetting({
          success: (res) => {
            console.log(res);
            if (res && res.authSetting["scope.userInfo"]) {
              that.authorizationFlag=false;
              this.getLoginInfo();
              // that.getConsultLists("get");
            }else{
              that.authorizationFlag=true;
              // dataLog.enterBrowse({
              //   browseType: "124",
              //   opDesc: "授权页面（独立授权页）（小程序）"
              // });
            }
          }
        })
      },
      getAuthorize(obj) {
        // dataLog.createTrack({
        //   actionId: 14188,
        // });
        this.authorizationFlag = false;
        console.log(obj);
        if (obj.target.userInfo) {
          this.getLoginInfo();
          this.ensureShow = false;
        } else {
          this.ensureShow = true;
        }
      },
      goToSetting(e) {
        let that = this;
        if (e.mp.detail.errMsg==="openSetting:ok" && e.mp.detail.authSetting["scope.userInfo"]){
          that.ensureShow = false;
          that.getLoginInfo();
        }else{
          that.ensureShow = true;
        }
      },
      // 获取登录信息
      getLoginInfo() {
        let that = this;
        miniLogin({
          successCallBack: function (res) {
            if (res.data.responseObject.responseData.mobile && res.data.responseObject.responseData.mobile.trim().length > 0) {
              that.getDiaryStatisticsFun();
            } else {

            }
          },
          failCallBack:()=>{
            console.log('失败的回调');
          }
        });
      },
      // 获取是否有康复日记
      getDiaryStatisticsFun () {
        this.loading = true;
        return getDiaryStatistics({
          patientCustomerId:wx.getStorageSync('userId'),
          isValid:1,
        }).then(res => {
          console.log(res);
          if(res.responseObject && res.responseObject.responseData && res.responseObject.responseData.dataList){
            let {diaryNum,diaryTotal} = res.responseObject.responseData.dataList[0];
            if (diaryNum) {
              this.loading = false;
              wx.redirectTo({
                url: `/packageF/journal/journalList?isRedirect=true&patientCustomerId=${wx.getStorageSync('userId')}&doctorId=${this.doctorId}`
              });
            } else {
              this.createJournalFun(diaryTotal);
            }
          } else {
            this.loading = false;
            console.log('获取康复日记数量失败');
          }
        })
      },
      createJournalFun (diaryTotal) {
        createJournal({
          authorId:wx.getStorageSync('userId'),
          sourceDiaryType:2,
        }).then( res => {
          console.log(res)
          this.loading = false;
          if (res.responseObject && res.responseObject.responseStatus) {
            wx.redirectTo({
              url: `/packageF/journal/journalEditor?isRedirect=true&patientCustomerId=${wx.getStorageSync('userId')}&doctorId=${this.doctorId}${diaryTotal?'&isShowTip=':''}${diaryTotal?false:''}&journalId=${res.responseObject.responsePk}`
            });
          } else {
            console.log('创建康复日记失败');
          };
        })
      },
      // 获取医生信息
      getDoctorMsg() {
        return getDoctorBaseMsg({
          doctorCustomerId: this.doctorId,
          logoUseFlag: 5
        }).then(data => {
          if (data.responseObject && data.responseObject.responseData) {
            this.doctorInfo  = data.responseObject.responseData.dataList[0];
          }
        });
      },
      // 去登录规则页
      goPageRule () {
        wx.navigateTo({
          url: "/pages/loginRule/loginRule"
        });
      },
      // 显示 toast 提示
      showToast (text) {
        wx.showToast({
          title: text,
          icon: 'none',
          duration: 2000
        })
      },
      /** 失焦事件 */
      validateBlur(type) {
        if (type === "phone") {
          let isPassPhone = /^1\d{10}$/.test(this.phone);
          this.changePhone = false;
          if (this.phone.length === 0) {
            this.showToast("请填写手机号码");
            return false;
          } else if (!isPassPhone) {
            this.showToast("请填写真实手机号码");
            return false;
          } else {
            return true;
          }
        } else if (type === "codeText") {
          if (this.codeNumber.length === 0) {
            this.showToast("请填写短信验证码");
            return false;
          } else {
            return true;
          }
        }

      },
      /** input最大长度事件 */
      inputMaxLength(attr, length) {
        this[attr] = api.getStrByteLen(this[attr], length);
      },
      /** 清除验证码 */
      clearTextCode() {
        this.codeNumber = "";
        this.formCheck = false
      },
      /** 获取验证码 */
      getCodeApi() {
        let _this = this;
        if (!_this.validateBlur("phone")) {
          return;
        }
        _this.loading = true;
        SendCode({
          account: _this.phone,
          operateType: 8,
          typeId: 3
        }).then(data => {
          if (data.responseObject.responsePk !== 0 && data.responseObject.responseStatus) {
            _this.showToast("验证码已发送");
            // _this.imgUrl = _this.toastImg.success;
            _this.countDown(60);
            _this.codeId = data.responseObject.responsePk;
          } else {

            _this.showToast(data.responseObject.responseMessage);
          }
        }).catch(err => {
          // _this.showToast("网络信号差，建议您稍后再试");
          console.log(err);
        }).finally(() => {
          _this.loading = false;
        });
      },
      /** 验证码倒计时 */
      countDown(time) {
        let _this = this;
        let _codeTime = time;
        _this.codeTime = _codeTime--;
        _this.getCode = false;
        timerCode = setInterval(() => {
          if (_codeTime > 0) {
            _this.codeTime = _codeTime--;
          } else {
            _this.getCode = true;
            _this.codeTime = 0;
            _this.getCodeText = "重新获取";
            clearInterval(timerCode);
          }
        }, 1000);
      },
      /** 点击下一步验证 */
      validate() {
        if (this.validateBlur('phone') && this.validateBlur('codeText')) {
          this.validCode();
        }
      },
      /** 校验验证码并登陆 */
      validCode() {
        let that = this;
        this.loading = true;
        return new Promise((resolve, reject) => {
          validCodeLogin({
            validCode: this.codeNumber,
            codeId: this.codeId,
            account: this.phone,
            typeId: 3
          }).then(res => {
            console.log(res);
            if (res.responseObject.responseStatus) {
              if (res.responseObject.responseData) {
                let {responseObject: {responseData: {uniteNameWeixin, uniteNickname, uniteFlagWeixin}}} = res;
                if (uniteFlagWeixin) {
                  if (this.unionId != uniteNameWeixin) {
                    console.log('需要绑定');
                    this.loading = false;
                    this.showModal({
                      content: "该手机号码已被“" + uniteNickname + "”占用，是否更换绑定为当前微信?",
                      success: (res) => {
                        if (res.confirm) {
                          console.log('用户点击确定');
                          this.bindPhoneFun();
                        } else if (res.cancel) {
                          console.log('用户点击取消')
                        }
                      },
                    });
                  } else {
                    console.log('不需要绑定');
                    this.getDiaryStatisticsFun();
                    console.log('验证成功');
                  }
                } else {
                  this.bindPhoneFun();
                }
              }
            } else {
              // 如果是新手机号，则进行绑定
              if (res.responseObject.responseCode == '0B0010') {
                this.bindPhoneFun();
              } else {
                this.loading = false;
                this.showToast(res.responseObject.responseMessage);
              }
            }
          }).catch((err) => {
            console.log(err);
          });
        })
      },
      // confirm 框提示
      showModal({ title = "", content,success = () =>{} } = paramObj) {
        wx.showModal({
          title,
          content,
          success,
        });
      },
      /** 绑定手机号 */
      bindPhoneFun() {
        let _this = this;
        console.log('我要绑定手机号');
        this.loading = true;
        bindMobile({
          account: this.phone,
          encryptedData: wx.getStorageSync('encryptedData'),
          sessionKey: wx.getStorageSync('sessionKey'),
          iv: wx.getStorageSync('iv'),
          visitSiteId: '24'
        }).then(res => {
          console.log(res);
          if (res.responseObject.responseStatus) {
            // 换绑成功，更新本地 userId
            wx.setStorageSync("userId", res.responseObject.responsePk);
            // 创建新患者；
            this.getDiaryStatisticsFun();
          }
        }).finally(() => {
          this.loading = false;
        });
      },
    }
  }
</script>
<style lang="scss">
  .spread-box{
    padding-top: 66px;
  }
  .spread-main{
    padding: 0 60px;
    .doctor-info-box{
      display: flex;
      align-items: center;
      .doctor-icon{
        width: 96px;
        height: 96px;
        border-radius: 999px;
      }
      .doctor-info{
        margin-left: 24px;
        line-height: 1;
        font-size:30px;
        color:rgb(157,163,175);
        .doctor-name{
          font-size:34px;
          font-weight:500;
          color:rgb(37,50,77);
        }
        .doctor-title{
          margin-left: 18px;
        }
        .doctor-info-hospital{
          margin-top: 18px;
        }
      }
    }
    .spread-tips{
      width: 480px;
      height: 114px;
      box-sizing: border-box;
      margin-top: 8px;
      padding-top: 21px;
      line-height: 95px;
      background: url("https://m.allinmed.cn/static/image/mp/index/1.1.4/bubbles.png") no-repeat center;
      background-size: 100% 100%;
      font-size:30px;
      font-weight:500;
      color:rgb(255,255,255);
      text-align: center;
    }
    .login-box{
      margin-top: 78px;
      //患者咨询
      .add-patient-content {
        padding: 15px 60px 0;
        &-item {
          height: 140px;
          line-height: 140px;
          border-bottom: 1px solid #D8D8D8;
          font-size: 0;
          position: relative;
          & > aside {
            display: inline-block;
            vertical-align: middle;
            width: 196px;
            font-size: 34px;
            color: #909090;
            letter-spacing: 0;
            /*line-height: 34px;*/
          }
          .codeText {
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
          & > .add-patient-input {
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
              z-index: 2;
              background: url("https://m.allinmed.cn/static/image/img00/login/close_button.png") center center no-repeat;
              background-size: 38px 38px;
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
              width: 100%;
              height: 100%;
              border: none;
              outline: none;
              /*padding: 26px 30px;*/
              background: none;
              color: #222;
              font-size: 34px;
            }
            & > select {
              min-height: 60px;
              background: none;
              border: none;
              width: 100%;
              outline: medium;
            }
            & > .codeInput {
              width: 60%;
            }
          }
          .add-patient-sex-selector {
            display: inline-block;
            width: 164px;
            vertical-align: middle;
            .add-patient-selector {
              width: 48px;
              height: 48px;
              background: url("https://m.allinmed.cn/static//image/mp/consult/notSelect@2x.png") no-repeat;
              background-size: contain;
              display: inline-block;
              vertical-align: middle;
              margin-right: 10px;
              box-sizing: border-box;
            }
            & > span {
              display: inline-block;
              vertical-align: middle;
              color:#222222;
            }
            &.on {
              .add-patient-selector {
                background: url("https://m.allinmed.cn/static//image/mp/consult/selected@2x.png") no-repeat;
                background-size: contain;
              }
            }
          }
        }
      }
    }
    .login-tips{
      margin-top: 28px;
      font-size:34px;
      font-weight:400;
      color:rgb(252,116,106);
    }
  }
  .next-box{
    margin-top: 236px;
    .next-btn{
      width: 520px;
      height: 96px;
      line-height: 96px;
      text-align: center;
      background: #00B9AD;
      color: #ffffff;
      border-radius: 8px;
      margin: 0 auto;
    }
    .next-tips{
      font-size:28px;
      font-weight:400;
      color:rgb(170,170,170);
      margin-top: 48px;
      text-align: center;
      .next-agreement{
        color:rgb(0,185,173);
      }
    }
  }
  .journal-maskers {
    position: fixed;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    background-color: rgba(0, 0, 0, 0.75);
    z-index: 2;
    transition: all 0.3s linear;
  }
  .journal-confirmBox-inner {
    width: 540px;
    background-color: #fff;
    position: absolute;
    border-radius: 24px;
    overflow:hidden;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
  }

  .journal-confirmBox-content {
    padding: 42px 72px;
    font-size:36px;
    border-bottom: 1px solid #dfdfdf;
    color: #222;
    p {
      font-weight: bold;
      text-align: center;
      margin-top:5px;
    }
  }

  .journal-confirmBox-btns {
    .journal-confirmBox-ensureBtn{
      width:100%;
      font-size:34px;
      text-align: center;
      color: #00BEAF;
      font-weight: bold;
      background: #fff;
    }
  }
</style>

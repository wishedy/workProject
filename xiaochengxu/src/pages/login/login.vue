<template>
  <section class="out-box">
    <section class="image-head"></section>
    <section class="loginRegisterBox">
      <article class="tphoneTips">请填写手机号，仅对医生可见</article>
      <!-- 手机验证登录 -->
      <p class="phoneInput">
        <input
          type="number"
          placeholder="请输入手机号"
          @blur="blurValid('phoneMessage','tel')"
          @input="onKeyPress()"
          v-model="phoneMessage"
          :class="{'hasContent':clearPhone}"
          placeholder-class="placeholderClass"
          :cursor-spacing=100
        >
        <i v-if="clearPhone" class="icon-clear" @click='clearMessage("phoneMessage")'></i>
      </p>
      <p class="codeInput">
        <input
          type="number"
          placeholder="请输入验证码"
          v-model="codeMessage"
          @blur="blurValid('codeMessage','code')"
          @input="codeKeyPress()"
          :class="{'hasContent':clearCode}"
          :cursor-spacing=100
          placeholder-class="placeholderClass">
        <i v-if="clearCode" class="icon-clear" @click='clearMessage("codeMessage")'></i>
        <span v-if="!countShow" class="getCode" @click="getCodeApi()">{{getCodeText}}</span>
        <span v-else class="codeCountdown" :class="{'hasContent':codeMessage.length>0}"><i>{{codeTime}}</i>秒后重新获取</span>
      </p>
      <section class="stipulation">登录代表您已同意<i @click="goLoginRule()">《唯医互联网骨科医院服务协议》</i></section>
    </section>
    <form  class="btn-primary go-next" @submit="formSubmit" report-submit="true">
      <button class="loginButton" :disabled='loading' @click="validLogin()" formType="submit">登录</button>
    </form>
    <NormalLoading v-if="loading"></NormalLoading>
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
import checkBlackList from "common/js/auth/checkBlackList";//校验是否是黑名单用户
/**************************Axios Http Requests*************************/
import NormalLoading from "components/loading";
import sendCode from "common/js/auth/sendCode"; // 发送验证码
import getOpenId from "common/js/auth/getOpenId"; // 获取openId
import validCodeLogin from "common/js/auth/validCodeLogin"; // 验证验证码
import bindMobile from "common/js/auth/bindMobile"; // 绑定手机号
import sendFormId from "common/js/HttpRequest/sendFormId";
import dataLog from "dataLog";
let timerCode = null; // 定时器

import {createNamespacedHelpers} from "vuex";
const {mapState, mapMutations, mapActions} = createNamespacedHelpers('journal');

const XHRList = {
  updateCode:""
};

export default {
  name: "index",
  data() {
    return {
      customerId:'',// 用户Id
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
    ...mapMutations(['setMobile', 'setCustomerId']),
    /** 发送formId */
    formSubmit(e) {
      if (this.loading) return;
      sendFormId(e.target.formId);
    },
    init() {
      const that = this;
      this.customerId = wx.getStorageSync('userId');
      this.unionId = wx.getStorageSync('unionId');
      this.openId = wx.getStorageSync('openId');
      wx.setNavigationBarTitle({
        title:'快速注册/登录',
      })
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
      dataLog.createTrack({
        actionId: 14135,
      });
      if (this.loading) return;
      let _this=this;
      this.blurValid("phoneMessage", "tel").then(result => {
        if (result) {
          _this.isCheckBlack('login');
        } else {
          _this.loginApi();
        }
      });

    },
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
                let query = this.$root.$mp.query.from;
                if(query=='blackList'){
                  wx.redirectTo({
                    url: '/pages/mIndex/mIndex'
                  });
                }else {
                  this.goAddPatient();
                  console.log('验证成功');
                }

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
    goAddPatient(){
      let backPage;
      this.loading = false;
      this.setMobile(this.phoneMessage);   //绑定成功后手机号
      if (this.$root.$mp.query.needSession) {
        wx.setStorageSync('bindFinish',1);
        wx.setStorageSync('needRefresh',true);
      }
      if (this.$root.$mp.query.backPage) {
        backPage = this.$root.$mp.query.backPage;
        console.log(backPage);
        wx.redirectTo({
          url: backPage,
        });
      } else {
        wx.navigateBack({
          delta: 1
        })
      }
    },
    // 绑定手机号
    bindPhone () {
      this.setCustomerId(wx.getStorageSync('userId'));//添加换绑后的customerId
      console.log(this.$root.$mp.query.from)
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
          let query = this.$root.$mp.query.from;
          if (query == 1) {
            wx.redirectTo({
              url: '/pages/myConsult/myConsult'
            });
          } else if (query == 2) {
            wx.redirectTo({
              url: '/packageF/couponList/couponList'
            });
          }else if (query == 8) {
            //设置登录成功之后跳转到我的挂号列表并返回重新获取登录信息
            wx.setStorageSync('needRefresh',true);
            wx.redirectTo({
              url: '/packageD/registration/myOrderList'
            });
          } else if(query=='blackList'){
            wx.redirectTo({
              url: '/pages/mIndex/mIndex'
            });
          }else {
            this.goAddPatient();
          }
          api.codeRecord();
        }
      });
    },
    //校验是否是黑名单用户
    isCheckBlack(type){
      let _this=this;
      checkBlackList({
        mobile:_this.phoneMessage
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
          }else {
            if(type=='login'){
              _this.loginApi()
            }else {
              _this.sendCodeApi();
            }
          }
        }else{
          if(type=='login'){
            _this.loginApi()
          }else {
            _this.sendCodeApi();
          }

        }
      })
    },
    //获取验证码
    getCodeApi() {
      dataLog.createTrack({
        actionId: 14134,
      });
      let _this = this;
      this.blurValid("phoneMessage", "tel").then(result => {
        if (result) {
          _this.isCheckBlack();
        } else {
          _this.sendCodeFlag = false;
        }
      });
    },
    //发送验证码
    sendCodeApi(){
      let _this=this;
      if (_this.sendCodeFlag) return;
      _this.sendCodeFlag = true;
      sendCode({
        // account: _this.phoneMessage,
        // customerId: this.customerId,
        // account: 15555555550,
        account: this.phoneMessage,
        // operateType: 1, //1-绑定手机 2－修改手机号 3-手机号找回p密码 5-手机号注册 8-手机号快捷登录 9-老患者报到 16-患者注册
        // typeId: 2 //1-修改/重置密码2-账号验证(绑定手机、手机号注册)3-手机快捷登录4-老患者报到5-短信通知
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
        success: () =>{

        },
        title,
        success: () =>{

        },
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
      dataLog.createTrack({
        actionId: 14136,
        browseType: "86",
        opDesc: "快速登录注册页（小程序）"
      });
      wx.navigateTo({
        url: "../loginRule/loginRule"
      });
    }
  },
  onLoad(){
    this.phoneMessage = '';
    this.codeMessage = '';
    let query = this.$root.$mp.query.from;
    console.log(query)
  },
  onUnload(){
    this.phoneMessage = '';
    this.codeMessage = '';
    this.getCodeText = '获取验证码';
    this.countShow = false;
    this.sendCodeFlag = false;
    this.loading = false;
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
    // 清除手机号的按钮是否展示
    clearPhone() {
      if (this.phoneMessage.length > 0) {
        return true;
      } else {
        return false;
      }
    },
    // 清除验证码的按钮是否展示
    clearCode() {
      if (this.codeMessage.length > 0) {
        return true;
      } else {
        return false;
      }
    }
  },
  components: {
    NormalLoading
  }
};
</script>

<style lang="scss">
.out-box {
  min-height: 100%;
  background-color: #fff;
}
.image-head {
  height: 400px;
  background: url("https://m.allinmed.cn/static/image/img00/login/banner@2x.png")
    center no-repeat;
  background-size: 100% 100%;
}
.loginRegisterBox {
  padding: 20px 75px 0;
  @include clearfix();
  font-size: 40px;
  color: #aaaaaa;
  font-weight: 600;
  box-sizing: border-box;
  .tphoneTips{
    margin-top:60px;
    font-size: 30px;
    color: #909090;
    letter-spacing: 0;
    font-weight: normal;
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
      font-weight: 600;
      &.hasContent {
        font-size: 40px;
      }
      .placeholderClass {
        color: #a0a0a0;
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
        font-weight: normal;
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
      color: #29a3a3;
    }
  }
  .changeAndForget {
    @include clearfix();
    padding: 20px 30px 0;
    font-size: 30px;
    color: #aaaaaa;
    .forgetPass {
      color: #2fc5bd;
    }
  }
}
.icon-eyesStatus {
  display: inline-block;
  width: 110px;
  height: 35px;
  background: url("https://m.allinmed.cn/static/image/img00/login/eyes_open.png")
    no-repeat;
  background-size: 100% 100%;
  margin-top: 5px;
  &.hasContent {
    margin-top: 20px;
  }
  &.hide {
    background: url("https://m.allinmed.cn/static/image/img00/login/eyes_close.png")
      no-repeat;
    background-size: contain;
  }
}
.icon-clearPassword {
  display: inline-block;
  width: 40px;
  height: 40px;
  margin-left: 10px;
  background: url("https://m.allinmed.cn/static/image/img00/login/close_button.png")
    no-repeat;
  background-size: 100% 100%;
  margin-top: 5px;
}
.loginButton {
  display: block;
  width: 630px;
  line-height: 98px;
  color: #fff;
  background-image: linear-gradient(90deg, #07b6ac 6%, #3fe6bc 95%);
  box-shadow: 0 20px 36px 0 rgba(30, 231, 187, 0.38);
  border-radius: 200px;
  margin: 36px auto;
  box-sizing: border-box;
  text-align: center;
  font-size: 34px;
}

.popup-tips {
  position: absolute;
}
</style>

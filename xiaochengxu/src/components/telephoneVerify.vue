<template>
  <section v-if="verifyFlag" class="telephone-box">
    <section class="content">
      <div class="input">
        <input type="text" placeholder="请输入新手机号" v-model="mobile" @blur="blurvalid('tel')">
        <div v-if="codeFlag" class="sendcode" @click="getCode">发送验证码</div>
        <div v-if="!codeFlag" class="sendcode disabled">发送验证码({{ seconds }})</div>
      </div>
      <div class="input"> <input type="text" placeholder="请输入验证码" @blur="blurvalid('code')" v-model="code"></div>
      <div></div>
      <div class="submit-box">
        <form class="cancle" @click="cancle"><button>取消</button></form>
        <form v-if="buttonFlag" class="confirm" @click="confirm"><button>确认</button></form>
        <form v-if="!buttonFlag" class="confirm disabled"><button>确认</button></form>
      </div>
    </section>
  </section>
</template>
<script type="text/ecmascript-6">
  /**
   * @Desc：
   * @Usage:
   * @Notify：
   * @Depend：
   *
   * Created by zhuning on 2019/06/25.
   */

  import dataLog from "dataLog";
  import api from 'common/js/util/util';
  import WxValidate from "common/js/util/wxValidate";

  const telephoneCodeApi = {
    getCode: api.httpEnv() + '/mcall/customer/send/code/v1/create/',
    confirm: api.httpEnv() + '/mcall/customer/patient/baseinfo/v1/verifyCodeUpdateMobile/',
  }

  const telephoneReg = {
    tel: /^1[3456789]\d{9}$/,
    code: /^\d{4}$/
  }
  export default {
    data() {
      return {
        verifyFlag: false,
        buttonFlag: false,
        codeFlag: true,
        seconds: 60,
        timer: '',
        mobile: '',
        code: '',
        codeId: 0,
        patientId: '',
        modalFlag: false
      }
    },
    methods: {
      blurvalid(flag) {
        if (flag == "tel" && !telephoneReg.tel.test(this.mobile)) {
          this.confirmModal('请输入正确手机号');
        } else if (flag == "code" && !telephoneReg.code.test(this.code)) {
          this.confirmModal('请输入正确验证码');
        }
        if (telephoneReg.tel.test(this.mobile) && telephoneReg.code.test(this.code)) {
          this.buttonFlag = true;
        }
      },
      cancle() {
        dataLog.createTrack({ actionId: 14249 });
        this.verifyFlag = false;
        this.buttonFlag = false;
        this.mobile = '';
        this.code = '';
      },
      show(patientId) {
        this.verifyFlag = true;
        this.patientId = patientId;
        clearInterval(this.timer);
        this.seconds = 60;
        this.codeFlag = true;
      },
      getCode() {
        dataLog.createTrack({ actionId: 14248 });
        var _this = this;
        if ( telephoneReg.tel.test(this.mobile) ) {
          wx.showLoading({ title: "正在加载..." });
          api.ajax({
            url: telephoneCodeApi.getCode,
            method: "POST",
            data: {
              account: this.mobile,
              typeId: 16,
              operateType: 26,
              visitSiteId: api.getSiteId(),
            },
            done(response) {
              wx.hideLoading();
              if (response && !response.responseObject.responseStatus) {
                this.confirmModal('验证码发送有误', _this.verifyFlag, true);
              } else {
                _this.codeId = response.responseObject.responsePk;
                _this.codeFlag = false;
                _this.timer = setInterval(() => {
                  _this.seconds = _this.seconds -1;
                  if (_this.seconds <= 0) {
                    clearInterval(_this.timer );
                    _this.codeFlag = true;
                    _this.seconds = 60;
                  }
                }, 1000);
              }
            }
          })
        } else {
          if (!this.modalFlag) this.confirmModal('请输入正确手机号');
        }
      },
      confirm() {
        var _this = this;
        dataLog.createTrack({ actionId: 14250 });
        api.ajax({
          url: telephoneCodeApi.confirm,
          method: "POST",
          data: {
            mobile: this.mobile,
            code: this.code,
            patientId: this.patientId,
            codeId: this.codeId,
          },
          done(response) {
            wx.hideLoading();
            if (response && !response.responseObject.responseStatus) {
              _this.confirmModal('验证码有误');
            } else {
              _this.$emit("success", { mobile: _this.mobile });
              _this.codeFlag = false;
              _this.verifyFlag = false;
              _this.buttonFlag = false;
              _this.mobile = '';
              _this.code = '';
            }
          }
        })          
      },
      confirmModal(info, callbackFlag, callbackFlagVal, cancleFlag) {
        var _this = this;
        if (!this.modalFlag) {
          this.modalFlag = true;
          wx.showModal({
            content: info || "出错了",
            showCancel: cancleFlag || false,
            confirmText: '知道了',
            confirmColor: '#333',
            success: function (res) {
              _this.modalFlag = false;
              if (res.confirm) {
                callbackFlag && (callbackFlag = callbackFlagVal);
              }
            }
          })          
        }

      }
    }
  }
</script>
<style lang="scss">
  .telephone-box {
    width: 750px;
    height: 100%;
    overflow: hidden;
    position: absolute;
    top: 0;
    left: 0;
    background-color: rgba(0, 0, 0, 0.35);
    text-align: center;
    z-index: 99;
    .content {
      width: 640px;
      height: 408px;
      background-color: #fff;
      border-radius: 16px;
      position: absolute;
      top: 50%;
      left: 50%;
      margin-left: -320px;
      margin-top: -260px;
      //padding: 32px 56px;
      padding-top: 32px;
      padding-bottom: 32px;
      .input {
        position: relative;
        width: 544px;
        margin: 30px auto;
        height: 106px;
        background-color: #F2F5F7;
        color: #08112B;
        text-align: left;
        line-height: 106px;
        .sendcode {
          position: absolute;
          z-index: 100;
          top: 24px;
          right: 16px;
          min-width: 182px;
          height: 58px;
          color: #2EA9FE;
          border: 1px solid #2EA9FE;
          line-height: 56px;
          font-size: 30px;
          text-align: center;
          border-radius: 8px;
          padding: 0 16px;
          &.disabled {
            font-weight: 500;
            color: rgba(8, 17, 43, 0.5);
            border: 1px solid rgba(124, 131, 145, 0.4);
          }
        }

        input {
          padding: 24px;
          line-height: 104px;
          font-size: 34px;
        }
      }
      .submit-box {
        position: absolute;
        left: 0;
        bottom: 0;
        width: 640px;
        height: 100px;
        border-top: 1px solid #DFDFDF;
        form {
          width: 319px;
          height: 100px;
          float: left;
          background-color: #fff;
          border-radius: 0 0 16px 16px;
          &:first-child {
            border-right: 1px solid #DFDFDF;
          }
          button {
            background-color: #fff;
            font-size: 36px;
            color: #555;
            border-radius: 0 0 16px 16px;
          }
          &.confirm {
            button {
              color: rgba(39, 172, 247, 1);
            }
          }
          &.disabled {
            button {
              color: rgba(85, 85, 85, 1);
            }
          }
        }
      }
    }
  }
</style>

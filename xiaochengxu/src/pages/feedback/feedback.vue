<template>
  <section class="al-mainInner">
    <section class="main-inner" v-if="!submitSuccess">
      <scroll-view scroll-y="true" class="main-inner-content">
        <section class="feedback-main">
          <section class="question">
            <section class="question-feedback">(必选)请选择你想反馈的问题点</section>
            <p
              class="question-type"
              @click.stop="suggestionType.service=!suggestionType.service"
              :class="{'on':suggestionType.service}"
            >
              <span>服务问题：医生回复慢、质量差，推荐的医生不合理</span>
            </p>
            <p
              class="question-type"
              @click.stop="suggestionType.setting=!suggestionType.setting"
              :class="{'on':suggestionType.setting}"
            >
              <span>使用问题：产品使用障碍、流程不顺畅</span>
            </p>
            <p
              class="question-type"
              @click.stop="suggestionType.others=!suggestionType.others"
              :class="{'on':suggestionType.others}"
            >
              <span>其他问题</span>
            </p>
          </section>
          <section class="question">
            <section class="question-feedback"><span v-if="suggestionType.others">(必填)</span><span v-if="!suggestionType.others">(选填)</span>请补充详细问题和描述</section>
            <figure class="main-input-box-textarea-inner">
              <textarea
                class="input-textArea"
                placeholder="请输入问题"
                v-model.trim="suggestionContent"
                @input="contentLimit"
                cursor-spacing="10"
              ></textarea>
              <p
                class="text-num-tips"
                
              >{{suggestionContent.length}}/100</p>
            </figure>
          </section>
          <section class="question">
            <section class="question-feedback">(选填)请输入联系信息</section>
            <input
              class="input-textArea2"
              placeholder="请填写QQ号/电话/邮箱"
              v-model="suggestionNumbers"
              @input="Limit"
              maxlength="50"
              auto-height="true"
            >
          </section>
          <button class="btn-primary go-next" :class="{'active':active}" @click="checkAllData">提交反馈</button>
        </section>

        <transition name="fade">
          <toast :content="errorMsg" v-if="errorShow"></toast>
        </transition>
      </scroll-view>
    </section>
    <section class="get-back" v-else-if="submitSuccess">
      <section class="icon"></section>
      <section class="title">提交成功</section>
      <section class="description">
        您的反馈我们已经收到
        <br>感谢对我们的支持理解
      </section>
      <section class="back" @click="goToHref">
        <span class="back-timing">{{backTimeout}}s后</span>
        <em>自动返回</em>
      </section>
    </section>
    <section class="contactMain">
      <section class="con_center">
        <section class="con_itemList">
          <div class="con_workTimeBox">
            <span class="workingTitle"><span class="con_point"></span>工作时间</span>
            <span class="workingWeek">周一至周五</span>
            <span class="workingHour">09:00-18:00</span>
            <span class="workingTip">节假日除外</span>
          </div>
          <div class="con_phone" @click="phoneCall">
            <a>
              <p class="con_phoneText"><span class="con_wxText">电话</span><span class="con_phoneNum">400-0010210</span><span class="con_phoneIcon"></span>
              </p>
            </a>
          </div>
          <div class="con_weiXin">
            <span class="con_wxText">微信</span><span class="con_wxNum">weiyizs123</span>
          </div>
        </section>
        <section class="con_itemList">
          <div class="con_workTimeBox notWork">
            <span class="workingTitle"><span class="con_point"></span>非工作时间</span>
          </div>
          <div class="con_email">
            <span class="con_wxText">邮箱</span><span class="con_wxNum">help@allinmed.cn</span>
          </div>
        </section>
      </section>
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
 * Created by YuxiYang on 2017/12/25.
 */
import api from "common/js/util/util";
import toast from "components/toast";
import dataLog from "dataLog";
const feedbackUrl = api.httpEnv() + "/mcall/customer/suggestion/v1/create/";

export default {
  data() {
    return {
      customerId: "",
      triageCustomerId: "",
      doctorId: "",
      suggestionType: {
        service: false,
        setting: false,
        others: false
      },
      suggestionNumbers: "",
      suggestionContent: "",
      errorShow: false,
      errorMsg: "",
      submitSuccess: false,
      backTimeout: 2,
      finish: false,
      active:false
    };
  },
  components: {
    toast
  },
  watch: {
    "suggestionContent":{
      handler:function(val, oldval) {
        if (this.suggestionType.others) {
          if (this.suggestionContent.length>0) {
              this.active = true;
          } else {
              this.active = false;
          }
        } else {
          
        }
      }
    },
    "suggestionType": {
        handler: function(val, oldval) {
          if (this.suggestionType.others) {
            if (this.suggestionContent.length>0) {
              this.active = true;
            } else {
              this.active = false;
            }
          }else if (this.suggestionType.service || this.suggestionType.setting) {
              this.active = true;            
          }else{
              this.active = false;
          }
        },
        deep: true
      },
  },
  onUnload() {
    this.submitSuccess = false;
    this.suggestionType = {
      service: false,
      setting: false,
      others: false
    };
    this.suggestionNumbers = "";
    this.suggestionContent = "";
  },
  onShow() {
    dataLog.enterBrowse();
    wx.setNavigationBarTitle({
      title: "建议反馈"
    });
    this.backTimeout = 2;
  },
  onHide() {
    dataLog.leaveBrowse();
  },
  mounted() {
    const query = this.$root.$mp.query;
    this.from = query.from || "";
    this.customerId = query.customerId || "";
    this.triageCustomerId = query.triageCustomerId || "";
    this.doctorId = query.doctorCustomerId || "";
    clearInterval(this._interval);
  },
  methods: {
    //检查后没有error后提交所有数据
    checkAllData() {
      const _this = this;
      if (
        !this.suggestionType.service &&
        !this.suggestionType.setting &&
        !this.suggestionType.others
      ) {
        this.validateToast("您还有问题未完善");
      } else {
        if (this.suggestionType.others && !this.suggestionContent) {
          this.validateToast("您还有问题未完善");
        } else {
          _this.submitAllData();
        }
      }
    },
    submitAllData() {
      let _this = this,
        _arr = [];
      for (let i in this.suggestionType) {
        if (this.suggestionType[i]) {
          switch (i) {
            case "service":
              _arr.push(3);
              break;
            case "setting":
              _arr.push(4);
              break;
            case "others":
              _arr.push(5);
              break;
          }
        }
      }
      wx.showLoading({
        mask: true
      });
      wx.getNetworkType({
        success: data => {
          const networkType = data.networkType;
          const device = wx.getSystemInfoSync();

          api.ajax({
            url: feedbackUrl,
            method: "POST",
            data: {
              suggestionType: _arr.join(""),
              triageCustomerId: this.triageCustomerId,
              suggestionContent: this.suggestionContent,
              suggestionNumbers: this.suggestionNumbers,
              customerId:
                _this.customerId || (wx.getStorageSync("userId") || 0),
              doctorId: this.doctorId || 0,
              visitSiteId: api.getSiteId(),
              equipmentVersion: device.model,
              networkEnvironment: networkType,
              systemVersion: device.system
            },
            done(data) {
              wx.hideLoading();
              if (data.responseObject.responseStatus) {
                _this.submitSuccess = true;
                _this.backToPast();
              } else {
                _this.submitSuccess = false;
                _this.validateToast("提交失败，请检查您的网络");
              }
            },
            fail(err) {}
          });
        }
      });
    },
    backToPast() {
      this._interval = setInterval(() => {
        this.backTimeout = this.backTimeout - 1;
        if (this.backTimeout === 0) {
          clearInterval(this._interval);
          this.goToHref();
        }
      }, 1000);
    },
    playPhone() {
      wx.makePhoneCall({
        phoneNumber: "400-0010210", //此号码并非真实电话号码，仅用于测试
        success: function() {
          console.log("拨打电话成功！");
        },
        fail: function() {
          console.log("拨打电话失败！");
        }
      });
    },
    goToHref() {
      if (this._interval) clearInterval(this._interval);
      wx.navigateBack({
        delta: 1
      });
    },
    validateToast(content) {
      wx.showToast({
        title: content,
        icon: "none",
        duration: 2000
      });
    },
    contentLimit() {
      if (api.getByteLength(this.suggestionContent) > 100) {
        this.suggestionContent = api.getStrByteLength(
          this.suggestionContent,
          100
        );
        // this.errorShow = true;
        this.validateToast("最多只能输入100字");
      }
    },
    Limit() {
      if (api.getByteLength(this.suggestionNumbers) > 50) {
        this.suggestionNumbers = api.getStrByteLength(
          this.suggestionNumbers,
          50
        );
      }
    },
    getByteLen(len) {
      return api.getByteLen(len);
    }
  }
};
</script>

<style lang="scss" rel="stylesheet/scss">
html,
body {
  width: 100%;
  height: 100%;
  background-color: #f2f2f2;
}
.question-feedback {
  color: #aaaaaa;
  letter-spacing: 0;
  font-size: 30px;
  position: relative;
  background: #f3f7f7;
  padding: 34px 0 22px 30px;
}
.main-inner {
  width: 100%;
  height: 100%;
  box-sizing: border-box;
  background: #f3f7f7;
}
.main-inner-content {
  box-sizing: border-box;
  z-index: 2;
}

.feedback-header {
  padding-top: 21px;
  padding-left: 20px;
  box-sizing: border-box;
}

.feedback-header-top {
  font-size: 44px;
  color: #555555;
  font-weight: normal;
}

.feedback-header-bottom {
  margin-top: 10px;
  margin-bottom: 36px;
  font-size: 30px;
  color: #909090;
}

.feedback-main {
  padding-bottom: 60px;
  .feedback.form {
    background-color: white;
  }
  .question {
    box-sizing: border-box;
    margin-left: 0;
  }
  .check-box {
    margin-top: 26px;
    margin-left: 14px;
    width: 20px;
    height: 20px;
    border: 1px solid #cccccc;
    border-radius: 2px;
  }
}

.question-type {
  padding-top: 27px;
  padding-left: 80px;
  font-size: 36px;
  color: #333333;
  background: #ffffff;
  position: relative;
  padding-right: 48px;
  &.on {
    &:before {
      background: url("https://m.allinmed.cn/static/image/img00/consult_V1.2/multiplechoice_on@2x.png");
      background-size: contain;
    }
  }
  &:before {
    width: 40px;
    height: 40px;
    display: inline-block;
    background: url("https://m.allinmed.cn/static/image/img00/consult_V1.2/multiplechoice_off@2x.png");
    background-size: contain;
    border-radius: 2px;
    content: "";
    position: absolute;
    left: 30px;
    top: 34px;
  }
  span {
    width: 100%;
    display: inline-block;
    vertical-align: middle;
    border-bottom: 1px solid #f2f2f2;
    padding-bottom: 22px;
    margin-right: 48px;
  }
}

.question-description {
  padding-top: 14px;
  padding-left: 60px;
  font-size: 30px;
  color: #666666;
  background: #ffffff;
}

.check-box {
  margin-top: 26px;
  margin-left: 14px;
  width: 20px;
  height: 20px;
  border: 1px solid #cccccc;
  border-radius: 2px;
}

.main-input-box-textarea-inner {
  box-sizing: border-box;
  overflow: auto;
  background: #ffffff;
  position: relative;
  .input-textArea {
    width: 100%;
    padding: 26px 30px 10px;
    font-size: 28px;
    border: 1px solid #e8ecef;
    height: 248px;
    border-style: none;
    box-sizing: border-box;
  }
}

.input-textArea2 {
  width: 100%;
  background: #ffffff;
  padding-top: 10px;
  padding-left: 30px;
  border: none;
  font-size: 28px;
  color: #444444;
  height: 104px;
  word-break: break-all;
}

.go-next {
  width: 560px;
  height: 100px;
  line-height: 100px;
  display: block;
  border-radius: 8px;
  background: #cccccc;
  text-align: center;
  box-sizing: border-box;
  font-size: 36px;
  color: #fff;
  outline: medium;
  padding: 0;
  margin: 80px auto 40px;
  &.active{
      box-shadow: 0 8px 24px 0 rgba(47, 197, 189, 0.40);
      background: #2EA9FE;
    }
}

.text-num-tips {
  position: absolute;
  font-size: 26px;
  color: #909090;
  bottom: 18px;
  right: 30px;
}

.get-back {
  top: 50%;
  width: 100%;
  padding: 0 30px;
  box-sizing: border-box;
  text-align: center;
  .icon {
    background: url("https://m.allinmed.cn/static/image/img00/directOperation/select_yes.png")
      no-repeat bottom center;
    background-size: contain;
    text-align: center;
    margin-top: 208px;
    width: 112px;
    height: 112px;
    display: inline-block;
  }
  .title {
    margin-top: 14px;
    margin-bottom: 30px;
    text-align: center;
    font-size: 48px;
    color: #555555;
    box-sizing: border-box;
  }
  .description {
    margin-top: 30px;
    margin-bottom: 84px;
    text-align: center;
    font-size: 36px;
    color: #999999;
  }
  .back {
    text-align: center;
    margin-bottom: 234px;
    & > * {
      font-size: 30px;
      color: #909090;
    }
    & > em {
      font-style: normal;
      color: #2EA9FE;
    }
  }
}

/*vue组件自定义动画开始*/
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s;
}

.fade-enter, .fade-leave-to /* .fade-leave-active in <2.1.8 */
 {
  opacity: 0;
}

.back {
  .back-timing {
    display: inline-block;
  }
  em {
    display: inline-block;
  }
}

.contactMain {
  height: 100%;
  position: relative;
  background: #F3F7F7;
  background-size: 100% 272px;
  .con_center {
    background: #ffffff;
    padding-bottom: 45px;
    .con_itemList {
      .con_workTimeBox {
        padding-top: 42px;
        padding-bottom: 26px;
        padding-left: 60px;
        background: #F3F7F7;
        &.notWork {
          margin-top: 50px;
        }
        .workingTitle {
          font-size: 36px;
          color: #333333;
          font-weight: bold;
          position: relative;
          .con_point {
            position: absolute;
            display: inline-block;
            width: 16px;
            height: 16px;
            -webkit-border-radius: 100px;
            -moz-border-radius: 100px;
            border-radius: 100px;
            background-color: #2EA9FE;
            top: 50%;
            margin-top: -8px;
            left: -32px;
          }
        }
        .workingWeek {
          font-size: 28px;
          color: #909090;
          padding-left: 16px;
        }
        .workingHour {
          font-size: 28px;
          color: #909090;
          padding: 0 10px;
        }
        .workingTip {
          font-size: 28px;
          color: #909090;
        }
      }
      .con_phone {
        padding-left: 60px;
        padding-top: 44px;
        a {
          display: inline-block;
        }
        .con_wxText{
          padding-right: 32px;
        }
        .con_phoneText {
          font-size: 36px;
          color: #909090;
          padding-right: 32px;
        }
        .con_phoneNum {
          font-size: 36px;
          color: #2EA9FE;
          display: inline-block;
          line-height: 0.9;
          font-weight: bold;
          border-bottom: 4px solid #2EA9FE;
        }
        .con_phoneIcon {
          margin-left: 30px;
          display: inline-block;
          width: 56px;
          height: 56px;
          vertical-align: bottom;
          background: url("https://m.allinmed.cn/static/image/mp/index/1.4.0/phone.png") no-repeat center;
          background-size: 100% 100%;
        }
      }
      .con_weiXin {
        padding-left: 60px;
        padding-top: 36px;
        .con_wxText {
          font-size: 36px;
          color: #909090;
          padding-right: 32px;
        }
        .con_wxNum {
          font-size: 36px;
          color: #222222;
        }
      }
      .con_email {
        padding-left: 60px;
        padding-top: 45px;
        .con_wxText {
          font-size: 36px;
          color: #909090;
          padding-right: 32px;
        }
        .con_wxNum {
          font-size: 36px;
          color: #222222;
        }
      }
    }
  }
}
</style>

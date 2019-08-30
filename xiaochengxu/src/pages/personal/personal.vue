<template>
  <section>
    <NormalLoading v-if="finish"></NormalLoading>
    <div class="index" v-if="!authorizationFlag">
      <section class="header">
        <image :src="baseInfo.headUrl" class="dp" @click="goToPage(5)" v-if="baseInfo.mobile.length>0"></image>
        <span @click="goToPage(5)" v-if="baseInfo.mobile.length>0">{{baseInfo.nickName}}</span>
        <button class="loginButton" open-type="getPhoneNumber" v-if="!mobileOnOff" @getphonenumber="goToPagePhoneNumber(1,$event)">快速登录/注册
        </button>
      </section>
      <section class="item-list">
        <section class="item"  @click="continueRecording" v-if="baseInfo.mobile>0 && !authorizationFlag && diaryNum > 0">
          <img class="listIcon" src="https://m1.allinmed.cn/static/image/mp/index/1.6.0/Rectangle.png">
          <span>康复日记</span>
          <section class="haveJournal">
            <dl class="haveItem">
              <dt class="num journal">{{diaryNum}}</dt>
              <dd class="title">我的日记</dd>
            </dl>
            <dl class="haveItem">
              <dt class="num hearten">{{sumPreferUpNum}}</dt>
              <dd class="title">患友鼓励</dd>
            </dl>
          </section>
          <section  class="addJournal updateJournal">
            <img class="addIcon" src="https://m.allinmed.cn/static/image/mp/index/1.1.4/add-simple.jpg" alt="">
            <span class="addText">继续更新日记</span>
          </section>
        </section>
        <section class="item" v-else>
          <img class="listIcon" src="https://m1.allinmed.cn/static/image/mp/index/1.6.0/Rectangle.png">
          <span>康复日记</span>
          <form action="" @submit="formSubmit" report-submit="true" v-if="mobileOnOff">
            <button v-if='baseInfo.mobile.length===0 || authorizationFlag || diaryNum == 0' open-type="getUserInfo"
                    class="addJournal"
                    type="submit"
                    formType="submit"
                    @getuserinfo="goToPage(6,$event)">
              <img class="addIcon" src="https://m.allinmed.cn/static/image/mp/index/1.1.4/add-simple.jpg" alt="">
                <span class="addText">写第一篇日记</span>
            </button>
          </form>
          <form action="" @submit="formSubmit" report-submit="true" v-if="!mobileOnOff">
            <button v-if='baseInfo.mobile.length===0 || authorizationFlag || diaryNum == 0' open-type="getPhoneNumber"
                    class="addJournal"
                    type="submit"
                    formType="submit"
                    @getphonenumber="goToPagePhoneNumber(6,$event)">
              <img class="addIcon" src="https://m.allinmed.cn/static/image/mp/index/1.1.4/add-simple.jpg" alt="">
              <span class="addText">写第一篇日记</span>
            </button>
          </form>
        </section>
        <button open-type="getUserInfo" class="item" @getuserinfo="goToPage(1,$event)" v-if="mobileOnOff">
          <img class="listIcon special" src="https://m1.allinmed.cn/static/image/mp/index/1.6.0/myDoctor.png">
          <span>问诊消息</span>
          <span
            class="extension">诊后报到 咨询记录</span>
        </button>
        <button open-type="getPhoneNumber" class="item" @getphonenumber="goToPagePhoneNumber(1,$event)" v-if="!mobileOnOff">
          <img class="listIcon special" src="https://m1.allinmed.cn/static/image/mp/index/1.6.0/myDoctor.png">
          <span>问诊消息</span>
          <span
            class="extension">诊后报到 咨询记录</span>
        </button>
        <button open-type="getUserInfo" class="item" v-if="false" @getuserinfo="goToPage(7,$event)">
          <img class="listIcon special" src="http://m.allinmed.cn/static/image/mp/index/1.4.0/icon@3x.png">
          <span>我的居民健康卡</span>
          <span
            class="getCard">可领取</span>
        </button>

        <!-- <section class="item" @click="goToPage(7)">
          <img class="listIcon" src="https://m1.allinmed.cn/static/image/mp/index/1.6.0/contact_us.png">
          <span>我的预约挂号</span>
        </section> -->
        <!--  我的预约挂号      -->
        <button open-type="getUserInfo" class="item" @getuserinfo="goToPage(8,$event)" v-if="mobileOnOff">
          <img class="listIcon order" src="https://m1.allinmed.cn/static/image/mp/index/1.6.0/order_mine.png">
          <span>我的预约挂号</span>
        </button>

        <button open-type="getPhoneNumber" class="item" @getphonenumber="goToPagePhoneNumber(8,$event)" v-if="!mobileOnOff">
          <img class="listIcon order" src="https://m1.allinmed.cn/static/image/mp/index/1.6.0/order_mine.png">
          <span>我的预约挂号</span>
        </button>
        <section class="item" @click="goToPage(4)">
          <img class="listIcon" src="https://m1.allinmed.cn/static/image/mp/index/1.6.0/suggestion.png">
          <span>建议反馈</span>
        </section>
      </section>
    </div>
    <div class="authorization" v-if="authorizationFlag">
      <img src="https://m.allinmed.cn/static/image/mp/report/authorization.png"/>
      <div class="text">获取信息失败，请先授权</div>
      <button @getuserinfo="getAuthorize" open-type="getUserInfo">去授权</button>
    </div>
    <ensureConfirm v-if="ensureShow" :ensureParams="ensureParams" @ensureClickEvent="goToSetting"></ensureConfirm>

    <customizedTabbar :selected=2 @FromChild="jumpToUrl" @goToMessage="jumpToMessage" :checkedPhone="mobileOnOff"></customizedTabbar>
    <BlackList></BlackList>
    <authorization></authorization>
  </section>
</template>

<script>
  import MpvueCropper from 'mpvue-cropper'
  import ensureConfirm from "components/ensure";
  import miniLogin from "common/js/miniUtil/miniLogin";
  import customizedTabbar from "components/customizedTabbar";
  import NormalLoading from "components/loading";
  import sendFormId from "common/js/HttpRequest/sendFormId";
  import dataLog from "dataLog";
  import localStorage from "localStorage";
  import getPhoneAuthorization from 'common/js/miniUtil/GetPhoneAuthorization';
  import getDiaryStatistics from "common/js/HttpRequest/getDiaryStatistics"; // 获取日记数量
  import createJournal from "common/js/HttpRequest/createJournal"; // 创建日记接口
  import BlackList from "components/BlackList";
  import authorization from "components/authorization/authorization";
  import {mapGetters} from 'vuex';
  export default {
    data() {
      let mobileOnOff = getPhoneAuthorization.checkPhoneNumber();
      return {
        finish: false,
        authorizationFlag: false,
        buttonShow: false,
        cropperShow: false,
        clickAble: true,
        mobileOnOff:mobileOnOff,
        baseInfo: {
          nickName: "",
          headUrl: "",
          mobile:'',
        },
        ensureShow: false,
        ensureParams: {
          content: "唯医骨科需获取您的授权信息，以方便您后续使用",
          ensure: "确定",
          type: "openSetting"
        },
        diaryNum:-1, // 有效康复日记总数
        diaryTotal:0, // 康复日记总数
        sumPreferUpNum:0, // 康复日记点赞数
      }
    },
    components: {
      // MpvueCropper,
      ensureConfirm,
      customizedTabbar,
      NormalLoading,
      BlackList,
      authorization
    },
    computed:{
      ...mapGetters(['userInfoEnd'])
    },
    watch:{
      userInfoEnd(newVal,oldVal){
        console.log(newVal);
        console.log('获取到信息');
        let _this = this;
        _this.mobileOnOff = getPhoneAuthorization.checkPhoneNumber();
      }
    },
    methods: {
      continueRecording(){
        if(this.clickAble) {
          this.clickAble = false;
          wx.navigateTo({
            url: `/packageF/journal/journalList?patientCustomerId=${wx.getStorageSync('userId')}&from=personal`,
          });
          setTimeout( () => {
            this.clickAble = true;
          },2000)
        }
      },
      /** 发送formId */
      formSubmit(e) {
        sendFormId(e.target.formId);
      },
      // 获取是否有康复日记
      getDiaryStatisticsFun () {
        return getDiaryStatistics({
          patientCustomerId:wx.getStorageSync('userId'),
          isValid:1,
        }).then(res => {
          console.log(res);
          if(res.responseObject && res.responseObject.responseData && res.responseObject.responseData.dataList){
            let {diaryNum,diaryTotal,sumPreferUpNum} = res.responseObject.responseData.dataList[0];
            this.diaryTotal = diaryTotal;
            this.diaryNum = diaryNum;
            this.sumPreferUpNum = sumPreferUpNum;
          } else {
            console.log('获取康复日记数量失败');
          }
        })
      },
      //跳转到我的医生列表
      jumpToMessage(e) {
        if (e.desc) {
          wx.redirectTo({
            url: '/pages/myConsult/myConsult'
          });
          miniLogin({
            successCallBack: (res) => {
            },
            failCallBack: (res) => {
              this.finish = true;
              setTimeout(() => {
                this.finish = false
              }, 2000)
            }
          });
        } else {
          this.ensureShow = true;
        }
      },
      //跳转到个人中心
      jumpToUrl(e) {
        if (e.desc) {
          wx.redirectTo({
            url: '/pages/personal/personal'
          });
          miniLogin({
            successCallBack: (res) => {
            },
            failCallBack: (res) => {
              this.finish = true;
              setTimeout(() => {
                this.finish = false
              }, 2000)
            }
          });
        } else {
          this.ensureShow = true;
        }
      },
      createJournalFun (diaryTotal) {
        wx.showLoading({
          mask: true
        });
        createJournal({
          authorId:wx.getStorageSync('userId'),
          sourceDiaryType:4,
        }).then( res => {
          console.log(res)
          if (res.responseObject && res.responseObject.responseStatus) {
            wx.navigateTo({
              url: `/packageF/journal/journalEditor?isRedirect=true&patientCustomerId=${wx.getStorageSync('userId')}${this.diaryTotal?'&isShowTip=':''}${this.diaryTotal?false:''}&journalId=${res.responseObject.responsePk}`
            });
            wx.hideLoading();
          } else {
            console.log('创建康复日记失败');
          };
        })
      },
      goToPage(index, e) {
        if(this.clickAble){
          this.clickAble = false;
          switch (index) {
            case 1:
              dataLog.createTrack({
                actionId: 14184,
                browseType: "127",
                opDesc: "我的（小程序）"
              });

              if (e.target.userInfo) {
                this.ensureShow = false;
                if (this.buttonShow) {
                  wx.navigateTo({
                    url: '/pages/login/login?from=1'
                  });
                } else {
                  wx.navigateTo({
                    url: '/pages/myConsult/myConsult'
                  });
                }
              } else {
                this.ensureShow = true;
              }

              break;
            case 4:
              dataLog.createTrack({
                actionId: 14187,
                browseType: "127",
                opDesc: "我的（小程序）"
              });
              wx.navigateTo({
                url: '/pages/feedback/feedback'
              });
              break;
            case 5:
              wx.navigateTo({
                url: '/pages/personalDetail/personalDetail'
              });
              break;
            case 6:
              if (e.target.userInfo) {
                this.ensureShow = false;
                if (this.buttonShow) {
                  wx.navigateTo({
                    url: '/pages/login/login?from=3&needSession=1'
                  });
                } else {
                  this.createJournalFun();
                }
              } else {
                this.ensureShow = true;
              }
              break;
            case 7:
              if (true) {
                wx.navigateTo({
                    url: '/packageD/healthCard/healthCardList'
                  });
              }else{
                wx.navigateTo({
                    url: '/pages/login/login?from=3&needSession=1'
                  });
              }
              break;
            case 8:
              //预约挂号
              dataLog.createTrack({
                actionId: 14240,
              });
              if (e.target.userInfo) {
                this.ensureShow = false;
                if (this.buttonShow) {
                  wx.navigateTo({
                    url: '/pages/login/login?from=8'
                  });
                } else {
                  wx.navigateTo({
                    url: '/packageD/registration/myOrderList'
                  });
                }
              } else {
                this.ensureShow = true;
              }
              break;
          }
        };
        setTimeout(()=>{
          this.clickAble = true;
        },3000)
      },
      goToPagePhoneNumber(index,info){
        console.log(index)
        let _this = this;
        let e = info.mp;
        console.log(e);
        getPhoneAuthorization.init({
          info:e,
          cancelBack(){
            console.log('取消')
          },
          successBack(){
            console.log('成功')
            if(_this.clickAble){
              _this.clickAble = false;
              switch (index) {
                case 1:
                  dataLog.createTrack({
                    actionId: 14184,
                    browseType: "127",
                    opDesc: "我的（小程序）"
                  });
                  if (!(e.detail.errMsg == 'getPhoneNumber:fail user deny')) {
                    // _this.mobileOnOff = true
                    wx.navigateTo({
                      url: '/pages/personal/personal'
                    });
                  } else {
                    _this.mobileOnOff = false;
                  }
                  break;
                case 2:
                  dataLog.createTrack({
                    actionId: 14185,
                    browseType: "127",
                    opDesc: "我的（小程序）"
                  });
                  if (!(e.detail.errMsg == 'getPhoneNumber:fail user deny')) {
                    // _this.mobileOnOff = true
                    wx.navigateTo({
                      url: '/pages/personal/personal'
                    });
                  } else {
                    _this.mobileOnOff = false
                  }
                  break;
                case 4:
                  dataLog.createTrack({
                    actionId: 14187,
                    browseType: "127",
                    opDesc: "我的（小程序）"
                  });
                  wx.navigateTo({
                    url: '/pages/feedback/feedback'
                  });
                  break;
                case 5:
                  wx.navigateTo({
                    url: '/pages/personalDetail/personalDetail'
                  });
                  break;
                case 6:
                  if (!(e.detail.errMsg == 'getPhoneNumber:fail user deny')) {
                    // _this.mobileOnOff = true
                    wx.navigateTo({
                      url: '/pages/personal/personal'
                    });
                  } else {
                    _this.mobileOnOff = false;
                  }
                  break;
                case 7:
                  if (true) {
                    wx.navigateTo({
                      url: '/packageD/healthCard/healthCardList'
                    });
                  }else{
                    wx.navigateTo({
                      url: '/pages/personal/personal'
                    });
                  }
                  break;
                case 8:
                  //预约挂号
                  dataLog.createTrack({
                    actionId: 14240,
                  });
                  if (!(e.detail.errMsg == 'getPhoneNumber:fail user deny')) {
                    // _this.mobileOnOff = true
                    wx.navigateTo({
                      url: '/pages/personal/personal'
                    });
                  } else {
                    _this.mobileOnOff = false;
                  }
                  break;
              }
            };
            setTimeout(()=>{
              _this.clickAble = true;
            },3000)
          }
        });

      },
      goLogin(e) {
        if (this.finish) return false;
        this.finish = true;
        dataLog.createTrack({
          actionId: 14183,
          browseType: "127",
          opDesc: "我的（小程序）"
        });
        if (e.target.userInfo) {
          this.finish = false;
          this.ensureShow = false;
          wx.navigateTo({
            url: '/pages/login/login?needSession=1'
          });
        } else {
          this.finish = false;
          this.ensureShow = true;
        }
      },
      goToSetting(e) {
        if (e.mp.detail.errMsg === "openSetting:ok") {
          this.ensureShow = false;
        } else {
          this.ensureShow = true;
        }
      },
      checkLogin() {
        const _this = this;
        _this.finish = true;
        miniLogin({
          successCallBack: (res) => {
            if (res.data.responseObject.responseData.mobile && res.data.responseObject.responseData.mobile.trim().length > 0) {
              _this.finish = false;
              _this.buttonShow = false; //已绑定手机...
              _this.baseInfo = res.data.responseObject.responseData;
              if (_this.diaryNum == -1 || _this.diaryNum == 0) {
                _this.getDiaryStatisticsFun();
              }
            } else {
              _this.finish = false;
              _this.buttonShow = true; //未绑定手机...出现去登录按钮
              _this.baseInfo = {
                nickName: res.data.responseObject.responseData.nickName,
                headUrl: res.data.responseObject.responseData.headUrl,
                mobile: ""
              };
            }
          }, failCallBack: (err) => {
            _this.finish = false;
            _this.buttonShow = true;
          }
        });
      },
      getAuthorize(e) {
        // this.finish = true;
        if (e.target.userInfo) {
          this.ensureShow = false;
          this.authorizationFlag = false;
          wx.getUserInfo({
            success: (res => {
              //已授权...尝试检测手机号绑定
              this.checkLogin();
            })
          })
        } else {
          this.ensureShow = true;
          this.finish = false;
        }
      }
    },
    onShow() {
      dataLog.enterBrowse();
      if (localStorage.getItem("mobile") && localStorage.getItem("mobile").length > 0) {
        this.buttonShow = false;
      } else {
        this.buttonShow = true;
      }
      this.baseInfo = {
        nickName: localStorage.getItem("nickName") || "",
        headUrl: localStorage.getItem("logoUrl") || "",
        mobile: localStorage.getItem("mobile") || ""
      };
      console.log(localStorage.getItem("needRefresh"));
      if (localStorage.getItem("needRefresh")) {
        this.checkLogin();
        localStorage.removeItem("needRefresh");
      }
      this.getDiaryStatisticsFun();
      this.mobileOnOff = getPhoneAuthorization.checkPhoneNumber();
      console.log('personal ===', this.mobileOnOff);
    },
    onHide() {
      this.clickAble = true;
      dataLog.leaveBrowse();
    },
    onLoad() {
      this.buttonShow = false;
      this.diaryNum = -1;
      this.authorizationFlag = false;
      wx.setNavigationBarTitle({
        title: '我的',
      });
      // this.finish = true;
      //显示授权提示
      wx.getSetting({
        success: ((res) => {
          //已授权...
          if (res && res.authSetting["scope.userInfo"]) {
            this.authorizationFlag = false;
            this.checkLogin();
          } else {
            //未授权...
            // this.finish = false;
            this.authorizationFlag = true;
          }
        }),
        fail: (() => {
          // this.finish = true;
          console.log('获取授权失败')
        })
      })
    },
    onUnload(){
      this.clickAble = true;
    }
  }
</script>

<style lang="scss">
  .index {
    background: #F2F4F7;
    padding-bottom: 98px;
    .header {
      width: 100%;
      background: white;
      position: relative;
      height: 128px;
      padding-bottom: 52px;
      .dp {
        content: none !important;
        position: absolute;
        left: 72px;
        width: 128px;
        height: 128px;
        border-radius: 50%;
        vertical-align: center;
      }
      span {
        position: absolute;
        height: 60px;
        overflow: hidden;
        left: 240px;
        top: 45px;
        font-size: 40px;
        color: #222222;
        letter-spacing: 0;
        line-height: 40px;
        text-overflow: ellipsis;
        max-width: 450px;
        white-space: nowrap;
      }
      .loginButton {
        margin-top: 80px;
        width: 354px;
        text-align: center;
        border: 1px solid #1ACAA7;
        border-radius: 100px;
        color: #00B9AD;
        font-size: 36px;

      }
    }

    .item-list {
      background: white;
      margin-top: 20px;
      .item {
        border-radius: 0;
        &:after {
          display: none;
        }
        color: #222222;
        line-height: 1.2;
        text-align: left;
        background: none;
        padding: 48px 0;
        margin: 0 50px;
        font-size: 36px;
        .extension {
          font-size: 32px;
          color: #BBBBBB;
          letter-spacing: 0;
          line-height: 16px;
          margin-left: 178px
        }
        .getCard{
          font-size: 32px;
          color: #FC746A;
          letter-spacing: 0;
          line-height: 16px;
          margin-left: 240px
        }
        border-bottom: 1px solid #EAEAEA;
      }
      .listIcon {
        width: 40px;
        height: 40px;
        position: relative;
        top: 8px;
        &.special {
          top: 4px;
        }
        /*&.order{*/
          /*top: 6px;*/
        /*}*/
      }
      .addJournal {
        width:320px;
        font-weight:500;
        height: 88px;
        font-size: 30px;
        background:#2EA9FE;
        border-radius:8px;
        margin: 60px auto 0;
        display: flex;
        align-items: center;
        justify-content:center;
        .addIcon{
          width: 28px;
          height: 28px;
        }
        .addText{
          font-size: 28px;
          line-height: 1;
          margin-left: 12px;
          color: #ffffff;
        }
        &.updateJournal{
          width: 340px;
          margin-top: 48px;
        }
      }
      .haveJournal{
        display: flex;
        margin-top: 60px;
        .haveItem{
          flex: 1;
          text-align: center;
          .num{
            font-size:50px;
            font-weight:bold;
            &.hearten{
              color:rgb(252,116,106);
            }
            &.journal{
              color:rgb(2,181,172);
            }
          }
          .title{
            font-size:30px;
            font-weight:400;
            margin-top: 10px;
            color:rgb(119,119,119);
          }
        }
      }
      span {
        margin-left: 20px;
      }
    }
  }

  .authorization {
    margin-top: 180px;
    background: #fff;
    image {
      width: 360px;
      height: 256px;
      display: block;
      margin: 0 auto 28px;
    }
    .text {
      font-size: 28px;
      color: #888888;
      letter-spacing: 0;
      line-height: 28px;
      text-align: center;
      margin-bottom: 140px;
    }
    button {
      width: 400px;
      height: 100px;
      border: 2px solid #12D5A8;
      border-radius: 50px;
      line-height: 100px;
      color: #11D5A7;
      display: block;
      margin: 0 auto;
    }
  }
</style>

<template>
  <footer class="bottom-bar" v-if="!showShareBox">

      <section class="bottom-bar-item" v-if="mobileOnOff">
        <form action="" @submit="formSubmit" report-submit="true">
          <button class="bottom-bar-item-content" type="submit" formType="submit" open-type="getUserInfo" @getuserinfo="commentEvent" v-if="!authStatus">
            <i class="icon-comment"></i>
            <span class="text">评论</span>
            <span class="num" v-if="commentNum.all>0">{{formatCommentNum}}</span>
          </button>
        </form>
        <section class="bottom-bar-item-content" @click="clickCommentEvent" v-if="authStatus">
          <i class="icon-comment"></i>
          <span class="text">评论</span>
          <span class="num" v-if="commentNum.all>0">{{formatCommentNum}}</span>
        </section>
      </section>
    <section class="bottom-bar-item" v-if="!mobileOnOff">
      <form action="" @submit="formSubmit" report-submit="true">
        <button class="bottom-bar-item-content" type="submit" formType="submit" open-type="getUserInfo" @getuserinfo="commentEvent" v-if="!authStatus">
          <i class="icon-comment"></i>
          <span class="text">评论</span>
          <span class="num" v-if="commentNum.all>0">{{formatCommentNum}}</span>
        </button>
      </form>
      <button class="bottom-bar-item-content" open-type="getPhoneNumber" @getphonenumber="clickCommentEventPhoneNumber" v-if="authStatus">
        <i class="icon-comment"></i>
        <span class="text">评论</span>
        <span class="num" v-if="commentNum.all>0">{{formatCommentNum}}</span>
      </button>
    </section>
      <span class="line"></span>
      <section class="bottom-bar-item">
        <form action="" @submit="formSubmit" report-submit="true">
          <button class="bottom-bar-item-content" type="submit" formType="submit" @click="shareEvent">
            <i class="icon-share">
              <img src="https://m.allinmed.cn/static/image/mp/index/1.1.2/wechat_01.png" alt="">
            </i>
            <span class="text">分享给好友</span>
          </button>
        </form>
      </section>

  </footer>
</template>

<script>

  /**
   * @Desc：
   * @Usage:
   * @Notify：
   * @Depend：
   *
   * Created by Hallmader on 2018/8/12.
   */
  import dataLog from "dataLog";
  import sendFormId from "common/js/HttpRequest/sendFormId";
  import getPhoneAuthorization from 'common/js/miniUtil/GetPhoneAuthorization';
  import {mapGetters,createNamespacedHelpers} from 'vuex';

  const {mapMutations, mapActions, mapState} = createNamespacedHelpers('journal');

  export default {
    data() {
      let mobileOnOff = getPhoneAuthorization.checkPhoneNumber();
      return {
        mobileOnOff:mobileOnOff,
        ensureParams: {
          content: "唯医骨科需获取您的授权信息，以方便您后续使用",
          ensure: "确定",
          type: "openSetting"
        },
      }
    },
    methods: {
      ...mapActions(['checkLogin']),
      ...mapMutations(['setShareShow','setCommentWindowShow','setEnsureShow', 'setLoadingStatus', 'setCurrentCommentId','setClickFlag','setAuthStatus']),
      /** 发送formId */
      formSubmit(e) {
        sendFormId(e.target.formId);
      },
      shareEvent() {
        this.setShareShow(true);
        dataLog.createTrack({
          actionId: 14130,
        });
      },
      clickCommentEventPhoneNumber(info){
          let _this = this;
          let e = info.mp;
        console.log(e);
        getPhoneAuthorization.init({
          info:e,
          cancelBack(){
            console.log('未获取用户手机号');
          },
          successBack(){
            // console.log(`+++++++++++++++++++++`)
            // console.log(this.mobile)
            if (!_this.clickFlag) return false;
            _this.setClickFlag(false);

            if (_this.mobile) {
              _this.setCurrentCommentId({
                reviewId: "",
                refCustomerId: ""
              });
              _this.setCommentWindowShow(true);
              _this.setLoadingStatus(false);
              _this.setClickFlag(true);
            } else {

              const pages = getCurrentPages() //获取加载的页面

              const currentPage = pages[pages.length-1] //获取当前页面的对象

              const url = currentPage.route //当前页面url

              const options = currentPage.options //如果要获取url中所带的参数可以查看options

              wx.navigateTo({
                url: "/packageF/journalDetail/journalDetail?rId=" + options + "&aId=" + options.aId + + "&form=" + options.form,
                success: () => {
                  _this.setClickFlag(true);
                }
              });
            }
          }
        });
      },
      clickCommentEvent(){
        // console.log(`+++++++++++++++++++++`)
        // console.log(this.mobile)
        if (!this.clickFlag) return false;
        this.setClickFlag(false);

        if (this.mobile) {
          this.setCurrentCommentId({
            reviewId: "",
            refCustomerId: ""
          });
          this.setCommentWindowShow(true);
          this.setLoadingStatus(false);
          this.setClickFlag(true);
        } else {

          const pages = getCurrentPages() //获取加载的页面

          const currentPage = pages[pages.length-1] //获取当前页面的对象

          const url = currentPage.route //当前页面url

          const options = currentPage.options //如果要获取url中所带的参数可以查看options

          wx.navigateTo({
            url: "/packageF/journalDetail/journalDetail?rId=" + options + "&aId=" + options.aId + + "&form=" + options.form,
            success: () => {
              this.setClickFlag(true);
            }
          });
        }
      },
      commentEvent(e) {
        // console.log(`-------------------------`)
        // console.log(this.mobile)
        if (!this.clickFlag) return false;
        this.setClickFlag(false);
        dataLog.createTrack({
          actionId: 14129,
        });
        this.setCurrentCommentId({
          reviewId: "",
          refCustomerId: ""
        });
        this.setLoadingStatus(true);
        // console.log("check....")
        // console.log(e.target)
        if (e.target.userInfo) {
          this.setAuthStatus(true);
          //已授权...
          if (this.mobile) {
            this.setCommentWindowShow(true);
            this.setLoadingStatus(false);
            this.setClickFlag(true);
          } else {
            this.checkLogin().then(status => {
              //  是否绑定手机？
              // 已绑定...
              console.log(status)
              if (status) {
                this.setCommentWindowShow(true);
              }
              this.setLoadingStatus(false);
              //未绑定...前往绑定
            });
          }
        } else {
          this.setEnsureShow(true);
          this.setLoadingStatus(false);
          this.setClickFlag(true);
        }
      }
    },

    mounted() {
      // console.log(this.shareMessage.num)
      let _this = this;
      _this.mobileOnOff = getPhoneAuthorization.checkPhoneNumber();
    },
    watch:{
      userInfoEnd(newVal,oldVal){
        console.log(newVal);
        console.log('获取到信息');
        let _this = this;
        _this.mobileOnOff = getPhoneAuthorization.checkPhoneNumber();
      }
    },
    computed: {
      ...mapState(["userInfoEnd",'hasBind', 'showShareBox', 'customerId', 'shareMessage', 'commentNum', 'listType', 'clickFlag', 'mobile', 'authStatus']),
      formatCommentNum() {
        if (parseInt(this.commentNum.all) > 99) {
          return "99+";
        } else {
          return this.commentNum.all;
        }
      },
      formatShareNum() {
        if (parseInt(this.shareMessage.num) >= 99) {
          return "99+";
        } else {
          return this.shareMessage.num
        }
      }
    }
  }
</script>

<style lang="scss">
  .iphonex {
    .bottom-bar {
      /*height: 128px;*/
      height: 166px;
      padding-bottom: 68px;
    }
  }
  .icon-share {
    display: inline-block;
    vertical-align: middle;
    width: 60px !important;
    height: 64px !important;
    img {
      width: 100%;
      height: 100%;
      vertical-align: top;
    }
  }
  .bottom-bar {
    position: fixed;
    left: 0;
    right: 0;
    bottom: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 0;
    background-color: #ffffff;
    height: 98px;
    /*height: 166px;*/
    z-index: 3;
    box-sizing: border-box;
    box-shadow: 0 -3px 11px 0 rgba(0, 0, 0, 0.15);
    .line {
      position: absolute;
      width: 1px;
      height: 80%;
      left: 50%;
      top: 50%;
      display: block;
      transform: translate(-50%, -50%);
      background: #F0F0F0;
    }
    &-item {
      width: 50%;
      text-align: center;

      &-content {
        padding: 0;
        border: none;
        background: none;
        border-radius: 0;
        box-shadow: none;
        span {
          display: inline-block;
          vertical-align: middle;
          color: #506C85;
        }
        i {
          display: inline-block;
          vertical-align: middle;
          width: 44px;
          height: 44px;
          margin-right: 10px;
        }
        .icon-comment {
          background: url("https://m.allinmed.cn/static/image/mp/index/1.1.2/overlay.png") no-repeat center center;
          background-size: contain;
        }
        .text {
          display: inline;
          font-size: 28px;
        }
        .num {
          display: inline;
          padding-top: 4px;
          font-size: 28px;
          margin-left:10px;
        }
      }
    }
  }
</style>

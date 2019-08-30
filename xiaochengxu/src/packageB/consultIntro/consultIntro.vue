<template>
  <section class="intro-inner">
    <NormalLoading v-if="loading"></NormalLoading>
    <section class="intro-wrapper">
      <!-- <img class="intro-banner-img" src="https://m.allinmed.cn/static/image/mp/index/1.6.0/zixun_bg.png" alt=""> -->
      <img class="intro-banner-img" src="https://m1.allinmed.cn/static/image/mp/index/1.6.0/zixun_bg.png" alt="">
      <section class="intro-main-content">
        <h3 class="intro-content-title">超过1600位合作专家</h3>
        <h3 class="intro-content-title">为您提供金牌服务</h3>
        <ul class="intro-main-list">
          <li class="intro-main-item">
            <image class="intro-main-image" src='https://m.allinmed.cn/static/image/mp/index/1.1.2/one.png'></image>
            <p class="intro-main-tips">预约加号</p>
          </li>
          <li class="intro-main-item">
            <image class="intro-main-image" src='https://m.allinmed.cn/static/image/mp/index/1.1.2/two.png'></image>
            <p class="intro-main-tips">手术咨询</p>
          </li>
          <li class="intro-main-item">
            <image class="intro-main-image" src='https://m.allinmed.cn/static/image/mp/index/1.1.2/three.png'></image>
            <p class="intro-main-tips">片子解读</p>
          </li>
          <li class="intro-main-item">
            <image class="intro-main-image" src='https://m.allinmed.cn/static/image/mp/index/1.1.2/four.png'></image>
            <p class="intro-main-tips">用药建议</p>
          </li>
          <li class="intro-main-item">
            <image class="intro-main-image" src='https://m.allinmed.cn/static/image/mp/index/1.1.2/five.png'></image>
            <p class="intro-main-tips">康复指导</p>
          </li>
          <li class="intro-main-item">
            <image class="intro-main-image" src='https://m.allinmed.cn/static/image/mp/index/1.1.2/six.png'></image>
            <p class="intro-main-tips">随访关怀</p>
          </li>
        </ul>
        <p class="intro-tips">{{ tips }}</p>
        <form>
          <button @click="goNext"> <p class="intor-auto-redirect"> 点此直接跳转 </p> </button>
        </form>
      </section>
    </section>

    <ensureConfirm v-if="ensureShow" :ensureParams="ensureParams" @ensureClickEvent="goToSetting"></ensureConfirm>
  </section>
</template>

<script>
  /**
   * @Desc：
   * @Usage:
   * @Notify：
   * @Depend：
   *
   * Created by Hallmader on 2018/6/24.
   */
  import api from 'common/js/util/util';
  import miniLogin from "common/js/miniUtil/miniLogin";
  import NormalLoading from "components/loading";
  import localStorage from "localStorage";
  import ensureConfirm from "components/ensure";
  import sendFormId from "common/js/HttpRequest/sendFormId";
  import dataLog from "dataLog";
  export default {
    data() {
      return {
        ensureShow:false,
        ensureParams: {
          content: "唯医骨科需获取您的授权信息，以方便您后续使用",
          ensure: "确定",
          type:"openSetting"
        },
        loading: false, // loading 组件是否显示
        isFullScreen:false, // 是否是全面屏；
        tips: '正为您安排骨科诊室，请稍候…',
        timeId: null
      }
    },
    onShareAppMessage: function () {
      let path = '/packageB/consultIntro/consultIntro';
      return {
        title: '唯医骨科|按病情快速推荐医生咨询',
        path: `/pages/mIndex/mIndex?from=shareFriend&path=${path}`,
      }
    },
    methods: {
      getAuthorize(obj) {

        if (this.loading) return;
        this.loading = true;

        dataLog.createTrack({
          actionId: 14182,
        });

        console.log(obj);
        if (obj.target.userInfo) {
          this.ensureShow = false;
          this.getLoginInfo();
        } else {
          this.loading = false;
          this.ensureShow = true;
        }
      },
      goNext() {
        let data = { applicationType: 0 };
        if (this.timeId) clearInterval(this.timeId)
        wx.navigateTo({
          url: '/packageB/consultSelectPart/consultSelectPart?query=' + encodeURIComponent(JSON.stringify(data))
        });
      },
      getLoginInfo(){
        console.log('检测登录');
        setTimeout(()=>{
          this.loading = false;
        },1500);
        miniLogin({
          successCallBack: (res) => {
            this.loading = false;
            if (res.data.responseObject.responseData.mobile && res.data.responseObject.responseData.mobile.trim().length > 0) {
              wx.navigateTo({
                url: '/packageB/consultPatientList/consultPatientList'
              });
            } else {
              wx.navigateTo({
                url: '/packageB/consultAddPatient/consultAddPatient'
              });
            }
          },
          failCallBack:()=>{
            console.log('失败的回调');
            this.loading = false;
          }
        })
      },
      goToSetting(e) {
        if (e.mp.detail.errMsg==="openSetting:ok"){
          this.ensureShow = false;
          this.getLoginInfo();
        }else{
          this.ensureShow = true;
        }
      },
    },
    mounted() {
      localStorage.removeItem("caseId");
      localStorage.removeItem("doctorId");
      localStorage.removeItem("doctorName");
      localStorage.removeItem("alreadyCreateIm");
      localStorage.removeItem("patientInfo");
      localStorage.removeItem("patientId");
      localStorage.removeItem("PCIMLinks");
    },
    onLoad () {
      var _this = this;
      wx.onNetworkStatusChange((res) => {
        this.loading = false;
        // console.log("netStatus:");
        // console.log(res);
        if (res && !!res.isConnected) {
        } else {
        }
      });
      this.isFullScreen = wx.getSystemInfoSync().screenHeight / wx.getSystemInfoSync().screenWidth > 2 ? true : false ;
      setTimeout(function(){ _this.tips = '正帮您联系骨科医生，请稍候…' }, 1000);
      this.timeId = setTimeout(function() {
        let data = { applicationType: 0 };
        wx.navigateTo({
          url: '/packageB/consultSelectPart/consultSelectPart?query=' + encodeURIComponent(JSON.stringify(data))
        });
      }, 2000);
    },
    onShow(){
      dataLog.enterBrowse();
    },
    onHide(){
      dataLog.leaveBrowse();
    },
    computed: {

    },
    components:{
      NormalLoading,
      ensureConfirm
    }
  }
</script>

<style lang="scss" scoped="scoped">
  page {
    height: 100%;
  }
  .intro-inner {
    width: 100%;
    height: 100%;
    box-sizing: border-box;
    background: #ffffff;
  }
  .intro-wrapper{
    position: relative;
    padding-top: 430px;
    box-sizing: border-box;
    height: 100%;
    overflow: hidden;
    .intro-banner-img {
      position: absolute;
      left: 0;
      top:0;
      width: 750px;
      height: 586px;
      z-index: 0;
    }
  }

  .intro-main-content {
    position: relative;
    width: 700px;
    height: 100%;
    margin: 0 auto;
    z-index: 1;
    padding-top: 56px;
    background-color: #fff;
    box-shadow:0px 16px 28px 0px rgba(117,151,156,0.32);
    font-size: 0;
    text-align: center;
    line-height: 1;
    border-radius: 24px 24px 0 0;
    .intro-content-title {
      font-size: 40px;
      color: #222222;
      font-weight: 600;
      + .intro-content-title {
        margin-top: 20px;
      }
    }
    .intro-main-list{
      display: flex;
      flex-wrap: wrap;
      padding-top: 26px;
      .intro-main-item{
        margin-top: 34px;
        width: 33.33%;
        text-align: center;
        .intro-main-image {
          width: 74px;
          height: 74px;
        }
        .intro-main-tips {
          margin-top: 12px;
          font-size: 30px;
          color: #555555;
        }
      }
    }
    .intro-tips {
      color: #27ACF7;
      font-size: 36px;
      text-align: center;
      margin-top: 80px;
    }
    button {
      border: none;
      background-color: #fff;
      padding: 0;
      line-height: inherit;
      margin-top: 100px;
      .intor-auto-redirect {
        font-size: 24px;
        text-align: center;
        color: #555;
        position: relative;
        line-height: 24px;
        &::after {
          display: inline-block;
          position: absolute;
          content: '';
          top: 6px;
          left: 424px;
          width: 10px;
          height: 10px;
          border-top: 2px solid #555;
          border-right: 2px solid #555;
          transform: rotate(45deg);
        }
      }
    }
  }

  .consult-btn {
    width:620px;
    line-height:104px;
    background:linear-gradient(228deg,rgba(0,194,174,1) 0%,rgba(0,189,176,1) 100%);
    box-shadow:0px 12px 24px 0px rgba(114,251,238,0.4);
    border-radius:8px;
    text-align: center;
    color: #ffffff;
    font-size: 40px;
    font-weight: bold;
    box-sizing: border-box;
    margin-top: 92px;
    &::before{
      display: inline-block;
      vertical-align: -6px;
      background: url("https://m.allinmed.cn/static/image/mp/index/1.2.0/zixun_icon_btn.png") no-repeat center center;
      background-size: 100% 100%;
      margin-right: 14px;
      content: '';
      width: 44px;
      height: 44px;
    }
    &::after{ border: none; }
    &.fullScreen{
      position: fixed;
      left: 50%;
      margin-left: -310px;
      bottom: 200px;
    }
  }
</style>

<template>
  <section class="intro-inner">
    <NormalLoading v-if="loading"></NormalLoading>
    <section class="intro-wrapper">
      <figure class="intro-banner">
        <image class="intro-banner-img" src="https://m.allinmed.cn/static/image/mp/index/1.1.2/text-bg.png"></image>
        <p class="intro-banner-out">
          <span class="intro-tips-one">不排队/限时免费</span>
        </p>
      </figure>
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
      </section>
      <form @submit="formSubmitName" report-submit="true">
        <button class="consult-btn" type="submit" formType="submit" open-type="getUserInfo" @getuserinfo="getAuthorize">马上去咨询</button>
      </form>
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
  const XHRList = {
    patientList: api.httpEnv() + "/mcall/customer/patient/relation/v1/getMapList/"//患者列表
  };
  import api from 'common/js/util/util';
  import miniLogin from "common/js/miniUtil/miniLogin";
  import NormalLoading from "components/loading";
  import localStorage from "localStorage";
  import ensureConfirm from "components/ensure";
  import sendFormId from "common/js/HttpRequest/sendFormId";
  import dataLog from "dataLog";
  import {createNamespacedHelpers} from "vuex";
  const {mapGetters,mapActions} = createNamespacedHelpers('meinian');
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
      }
    },
    // onShareAppMessage: function () {
    //   let path = '/packageB/consultIntro/consultIntro';
    //   return {
    //     title: '唯医骨科|按病情快速推荐医生咨询',
    //     path: `/pages/mIndex/mIndex?from=shareFriend&path=${path}`,
    //   }
    // },
    methods: {
      ...mapActions(['changeVerifyPhoneNumber','changeName','changeIdentityCardNum','changePhoneNum','checkVerificationCode','showToast','savePatientList','changePhoneNum','changeClickAble']),
      getAuthorize(obj) {
        let t = this;
        if(!t.clickAble){
          return false;
        }else{
          t.changeClickAble(false);
        }
        if (this.loading) return;
        this.loading = true;

        // dataLog.createTrack({
        //   actionId: 14182,
        // });
        if (obj.target.userInfo) {
          this.ensureShow = false;
          this.getLoginInfo();
        } else {
          this.loading = false;
          t.changeClickAble(true);
          this.ensureShow = true;
        }
      },
      formSubmitName(e) {
        sendFormId(e.target.formId).then(res=>{
          console.log(res);
        }).catch(err=>{
          this.loading = false;
        });
      },
      getPatientList() {
        const _this = this;
        this.gotPatient = false;
        this.loading = true;
        let _data = {
          customerId:localStorage.getItem("userId"),
          isValid: "1",
          patientSource:1,
          caseType:15,
          firstResult: "0",
          maxResult: "9999",
        };
        api.ajax({
          url: XHRList.patientList,
          method: "POST",
          data: _data,
          done(param) {
            _this.gotPatient = true;
            _this.count = param.responseObject.responseData.totalCount;
            if (param.responseObject.responseMessage == "NO DATA") {
              _this.changeClickAble(true);
              wx.navigateTo({
                url: '/packageA/meinian/meinian'
              });
            } else {
              param.responseObject.responseData.dataList.forEach((e, i) => {
                e.fullName = e.patientName.length > 4 ? e.patientName.substring(0, 4) + '...' : e.patientName;
              });
              _this.patientList = param.responseObject.responseData.dataList.reverse();
              if(_this.patientList.length>0){
                console.log(_this.patientList);
                _this.savePatientList(_this.patientList);
              }else{
                _this.changeClickAble(true);
                wx.navigateTo({
                  url: '/packageA/meinian/meinian'
                });
              }
            }
            _this.loading = false;
          },
          fail(err) {
            console.log(err);
          }
        })
      },
      getLoginInfo(){
        let t = this;
        setTimeout(()=>{
          this.loading = false;
        },1500);
        miniLogin({
          successCallBack: (res) => {
            this.loading = false;
            if (res.data.responseObject.responseData.mobile && res.data.responseObject.responseData.mobile.trim().length > 0) {
              let mobileNum = res.data.responseObject.responseData.mobile.trim();
              t.changePhoneNum(mobileNum);
              t.changeVerifyPhoneNumber(true);
              t.getPatientList();
              /*t.changeVerifyPhoneNumber(false);
              wx.navigateTo({
                url: '/packageA/meinian/meinian'
              });*/
            } else {
              t.changeVerifyPhoneNumber(false);
              wx.navigateTo({
                url: '/packageA/meinian/meinian'
              });
            }
            t.changeClickAble(true);
          },
          failCallBack:()=>{
            console.log('失败的回调');
            this.loading = false;
            t.changeClickAble(true);
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
      localStorage.removeItem('backIndex');
    },
    onLoad () {
      wx.onNetworkStatusChange((res) => {
        this.loading = false;
        console.log("netStatus:");
        console.log(res);
        if (res && !!res.isConnected) {

        } else {

        }
      });
    },
    onShow(){
      dataLog.enterBrowse();
    },
    onHide(){
      dataLog.leaveBrowse();
    },
    computed: {
      ...mapGetters(['clickAble'])
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
    min-height: 100%;
    box-sizing: border-box;
    background: url("https://m.allinmed.cn/static/image/mp/index/1.1.2/bg_indrouce.png") no-repeat top left;
    background-size: cover;
    padding-bottom: 166px;
  }


  .intro-banner {
    padding-top: 50px;
    line-height: 1;
    color: #FFFFFF;
    .intro-banner-img {
      width: 388px;
      height: 284px;
      margin-left: 30px;
    }
    .intro-banner-out{
      margin-left: 50px;
    }
    .intro-tips-one {
      padding: 12px 20px;
      display: inline-block;
      background-image: linear-gradient(-20deg, #FFC473 0%, #FFB061 97%);
      border-radius: 6px;
      font-size: 28px;
    }
  }

  .intro-main-content {
    background-color: #fff;
    box-shadow: inset 0 0 15px 0 rgba(109,255,245,0.78);
    border-radius: 24px;
    margin: 86px 26px 0;
    padding-top: 58px;
    padding-bottom: 76px;
    font-size: 0;
    text-align: center;
    line-height: 1;
    .intro-content-title {
      font-size: 38px;
      color: #222222;
      font-weight: 600;
      + .intro-content-title {
        margin-top: 16px;
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
  }

  .consult-btn {
    height: 166px;
    border-radius: 0;
    background: url("https://m.allinmed.cn/static/image/mp/index/1.1.2/btn-bg.png") no-repeat center center;
    background-size: 100% 100%;
    text-align: center;
    color: #ffffff;
    font-size: 40px;
    font-weight: bold;
    padding-top: 55px;
    box-sizing: border-box;
    position: fixed;
    left: 0;
    right: 0;
    bottom: 0;
    &::after{ border: none; }
  }
</style>

<template>
  <div class="doctorHomeMain" :class="{doctorNoV2:dataFinish && doctorLevel != 8}">
    <section class="doctorV2Level" v-if="dataFinish && doctorLevel != 8">
      <div class="doctorV2BgImg"><img src="https://m.allinmed.cn/static/image/mp/index/lost_erweima.png" alt=""></div>
      <h4>二维码已失效</h4>
      <article>请联系{{doctorNameAll}}医生获取最新二维码</article>
      <span class="goHomeBtn" @click="goHomePage">返回首页</span>
    </section>
    <section class="doctorHomeTop" :class="{'fullScreen':isFullScreen}" v-if="dataFinish && doctorLevel == 8">
      <section class="doctorInfo">
        <div class="doctorLogo">
          <img class="doctorLogoImg" :src="doctorLogo" alt="">
          <div class="doctorLogoBottom"></div>
        </div>
        <section class="doctorBaseInfo">
          <h2 class="docName">{{doctorName}}医生网上诊所</h2>
          <p class="docOtherInfo">
            <span>{{medicalTitle}}</span>&nbsp;<span>{{company}}</span>
          </p>
          <p class="docTips"><span class="docTipsText">擅治疾病</span></p>
          <p class="docStrongInfo">{{expertiseFiled}}</p>
          <div class="reportBtn">
            <form action="" @submit="formSubmit" report-submit="true">
              <button class="reportBtnAuthorize" type="submit" formType="submit" @click="logTrack" open-type="getUserInfo" @getuserinfo="getAuthorize" v-if="mobileOnOff">
                点击进入
              </button>
              <button class="reportBtnAuthorize" type="submit" formType="submit" @click="logTrack" open-type="getPhoneNumber" @getphonenumber="getAuthorizePhone" v-if="!mobileOnOff">
                点击进入
              </button>
            </form>
          </div>
        </section>
        <img src="https://m.allinmed.cn/static/image/mp/index/1.2.0/hua1.png" alt="" class="flowerOne">
        <img src="https://m.allinmed.cn/static/image/mp/index/1.2.0/hua2.png" alt="" class="flowerTwo">
        <img src="https://m.allinmed.cn/static/image/mp/index/1.2.0/hua_b.png" alt="" class="flowerThree">
      </section>
    </section>
    <toast :content="toastContent" v-if="toastShow"></toast>
    <LogoLoading v-if="loadingFlag"></LogoLoading>
    <ensureConfirm v-if="ensureShow" :ensureParams="ensureParams" @ensureClickEvent="goToSetting"></ensureConfirm>
    <BlackList
      :shielded="true"
      @shielded="shielded"
    ></BlackList>
    <authorization></authorization>
  </div>
</template>

<script type="text/ecmascript-6">
  import api from "common/js/util/util";
  import miniLogin from "common/js/miniUtil/miniLogin";
  import ensureConfirm from "components/ensure";
  import storage from "localStorage";
  import toast from 'components/toast';
  import LogoLoading from 'components/LogoLoading';
  import getPhoneAuthorization from 'common/js/miniUtil/GetPhoneAuthorization';
  import authorization from "components/authorization/authorization";
  import dataLog from "common/js/dataLog/dataLog";
  import sendFormId from "common/js/HttpRequest/sendFormId";
  import getPatientList from "common/js/HttpRequest/getPatientList";
  import {mapGetters,createNamespacedHelpers} from "vuex";
  import BlackList from "components/BlackList";
  const {mapMutations, mapState} = createNamespacedHelpers('reportNew');
  const XHRList = {
    doctorInfo: api.httpEnv() + "/mcall/customer/auth/v1/getMapById/"
  };
  import checkBlackList from "common/js/auth/checkBlackList";
  export default {
    name: "doctorHome",
    data() {
      let mobileOnOff = getPhoneAuthorization.checkPhoneNumber();
      return {
        mobileOnOff:mobileOnOff,
        doctorLogo: "",
        doctorName: "",
        doctorNameAll:"",
        doctorLevel:"",
        medicalTitle: "",
        company: "",
        expertiseFiled: "",
        toastShow:false,
        toastContent:"",
        clickStatus: true,
        ensureShow: false,
        dataFinish: false,
        ensureParams: {
          content: "唯医骨科需获取您的授权信息，以方便您后续使用",
          ensure: "确定",
          type:"openSetting"
        },
        loadingFlag:false,
        isFullScreen:false, // 是否是全面屏；
        isShielded:0   //是否被屏蔽
      }
    },
    onLoad(options) {
      this.loadingFlag = false;
      let scene = "";
      let defaultId = "1522723538976";
      let docCustomerId = this.$root.$mp.query.doctorCustomerId;
      console.log('onLoad');
      console.log(options);
      wx.removeStorageSync('backIndex');
      if (docCustomerId && docCustomerId.length > 0) {
        scene = docCustomerId;
        wx.setStorageSync("doctorId", scene);
      } else {
        if (options.scene) {
          console.log(options)
          scene = decodeURIComponent(options.scene);
          wx.setStorageSync("doctorId", scene);
        } else {
          scene = defaultId;
        }
      }
      this.setDoctorCustomerId(scene); // 设置vuex中的doctorId；
      this.isFullScreen = wx.getSystemInfoSync().screenHeight / wx.getSystemInfoSync().screenWidth > 2 ? true : false ;
      api.codeRecord("/pages/doctorHome/doctorHome");
    },
    mounted(options) {
      console.log('mounted');
      console.log(options);
    },
    onShow(option) {
      this.dataFinish = false;
      this.clickStatus = true;

      this.doctorInfo();
      console.log('onshow');
      console.log(option);
      let _this = this;
      wx.getLocation({
        type: 'wgs84',
        success: (res) => {
          console.log(res)
          const location = {
            latitude: res ? res.latitude : "", //经度
            longitude: res ? res.longitude : "", //纬度
            speed: res ? res.speed : "" //移动速度
          };
          storage.setItem("location", JSON.stringify(location));
        },
        fail: (err) => {
          console.log("用户拒绝授权，无法获取位置信息");
        }
      });
      storage.removeItem("alreadyCreateIm");
      this.mobileOnOff = getPhoneAuthorization.checkPhoneNumber();
    },
    onHide(){
      dataLog.leaveBrowse();
    },
    computed: {
      ...mapState(['doctorMessage']),
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
      ...mapMutations(['setDoctorCustomerId','setDoctorMessage']),
      /** 发送formId */
      formSubmit(e) {
        sendFormId(e.target.formId);
      },
      /** 显示toast */
      showToast(msg){
        this.toastContent = msg;
        this.toastShow = true;
        setTimeout(()=>{
          this.toastShow = false;
        },2000);
      },
      shielded(){
       this.isShielded = 1;
      },
      /** 获取医生信息 */
      doctorInfo() {
        const _this = this;
        _this.loadingFlag = true;
        _this.doctorId = wx.getStorageSync("doctorId");
        console.log('获取数据的医生ID'+ wx.getStorageSync("doctorId"));
        api.ajax({
          url: XHRList.doctorInfo,
          method: "POST",
          data: {
            customerId: wx.getStorageSync("doctorId"),
            logoUseFlag: 3
          },
          done(res) {
            _this.loadingFlag = false;
            if (res && res.responseObject.responseData && res.responseObject.responseData.dataList) {
              let doctorMain = res.responseObject.responseData.dataList[0];
              let medicalTitleText = _this.textCutter(doctorMain.authMap.medicalTitle, "medical");
              _this.doctorLogo = doctorMain.logoUrlMap.logoUrl;
              _this.doctorNameAll = doctorMain.authMap.fullName;
              wx.setStorageSync("doctorName", doctorMain.authMap.fullName);
              _this.doctorName = api.getByteLen(doctorMain.authMap.fullName) > 8 ? api.getStrByteLen(doctorMain.authMap.fullName,6) + "..." : doctorMain.authMap.fullName;
              _this.doctorLevel = doctorMain.authMap.state;
              _this.medicalTitle = (medicalTitleText.length > 8 ? medicalTitleText.substring(0, 8) + "..." : medicalTitleText) || "";
              _this.company = doctorMain.authMap.company || "";
              // _this.expertiseFiled = doctorMain.illnessMapList.length > 0 ?  _this.expertiseFun(doctorMain.illnessMapList) : '';
              _this.expertiseFiled = doctorMain.authMap.expertise.split("，");
              _this.dataFinish = true;
              _this.setDoctorMessage({
                logoUrl:_this.doctorLogo, // 医生头像连接
                fullName:_this.doctorNameAll, // 医生名字的全称；
                fullNameClip:_this.doctorName, // 医生名字超过四个中文字显示 ...
                medicalTitle:_this.medicalTitle, // 医生职称
                company:_this.company, // 医院
              });
              console.log(_this.doctorMessage);
              if(_this.doctorLevel != 8){
                wx.setNavigationBarTitle({
                  title: `${_this.doctorNameAll }医生`
                });
                wx.setNavigationBarColor({
                  frontColor:'#000000',
                  backgroundColor: '#ffffff'
                });
                dataLog.enterBrowse({
                  browseType: "131",
                  opDesc: "患者报到医生二维码失效页（小程序）"
                })
              }else{
                wx.setNavigationBarTitle({
                  title: "唯医骨科"
                });
                wx.setNavigationBarColor({
                  frontColor:'#000000',
                  backgroundColor: '#DBFBFF'
                });

                dataLog.enterBrowse({
                  resourceId:JSON.stringify({
                    doctorId: wx.getStorageSync("doctorId")
                  })
                })
              }
            }else{
              _this.dataFinish = false;
              _this.showToast("网络信号差，请稍后再试");
            }
          },
          fail(err){
            _this.dataFinish = false;
            _this.loadingFlag = false;
            _this.showToast("网络信号差，请稍后再试");
          }
        })
      },
      // 处理擅长疾病字段；
      expertiseFun (obj) {
        let arrTemp = [];
        obj.map( (item) => {
          arrTemp.push(item.illnessName);
        });
        return arrTemp.join(',');
      },
      /** 处理医生职称数据 */
      textCutter(str, type) {
        let strNew = "";
        if (str.includes(",")) {
          str.split(",").forEach((element) => {
            if (element.length === 0) {
              strNew += "";
            } else {
              if (element.includes("_")) {
                if (type == "medical") {
                  strNew += element.split("_")[1] + " ";
                } else {
                  strNew += element.split("_")[1] + "，";
                }
              } else {
                if (type == "medical") {
                  strNew += element + " ";
                } else {
                  strNew += element + "，";
                }
              }
            }
          });
          return strNew.substring(0, strNew.length - 1);
        } else if (str.includes("_")) {
          strNew += str.split("_")[1];
          return strNew;
        } else {
          strNew += str;
          return strNew;
        }
      },
      getAuthorizePhone(info){
        let _this = this;
        let e = info.mp;
        if(_this.isShielded ===1){
          _this.showToast("与医生沟通时触发敏感词汇，无法向该医生报到");
          return false;
        }
        getPhoneAuthorization.init({
          info:e,
          cancelBack(){
            if (_this.clickStatus) {
              _this.ensureShow = true;
            }
          },
          successBack(){
            if (_this.clickStatus) {
              _this.clickStatus = false;
              _this.ensureShow = false;
              _this.getLoginInfo();
            }
          }
        });
      },
      /** 获取授权 */
      getAuthorize(obj) {
        if(this.isShielded ===1){
          this.showToast("与医生沟通时触发敏感词汇，无法向该医生报到");
          return false;
        }

        if (this.clickStatus) {
          this.clickStatus = false;
          if (obj.target.userInfo) {
            this.ensureShow = false;
            this.getLoginInfo();
          } else {
            this.ensureShow = true;
          }
        }
      },
      /** 获取授权 */
      goToSetting(e) {
        let _this = this;
        if (e.mp.detail.errMsg==="openSetting:ok"){
          _this.ensureShow = false;
          _this.clickStatus = false;
          _this.getLoginInfo();
        }else{
          _this.clickStatus = true;
          _this.ensureShow = true;
        }
      },
      /** 登录判断并且跳转 */
      getLoginInfo() {
        const _this = this;
        _this.loadingFlag = true;
        miniLogin({
          successCallBack: function (res) {
            let customerId = wx.getStorageSync("userId");
            let doctorId = wx.getStorageSync("doctorId");
            checkBlackList({
              customerId: customerId,
              doctorId : doctorId
            }).then(checkBlackListRes => {

              //如果被屏蔽则提示,并退出
              if (checkBlackListRes && checkBlackListRes.responseObject && checkBlackListRes.responseObject.responseData && checkBlackListRes.responseObject.responseData.dataList && checkBlackListRes.responseObject.responseData.dataList[0] && checkBlackListRes.responseObject.responseData.dataList[0].isShielded === 1) {
                _this.isShielded =1;
                _this.loadingFlag = false;
                _this.showToast("与医生沟通时触发敏感词汇，无法向该医生报到");
                return false;
              }else{
                if (res.data.responseObject.responseData.mobile && res.data.responseObject.responseData.mobile.trim().length > 0) {
                  api.codeRecord("/packageD/doctorHome/doctorHome");
                  _this.getPatientListFun();
                } else {
                  _this.loadingFlag = false;
                  wx.navigateTo({
                    url: `/packageD/reportNew/reportRegister`
                  });
                }
              }
            })
          },
          failCallback : err => {
            _this.loadingFlag = false
            console.log(err);
          },
        });
      },
      /** 获取患者列表函数 */
      getPatientListFun() {
        const _this = this;
        getPatientList().then(param => {
          _this.loadingFlag = false;
          if (param.responseObject.responseMessage == "NO DATA") {
            console.log("没有患者");
            wx.navigateTo({
              url: `/packageD/reportNew/reportAddPatient`
            });
          } else {
            wx.navigateTo({
              url: `/packageD/reportNew/reportPatientList`
            });
          }
        }).catch( err => {
          console.log(err)
        })
      },
      /** 返回首页 */
      goHomePage(){
        wx.navigateTo({
          url: '/pages/mIndex/mIndex'
        });
      },
      logTrack(){
        let _this = this;
        dataLog.createTrack({ // 医生报到首页页面 点击”点击进入“
          actionId: 14223,
          browseType:145,
          pushMessageId:JSON.stringify({doctorId:_this.doctorId})
        });
      }
    },
    components: {
      ensureConfirm,
      toast,
      LogoLoading,
      BlackList,
      authorization
    }
  }
</script>

<style lang="scss" scoped>
  .doctorHomeMain {
    width: 100%;
    height: 100%;
    background: linear-gradient(180deg,rgba(219,251,255,1) 0%,rgba(222,243,250,1) 100%);
    &.doctorNoV2{
      background: #fff;
    }
    .doctorHomeTop {
      width: 100%;
      height: 100%;
      background-image: url("https://m.allinmed.cn/static/image/mp/index/1.2.0/bg_home.png");
      background-repeat: no-repeat;
      background-position: bottom left;
      background-size: 100% 188px;
      /*&.fullScreen{*/
        /*.doctorInfo{*/
          /*padding-top: 280px;*/
          /*.doctorLogo{*/
            /*top: 110px;*/
          /*}*/
        /*}*/
      /*}*/
      .doctorInfo {
        padding-top: 170px;
        position: relative;
        .doctorLogo{
          position: absolute;
          z-index: 2;
          top: 0px;
          padding-top: 36px;
          left: 50%;
          transform: translateX(-50%);
          .doctorLogoImg{
            width: 250px;
            height: 250px;
            border-radius: 50%;
            border: 6px solid #ffffff;
            box-shadow:0px 10px 22px 0px rgba(142,158,162,0.2);
          }
          .doctorLogoBottom {
            width:72px;
            height:6px;
            border-radius: 3px;
            background-color: #cdd1d9;
            margin: 36px auto;
          }
        }
        .doctorBaseInfo{
          margin: 0 22px;
          padding-top: 244px;
          padding-bottom: 92px;
          border-radius: 40px;
          background-color: #ffffff;
          box-shadow:0px 8px 16px 0px rgba(178,214,209,0.25),0px -1px 1px 0px rgba(208,243,255,1);
          line-height: 1;
          position: relative;
          z-index: 1;
          .docName {
            font-size:52px;
            color: #333333;
            text-align: center;
            font-weight: bold;
          }
          .docOtherInfo{
            color: #888888;
            padding: 0 40px;
            font-size: 34px;
            margin-top: 26px;
            text-align: center;
            @include ellipsis();
          }
          .docTips {
            position: relative;
            text-align: center;
            margin-top: 60px;
            &::before{
              display: block;
              content: '';
              position: absolute;
              width:446px;
              height:2px;
              background-color: #F0F1F3;
              top: 50%;
              margin-top: -1px;
              left: 50%;
              margin-left: -223px;
              z-index: 0;
            }
            .docTipsText{
              position: relative;
              padding: 0 36px;
              z-index: 1;
              color: #888888;
              font-size: 32px;
              background-color: #ffffff;
            }
          }
          .docStrongInfo{
            padding: 0 61px;
            margin-top: 44px;
            color:rgb(37,50,77);
            line-height:1.5;
            font-size: 32px;
            overflow: hidden;
            text-overflow: ellipsis;
            display: -webkit-box;
            -webkit-line-clamp: 2;
            -webkit-box-orient: vertical;
          }
          .reportBtn{
            margin-top: 88px;
            .reportBtnAuthorize{
              margin: 0 auto;
              width:560px;
              line-height:104px;
              background:linear-gradient(228deg,rgba(0,194,174,1) 0%,rgba(0,189,176,1) 100%);
              box-shadow:0px 12px 24px 0px rgba(114,251,238,0.4);
              border-radius:8px;
              color: #ffffff;
              font-size: 36px;
              &::after{
                border: none;
              }
            }
          }
        }
        .flowerOne {
          width: 66px;
          height: 64px;
          position: absolute;
          z-index: 1;
          top: 460px;
          left: 4px;
        }
        .flowerTwo {
          width: 80px;
          height: 82px;
          position: absolute;
          z-index: 1;
          bottom: 4px;
          right: 8px;
        }
        .flowerThree{
          position: absolute;
          width: 68px;
          height: 86px;
          right: 70px;
          bottom: -15px;
          z-index: 0;
        }
      }
    }
    .doctorV2Level{
      width:100%;
      height: 100%;
      overflow: hidden;
      .doctorV2BgImg{
        width:320px;
        height:320px;
        margin:180px auto 0;
        img{
          display: block;
          width:100%;
          height:100%;
        }
      }
      h4{
        font-size: 38px;
        color: #222222;
        font-weight: bold;
        text-align: center;
        margin-top:46px;
      }
      article{
        margin-top:24px;
        font-size: 34px;
        color: #555555;
        text-align: center;
      }
      .goHomeBtn{
        display:block;
        width:216px;
        height:68px;
        line-height:68px;
        margin:66px auto 0;
        text-align: center;
        border: 1px solid #2EA9FE;
        border-radius: 100px;
        color:#2EA9FE;
        font-size:32px;
        font-weight: bold;
      }
    }
  }
</style>

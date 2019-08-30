<template>
  <section class="illnessAddMain">
    <article class="invite-title">
      <h2>想要{{doctorFullName}}医生提供的帮助是？</h2>
      <p>简单描述您的病情，并说明想要得到的帮助；如发病诱因，症状，患病时长，治疗情况等。</p>
    </article>
    <section class="illnessBox">
      <textarea class="illnessAddArea" :placeholder="placeholder" v-model.trim="areaText" @input="inputFn()" maxlength=-1></textarea>
      <span class="inputCount">{{inputCount}}</span>
    </section>
    <section class="illnessAddBtnBox">
      <button class="illnessAddBtnSure" @click="sureGoBack" >下一步</button>
    </section>
  </section>
</template>
<NormalLoading v-if="loading"></NormalLoading>

<script type="text/ecmascript-6">
  import api from "common/js/util/util";
  import createInviteContent from "common/js/HttpRequest/createInviteContent";
  import NormalLoading from "components/loading";
  import miniLogin from "common/js/miniUtil/miniLogin";
  import localStorage from "common/js/miniUtil/localStorage";
  import dataLog from "dataLog";
  import {createNamespacedHelpers} from "vuex";
  const {mapMutations, mapState , mapGetters, mapActions} = createNamespacedHelpers('doctorMain');

  export default {
    data() {
      return {
        placeholder: "请在这里描述",
        areaText: "",
        inputCount: "",
        loading: false, // loading 是否显示
        from:'',
        ableUse:true,
        doctorFullName:'',   //医生名字
        doctorId:'',         //医生ID
      };
    },
    mounted() {
      this.checkLogin(); // 检查是否登录
    },
    onLoad(option){
      const _this = this;
      if (option.from) {
        this.from = option.from;
        //IM医生卡牌邀请开诊，增加 option.doctorId,是为了容错 分诊IM => 医生主页 => 邀请开诊获取不到医生名字而添加；
        if (option.from=='imScene' && option.doctorId) {
          _this.doctorFullName = option.fullName;
          _this.doctorId = option.doctorId;
          _this.setDoctorMessage({
            authMap:{fullName:option.fullName},
          });
        } else {
          _this.doctorFullName = _this.doctorMessage.authMap.fullName;
          _this.doctorId = _this.idList.doctorId;
        }
      }
      this.inputCount ='';
      this.areaText = '';
    },
    onShow(){
      dataLog.enterBrowse();
    },
    onHide(){
      dataLog.leaveBrowse();
    },
    components: {
      NormalLoading,
    },
    computed: {
      ...mapState(["doctorMessage","idList","isLogin"]),
      // ...mapGetters(['isLogin']),
    },
    methods: {
      ...mapMutations(['setMainKey','setIsLogin',"setDoctorMessage",]),
      // ...mapActions(['setIsLogin']),
      showToast(str){
        wx.showToast({
          title: str,
          icon: 'none',
          duration: 2000
        })
      },
      /** 检查是否登录 */
      checkLogin () {
        miniLogin({
          successCallBack:  (res) => {
            if (res.data.responseObject.responseData.mobile && res.data.responseObject.responseData.mobile.trim().length > 0) {
              // 已登录...前往患者列表
              this.setIsLogin(true);
            } else {
              // 未登录...前往添加患者
              this.setIsLogin(false);
            }
          }
        });
      },
      sureGoBack() {
        if (this.areaText.length > 0) {
          if (this.ableUse) {

            this.ableUse = !this.ableUse;
            this.saveInviteContent();
          } else {
            return false;
          }
        } else {
          this.showToast("请输入描述内容");
        }
      },
      //保存开诊登记
      saveInviteContent() {
        dataLog.createTrack({
          actionId: 14154,
          keyword: localStorage.getItem("userId") || "",
        });
        this.loading = true;
        createInviteContent({
          patientId: "",
          patientCustomerId: localStorage.getItem("userId") || "",
          customerId: this.doctorId,
          openid: localStorage.getItem("openId") || "",
          uuid: localStorage.getItem("unionId") || "",
          state: "0",
          needHelp: this.areaText,
          visitSiteId: '24',
          sourceType: this.from === "find" ? 1 : 2,
        }).then(data => {
          this.ableUse = !this.ableUse;
          if (data.responseObject.responseStatus) {
            this.setMainKey(data.responseObject.responsePk);
            this.loading = false;
            // 保存成功...判断是否已登录
            if (this.isLogin) {
              console.log('登录了');
              wx.redirectTo({
                url:`/pages/doctorMain/doctorMainPatientList`,
              });
            } else {
              console.log("未登录");
              wx.redirectTo({
                url:`/pages/doctorMain/doctorMainAddPatient`,
              });
            }
          } else {
            this.showToast("提交失败");
          }
        })
      },
      inputFn() {
        let _this = this;
        let _countObj = api.getStrInputCut(_this.areaText, 200, 50);
        _this.areaText = _countObj.str;
        if (_countObj.outStatus) {
          _this.inputCount = _countObj.lastCount;
        } else {
          _this.inputCount = '';
        }
      }
    }
  };
</script>
<style lang="scss" rel="stylesheet/scss">
  .illnessAddMain {
    width: 100%;
    height: 100%;
    background: #ffffff;
    box-sizing: border-box;
    .illnessBox {
      position: relative;
      width: 634px;
      height: 240px;
      margin: 0 auto;
      .inputCount {
        position: absolute;
        bottom: 12px;
        right: 10px;
        font-size: 36px;
        color: #FE8178;
      }
      .illnessAddArea {
        display: block;
        width: 634px;
        height: 240px;
        padding: 30px 28px;
        font-size: 32px;
        line-height: 44px;
        color: #333333;
        border: 2px solid #cccccc;
        border-radius: 8px;
        box-sizing: border-box;
        &::-webkit-input-placeholder {
          color: #aaaaaa;
        }
      }
    }

    .illnessAddBtnBox {
      margin-top: 80px;
      .illnessAddBtnSure {
        display: block;
        margin: 0 auto;
        width: 500px;
        height: 100px;
        line-height: 100px;
        text-align: center;
        font-size: 34px;
        color: #ffffff;
        font-weight: bold;
        background: linear-gradient(-90deg, #3fe6bc 6%, #07b6ac 95%);
        box-shadow: 0 20px 36px 0 rgba(30, 231, 187, 0.38);
        border-radius: 100px;
      }
      .illnessAddBtnCancle {
        display: block;
        width: 100%;
        margin-top: 44px;
        text-align: center;
        font-size: 34px;
        color: #929292;
      }
    }
  }

  .invite-title {
    padding: 0 66px;
    padding-top: 64px;
    box-sizing: border-box;
    margin-bottom: 30px;
    h2 {
      font-size: 40px;
      color: #222222;
    }
    p {
      margin-top: 70px;
      color: #444444;
      font-size: 30px;
      line-height: 1.5;
    }
  }
</style>

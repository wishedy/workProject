<template>
  <section>
    <!--<HeaderProgress :progress="1"></HeaderProgress>-->
    <AddPatient
      :headTitle='headTitle'
      @selectPartCb="toSelectPart"
    ></AddPatient>
    <BackIndex v-if="backIndexShow"></BackIndex>
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
   * Created by lichenyang on 2018/8/9.
   */
  import api from 'common/js/util/util';
  import AddPatient from "components/consult/addPatient";
  import BackIndex from "components/backIndex"; // 返回首页组件
  // import HeaderProgress from "components/consult/headerProgress";
  import NormalLoading from "components/loading";
  import dataLog from "dataLog";
  import localStorage from "localStorage";
    /**************************Base Vue-Methods*************************/
  import {createNamespacedHelpers} from "vuex";
  const {mapMutations, mapGetters,mapState, mapActions} = createNamespacedHelpers('findDoctor');
  export default {
    data() {
      return {
        loading : false, // 控制 Loading；
        headTitle:'', // 头部title
        doctorCustomerId:0, // 医生id
        backIndexShow: false, // 返回首页是否显示
      }
    },

    onShow(){
      if (localStorage.getItem("userId")){
        dataLog.enterBrowse({
          browseType:"92",
          opDesc:"新就诊人信息添加-已登录找医生（小程序）"
        })
      }else{
        dataLog.enterBrowse({
          browseType:"91",
          opDesc:"新就诊人信息添加-未登录找医生（小程序）"
        })
      }
    },
    onHide(){
      dataLog.leaveBrowse();
    },
    onLoad(options) {
      this.loading = true;
      if (wx.getStorageSync("backIndex")) {
        this.backIndexShow = true;
      } else {
        this.backIndexShow = false;
      }
      // 从患者列表进来没有医生id，所以添加容错；
      if (options &&  options.doctorCustomerId) {
        this.doctorCustomerId = options.doctorCustomerId;
        this.setDoctorCustomerId(options.doctorCustomerId);
      }
      this.partName = options.partName;
      this.caseType = options.caseType;
      this.partId = options.partId;
      if(options.source && options.source === 'qrCode') {
        this.setQrCode(true);
      } else {
        this.setQrCode(false);
      }
      try { this.customerId = wx.getStorageSync('userId') } catch (e) {}
      try { this.openId = wx.getStorageSync('openId') } catch (e) {}
      this.init();
    },
    onUnload(){
      console.log('onUnload');
      this.setDoctorMessage({}); // 返回的时候清掉医生的数据；
      this.headTitle = ""; // 返回的时候清空头部话术；
    },
    methods: {
      ...mapActions(["getDoctorMsg",'setQrCode',"setOrderMessage"]),
      ...mapMutations(["setDoctorMessage","setDoctorCustomerId"]),
      /** 页面初始化 */
      init() {
        let doctorMessage = this.doctorMessage;
        if (doctorMessage && !!doctorMessage.doctorName) {
          this.headTitle = `与${doctorMessage.doctorName}医生沟通前，请先完善就诊人信息和病情资料。`;
          this.loading = false;
        } else {
          this.getDoctorMsg(this.doctorCustomerId).then( () => {
          this.headTitle = `与${this.doctorMessage.doctorName}医生沟通前，请先完善就诊人信息和病情资料。`;
          this.loading = false;
          });
        }
      },
      /** 去选择部位 */
      toSelectPart(patientItem) {
        dataLog.createTrack({
          actionId: 14159,
          browseType: "92",
          opDesc: "新患者信息添加"
        });
        const caseParam = {
          "visitSiteId": api.getSiteId(),
          "customerId": this.customerId + "",
          "patientId": patientItem.patientId,
          "patientName": patientItem.patientName,
          "patientAge": patientItem.patientAge,
          "caseType": this.caseType,
          "openId": this.openId,
          "partId": this.partId,
          "sex": patientItem.patientSex
        };
        this.findDoctorAffirmOrder(caseParam);
        // wx.navigateTo({
        //   url: '/packageE/findDoctorSelectPart/findDoctorSelectPart'
        // });
      },
      findDoctorAffirmOrder(caseParam) {
        // let _this = this;
        // api.ajax({
        //   url:  api.httpEnv() + '/mcall/customer/patient/case/v3/create/',
        //   method: "POST",
        //   data: caseParam,
        //   done(response) {
        //     if (response.responseObject.responseStatus) {
        //       if (_this.applicationType == '12') {
        //         const consultParam = {
        //           caseId: response.responseObject.responsePk,
        //           caseType: _this.caseType,
        //           patientCustomerId: _this.patientCustomerId,
        //           patientId: _this.patientId,
        //           consultationType: _this.consultationType,
        //           consultationState: 4,
        //           siteId: api.getSiteId()
        //         }
        //         createConsultation(consultParam).then(data => {
        //           if (data.responseObject.responseStatus) {
        //             wx.reLaunch({
        //               url: `/packageA/imScene/imScene?caseId=${consultParam.caseId}&patientId=${consultParam.patientId}`
        //             });
        //           } else {
        //             console.log('createConsultation error')
        //           }
        //         });
        //       } else {
        //
        //       }
        //
        //     } else {
        //       console.log('caseParam error')
        //     }
        //   }
        // })
        console.log('伪造一下订单信息吧');
        let medicalShow =Object.assign(this.orderMessage.medicalShow,{
          patientName: caseParam.patientName,
          sex: caseParam.sex,
          age: caseParam.patientAge,
          partName: this.partName
        })
        //订单信息伪造
        this.setOrderMessage({
          medicalShow: medicalShow,
          medicalCreate: caseParam
        });
        wx.navigateTo({
          url: `/packageE/findDoctorAffirmOrder/findDoctorAffirmOrder`
        });
      }
    },
    computed: {
      ...mapState(["doctorMessage"]),
      ...mapGetters(["orderMessage"]),
    },
    mounted() {
      this.init();
    },
    components: {
      BackIndex,
      // HeaderProgress,
      NormalLoading,
      AddPatient
    }
  }
</script>

<style lang="scss">

</style>

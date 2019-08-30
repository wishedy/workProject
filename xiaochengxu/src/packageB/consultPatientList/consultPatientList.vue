<template>
  <section>
    <!-- <HeaderProgress :progress="1"></HeaderProgress> -->
    <PatientList
      @selectPatientCb="toSelectPart"
      @addPatientCb="toAddPatient"
      @redirectPatientCb = "redirectToAddPatient"
    ></PatientList>
    <confirm :confirmParams="{
          'ensure':'继续沟通',
          'cancel':'返回首页',
          'title':'您的咨询单已提交\n无需重复操作'
          }" v-if="confirmShow" @cancelClickEvent="backToHome" @ensureClickEvent="backToIm">
    </confirm>
    <BlackList></BlackList>
    <NormalLoading v-if="isLoading"></NormalLoading>
    <authorization></authorization>
  </section>
</template>

<script>
  /**
   * @Desc：
   * @Usage:
   * @Notify：
   * @Depend：
   *
   * Created by Hallmader on 2018/7/4.
   */
  import PatientList from "components/consult/patientList";
  import NormalLoading from "components/loading";
  import HeaderProgress from "components/consult/headerProgress";
  import localStorage from "localStorage";
  import confirm from "components/confirm";
  import dataLog from "dataLog";
  import BlackList from "components/BlackList";
  import authorization from "components/authorization/authorization";
  import api from 'common/js/util/util';
  import createConsultation from "common/js/HttpRequest/createConsultation";

  export default {
    data() {
      return {
        confirmShow:false,
        isLoading:false
      }
    },

    methods: {
      /** 去选择部位 */
      toSelectPart(patientItem) {
        let _this = this;
        dataLog.createTrack({
          actionId: 14157,
          keyword:patientItem.patientName
        });
        console.log('patientItem --> ',  patientItem)
        this.patientCustomerId = patientItem.patientCustomerId;
        this.patientId = patientItem.patientId;
        const caseParam = {
          "visitSiteId": api.getSiteId(),
          "customerId": this.customerId + "",
          "patientId": patientItem.patientId,
          "patientName": patientItem.patientName,
          "caseType": this.caseType,
          "openId": this.openId,
          "partId": this.partId,
          "sex": patientItem.patientSex
        };
        this.doctorId && (caseParam.doctorId = this.doctorId);
        // wx.showLoading({
        //   title: "正在加载..."
        // });
        _this.isLoading=true;
        api.ajax({
          url:  api.httpEnv() + '/mcall/customer/patient/case/v3/create/',
          method: "POST",
          data: caseParam,
          done(response) {
            //console.log('response --> ', response);
            if (response.responseObject.responseStatus) {
              const consultParam = {
                caseId: response.responseObject.responsePk,
                caseType: _this.caseType,
                patientCustomerId: _this.patientCustomerId,
                patientId: _this.patientId,
                consultationType: _this.consultationType,
                consultationState: 4,
                siteId: api.getSiteId()
              }
              console.log('consultParam ---> ', consultParam);
              createConsultation(consultParam).then(data => {
                wx.hideLoading();
                _this.isLoading=false;
                if (data.responseObject.responseStatus) {
                  if (getCurrentPages().length > 5) {
                    wx.setStorageSync("backIndex",true);
                    wx.reLaunch({
                      url: `/packageA/imScene/imScene?caseId=${consultParam.caseId}&patientId=${consultParam.patientId}`
                    });
                  } else {
                    wx.navigateTo({
                      url: `/packageA/imScene/imScene?caseId=${consultParam.caseId}&patientId=${consultParam.patientId}`
                    });
                  }
                } else {
                  console.log('consultParam ---> ', data)
                }
              });
            } else {
              wx.hideLoading();
              console.log('caseParam --> ', response)
            }
          }
        })

        // wx.reLaunch({
        //   url: `/packageA/imScene/imScene?caseId=${param.caseId}&patientId=${param.patientId}`
        // });
        // wx.navigateTo({
        //   url: '/packageB/consultSelectPart/consultSelectPart'
        // });
      },
      /** 去添加患者 */
      toAddPatient () {
        wx.navigateTo({
          url: '/packageB/consultAddPatient/consultAddPatient?doctorId='+this.doctorId+'&partId='+this.partId
        });
      },
      /** 替换患者列表 */
      redirectToAddPatient (data) {
        console.log('redirectToAddPatient ---> ', data)
        wx.redirectTo({
          url: '/packageB/consultAddPatient/consultAddPatient?doctorId='+this.doctorId+'&partId='+this.partId
        });
      },
      //返回首页
      backToHome() {
        this.confirmShow = false;
        wx.reLaunch({
          url: "/pages/mIndex/mIndex"
        })
      },
      backToIm(){
        this.confirmShow = false;
        let param = JSON.parse(localStorage.getItem("PCIMLinks"));
        wx.navigateTo({
          url:  `/packageA/imScene/imScene?caseId=${param.caseId}&patientId=${param.patientId}`
        });
      }
    },
    mounted() {

    },
    onLoad(option) {
      const data = JSON.parse(decodeURIComponent(option.query));
      console.log(data);
      this.doctorId = data.doctorId;
      this.partId = data.partId;
      this.isLoading=false;
      // this.caseType = data.applicationType;
      this.caseType = 0;
      try { this.customerId = wx.getStorageSync('userId') } catch (e) {}
      try { this.openId = wx.getStorageSync('openId') } catch (e) {}
    },
    onShow(){
      dataLog.enterBrowse();
      if(localStorage.getItem("PCIMLinks")) {
        this.confirmShow = true;
      } else {
        this.confirmShow = false;
      }
    },
    onHide(){
      dataLog.leaveBrowse();
    },
    computed: {},
    components: {
      // HeaderProgress,
      PatientList,
      BlackList,
      authorization,
      confirm,
      NormalLoading
    }
  }
</script>

<style lang="scss">

</style>

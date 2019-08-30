<template>
  <section>
    <!--<HeaderProgress :progress="1"></HeaderProgress>-->
    <AddPatient
      @selectPartCb="toSelectPart"
    ></AddPatient>
    <NormalLoading v-if="isLoading"></NormalLoading>
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
  import AddPatient from "components/consult/addPatient";
  import NormalLoading from "components/loading";
  // import HeaderProgress from "components/consult/headerProgress";
  import dataLog from "dataLog";
  import api from 'common/js/util/util';
  import localStorage from "localStorage";
  import createConsultation from "common/js/HttpRequest/createConsultation";

  export default {
    data() {
      return {
        isLoading:false
      }
    },
    methods: {
      /** 去选择部位 */
      toSelectPart(patientItem) {
        dataLog.createTrack({
          actionId: 14159,
          browseType: "108",
          opDesc: "新患者信息添加"
        });
        this.isLoading=true;
        console.log('patientItem --> ',  patientItem)
        let _this=this;
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
                wx.hideLoading()
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
              wx.hideLoading()
              console.log('caseParam --> ', response)
            }
          }
        })
        // wx.navigateTo({
        //   url: '/packageB/consultSelectPart/consultSelectPart'
        // });
      },
    },
    mounted() {

    },
    onShow() {
      if (localStorage.getItem("userId")) {
        dataLog.enterBrowse({
          browseType: "109",
          opDesc: "新就诊人信息添加-已登录找医生（小程序）"
        })
      } else {
        dataLog.enterBrowse({
          browseType: "108",
          opDesc: "新就诊人信息添加-未登录找医生（小程序）"
        })
      }
    },
    onHide() {
      dataLog.leaveBrowse();
    },
    onLoad(option){
      this.isLoading=false
      this.doctorId = option.doctorId;
      this.partId = option.partId;
      this.caseType = 0;
      try { this.customerId = wx.getStorageSync('userId') } catch (e) {}
      try { this.openId = wx.getStorageSync('openId') } catch (e) {}
    },
    components: {
      // HeaderProgress,
      AddPatient,
      NormalLoading
    }
  }
</script>

<style lang="scss">

</style>

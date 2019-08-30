<template>
  <section>
    <!-- <HeaderProgress :progress="1"></HeaderProgress> -->
    <PatientList
      :headTitle='headTitle'
      @selectPatientCb="toSelectPart"
      @addPatientCb="toAddPatient"
      @redirectPatientCb="redirectToAddPatient"
      :scene="'findDoctor'"
    ></PatientList>
    <BackIndex v-if="backIndexShow"></BackIndex>
    <NormalLoading v-if="loading"></NormalLoading>
    <confirm :confirmParams="{
          'ensure':'去沟通',
          'cancel':'取消',
          'title':'您与该医生有正在进行中的咨询，现在继续去沟通吗？'
          }" v-if="confirmShow"  @cancelClickEvent="confirmShow=false" @ensureClickEvent="toImPage">
    </confirm>
    <BlackList></BlackList>
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
  /**************************Common Components**************************/
  import PatientList from "components/consult/patientList";
  import BackIndex from "components/backIndex"; // 返回首页组件
  import HeaderProgress from "components/consult/headerProgress";
  import NormalLoading from "components/loading";
  import dataLog from "dataLog";
  import localStorage from "localStorage";
  /**************************Axios Http Requests*************************/
  import miniLogin from "common/js/miniUtil/miniLogin";
  import getImStatus from "common/js/HttpRequest/getImStatus"; // 找医生流程获取im状态
  import { createNamespacedHelpers} from "vuex";
  /**************************Base Vue-Methods*************************/
  import confirm from 'components/confirm';

  import BlackList from "components/BlackList";
  const {mapMutations, mapGetters, mapState, mapActions} = createNamespacedHelpers('findDoctor');

  import api from 'common/js/util/util';
  import createConsultation from "common/js/HttpRequest/createConsultation";
  export default {
    data() {
      return {
        headTitle: '', // 头部title
        doctorCustomerId: 0, // 医生id
        loading:false,
        confirmShow:false,
        consultationtype:"",
        patientId:"",
        partName:"",
        caseId:"",
        backIndexShow: false, // 返回首页是否显示
      }
    },
    onLoad(options) {
      options = JSON.parse(decodeURIComponent(options.query));
      console.log(options)
      this.loading = true;
      if (wx.getStorageSync("backIndex")) {
        this.backIndexShow = true;
      } else {
        this.backIndexShow = false;
      }
      this.doctorCustomerId = options.doctorId;
      this.partName = options.partName;
      this.caseType = options.applicationType;
      this.partId = options.partId
      this.setDoctorCustomerId(options.doctorId);
      this.init();
      if(options.source && options.source === 'qrCode') {
        this.setQrCode(true);
      } else {
        this.setQrCode(false);
      }
      try { this.customerId = wx.getStorageSync('userId') } catch (e) {}
      try { this.openId = wx.getStorageSync('openId') } catch (e) {}
    },
    onShow() {
      console.log('出现了');
      dataLog.enterBrowse();
      if (localStorage.getItem("PCIMLinks")) {
        wx.reLaunch({
          url: "/pages/mIndex/mIndex"
        })
      }
    },
    onHide() {
      dataLog.leaveBrowse();
    },
    onUnload() {
      console.log('onUnload');
      this.setDoctorMessage({}); // 返回的时候清掉医生的数据；
      this.headTitle = ""; // 返回的时候清空头部话术；
    },
    methods: {
      ...mapActions(["getDoctorMsg","setQrCode","setOrderMessage"]),
      ...mapMutations(["setDoctorMessage", "setDoctorCustomerId"]),
      /** 页面初始化 */
      init() {
        let doctorMessage = this.doctorMessage;
        if (doctorMessage && doctorMessage.doctorName) {
          this.headTitle = `与${doctorMessage.doctorName}医生沟通前，请先完善就诊人信息和病情资料。`;
          this.loading = false;
        } else {
          this.getDoctorMsg(this.doctorCustomerId).then(() => {
            this.loading = false;
            this.headTitle = `与${this.doctorMessage.doctorName}医生沟通前，请先完善就诊人信息和病情资料。`;
          }).catch(err=>{
            console.log(err);
            this.loading = false;
          });
        }
      },
      /** 去选择部位 */
      toSelectPart( patientItem ) {
        if (this.loading) return;
        dataLog.createTrack({
          actionId: 14157,
          keyword:patientItem.patientName
        });
        this.loading = true;

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

        // 找医生流程获取im状态
        getImStatus({
          doctorCustomerId:this.doctorCustomerId,
          patientId:patientItem.patientId,
        }).then( (data) => {
          let {responseStatus,responseData} = data.responseObject;
          if (responseStatus) {
            let {caseId,isIntoIm,consultationtype} = responseData;
            if(!caseId) {
              this.findDoctorAffirmOrder(caseParam);
            } else {
              if (isIntoIm) {
                this.confirmShow = true;
                this.loading = false;
                this.consultationtype = consultationtype;
                this.patientId = patientItem.patientId;
                this.caseId = caseId;
              } else {
                this.findDoctorAffirmOrder(caseParam);
              }
            }
          }
          this.loading = false;
          console.log(data);
        }).catch( (err) => {
          console.log(err);
        }).finally( () => {

        });
      },
      //跳转IM
      toImPage(){
        if (parseInt(this.consultationtype)) {
          wx.navigateTo({
            url: `/packageA/imSceneDoctor/imSceneDoctor?doctorCustomerId=${this.doctorCustomerId}&patientId=${this.patientId}&caseId=${this.caseId}`,
            complete: () => {
              this.confirmShow = false;
              this.consultationtype = "";
              this.patientId = "";
              this.caseId = "";
            }
          });
        } else {
          wx.navigateTo({
            url: `/packageA/imScene/imScene?patientId=${this.patientId}&caseId=${this.caseId}&from=find`,
            complete: () => {
              this.confirmShow = false;
              this.consultationtype = "";
              this.patientId = "";
              this.caseId = "";
            }
          });
        }
      },
      /** 去添加患者 */
      toAddPatient() {
        let url;
        if (this.qrCode) {
          url = `/packageE/findDoctorAddPatient/findDoctorAddPatient?doctorCustomerId=${this.doctorCustomerId}&source=qrCode&partName=${this.partName}&caseType=${this.caseType}&partId=${this.partId}`
        } else {
          url = `/packageE/findDoctorAddPatient/findDoctorAddPatient?doctorCustomerId=${this.doctorCustomerId}&partName=${this.partName}&caseType=${this.caseType}&partId=${this.partId}`;
        }
        wx.navigateTo({
          url,
        });
      },
      /** 替换患者列表 */
      redirectToAddPatient() {
        let url;
        if (this.qrCode) {
          url = `/packageE/findDoctorAddPatient/findDoctorAddPatient?doctorCustomerId=${this.doctorCustomerId}&source=qrCode&partName=${this.partName}&caseType=${this.caseType}&partId=${this.partId}`
        } else {
          url = `/packageE/findDoctorAddPatient/findDoctorAddPatient?doctorCustomerId=${this.doctorCustomerId}&partName=${this.partName}&caseType=${this.caseType}&partId=${this.partId}`;
        }
        wx.redirectTo({
          url,
        });
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
      ...mapGetters(['qrCode',"orderMessage"]),
    },
    components: {
      HeaderProgress,
      PatientList,
      NormalLoading,
      confirm,
      BackIndex,
      BlackList
    }
  }
</script>

<style lang="scss">

</style>

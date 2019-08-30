<template>
  <section style="height: 100%;">
    <HeaderProgress :progress="2"></HeaderProgress>
    <SelectPart v-if="selectPartShow" @selectPartCb="goToQuestion"></SelectPart>
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
  import SelectPart from "components/consult/selectPart";
  import api from 'common/js/util/util';
  import HeaderProgress from "components/consult/headerProgress";
  import dataLog from "dataLog";
  import localStorage from "localStorage";
  /**************************Base Vue-Methods*************************/
  import {createNamespacedHelpers} from "vuex";
  const {mapMutations, mapGetters,mapState, mapActions} = createNamespacedHelpers('findDoctor');
  const XHRList = {
    patientInfo: api.httpEnv() + "/mcall/customer/patient/baseinfo/v1/getMapList/", // 获取患者个人信息
  };
  export default {
    data() {
      return {
        selectPartShow:false,
      }
    },
    methods: {
      ...mapMutations(["setDoctorCustomerId",]),
      ...mapActions(["setPatientMessage"]),
      goToQuestion(){
        wx.navigateTo({
          url: '/packageE/findDoctorQuestionList/findDoctorQuestionList'
        });
      },
      /** 获取患者个人信息 */
      getPatientInfo(patientId, unshiftFlag) {
        const _this = this;
        api.ajax({
          url: XHRList.patientInfo,
          method: "POST",
          data: {
            patientId: patientId,//患者id
          },
          done(data) {
            if (data.responseObject.responseStatus) {
              _this.setPatientInfo(data.responseObject.responseData.dataList[0]);
            } else {
              console.log('获取患者信息失败');
            }
          }
        })
      },
      /** 设置患者信息 */
      setPatientInfo(data) {
        // debugger;
        this.setPatientMessage({
          partId:'',
          userId: localStorage.getItem("userId"),
          sex: data.patientSex,
          age: data.patientAge,
          patientId: data.patientId,
          patientName: data.patientName,
          count: 0,
          height: data.height ? data.height : "",
          weight: data.weight ? data.weight : ""
        });
        this.selectPartShow = true;
      },
    },
    onShow(){
      dataLog.enterBrowse();
    },
    onHide(){
      dataLog.leaveBrowse();
    },
    onLoad({patientId,doctorId} = options) {
      //针对于老患者报道未就诊过来的增加的容错；
      if (patientId) {
        this.getPatientInfo(patientId);
      } else {
        this.selectPartShow = true;
      }
      if (doctorId) {
        this.setDoctorCustomerId(doctorId);
      }
    },
    computed: {

    },
    components:{
      HeaderProgress,
      SelectPart
    }
  }
</script>

<style lang="scss">

</style>

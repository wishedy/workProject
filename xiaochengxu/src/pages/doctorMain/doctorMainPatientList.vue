<template>
  <section>
    <PatientList
      :headTitle='headTitle'
      @selectPatientCb="toSelectPart"
      @addPatientCb="toAddPatient"
      @redirectPatientCb = "redirectToAddPatient"
    ></PatientList>
  </section>
</template>

<script>
  /**
   * @Desc：
   * @Usage:
   * @Notify：
   * @Depend：
   *
   * Created by Hallmader on 2018/7/23.
   */
  import PatientList from "components/consult/patientList";
  import createInvitePatient from "common/js/HttpRequest/createInvitePatient";
  import localStorage from "localStorage";
  import {createNamespacedHelpers} from "vuex";
  import dataLog from "dataLog";
  const {mapMutations, mapState, mapActions, mapGetters} = createNamespacedHelpers('doctorMain');


  export default {
    data() {
      return {
        headTitle:'',
      }
    },
    methods: {
      /** 返回医生主页 */
      toSelectPart(patientId) {
        dataLog.createTrack({
          actionId: 14156,
        });
        createInvitePatient({
          id: this.mainKey,
          patientId:patientId.patientId,
          patientCustomerId: localStorage.getItem("userId") || ""
        }).then(data => {
          if (data.responseObject.responseStatus) {
            this.showToast("您的预约已发送成功，医生上线后会及时通知，请耐心等候")
            // 用来获取最近的一层的分诊IM的层级
            let _arr = getCurrentPages().reverse();
            let backNum = -1;
            for (let j = 0, len = _arr.length; j < len; j++) {
              if (_arr[j].route == 'pages/doctorMain/doctorMain') {
                backNum = j;
                j = len;
                break;
              }
              if (_arr[j].route == 'packageA/imScene/imScene') {
                backNum = j;
                j = len;
                break;
              }
            }
            console.log(`-------------${backNum}-----------------`)
            setTimeout(() => {
              if (backNum == -1) {
                wx.redirectTo({
                  url:`/pages/doctorMain/doctorMain`,
                });  
              } else {
                wx.navigateBack({
                  delta: backNum
                })
              }
            }, 2000);
          }
        });
      },
      /** 去添加患者 */
      toAddPatient () {
        wx.navigateTo({
          url: '/pages/doctorMain/doctorMainAddPatient'
        });
      },
      /** 替换患者列表 */
      redirectToAddPatient () {
        wx.redirectTo({
          url: '/pages/doctorMain/doctorMainAddPatient'
        });
      },
      showToast(str){
        wx.showToast({
          title: str,
          icon: 'none',
          duration: 2000
        })
      },
    },
    mounted() {
      this.headTitle = `请完善患者信息以便提醒${this.doctorMessage.authMap.fullName}医生尽快开诊`;
    },
    onShow(){
      dataLog.enterBrowse();
    },
    onHide(){
      dataLog.leaveBrowse();
    },
    computed: {
      ...mapState(["doctorMessage",'mainKey'])
    },
    components: {
      PatientList
    }
  }
</script>

<style lang="scss">

</style>

<template>
  <section class="sticky-wrapper">
    <AddPatient @selectPartCb="toSelectPart" :headTitle = "headTitle"></AddPatient>
  </section>
</template>

<script type="text/ecmascript-6">
  /**
   * @Desc：患者选择
   * @Usage:
   * @Notify：
   * @Depend：
   *
   * Created by lichenyang on 18/7/23.
   */
  import AddPatient from "components/consult/addPatient";
  import createInvitePatient from "common/js/HttpRequest/createInvitePatient";
  import localStorage from "localStorage";
  import dataLog from "dataLog";
  import {createNamespacedHelpers} from "vuex";
  const {mapMutations, mapState, mapActions, mapGetters} = createNamespacedHelpers('doctorMain');

  export default {
    data() {
      return {
        headTitle:'',
      }
    },
    computed: {
      ...mapState(["doctorMessage",'mainKey'])
    },
    created() {
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
    methods: {
      toSelectPart(patientId) {
        if(localStorage.getItem("userId")){
          dataLog.createTrack({
            actionId: 14156,
          });
        }else{
          dataLog.createTrack({
            actionId: 14155,
          });
        }
        createInvitePatient({
          id: this.mainKey,
          patientId,
          patientCustomerId: localStorage.getItem("userId") || "",
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
      showToast(str){
        wx.showToast({
          title: str,
          icon: 'none',
          duration: 2000
        })
      },
    },
    components: {
      AddPatient
    }
  }
</script>
<style lang="scss">
</style>

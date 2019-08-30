<template>
  <div>
    <web-view :src="webViewUrl"></web-view>
  </div>
</template>

<script>
  /**
   * @Desc：
   * @Usage:
   * @Notify：
   * @Depend：
   *
   * Created by Hallmader on 2018/6/29.
   */
  import api from "common/js/util/util";
  import localStorage from "localStorage";
  import dataLog from "dataLog";
  export default {
    data() {
      return {
        webViewUrl: ""
      }
    },
    onShow() {
      dataLog.enterBrowse();
    },
    onHide(){
      dataLog.leaveBrowse();
    },
    methods: {},
    mounted() {
      localStorage.setItem("backFromImgCheck",1);
      const query = this.$root.$mp.query;
      let urlTemp = `${api.httpEnv()}/dist/patientComment.html?patientCustomerId=${localStorage.getItem("userId") ? localStorage.getItem("userId") : query.patientCustomerId}&consultationId=${query.consultationId}&patientId=${query.patientId}&doctorId=${query.doctorId}`;

      let blackUserId = localStorage.getItem("userId") ? localStorage.getItem("userId") : query.patientCustomerId;
      if(blackUserId){
        urlTemp += `&blackUserId=${blackUserId}`;
      }

      this.webViewUrl= urlTemp;
    },
    computed: {}
  }
</script>

<style lang="scss">

</style>

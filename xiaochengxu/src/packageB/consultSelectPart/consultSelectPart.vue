<template>
  <section style="height: 100%;">
    <!-- <HeaderProgress :progress="2"></HeaderProgress> -->
    <SelectPart @selectPartCb="goToQuestion"></SelectPart>
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
  import SelectPart from "components/consult/selectPart";
  import HeaderProgress from "components/consult/headerProgress";
  import dataLog from "dataLog";
  import localStorage from "localStorage";
  import authorization from "components/authorization/authorization";

  export default {
    data() {
      return {}
    },

    methods: {
      goToQuestion(data){
        data.applicationType = this.applicationType;
        this.doctorId && (data.doctorId = this.doctorId);
        this.doctorName && (data.doctorName = this.doctorName);
        console.log('data result ---> ', data)
        wx.navigateTo({
          url: '/packageE/intelligentTriage/intelligentTriage?query=' + encodeURIComponent(JSON.stringify(data))
        });
      }
    },
    mounted() {

    },
    computed: {

    },
    onLoad(option){
      this.doctorId='';
      this.doctorName='';
      this.applicationType='';
      let data = JSON.parse(decodeURIComponent(option.query));
      this.applicationType = data.applicationType;
      data.doctorId && (this.doctorId = data.doctorId);
      data.doctorName && (this.doctorName = data.doctorName);
    },
    onShow(){
      if(this.doctorId){
        dataLog.enterBrowse({
          browseType: "93",
          opDesc: "人体图页-找医生"
        })
      }else {
        dataLog.enterBrowse();
      }

      if(localStorage.getItem("PCIMLinks")) {
        localStorage.removeItem("PCIMLinks");
        wx.reLaunch({
          url: "/pages/mIndex/mIndex"
        })
      }
    },
    onHide(){
      dataLog.leaveBrowse();
    },
    components:{
      HeaderProgress,
      SelectPart,
      authorization
    }
  }
</script>

<style lang="scss">

</style>

<template>
  <section style="height: 100%;">
    <HeaderProgress :progress="3"></HeaderProgress>
    <QuestionList @questionListCb="goToNext" :scene="scene"></QuestionList>
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
  import QuestionList from "components/consult/questionList";
  import HeaderProgress from "components/consult/headerProgress";
  import localStorage from "localStorage";
  import dataLog from "dataLog";
  export default {
    data() {
      return {
        scene:"findDoctor"
      }
    },
    methods: {
      goToNext(param){
        wx.navigateTo({
          url: `/packageE/findDoctorAffirmOrder/findDoctorAffirmOrder`
        });
      }
    },
    mounted() {

    },
    onShow(){
      dataLog.enterBrowse();
      if (localStorage.getItem("PCIMLinks")) {
        wx.reLaunch({
          url: "/pages/mIndex/mIndex"
        })
      }
    },
    onHide(){
      dataLog.leaveBrowse();
    },
    computed: {

    },
    components:{
      HeaderProgress,
      QuestionList
    }
  }
</script>

<style lang="scss">

</style>

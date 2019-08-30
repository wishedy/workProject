<template>
  <section style="height: 100%;">
    <HeaderProgress :progress="3"></HeaderProgress>
    <QuestionList @questionListCb="goToNext"></QuestionList>
    <confirm :confirmParams="{
          'ensure':'继续沟通',
          'cancel':'返回首页',
          'title':'您的咨询单已提交\n无需重复操作'
          }" v-if="confirmShow" @cancelClickEvent="backToHome" @ensureClickEvent="backToIm">
    </confirm>
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
  import confirm from "components/confirm";
  import localStorage from "localStorage";
  import dataLog from "dataLog";
  export default {
    data() {
      return {
        confirmShow:false
      }
    },
    onUnload(){

    },
    methods: {
      goToNext(param){
        if (getCurrentPages().length>=6) {
          wx.setStorageSync("backIndex",true);
          wx.reLaunch({
            url: `/packageA/imScene/imScene?caseId=${param.caseId}&patientId=${param.patientId}`
          });
        } else {
          wx.navigateTo({
            url: `/packageA/imScene/imScene?caseId=${param.caseId}&patientId=${param.patientId}`
          });
        }
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
    onShow() {
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
    components:{
      HeaderProgress,
      QuestionList,
      confirm
    }
  }
</script>

<style lang="scss">

</style>

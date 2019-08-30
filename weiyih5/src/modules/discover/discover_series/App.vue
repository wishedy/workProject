<template>
  <section class="al-mainInner">
    <WakeApp :options="wakeData"></WakeApp>
    <HeaderBar :header-config="headerConfig"></HeaderBar>
    <BannerBar></BannerBar>
    <router-view></router-view>
    <FooterBar></FooterBar>
    <loading v-show="loading"></loading>
  </section>
</template>

<script type="text/ecmascript-6">
    import axios from "axios";
    import loading from "components/Loading/Loading.vue";
    import HeaderBar from "components/HeaderBar/HeaderBar.vue";
    import BannerBar from "./components/BannerBar.vue"
    import FooterBar from "./components/Footer.vue"
	import {shareAll} from '@allin/wap-share';
	import  {mapGetters} from "vuex";
    import WakeApp from  'components/WakeApp/WakeApp.vue';
	window.shareAll = shareAll;
  export default {
      data() {
          return {
            wakeData:{
              el: ".al-newWakeUpAppBtn",
              ios: "allinmdios://app.allinmd.cn/applinks.html",
              ios9: "http://app.allinmd.cn/applinks.html",
              android: "allin://com.allin.social:75235?data={}"
            },
              headerConfig: {
                  title: "系列课",
                  backOnOff: true,
                  share: {
                      onOff: true,
                      params: {
                          "sceneType": "71",
                          "resourceType": 0,
                          "platformId": 1
                      }
                  },
                  feedback: {
                      onOff: false
                  }
              }
          }
      },
      computed:{
          ...mapGetters(["loading"])
      },
      mounted(){

      },
      components:{
          HeaderBar,
          BannerBar,
          FooterBar,
          loading,
          WakeApp
      }
  };
</script>

<style lang="scss" rel="stylesheet/scss">
  @import "scss/base";
  @import "scss/pages/classes/classes";
  .courseList li p:last-child i{
    background: url(//img50.allinmd.cn/classes/views.png) no-repeat;
    background-size: 100% 100%;
  }
</style>

<template>
  <section class="al-mainInner">
    <WakeApp :options="wakeData"></WakeApp>
    <HeaderBar :header-config="headerConfig"></HeaderBar>
    <Collect></Collect>
    <BannerBar></BannerBar>
    <router-view></router-view>
    <Popup :popup-config="popupConfig"></Popup>
  </section>
</template>

<script type="text/ecmascript-6">
    import axios from "axios"
    import comm from 'static/js/comm.js'
    import HeaderBar from "components/HeaderBar/HeaderBar.vue";
    import BannerBar from "./components/BannerBar.vue"
    import Collect from "./components/Collect.vue"
    import Popup from "components/PopupLayer/PopupLayer"
	import {shareAll} from '@allin/wap-share';
    import WakeApp from  'components/WakeApp/WakeApp.vue';
	window.shareAll = shareAll;
    const courseId = comm.queryParam("tId");
  export default {
        data(){
          return {
            wakeData:{
              el: ".al-newWakeUpAppBtn",
              ios: "allinmdios://app.allinmd.cn/applinks.html",
              ios9: "http://app.allinmd.cn/applinks.html",
              android: "allin://com.allin.social:75235?data={}"
            },
              headerConfig: {
                  backOnOff: true,
                  share: {
                      onOff: true,
                      params: {
                          "sceneType": "72",
                          "resourceType": 0,
                          "courseId":courseId
                      }
                  },
                  feedback: {
                      onOff: true
                  }
              }
          }
        },
      computed:{
          popupConfig(){
              return this.$store.state.popupConfig;
          }
      },
      components:{
          HeaderBar,
          BannerBar,Collect,Popup,WakeApp
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

<template>
  <section class="al-mainInner">
    <WakeApp :options="wakeData"></WakeApp>
    <HeaderBar :header-config="headerConfig"></HeaderBar>
    <Container></Container>
  </section>
</template>

<script type="text/ecmascript-6">
  import HeaderBar from "components/HeaderBar/HeaderBar.vue";
  import Container from "./components/Container";
  import comm from 'static/js/comm.js';
  import TempCache from 'static/js/tempcache.js';
  import {shareAll} from '@allin/wap-share';
  import WakeApp from  'components/WakeApp/WakeApp.vue';
  window.shareAll = shareAll;
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
                title: "权威专家",
                backOnOff: true,
                share: {
                    onOff: false
                },
                feedback: {
                    onOff: false
                }
            }
        }
      },
      methods:{

      },
      mounted(){

      },
      components:{
        HeaderBar,
        Container,
        WakeApp
      },
  };
</script>

<style lang="scss" rel="stylesheet/scss">
 @import 'scss/pages/discover/discover_master.scss';
</style>

<template>
  <section class="al-mainInner">
    <WakeApp :options="wakeData"></WakeApp>
    <HeaderBar :header-config="headerConfig" style="position: inherit;"></HeaderBar>
    <Container style="margin-top: 5px;"></Container>
  </section>
</template>

<script type="text/ecmascript-6">
  import axios from "axios";
  import HeaderBar from "components/HeaderBar/HeaderBar.vue";
  import Container from "./components/Container";
  import comm from 'static/js/comm.js'
  import Log from 'static/js/log.js'
  import WakeApp from  'components/WakeApp/WakeApp.vue';
  export default {
      data(){
        return {
            headerConfig: {
                title: "",
                backOnOff: true,
                share: {
                    onOff: false
                },
                feedback: {
                    onOff: false
                }
            },
            wakeData:{
              el: ".al-newWakeUpAppBtn",
              ios: "allinmdios://app.allinmd.cn/applinks.html",
              ios9: "http://app.allinmd.cn/applinks.html",
              android: "allin://com.allin.social:75235?data={}"
            }
        }
      },
      methods:{

      },
      mounted(){
          let t=this;
          let _a = comm.getpara().trendTypes;
          let trendType=_a!=undefined?_a:0;           //	全部时传1,2,4,7
          let _b =comm.getpara().dateType;
          let dateType =_b!=undefined?_b:1;          //1-每日最新 2-每周最新
          let resType='资源';
          switch(parseInt(trendType)){
              case 1:
                  resType='视频';
                  break;
              case 2:
                  resType='文库';
                  break;
              case 4:
                  resType='话题';
                  break;
              case 7:
                  resType='病例';
                  break;
              default:
                  resType='资源';
          }
          switch(parseInt(dateType)){
              case 1:
                  t.headerConfig.title='每日最新';
                  document.title = "每日最新"+resType+" －为你精选,唯医,allinmd";
                  document.getElementsByName("keywords")[0].setAttribute("content","每日最新"+resType+"，allinmd");
                  //Log.createBrowse(38,"每日最新");
                  setTimeout(function(){
                      if(g_sps) {
                          g_sps.createBrowse({pageId: 433});
                      }
                  },2200);
                  break;
              case 2:
                  t.headerConfig.title='每周最新';
                  document.title = "每周最新"+resType+" －为你精选,唯医,allinmd";
                  document.getElementsByName("keywords")[0].setAttribute("content","每周最新"+resType+"，allinmd");
                  //Log.createBrowse(39,"每周最新");
                  setTimeout(function(){
                      if(g_sps) {
                          g_sps.createBrowse({pageId: 434});
                      }
                  },2200);
                  break;
          }
      },
      components:{
          HeaderBar,
          Container,
          WakeApp
      }
  };
</script>

<style lang="scss" rel="stylesheet/scss">
 @import 'scss/pages/index/weekly_list';
</style>

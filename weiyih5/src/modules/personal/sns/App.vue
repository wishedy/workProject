<template>
  <section class="al-mainInner">
    <HeaderBar :header-config="headerConfig"></HeaderBar>
    <Container></Container>
  </section>
</template>

<script type="text/ecmascript-6">
  import HeaderBar from "components/HeaderBar/HeaderBar.vue";
  import Container from "./components/Container";
  import comm from 'static/js/comm.js';
  import TempCache from 'static/js/tempcache.js';
  import commdate from 'static/js/comm.date.js';
  import Log from 'static/js/log.js';
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
            }
        }
      },
      methods:{
          getHeader(){
              let t=this;
              let para=comm.getpara();
              switch (para.action){
                  case "praise"://赞
                      t.headerConfig.title="点赞";
                      document.title="点赞－唯医,allinmd";
                      if(!para.cid){
						  TempCache.setItem('readPreferTime',commdate.local_time());    //cookie记录上次查看赞的时间
                          // Log.createBrowse(127,'我的-点赞列表');
                          setTimeout(function(){
                              if(g_sps) {
                                  g_sps.createBrowse({pageId: 417})
                              }},2000);
                      }else{
						  // Log.createBrowse(125,'TA的点赞列表')
                      }
                      break;
                  case "fans"://粉丝
                      t.headerConfig.title="粉丝";
                      document.title="粉丝－唯医,allinmd";
					  if(!para.cid) {
						  TempCache.setItem('readFansTime', commdate.local_time());    //cookie记录上次查看粉丝的时间
						  // Log.createBrowse(124,'我的粉丝')
                          setTimeout(function(){
                              if(g_sps) {
                                  g_sps.createBrowse({pageId: 418})
                              }},2000);
					  }else{
					  	  // Log.createBrowse(125,'TA的粉丝列表')
                          setTimeout(function(){
                              g_sps&&g_sps.createBrowse({pageId:420})
                          },2000);
                      }
                      break;
                  case "follow"://关注
                      t.headerConfig.title="关注";
                      document.title="关注－唯医,allinmd";
                      if(!para.cid){
						  // Log.createBrowse(126,'我的-关注列表')
                          setTimeout(function(){g_sps&&g_sps.createBrowse({pageId:419})},2000);
                      }else{
						  // Log.createBrowse(124,'我的粉丝')
                      }
                      break;
              }
          }
      },
      mounted(){
          this.getHeader();
      },
      components:{
          HeaderBar,
          Container
      }
  };
</script>

<style lang="scss" rel="stylesheet/scss">
 @import 'scss/pages/personal/personal_fans.scss';
</style>

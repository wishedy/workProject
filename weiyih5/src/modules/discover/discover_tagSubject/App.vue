<template>
  <section>
    <section class="al-mainInner">
      <Share :shareConfig.sync="shareConfig" v-show="shareOnOff" v-if="dataHas" @mousedown.native="batch"></Share>

      <HeaderBar></HeaderBar>
      <FocusList></FocusList>
      <NavBar></NavBar>
      <Nothing v-if="!dataHas"></Nothing>
      <router-view  v-if="dataHas"></router-view>
      <FollowLayer  @ensureClickEvent="ensure" @cancelClickEvent="cancel"></FollowLayer>
    </section>
  </section>

</template>

<script type="text/ecmascript-6">
  const  xhrUrl = {
      deleteUrl:"/mcall/customer/follow/resource/delete/"
  };
  import Share from "components/Share/Share.vue"
  import axios from "axios";
  import comm from 'static/js/comm.js';
  import HeaderBar from "./components/HeaderBar.vue";
  import FocusList from "./components/FocusList.vue";
  import NavBar from "./components/NavBar.vue";
  import Nothing from "./components/Nothing.vue";
  import FollowLayer from "components/FollowLayer/FollowLayer";
  import app from 'static/js/comm.app.js';
  import {shareAll} from '@allin/wap-share';
  window.shareAll = shareAll;
  export default {
        data(){
          return {
              shareOnOff:true,
              shareConfig:Object
          }
        },
      computed:{
          tagId(){
              let t = this;
              return (t.$store.state.tagId)  ;
          },
          propertyName(){
              let t = this;
              return (t.$store.state.propertyName)  ;
          },
          customerId(){
              let t = this;
              return t.$store.state.customerId;
          },
          dataHas(){
              let t = this;
              return !t.$store.state.noData;
          }
      },
      methods:{
          batch(){
              comm.creatEvent({
                  triggerType:'分享',
                  keyword:'分享（呼出）',
                  actionId:40
              });
          },
          share(){
              let t = this;
              let routerName = (this.$route.path).substring(1,100);
              const scene = {"release": "1", "comment": "2", "browse": "3"};
              $(".al-scrollShareBtn").off("click");
              this.shareConfig = {
                  shareData:{
                      "tagId":t.tagId,"pageSize":20,"pageIndex":t.$store.state.pageIndex,"dataScene":scene[routerName],"dataType":t.$store.state.dataType,"scene":2,"sceneType":16,"resourceType":0
                  },
                  initData:{

                  }

              };
          },
          ensure(){
              if(TempCache.getItem("customerRole") === "14"){
                  // 审核与二次认证
                  if(user.getRenZhengInfo().state === 0 || user.getRenZhengInfo().state === 1){
                      comm.alertBox({
                          "title":"认证资料审核将在1-3个工作日内完成，请耐心等待 ",
                          "ensure":"知道了",
                      });
                  }else{
                      // 厂商未认证时,直接去APP认证,认证后可以看
                      let androidParam = `{}`;
                      let iosParam = ``;
                      comm.newReleaseBox({
                          imgPath:"/images/img50/case/release.png",
                          title:"厂商认证需使用唯医骨科App",
                          solidBtnTitile:"立即使用",
                          authNoneTitle:"暂不使用",
                          data:{
                              el: ".solidBtn",
                              ios: "allinmdios://app.allinmd.cn/applinks.html?"+iosParam,
                              ios9: "http://app.allinmd.cn/applinks.html?"+iosParam,
                              android: "allin://com.allin.social:75235?data="+androidParam
                          }
                      });
                  }
              }else {
                  let t = this;
                  let param = {
                      "followType": 61,
                      "customerId": t.customerId,
                      "refId": t.tagId,
                      "refName": t.propertyName
                  };
                  t.$store.state.confirmOption = false;
                  comm.ajax({
                      url: xhrUrl.deleteUrl,
                      method: "POST",
                      paramJson: true,
                      data: param,
                      success: function (res) {
                          if (res.data.responseObject.responseStatus) {
                              t.$store.state.followState = 0;
                          }
                      }
                  })
              }
          },
          cancel(){
              let t = this;
              t.$store.state.confirmOption = false;
          },
          layout(){
              var headHeight = $(".al-tagSeminarHeader").outerHeight();
              var navbarTop = $(".al-tagSeminarFollowMsg").outerHeight();
              var scrollHeadHeight = $(".al-tagScrollHead").outerHeight();
              var appH=$(".al-appWakeUpFigure").outerHeight();
              $(window).on("scroll", function() {
                  if (headHeight+appH+navbarTop+scrollHeadHeight < $(this).scrollTop()) {
                      $(".al-tagSeminarHeader").hide();
                      $(".al-tagSeminarFollowMsg").hide();
                      $(".al-tagScrollHead").show();
                      $(".al-scrollBox").addClass('al-scrollBoxFixed');
                      $(".al-mainInner").css("paddingTop", '0.8rem');
                  } else {
                      $(".al-tagSeminarHeader").show();
                      $(".al-tagSeminarFollowMsg").show();
                      $(".al-scrollBox").removeClass('al-scrollBoxFixed');
                      $(".al-tagScrollHead").hide();

                      $(".al-mainInner").css("paddingTop", "0");
                  }
              });

          }
      },
      mounted(){
        let t = this;
        let amChannel = comm.getpara()._amChannel;
        let options ={
          ios: "allinmdios://app.allinmd.cn/applinks.html?scene=11&type=54&sourceId="+t.tagId +(amChannel?"&_amChannel="+amChannel:''),
          android: "allin://com.allin.social:75235?data={scene:3,type:54,sourceId="+t.tagId +(amChannel?",_amChannel:"+amChannel+"}":''),
          ios9: "http://app.allinmd.cn/applinks.html?scene=11&type=54&sourceId=" + t.tagId +(amChannel?"&_amChannel="+amChannel:'')
        };
        app.appWakeUp('figure',options);
        t.share();
      },
      watch:{
        "$route"(a,b,c){
            let t = this;
            t.share();
            let routerName = (this.$route.path).substring(1,100);
            const sceneInfo = {"release": {
                    keyword:"最新发布",
                    actionId:"47",
                }, "comment":  {
                    keyword:"最多评论",
                    actionId:"49",
                }, "browse":  {
                    keyword:"最多浏览",
                    actionId:"48",
                }};
            comm.creatEvent({
                triggerType:'列表资源排序',
                keyword:sceneInfo[routerName].keyword,
                actionId:sceneInfo[routerName].actionId
            });
        },
          '$store.state.goShare'(){
            // console.log("改变");
              let t = this;
              t.share();
          }
      },
      created(){
          this.layout();
      },
      components:{
          HeaderBar,FocusList,NavBar,FollowLayer,Share,Nothing
      }
  };
</script>

<style lang="scss" rel="stylesheet/scss">
  @import "scss/base";
  @import "scss/pages/discover/tag_seminar.scss";
</style>

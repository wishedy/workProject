<template>
  <section class="al-mainInner" :style="{'padding-top':paddingTop}">
    <section>
        <header-float-bar v-show="hasFloat"></header-float-bar>
        <router-view></router-view>
        <footerBar :isActive="3" v-on:specialCount="listenToMyBoy"></footerBar>
    </section>
      <loading v-if="isAjax.length"></loading>
  </section>
</template>

<script type="text/ecmascript-6">
  import footerBar from 'components/Footer/Footer'
  import headerFloatBar from "./components/HeaderFloatBar";
  import Loading from 'components/Loading/Loading';
  import {mapActions,mapGetters} from  "vuex";
  import FastClick from "fastclick";
  import {shareAll} from '@allin/wap-share';
  import weixinMethods from "static/js/weixinflag.js";
  import user from 'static/js/module.user.js';
  import TempCache from "static/js/tempcache.js";
  weixinMethods.loginWeiXin();
  window.shareAll = shareAll;
  window.FastClick = FastClick;
  window.user = user;
  FastClick.attach(document.body);
  export default {
      data(){
        return {
          hasFloat:false,
          paddingTop:0,
        }
      },
      computed:{
        ...mapGetters(['cId','isAjax']),
      },
      methods:{
        ...mapActions(["changeSate",'getInitPage','setSpecialCount','setCID','changeIscontentTab','changeIsHeader']),
        listenToMyBoy (somedata){
          this.setSpecialCount(somedata);
        },
        scroll() {
			let t = this;
			let headHeight =document.getElementsByClassName("al-personalHead").length===0?0: document.getElementsByClassName("al-personalHead")[0].parentNode.offsetHeight;
			let appH = document.getElementsByClassName("al-appWakeUpFigure").length === 0 ? 0 : document.getElementsByClassName("al-appWakeUpFigure")[0].offsetHeight;
            let eventContainer = document.getElementsByClassName("ev-contentCon").length === 0 ? 0 : document.getElementsByClassName("ev-contentCon")[0].offsetTop;
            let HeadFixed = document.getElementsByClassName("al-personalHeadFixed").length === 0 ? 0 : document.getElementsByClassName("al-personalHeadFixed")[0].offsetHeight;
            let top = document.documentElement.scrollTop || document.body.scrollTop;//滚动高度
            if(t.$router.currentRoute.fullPath.indexOf('ndexHome') != -1){
                if (headHeight + appH < top) {
                    t.hasFloat = true;
                    if(top > eventContainer-HeadFixed){
                        t.changeIscontentTab(true);
                    }else {
                        t.changeIscontentTab(false);
                    }
                } else {
                    t.hasFloat = false;
                    t.changeIscontentTab(false);
                }

            }else if(t.$router.currentRoute.fullPath.indexOf('Info') != -1){
                if (top > appH) {

                    t.changeIsHeader(true);

                }else{
                    t.changeIsHeader(false);
                }
            }

		}
      },
      mounted(){
          let t = this;
          //微信环境
         //TempCache.setItem("userId",'1554976157628');
          if(weixinMethods.weixinFlag){
            user.privExecute({
              operateType: 'login',   //'login','auth','conference'
              callback: function () {
                if(TempCache.getItem("userId")){
                  t.setCID(TempCache.getItem("userId"));
                  t.getInitPage();
                }else{
                  user.getSessionInfo();
                  t.setCID(TempCache.getItem("userId"));
                  t.getInitPage();
                }
              }
            });
          }else{
            t.setCID(TempCache.getItem("userId"));
            t.getInitPage();
          }
          if (location.hash.indexOf('IndexHome') != -1||location.hash.indexOf('Info') != -1) {
              window.addEventListener("scroll", t.scroll, false);
          }
          window.addEventListener('hashchange', function () {
              $(window).scrollTop(0);
              t.changeIsHeader(false);
              t.changeIscontentTab(false);
              if (location.hash.indexOf('IndexHome') != -1||location.hash.indexOf('Info') != -1) {
                  window.addEventListener("scroll", t.scroll, false);
              } else {
                  window.removeEventListener('scroll', t.scroll, false);
                  $('.al-personalNavbar').removeClass('al-personalNavbarFixed');
                  $('.al-personalNavbar').prev('section').eq(0).show();
                  $('.al-personalHeadFixed').hide();
                  $('.al-mainInner').css({paddingTop: 0});
              }
          }, false);
      },
      components:{
          footerBar,
          headerFloatBar,
          Loading
          // Index
      }
	}
</script>
<style lang="scss" rel="stylesheet/scss">
 /*@import 'scss/pages/personal/personal_index.scss';*/
 @import 'scss/pages/personal/personal_indexNew.scss';
</style>

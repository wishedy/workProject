<template>
  <section>
    <section class="al-mainInner" v-show="!showUploadImg" :style="{'padding-top':paddingTop}">
      <headerFloatBar v-show="hasFloat"></headerFloatBar>
      <headerBar v-show="!hasFloat"></headerBar>
      <TabHeader></TabHeader>
      <router-view></router-view>
      <footerBar :isActive="3" v-on:specialCount="listenToMyBoy"></footerBar>
    </section>
    <UploadImg v-show="showUploadImg" v-if="cId"></UploadImg>
  </section>
</template>

<script type="text/ecmascript-6">
  import headerBar from "./components/HeaderBar";
  import headerFloatBar from "./components/HeaderFloatBar";
  import footerBar from 'components/Footer/Footer'
  import UploadImg from "./components/UploadImg";
  import TabHeader from "./components/TabHeader.vue";
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
        ...mapGetters(['showUploadImg','cId']),
      },
      methods:{
        ...mapActions(["changeSate",'getInitPage','setSpecialCount','setCID']),
        listenToMyBoy (somedata){
          this.setSpecialCount(somedata);
        },
        scroll() {
			let t = this;
			let tabBar = document.getElementsByClassName("al-personalNavbar")[0];
			let headHeight = document.getElementsByClassName("al-personalHead")[0].parentNode.offsetHeight;
			let navbarTop = document.getElementsByClassName("al-personalNavbar")[0].offsetHeight;
			let scrollHeadHeight = document.getElementsByClassName("al-personalScrollHead")[0].offsetHeight;
			let appH = document.getElementsByClassName("al-appWakeUpFigure").length === 0 ? 0 : document.getElementsByClassName("al-appWakeUpFigure")[0].offsetHeight;

			let top = document.documentElement.scrollTop || document.body.scrollTop;//滚动高度
			if (headHeight + appH < top) {
				t.hasFloat = true;
				tabBar.className = 'al-personalNavbar al-personalNavbarFixed';
				t.paddingTop = navbarTop + scrollHeadHeight + headHeight - appH + "px";
			} else {
				t.hasFloat = false;
				tabBar.className = 'al-personalNavbar';
				t.paddingTop = 0;
			}
		}
      },
      mounted(){
          let t = this;
          //微信环境
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
          if (location.hash.indexOf('index') == -1) {
              window.addEventListener("scroll", t.scroll, false);
          }
          window.addEventListener('hashchange', function () {
              $(window).scrollTop(0);
              if (location.hash.indexOf('index') == -1) {
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
          headerBar,
          headerFloatBar,
          UploadImg,
          TabHeader,
          footerBar
      }
	}
</script>
<style lang="scss" rel="stylesheet/scss">
 @import 'scss/pages/personal/personal_index.scss';
</style>

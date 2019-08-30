<template>
  <div class="app">
      <WakeApp :options="wakeData"></WakeApp>
      <my-header :header-config="headerConfig" v-show="!rule"></my-header>
      <TabSwitch v-show="!rule"></TabSwitch>
      <router-view v-show="!rule"></router-view>
      <ListInfo></ListInfo>
      <Rule v-show="rule"></Rule>
  </div>
</template>

<script type="text/ecmascript-6">
    import myHeader from "components/HeaderBar/HeaderBar";
    import TabSwitch from "./components/Tabswitch";
    import ListInfo from "./components/ListInfo";
    import Rule from "./components/Rule";
    import WakeApp from  'components/WakeApp/WakeApp.vue';
	import {shareAll} from '@allin/wap-share';
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
                    title: "榜单",
                    backOnOff: true,
                    rule:true,
                    backFn:function(){
                        g_sps.jump(null,'/dist/discover/discover_index.html');
                    }
                },
                rule:false,
            }
        },
        methods:{},
        components:{
            myHeader,
            TabSwitch,
            ListInfo,
            Rule,
            WakeApp
        },
        mounted(){
            if(this.$route.name ==4){
                this.rule = true;
            }
        },
        watch: {
            $route() {
                if(this.$route.name==4){
                    this.rule = true;
                }else{
                    this.rule = false;
                }
            }
        }
    };
</script>

<style rel="stylesheet/scss" lang="scss">
    @import 'scss/base';
    @import 'scss/pages/discover/discover_master';
    @import 'scss/pages/discover/discover_billboard';
</style>


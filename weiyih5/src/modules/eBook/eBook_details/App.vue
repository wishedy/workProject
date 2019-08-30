<template>
    <section class="al-mainInner" :style="{marginTop:heig+'px'}">
        <WakeApp :options="wakeData"></WakeApp>
        <HeaderBar :header-config="headerConfig" :style="fixed"></HeaderBar>
        <BookMessage></BookMessage>
        <Navtab></Navtab>
        <section class="al-eBookContentContainer">
            <section class="al-eBookContentWrapper">
                <router-view></router-view>
            </section>
        </section>
        <FooterBar></FooterBar>
        <Loading v-show="ajaxing"></Loading>
    </section>
</template>

<script type="text/ecmascript-6">
    import comm from 'static/js/comm';
    import HeaderBar from "components/HeaderBar/HeaderBar.vue";
    import BookMessage from './components/BookMessage.vue';
    import Navtab from './components/Navtab.vue';
    import FooterBar from './components/Footer.vue';
    import Loading  from "components/Loading/Loading";
	import {shareAll} from '@allin/wap-share';
    import WakeApp from  'components/WakeApp/WakeApp.vue';
	window.shareAll = shareAll;
    window.comm = comm;
    if(!comm.players){
    	comm.players =[];
    }
    export default{
        data(){
            let _this = this;
            let androidParam = `{scene:3,type:2,sourceId:${_this.$store.state.bId},tplPath:286}`;
            let iosParam = `scene=terminalPage&index=2&sourceId=${_this.$store.state.bId}&tplPath=286&share=app&visitSiteId=5`;
            return {
                heig:'',
                wakeData:{
                    el: ".al-newWakeUpAppBtn",
                    ios: "allinmdios://app.allinmd.cn/applinks.html?"+iosParam,
                    ios9: "http://app.allinmd.cn/applinks.html?"+iosParam,
                    android: "allin://com.allin.social:75235?data="+androidParam
                },
                headerConfig:{
                    title:"",
                    backOnOff:"true",
                    ebookShare:true,
                    share:{
                        params: {
                            "attUseFlag":3,
                            "useFlag":3,
                            "docId":this.$store.state.bId,
                            "visitSiteId":2,
                            "resourceType":17,
                            "sceneType":27
                        }
                    }
                },
                ajaxing:false,
                fixed:{},
                storageTitle:''
            }
        },
        mounted(){
            this.scroll();
        },
        components:{
            HeaderBar,
            BookMessage,
            Navtab,
            FooterBar,
            Loading,
            WakeApp
        },
        methods:{
            scroll(){
                let t = this;
                let scrollTop = '';
                window.addEventListener('scroll', function () {
                    scrollTop = window.pageYOffset || document.documentElement.scrollTop;
                    if (scrollTop >0) {
                        t.headerConfig.title = t.storageTitle;
                        t.fixed = {
                            'position': 'fixed',
                            'z-index': '2',
                            'width':'9.2rem',
                        };
                    }else{
                        t.headerConfig.title = '';
                        t.fixed = {};
                    }
                }, false);
            }
        },
        watch:{
            "$store.state.ajaxing"(){   //该页面所有使用的loading都是在app文件中引入，通过vuex来控制显示
                if(this.$store.state.ajaxing){
                    this.ajaxing = true;
                }else{
                    this.ajaxing = false;
                }
            },
            "$store.state.urlData"(){
                let str =this.$store.state.urlData.bookName;
                this.storageTitle = comm.getStrLen(str,20);
            }
        }
    }
</script>

<style rel="stylesheet/scss" lang="scss">
    @import "scss/base";
    @import "scss/pages/eBook/eBook_details";
    .al-eBookItemContent{
        width:100%;
    }

</style>


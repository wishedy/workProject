<template>
    <section class="al-mainInner">
        <WakeApp :options="wakeData"></WakeApp>
        <HeaderBar :header-config="headerConfig"></HeaderBar>
        <NavBar></NavBar>
        <transition :enter-active-class="direction" :leave-active-class="direction">
                    <router-view></router-view>
        </transition>
        <Share :shareConfig.sync="shareConfig" v-show="shareOnOff"></Share>
    </section>
</template>

<script>
    import HeaderBar from "components/HeaderBar/HeaderBar";
    import NavBar from "./components/NavBar.vue";
    import Share from "components/Share/Share.vue";
    import comm from "static/js/comm";
    import {mapActions} from "vuex";
	import {shareAll} from '@allin/wap-share';
    import WakeApp from  'components/WakeApp/WakeApp.vue';
	window.shareAll = shareAll;
    export default {
        data(){
            return {
                headerConfig: {
                    title:"书籍详情",
                    backOnOff: "true"
                },
                shareConfig:{},
                shareOnOff:true,
                firstDocName: '',
                secondDocName: '',
                threeDocName: '',
                docCount:'',
                wakeData:{
                    el: ".al-newWakeUpAppBtn",
                    ios: "allinmdios://app.allinmd.cn/applinks.html",
                    ios9: "http://app.allinmd.cn/applinks.html",
                    android: "allin://com.allin.social:75235?data={}"
                }
            }
        },
        components:{
            HeaderBar,
            NavBar,
            Share,
            WakeApp
        },
        mounted(){
            this.headerConfig.title = comm.getStrLen(comm.getpara().catalogueName,20);
            document.title = comm.getpara().catalogueName+'-'+comm.getpara().bookName+'唯医,allinmd';
            this.share();
        },
        methods:{
            share(){
                this.shareConfig = {
                    initData:{

                    },
                    shareData:{
                        attUseFlag:3,
                        useFlag:3,
                        docId:comm.getpara().articleBook,
                        visitSiteId:2,
                        resourceType:0,
                        sceneType:27,
                        sessionCustomerId: $("#sesCustomerId").val(),
                        catalogueName:comm.getpara().catalogueName,
                        catalogueNum:comm.getpara().catalogueNum,
                        firstDocName: '',
                        secondDocName: '',
                        threeDocName: '',
                        docCount:'',
                        catalogueId:comm.getpara().articleCatalogue
                    }
                }
            },
            ...mapActions(["routerState"])
        },
        watch:{
            "$store.state.shareData"(){
                let shareData = this.$store.state.shareData;
                this.shareConfig.shareData.docCount = shareData.docCount;
                this.shareConfig.shareData.firstDocName = shareData.firstDocName;
                this.shareConfig.shareData.secondDocName = shareData.secondDocName;
                this.shareConfig.shareData.threeDocName = shareData.threeDocName;
            },
            "$store.state.status"(){
                this.share();
            },
            $route(){
                this.routerState(this.$route.name);
            }
        },
        computed: {
            direction () {
                const viewDir = this.$store.state.viewDirection;
                let tranName = '';

                if (viewDir === 'left') {
                    document.getElementById('box').innerHTML="";
                    tranName = 'animated slideInRight';
                } else if (viewDir === 'right') {
                    document.getElementById('box').innerHTML="";
                    tranName = 'animated slideInLeft';
                } else {
                    tranName = 'fade';
                }
                return tranName
            },
        },
    }
</script>

<style ref="stylesheet" lang="scss">
    @import "scss/base";
    @import "scss/pages/eBook/eBook_chapter";

    .al-indexHeader .al-indexHeaderItem:nth-child(2) {
        text-align: center;
        width:auto;
    }
    .al-eBookItemContent{
        position:absolute;
    }
</style>

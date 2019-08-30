<template>
    <section class="al-mainInner">
        <my-header v-show="floatHead"></my-header>
        <router-view ></router-view>
        <FollowLayer @ensureClickEvent="ensure" @cancelClickEvent="cancel" :followLayer='followLayer'></FollowLayer>
        <Loading v-show="isAjax.length"></Loading>
    </section>
</template>

<script>
    import app from 'static/js/comm.app.js';
    import myHeader from "./components/HeaderFloat.vue";
    import comm from 'static/js/comm.js';
    import Loading from "components/Loading/Loading";
    import FollowLayer from "components/FollowLayer/FollowLayer.vue";
    import {mapActions,mapGetters} from "vuex";
	import FastClick from "fastclick";
	import {shareAll} from '@allin/wap-share';
	window.shareAll = shareAll;
	window.FastClick = FastClick;
	FastClick.attach(document.body);
    export default {
        data(){
            return {
                headerConfig:{
                    title:"热门活动",
                },
                floatHead:false,
                navstate:'',
                hieght:'',
				followLayer:{
                	title:'确定不再关注此人？'
                }
            }
        },
        components:{
            myHeader,
            FollowLayer,
            Loading
        },
        computed:{
            ...mapGetters(['isAjax'])
        },
        methods: {
            ...mapActions(['changeIscontentTab','changeIsHeader']),
            "ensure"() {
                this.changeEn(true);
                this.change(false);
            },
            "cancel"() {
                this.change(false);
            },
            scroll(){
                let t = this;
                let scrollTop = '';
                window.addEventListener('scroll', function () {
                    let headHeight = document.getElementsByClassName("al-personalHead").length==0?0:document.getElementsByClassName("al-personalHead")[0].offsetHeight;
                    let appH = document.getElementsByClassName("al-appWakeUpFigure").length === 0 ? 0 : document.getElementsByClassName("al-appWakeUpFigure")[0].offsetHeight;
                    let eventContainer = document.getElementsByClassName("ev-contentCon").length === 0 ? 0 : document.getElementsByClassName("ev-contentCon")[0].offsetTop;
                    let HeadFixed = document.getElementsByClassName("al-personalHeadFixed").length === 0 ? 0 : document.getElementsByClassName("al-personalHeadFixed")[0].offsetHeight;
                    scrollTop = window.pageYOffset || document.documentElement.scrollTop;
                    if(t.$router.currentRoute.fullPath.indexOf('ndexHome') != -1||t.$router.currentRoute.fullPath.indexOf('ontribution') != -1){
                        if (scrollTop > headHeight+appH) {
                            t.floatHead = true;
                            if(scrollTop > eventContainer-HeadFixed){
                                t.changeIscontentTab(true);
                            }else {
                                t.changeIscontentTab(false);
                            }

                        }else{
                            t.floatHead = false;
                            t.changeIscontentTab(false);
                        }
                    }else if(t.$router.currentRoute.fullPath.indexOf('Info') != -1){
                        if (scrollTop > appH) {

                            t.changeIsHeader(true);

                        }else{
                            t.changeIsHeader(false);
                        }
                    }


                }, false);
            },
            //唤醒app
            wakeup(){
                let t=this;
                let amChannel = comm.getpara()._amChannel;
                let cId=comm.getpara().cid;
                let callAppOptions={
                    ios: "allinmdios://app.allinmd.cn/applinks.html?scene=terminalPage&index=0"+(cId?"&sourceId=" + cId:"") +"&tplPath=0"+ (amChannel?"&_amChannel="+amChannel:''),
                    android: "allin://com.allin.social:75235?data={scene:3,type:0"+(cId?",sourceId:"+  cId :'')+",tplPath:0"+ (amChannel?",_amChannel:"+amChannel:'')+ "}",
                    ios9: "http://app.allinmd.cn/applinks.html?scene=terminalPage&index=0"+(cId?"&sourceId=" + cId:"") +"&tplPath=0"+ (amChannel?"&_amChannel="+amChannel:''),
                    runAtOnce: false
                };
                app.appWakeUp("figure",callAppOptions);//下载app层
            },
            ...mapActions(["change","changeEn"]),
        },
        mounted(){
           this.wakeup();
           let t=this;
            window.addEventListener('hashchange', function () {
                $(window).scrollTop(0);
                t.changeIsHeader(false);
                t.changeIscontentTab(false);
            }, false);
        },
        beforeMount(){
			//当前cid 等于已登录用户userId，跳转到个人中心首页
        	let cid = comm.getpara().cid;
        	let userId = localStorage.getItem('userId');
        	if(userId&&cid==userId){
        		if(window.g_sps){
					g_sps.jump(null,'./personal_index.html#/IndexHome');
                }else{
        			setTimeout(function(){
						g_sps.jump(null,'./personal_index.html#/IndexHome');
                    },200)
                }

            }
        	this.$nextTick(this.scroll);
        },
        watch:{
            $route(){
                this.navstate = '';
            }
        },
    }
</script>

<style rel="stylesheet" lang="scss">
    @import "scss/base";
    /*@import "scss/pages/others/others_index.scss";*/
    @import 'scss/pages/personal/personal_indexNew.scss';
</style>

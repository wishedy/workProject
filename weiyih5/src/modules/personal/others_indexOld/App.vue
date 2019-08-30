<template>
    <section class="al-mainInner">
        <my-header v-show="floatHead"></my-header>
        <my-detail @detail="detail"></my-detail>
        <my-switch :class="navstate"></my-switch>
        <router-view ></router-view>
        <FollowLayer @ensureClickEvent="ensure" @cancelClickEvent="cancel" :followLayer='followLayer'></FollowLayer>
    </section>
</template>


<script>
    import app from 'static/js/comm.app.js';
    import myDetail from "./components/Detail.vue";
    import myHeader from "./components/HeaderFloat.vue";
    import mySwitch from "./components/Switch.vue";
    import comm from 'static/js/comm.js';
    import FollowLayer from "components/FollowLayer/FollowLayer.vue";
    import {mapActions} from "vuex";
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
            myDetail,
            myHeader,
            mySwitch,
            FollowLayer,
        },
        methods: {
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
                    scrollTop = window.pageYOffset || document.documentElement.scrollTop;
                    if (scrollTop > 0) {
                        t.floatHead = true;
                        if(scrollTop > t.hieght){
                            t.navstate = 'al-personalNavbarFixed';
                        }else{
                            t.navstate = '';
                        }
                    }else{
                        t.floatHead = false;
                    }
                }, false);
            },
            detail(d){
                this.hieght = d;
            },
            //唤醒app
            wakeup(){
                let t=this;
                let amChannel = comm.getpara()._amChannel;
                let cId=comm.getpara().cid;
                let callAppOptions={
                    ios: "allinmdios://app.allinmd.cn/applinks.html?scene=terminalPage&index=0"+(cId?"&sourceId=" + cId:"") + (amChannel?"&_amChannel="+amChannel:''),
                    android: "allin://com.allin.social:75235?data={scene:3,type:0"+(cId?",sourceId:"+  cId :'')+ (amChannel?",_amChannel:"+amChannel:'')+ "}",
                    ios9: "http://app.allinmd.cn/applinks.html?scene=terminalPage&index=0"+(cId?"&sourceId=" + cId:"") + (amChannel?"&_amChannel="+amChannel:''),
                    runAtOnce: false
                };
                app.appWakeUp("figure",callAppOptions);//下载app层
            },
            ...mapActions(["change","changeEn"]),
        },
        mounted(){
           this.wakeup();
        },
        beforeMount(){
			//当前cid 等于已登录用户userId，跳转到个人中心首页
        	let cid = comm.getpara().cid;
        	let userId = localStorage.getItem('userId');
        	if(userId&&cid==userId){
        		if(window.g_sps){
					g_sps.jump(null,'./personal_index.html');
                }else{
        			setTimeout(function(){
						g_sps.jump(null,'./personal_index.html');
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
    @import "scss/pages/others/others_index.scss";
</style>

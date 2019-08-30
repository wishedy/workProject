<template>
    <!--全部直播-->
    <section>
        <section class="al-contentPartModule" v-for="kv in listData">
            <article class="al-contentWatcher">
                <figure class="al-contentWatcherPic">
                    <a :href="'/dist/personal/others_contribution.html?cid='+kv.customerId">
                        <img :src="kv.logoUrl" alt=""></a>
                </figure>
                <span class="al-contentWatcherName">
                    <a :href="'/dist/personal/others_contribution.html?cid='+kv.customerId">{{kv.authName}}</a>
                    <span class="watcherNum icon-livingWatcherNum">{{kv.num,kv.followNum,kv.onlineNum|toWKH}}</span>
                    </span>
            </article>
            <figure class="al-contentSeminarImg">
                <a style="position:relative;" :href="jumpHref(kv.liveState,kv.liveId)">
                    <img :src="ImgSrc(kv.attUrl)" alt="">
                    <i :class="{mark:true,'livingMark_order':kv.liveState==1,'livingNoBegin':kv.liveState==2,'livingMark_living':kv.liveState==3,'livingMark_end':kv.liveState==4}"></i>
                    <span class="al-livingClass">{{kv.liveType|getType}}</span></a>
            </figure>
            <section class="al-contentBottomPart">
                <article class="al-contentText">
                    <a :href="jumpHref(kv.liveState,kv.liveId)" class="al-contentTitle">{{kv.liveTitle}}</a>
                </article>
                <figure class="al-contentSeminarJoin" v-if="kv.liveState==2||kv.liveState==1">
                    <a :href="'//m.allinmd.cn/pages/live/livingDetails.html?liveId='+kv.liveId" :class="{'btn-done':kv.isOrder==1,'btn-primary':kv.isOrder!=1}" :style="{display:'inline-block'}">{{kv.isOrder|isOrder}}</a></figure>
            </section>
        </section>
    </section>

</template>

<script type="text/ecmascript-6">
    /**
     * 功能描述： 直播列表
     * 使用方法:
     * 注意事件：
     * 引入来源：
     * 作用：
     * Created by zhanghonda on 2017/12.
     */
    // import axios from 'axios';
    import TempCache from "static/js/tempcache.js"
    import comm from 'static/js/comm.js'
    import commApp from 'static/js/comm.app.js'

    export default {
        props: ['listData'],
        data() {
            return {
                param:{
                    sessionCustomerId:TempCache.getItem('userId')!=undefined?TempCache.getItem('userId'):'',
                },
            }
        },
        methods: {
            jumpHref(liveSta,liveId){
                return (liveSta==3?"//m.allinmd.cn/pages/live/living_watch.html?liveId="+liveId:"//m.allinmd.cn/pages/live/livingDetails.html?liveId="+liveId);
            },
            ImgSrc(attUrl,sma){
                if(sma){
                    return (attUrl!=""?attUrl:  "//img50.allinmd.cn/pages/living/NoCover_ListSmall.png");
                }else{
                    return (attUrl!=""?attUrl:"//img50.allinmd.cn/pages/living/NoCover_ListBig.png");
                }
            },
            callApp(){
                let t = this;
                $('.ev_app').on("click", function() {
                    let cid=t.param.sessionCustomerId;
                    let amChannel = comm.getpara()._amChannel;
                    let callAppOptions = {
                        ios: "allinmdios://app.allinmd.cn/applinks.html?scene=publishScene&type=4&userId=" + cid +(amChannel?"&_amChannel="+amChannel:''),
                        android: "allin://com.allin.social:75235?data={scene:11,userId:"+  cid +",type:51" +(amChannel?",_amChannel:"+amChannel+"}":''),
                        ios9: "http://app.allinmd.cn/applinks.html?scene=publishScene&type=4&userId=" + cid +(amChannel?"&_amChannel="+amChannel:''),
                        runAtOnce: false
                    };
                    commApp.appWakeUp('confirm',callAppOptions);
                });
            }
        },
        watch: {},
        filters:{
            isOrder(val){
                if(parseInt(val,10)===1){
                    return "已预约";
                }else{
                    return "预约";
                }
            },
            getType(x){
                let type="";
                switch(parseInt(x, 10)){//直播类型(1-手术直播，2-学术会议，3-产品推荐，4-器械操作，5-手术解说，6-病例讨论)
                    case 1:type="手术直播";break;
                    case 2:type="学术会议";break;
                    case 3:type="产品推荐";break;
                    case 4:type="器械操作";break;
                    case 5:type="手术解说";break;
                    case 6:type="病例讨论";break;
                    case 7:type="课程讲解";break;
                    case 8:type="会议直播";break;
                    case 9:type="学术讨论";break;
                    case 10:type="其他";break;
                }
                return type;
            },
            toWKH(sta,followNum,onlineNum){
                if(sta==4||sta==5){
                    return comm.toWKH(followNum);
                }else{
                    return comm.toWKH(onlineNum);
                }
            },
        },
        mounted() {
            this.callApp();
        }
    }
</script>

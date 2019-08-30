<template>
    <!--我的预约-->
    <section>
        <section class="al-myLivingItem" v-for="kv in OrdlistData">
            <a :href="jumpHref(kv.liveState,kv.liveId)">
                <figure class="al-myLivingItemImg">
                    <img :src="ImgSrc(kv.attUrl,1)" alt="">
                    <i :class="{mark:true,'livingMark_order':kv.liveState==1,'livingNoBegin':kv.liveState==2,'livingMark_living':kv.liveState==3,'livingMark_end':kv.liveState==4}"></i>
                    <p class="al-myLivingItemBaseMsg">
                        <span>{{kv.liveStartTime}}</span>
                        <span>{{kv.liveType|getType}}</span>
                    </p>
                </figure>
                <figcaption>
                    <h2>{{kv.liveTitle}}</h2>
                    <p>
                        <span class="time">{{kv.authName}}</span>
                        <span class="watcherNum icon-livingWatcherNum">{{kv.num,kv.followNum,kv.onlineNum|toWKH}}</span>
                    </p>
                </figcaption>
            </a>
        </section>
    </section>
</template>

<script type="text/ecmascript-6">
    /**
     * 功能描述： 我的预约列表
     * 使用方法:
     * 注意事件：
     * 引入来源：
     * 作用：
     * Created by zhanghonda on 2017/12.
     */

    import comm from 'static/js/comm.js'

    export default {
        props: ['OrdlistData'],
        data() {
            return {

            }
        },
        methods:{
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

        },
        filters:{
            // getState(sta){
            //     let tip="";
            //     switch(parseInt(sta, 10)){//直播状态( 1-预约，2-未开始,3-直播中，4-直播结束，5-完成)
            //         case 1:
            //             tip='<i class="mark livingMark_order"></i>';break;
            //         case 2:
            //             tip ='<i class="mark livingNoBegin"></i>';break;
            //         case 3:
            //             tip='<i class="mark livingMark_living"></i>';break;
            //         case 4:
            //             break;
            //         case 5:
            //             tip='<i class="mark livingMark_end"></i>';break;
            //     }
            //     return tip;
            // },
            getType(x){
                let type="";
                switch(parseInt(x, 10)){//直播类型(1-手术直播，2-学术会议，3-产品推荐，4-器械操作，5-手术解说，6-病例讨论)
                    case 1:
                        type="手术直播";break;
                    case 2:
                        type="学术会议";break;
                    case 3:
                        type="产品推荐";break;
                    case 4:
                        type="器械操作";break;
                    case 5:
                        type="手术解说";break;
                    case 6:
                        type="病例讨论";break;
                    case 7:
                        type="课程讲解";break;
                    case 8:
                        type="会议直播";break;
                    case 9:
                        type="学术讨论";break;
                    case 10:
                        type="其他";break;
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
           console.log(this.listDate);
        }
    }
</script>

<style scoped>

</style>
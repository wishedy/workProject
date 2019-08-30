<template>
    <section class="al-mainInner">
        <!-- 头部信息 -->
        <header class="al-indexHeader" data-alcode-mod='401'>
            <figure class="al-indexHeaderItem">
                <a href="javascript:;" class="ev_backBtn" data-alcode='e45'>
                    <img src="//img50.allinmd.cn/pages/personal/arrow_back.png" alt="">
                </a>
            </figure>
            <figure class="al-indexHeaderItem">
                <h1>我的预约</h1>
            </figure>
            <figure class="al-indexHeaderItem">
                <a href="javascript:void(0)">
                </a>
            </figure>
        </header>
        <section class="al-myLivingContent ev_myOrder" style="display:none;" data-alcode-mod='478'>
            <!--我的预约直播列表-->
            <OrderList :OrdlistData="OrderList"></OrderList>
        </section>
        <section class="al-noLoginTips" style="display: none;">
            <figure>
                <img src="//img50.allinmd.cn/pages/living/NoOrderImg.png" alt="">
            </figure>
            <button class="btn-primary ev_app" style="width:auto!important;height:auto;line-height:1;">我要直播</button>
        </section>
    </section>
</template>

<script type="text/ecmascript-6">

    /**
     * 功能描述：个人中心预约直播列表
     * 使用方法:
     * 注意事件：
     * 引入来源：
     * 作用：
     * Created by zhanghonda on 2017/12.
     */

    import axios from 'axios';
    import Loading from 'components/Loading/Loading.vue';
    import TempCache from "static/js/tempcache.js";
    import comm from 'static/js/comm.js';
    import commApp from 'static/js/comm.app.js';
    import user from "static/js/module.user.js";
    import OrderList from "components/Live/orderList.vue";

    const xhrUrl = {//接口地址
        myLive:'/mcall/broadcast/home/getMapList/',//我的预约列表
    };

    export default {
        props: ['orderData'],
        components: {
            Loading,//loading事件
            OrderList,//我的预约列表
        },
        data() {
            return {
                param:{
                    sessionCustomerId:TempCache.getItem('userId')!=undefined?TempCache.getItem('userId'):'',
                },
                OrderList:[]//我的预约直播
            }
        },
        methods:{
            //获取直播列表
            getMyLive() {
                let t = this;
                let cid = t.param.sessionCustomerId;
                axios({
                    url: xhrUrl.myLive,
                    method: "POST",
                    data: {
                        sessionCustomerId:cid?cid:'',
                        visitSiteId:2,
                        isHome:0,      //是否是首页（传0）（1-是，0-不是）
                        isSubscribe:1, //是否是预约（传1）（1-是，0-不是）
                        pageIndex:1,
                        pageSize:20
                    },
                    transformRequest: [function (data) {
                        return "paramJson=" + JSON.stringify(data);
                    }],
                    headers: {
                        'X-Requested-With': 'XMLHttpRequest'
                    },
                    timeout: 30000
                }).then(function (res) {
                    t.loading = false;
                    let myArrList = [];
                    let options  = {
                        success(data) {
                            t.ajaxing=false;
                            let dataList = data.responseObject.responseData.data_list;
                            $('.ev_myOrder').show();
                            for(let num = 0;num<dataList.length;num++){
                                let e = dataList[num];
                                myArrList.push({
                                    liveAttendeeJoinUrl: e.liveAttendeeJoinUrl,
                                    attUrl:e.attUrl,
                                    subtractionDate:e.subtractionDate,
                                    liveTitle:comm.getStrLen(e.liveTitle,20),
                                    liveStartTime:e.liveStartTime,
                                    onlineNum:e.onlineNum,
                                    followNum:e.followNum,
                                    liveType:e.liveType,
                                    liveState:e.liveState,
                                    liveId:e.liveId,
                                    authName:e.authInfo.authName
                                });
                                t.OrderList = myArrList;
                            }
                            if(dataList&&dataList.length>4){
                                $('.al-checkMore').css({'display':'inline-block','width':'100%'});
                            }
                            if(t.OrderList==[]){//如果返回有数据 但是为空
                                $('.al-myLivingContent').hide();
                                $('.al-noLoginTips').show();
                            }
                        },
                        failed(){
                            t.ajaxing=false;
                            t.noMore=true;
                            $('.al-myLivingContent').hide();
                            $('.al-noLoginTips').show();
                        }
                    };
                    comm.successRequest(res.data,options);
                });
            },
            backBtn(){
                $('.ev_backBtn').click(function(){
                    comm.creatEvent({
                        triggerType:'全站功能按钮点击',
                        keyword:"返回",
                        actionId:41,
                        async:false
                    });
                    if(!comm.getpara().from){
                        g_sps.jump(null,'/dist/personal/personal_index.html');
                    }else{
                        g_sps.jump(null,comm.getpara().from);
                    }
                });
            },
            callApp(){
                let t = this;
                $('.ev_app').on("click", function() {
                    let cid=t.param.sessionCustomerId;
                    let amChannel = comm.getpara()._amChannel;
                    let callAppOptions = {
                        ios: "allinmdios://app.allinmd.cn/applinks.html?scene=publishScene&type=4&userId=" + cid + (amChannel?"&_amChannel="+amChannel:''),
                        android: "allin://com.allin.social:75235?data={scene:11,userId:"+  cid +",type:51"+ (amChannel?",_amChannel:"+amChannel:'')+ "}",
                        ios9: "http://app.allinmd.cn/applinks.html?scene=publishScene&type=4&userId=" + cid + (amChannel?"&_amChannel="+amChannel:''),
                        runAtOnce: false
                    };
                    commApp.appWakeUp('confirm',callAppOptions);
                });
            }
        },
        filters:{},
        mounted() {//方法调用
            let t = this;
            let cid =TempCache.getItem('userId');
            let auth = TempCache.getItem('auth');
            let state;
            if(auth&&auth!=null){
                state = JSON.parse(auth).state;
            }
            if(cid&&state==2||state==7||state==8||state==9){
                t.getMyLive();
                t.backBtn();
                t.callApp();
            }else{
                user.privExecute({
                    callback: function() {

                    },
                    operateType: "auth"
                });
            }
        }
    }
</script>
<style scoped>
</style>
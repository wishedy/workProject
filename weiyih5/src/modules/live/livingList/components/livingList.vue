<template>
    <section class="al-mainInner">
        <!-- 头部信息 -->
        <header class="al-indexHeader">
            <figure class="al-indexHeaderItem">
                <a class='ev_digHole' href="//m.allinmd.cn">
                    <img src="//img50.allinmd.cn/pages/personal/arrow_back.png" alt="">
                </a>
            </figure>
            <figure class="al-indexHeaderItem">
                <h1>直播</h1>
            </figure>
            <figure class="al-indexHeaderItem">
                <a href="javascript:void(0)">
                </a>
            </figure>
        </header>
        <!--头部信息结束-->
        <section class="al-myLivingContent ev_MyLiveBox" style="display: none;">
            <header class="al-myLivingContentTitle">
                <h2>我的预约</h2>
            </header>
            <section class="ev_MyLive">
                <OrderList :OrdlistData="Orderlist"></OrderList>
            </section>
        </section>
        <a href="/dist/live/livingOrder.html?from=/dist/live/livingList.html" class="al-checkMore" style="display: none;">
            <span>查看更多</span><i class="icon-arrowRight"></i>
        </a>
        <section class="al-myLivingContent ev_allLiveBox">
            <header class="al-myLivingContentTitle">
                <h2>全部直播</h2>
            </header>
            <section class="ev_allLive">
                <LiveList :listData="list"></LiveList>
            </section>
        </section>
        <section class="al-noLoginTips" style="display: none;">
            <figure>
                <img src="//img50.allinmd.cn/pages/living/LiveList_no@2x.png" alt="">
            </figure>
            <button :style="{'height':'auto','line-height':'1','width':'auto!important'}" class="btn-primary ev_app">我要直播</button>
        </section>
        <!-- 列表内容结束 -->
        <Loading v-show="loading"></Loading>
    </section>
</template>
<script type="text/ecmascript-6">
    import axios from 'axios';
    import Loading from 'components/Loading/Loading.vue'
    import TempCache from "static/js/tempcache.js"
    import comm from 'static/js/comm.js';
    import HeaderBar from "components/HeaderBar/HeaderBar.vue";
    import LiveList from "./liveList.vue";
    import OrderList from "components/Live/orderList.vue";

    const xhrUrl = {//接口地址
        allLive: '/mcall/broadcast/home/getMapList/',//弹层筛选分类列表接口
    };
    export default {
        components: {
            HeaderBar,//头部
            Loading,//loading事件
            LiveList,//直播列表
            OrderList,//我的预约列表
        },
        data() {
            return {
                param:{
                    sessionCustomerId:TempCache.getItem('userId')!=undefined?TempCache.getItem('userId'):'',
                    pageIndex:1,
                    pageSize:20,
                },
                shareOnOff: true,//分享
                loading: false,//loading显示和隐藏
                noMore:false,
                ajaxing:false,
                list:[],
                Orderlist:[]
            }
        },
        methods: {
            //获取直播列表
            getAllLive() {
                let t = this;
                let cid = t.param.sessionCustomerId;
                axios({
                    url: xhrUrl.allLive,
                    method: "POST",
                    data: {
                        visitSiteId:2,
                        isHome:1,      //是否是首页（传0）（1-是，0-不是）
                        sessionCustomerId:cid?cid:"",
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
                    let options = {
                        success(data){
                            t.ajaxing=false;
                            let dataList = data.responseObject.responseData.data_list;
                            let orderList = data.responseObject.responseData.order_list;
                            let arrList = [];
                            let myArrList = [];
                            for(let num = 0;num<dataList.length;num++){
                                let e = dataList[num];
                                arrList.push({
                                    liveAttendeeJoinUrl: e.liveAttendeeJoinUrl,
                                    attUrl: e.attUrl,
                                    subtractionDate: e.subtractionDate,
                                    liveTitle: e.liveTitle,
                                    liveStartTime: e.liveStartTime,
                                    onlineNum: e.onlineNum,
                                    followNum: e.followNum,
                                    liveType: e.liveType,
                                    liveState: e.liveState,
                                    liveId: e.liveId,
                                    isOrder: e.isOrder,
                                    authName: e.authInfo.authName,
                                    customerId: e.authInfo.authCustomerId,
                                    logoUrl: e.authInfo.logoUrl
                                });
                                t.list = arrList;
                                t.Orderlist = arrList;//测试用于展示我的预约
                            }
                            if(dataList.length<20){
                                $('.ev_allLive').attr('scrollPagination','disabled').append("<section style='padding:0.3rem;text-align: center;color:#515c74;font-size:0.3rem;'>~~没有更多了~~</section>");
                            }
                            if(orderList&&orderList.length){
                                for(let i = 0;i<orderList.length;i++){
                                    let e = orderList[i];
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
                                    t.Orderlist = myArrList;
                                }
                                $('.ev_MyLiveBox').show();
                            }
                            if(orderList&&orderList.length>1){
                                $('.al-checkMore').css({'display':'inline-block','width':'100%'});
                            }
                            if(t.list==[]){//如果返回有数据 但是为空
                                $('.al-myLivingContent').hide();
                                $('.al-noLoginTips').show();
                            }
                            t.param.pageIndex++;
                            if(dataList.length<t.param.pageSize){
                                t.noMore=true;
                            }
                        },
                        failed(){
                            t.ajaxing=false;
                            t.noMore=true;
                            if(t.list.length){
                                return false;
                            }else{
                                if(t.param.pageIndex==1){
                                    t.list=[];
                                    t.Orderlist=[]
                                }
                            }
                            $('.al-myLivingContent').hide();
                            $('.al-noLoginTips').show();
                        }
                    };
                    comm.successRequest(res.data,options);
                });
            },
            //瀑布流
            scroll:function(){
                let t=this;
                window.onscroll=function(){
                    let top = document.documentElement.scrollTop || document.body.scrollTop;//滚动高度
                    let height = document.documentElement.clientHeight;//可视区高度
                    let scrollHeight = document.documentElement.scrollHeight || document.body.scrollHeight;//文档高度
                    if(top+height>scrollHeight-100){
                        if(!t.ajaxing && !t.noMore){
                            t.getAllLive();
                        }
                    }
                }
            },
            digHole(){
                $('.ev_digHole').click(function(){
                    comm.creatEvent({
                        triggerType:'全站功能按钮点击',
                        keyword:'直播列表',
                        actionId:41
                    });
                });
            },
        },
        watch: {//监听数据data

        },
        mounted() {//方法调用
            let t = this;
                t.getAllLive();
                t.digHole();
        }
    }
</script>
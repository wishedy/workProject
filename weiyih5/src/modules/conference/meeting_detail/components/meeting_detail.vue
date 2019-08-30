<template>
    <section class="al-mainInner">
        <!-- 头部信息 -->
        <section class="al-headFilterBox" style="position:unset;">
            <header class="al-indexHeader" data-alcode-mod='401'>
                <figure class="al-indexHeaderItem">
                    <a href="javascript:;" data-alcode='e45' @click.stop="meetingGoBack()">
                        <img src="//img50.allinmd.cn/pages/personal/arrow_back.png" alt="">
                    </a>
                </figure>
                <figure class="al-indexHeaderItem">
                    <h1 class="ev_consubName"></h1>
                </figure>
                <figure class="al-indexHeaderItem">
                    <a href="javascript:;" class="ev_shareBtn">
                        <i class="meetingShare"></i>分享
                    </a>
                </figure>
            </header>
        </section>
        <section class="ev-fixedArea fixedArea" @click.stop="titleCli()"></section>
        <section class="meetingCont">
            <section class="meetingIntroduction" style="margin-top: 20px;">
                <aside class="meIntroTitle">{{meetingIntro.conName}}</aside>
                <div class="fellow">
                    <div class="fellowNum">{{hasFollowNum?meetingItem.followNum:0}}关注</div>
                    <div class="fellowBtn" v-text="hasFollowState?(meetingItem.followState==1?'已关注':'关注'):'关注'" :class={active:followSta} @click.stop="followClick(meetingItem?meetingItem.followState:'')"></div>
                </div>
                <p>
                    <b>{{meetingInfo}}</b>
                    <span v-show="upShowOnOff" @click.stop="meetingUpDown()"><span v-text="isUp?'收起':'展开'" style="float: left"></span><i :class="{active:isUp}"></i></span>
                </p>
            </section>
            <section class="meetingList">
                <metlist :metlistData="meetingList"></metlist>
            </section>
        </section>

    </section>
</template>

<script>
    import comm from "static/js/comm";
    import TempCache from "static/js/tempcache";
    import metlist from "./meetingList.vue";
    import user from 'static/js/module.user';
    const $ = require('jquery');
    window.user = user;
    const xhrUrl = {//接口地址
        getMapListV4Url:'/mcall/conference/index/getMapListV4/',//会议预告列表接口
        followUrl: '/mcall/customer/follow/resource/create/',//关注接口customer/follow_resource/createFollowResource/'  customer/follow/resource/create/
        cancelUrl: '/mcall/customer/follow/resource/delete3/',//取消关注接口"customer/follow_resource/delete3/"  customer/follow/resource/delete/
        mInfo: '/mcall/conference/index/getConferenceSubList/',//会议简介接口
    };

    export default {
        data(){
            return{
                param:{
                    sessionCustomerId:TempCache.getItem('userId')!=undefined?TempCache.getItem('userId'):'',
                    conId:comm.getpara().conId,
                    authState : JSON.parse(TempCache.getItem("auth")) ? JSON.parse(TempCache.getItem("auth")).state : ""
                },
                meetingIntro:[],//会议简介
                meetingList:[],//会议列表数据
                meetingItem:[],
                meetingInfo:'',//会议简介
                shortIntro:'',//短会议简介
                longInfo:'',//长会议简介
                followSta:false,//是否关注
                upShowOnOff:false,//展开收起
                isUp:false,//展开收起
                hasFollowNum:false,
                hasFollowState:false,
            }
        },
        components:{
            metlist
        },
        methods:{
            meInfo: function () {/*会议简介的数据*/
                let t = this;
                comm.ajax2({
                    type:"post",
                    url:xhrUrl.mInfo,
                    data:{paramJson: JSON.stringify({pageIndex: 1, pageSize: 200, conId: t.param.conId})},
                    success:function(req){
                        if(req && req.responseObject && req.responseObject.responseStatus){
                            if (t.hasResponseData(req)) {
                                t.meetingIntro = req.responseObject.responseData;
                            }
                            if (t.hasResponseMessage(req)) {
                                t.meetingList = req.responseObject.responseMessage;
                            }
                            if (t.meetingIntro) {//简介字符串截取
                                let meetingTitle = t.meetingIntro.conIntro;
                                if (meetingTitle&&meetingTitle.length > 40) {
                                    t.upShowOnOff = true;
                                    t.shortIntro = comm.getStrLen(meetingTitle, 80);
                                    t.meetingInfo = t.shortIntro;
                                    t.longInfo = meetingTitle;
                                } else {
                                    t.upShowOnOff = false;
                                    t.meetingInfo = meetingTitle;
                                }
                            }
                            let _shortIntro = t.meetingIntro.conIntro;
                            if (t.meetingIntro&&t.meetingIntro.conIntro&&t.meetingIntro.conIntro.length > 40) {
                                _shortIntro = comm.getStrLen(t.meetingTitle, 80);
                            } else {

                            }
                            let conMainPicUrl = t.meetingIntro.conMainPicUrl;
                            let title="完整授课视频";
                            for(let i=0;i<t.meetingList.length;i++){
                              let val=t.meetingList[i];
                              if((val.isOnline==1||val.isOnline==2)&&(val.isValid==5||val.isValid==4)){
                                title="直播进行中";
                                break;
                              }
                            }
                            t.shareFn({
                                conId: t.param.conId,
                                title: "[" + t.meetingIntro.conName + "]"+title+"，就在唯医",
                                picUrl: conMainPicUrl ? conMainPicUrl : "https://m.allinmd.cn/image/allin_logo.png",
                                wxTitle: "[" + t.meetingIntro.conName + "]"+title+"，就在唯医",
                                wxDesc: _shortIntro,
                                timelineTitle: "[" + t.meetingIntro.conName + "]"+title+"，就在唯医",
                                sinaTitle: "[" + t.meetingIntro.conName + "]"+title+"，就在唯医。" + (t.meetingIntro.startTime ? t.meetingIntro.startTime.substring(0, 10) + "," : "") + " " + t.meetingIntro.country + t.meetingIntro.city + (_shortIntro ? (',' + _shortIntro) : "") + " 点击查看:",
                                qZoneTitle: "[" + t.meetingIntro.conName + "]"+title+"，就在唯医",
                                qZoneDesc: _shortIntro
                            })
                        }
                    }
                });
            },
            cusStatu:function () {/*获取用户状态*/
                let t = this;
                comm.ajax2({
                    type:"post",
                    url:xhrUrl.getMapListV4Url,
                    data:{paramJson: JSON.stringify({
                            scene: 0,//场景（0-会议频道页，1-我关注的会议，2-会议预告）
                            visitSiteId: 2,
                            platformId: TempCache.getItem('department') || 1,
                            pageIndex: 1,
                            pageSize: 20,
                            sessionCustomerId: t.param.sessionCustomerId,
                            conId: t.param.conId
                    })},
                    success:function(req){
                        if(req && req.responseObject && req.responseObject.responseStatus){
                            let items = req.responseObject.responseData.data_list[0];
                            t.meetingItem = req.responseObject.responseData.data_list[0];
                            if(items&&items!=''){
                                if(items.followNum){
                                    t.hasFollowNum=true;
                                }
                                if(items.followNum){
                                    t.hasFollowState=true
                                }
                                if(items.followState == 0) {//未关注
                                    t.followSta = false;
                                } else {//已关注
                                    t.followSta = true;
                                }
                            }
                        }
                    }
                });
            },
            hasResponseData: function (r) {
                if (r && r.responseObject && r.responseObject.responseData && !$.isEmptyObject(r.responseObject.responseData)) {
                    return true;
                }
                return false;
            },
            hasResponseMessage: function (r) {
                if (r && r.responseObject && r.responseObject.responseMessage && !$.isEmptyObject(r.responseObject.responseMessage)) {
                    return true;
                }
                return false;
            },
            followClick:function (sta) {//关注点击事件
                let t = this;
                let authState = t.param.authState;
                if(t.param.sessionCustomerId && (authState == 2|| authState == 7 || authState == 8 || authState == 9 )) {//登录认证用户 authState == 1 ||
                    if(sta==0){//表示没有关注
                        t.followOpFunc(xhrUrl.followUrl,sta)
                    }else{//表示已经关注
                        t.followOpFunc(xhrUrl.cancelUrl,sta)
                    }
                }else{
                    user.privExecute({
                        operateType: 'auth',   //'login','auth','conference'
                        callback: function () {},
                        noNeedBack:true
                    });
                }
            },
            followOpFunc: function (url,sta) {//点击关注按钮后的操作
                let t = this;
                if (t.param.conId) {
                    comm.ajax2({
                        type:"post",
                        url:url,
                        data:{paramJson: JSON.stringify({
                                refId: t.param.conId,
                                refName: '',
                                customerId: t.param.sessionCustomerId,
                                followType: 3
                            })},
                        success:function(req){
                            if (req && req.responseObject && req.responseObject.responseStatus) {//关注成功
                                if(sta==0){//表示是没有关注，添加关注
                                    if(t.meetingItem){
                                        t.followSta = true;
                                        t.meetingItem.followState=1;
                                        t.meetingItem.followNum++;
                                    }
                                }else{//表已经关注，取消关注
                                    if(t.meetingItem){
                                        t.followSta = false;
                                        t.meetingItem.followState=0;
                                        t.meetingItem.followNum--;
                                    }
                                    comm.creatEvent({triggerType: '关注', triggerName:"关注", keyword: "", actionId: 11022, refId:t.param.conId, refType:"会议"});
                                }
                            }
                        }
                    });
                }
            },
            meetingUpDown:function () {//会议简介展开收起
                let t = this;
                if(t.isUp==false){//表示是收起状态状态，i标签上没有active类
                    t.isUp = true;
                    t.meetingInfo = t.longInfo;
                    comm.creatEvent({triggerType: '功能按钮', triggerName:"展开", keyword: "", actionId: 11024, refId:t.param.conId, refType:"会议"});
                }else{
                    t.isUp = false;
                    t.meetingInfo = t.shortIntro;
                    comm.creatEvent({triggerType: '功能按钮', triggerName:"收起", keyword: "", actionId: 11025, refId:t.param.conId, refType:"会议"});
                }
            },
            meetingGoBack:function () {//顶部返回按钮
                let t = this;
                comm.creatEvent({triggerType: '全站功能按钮点击', keyword: t.meetingIntro.conName, actionId: 41, refId: t.param.conId, async: false});
                if(document.referrer){
                  history.back();
                }else{
                  g_sps.jump(null,'/');
                }

            },
            //此处用的JQ，用来写屏幕滑动置顶后点击fixed的Tab效果
            titleCli:function () {
                let t = $('.meetingCont');
                if (t.find('i').hasClass('active')) {
                    t.find('i').removeClass('active');
                    // t.find('.scheduleListWrap').slideUp();
                    t.find('.scheduleListWrap').hide();
                } else {
                    t.find('i').addClass('active');
                    t.find('.scheduleListWrap').show();
                }
            },
            shareFn: function (kv) {//分享
                shareAll({
                    title: kv.title,
                    url: window.location.href,//不传默认取当前地址
                    pic: kv.picUrl,//分享图片
                    trendUrl: "",//分享动态的请求连接  //不需要动态分享就不传 cId?"/mcall/customer/reprint/create/":""
                    noPJ: 0,//0：分享动态给后台的参数需要转为paramJson ,1:不需要book
                    data: {//分享动态传给后台的参数

                    },
                    callback: function () {
                    },//分享动态后成功后的回调函数
                    wxTitle: kv.wxTitle,//微信分享标题
                    wxDesc: kv.wxDesc,//微信分享描述
                    timeLineTitle: kv.timelineTitle,
                    sinaTitle: kv.sinaTitle,//新浪title
                    desc: kv.sinaTitle,//新浪的描述
                    qzoneTitle: kv.qZoneTitle,//qq空间title
                    summary: kv.qZoneDesc,//qq空间的描述
                    fnMessageSuc: function () {
                        comm.shareLog({
                            shareType: 3,
                            resourceId: kv.conId,
                            resourceType: 3,
                            refId: kv.conId,
                            isValid: 1,
                            shareSence: 24,
                            shareChannel: 4,
                            shareContent: kv.title
                        });
                    },
                    fnTimelineSuc: function () {
                        comm.shareLog({
                            shareType: 3,
                            resourceId: kv.conId,
                            resourceType: 3,
                            refId: kv.conId,
                            isValid: 1,
                            shareSence: 24,
                            shareChannel: 5,
                            shareContent: kv.title
                        });
                    },
                    qShareLog: function (o) {
                        comm.shareLog({
                            shareType: 3,
                            resourceId: kv.conId,
                            resourceType: 3,
                            refId: kv.conId,
                            isValid: 1,
                            shareSence: 24,
                            shareChannel: o == 'sina' ? 3 : 1,
                            shareContent: o == 'sina' ?
                                kv.sinaTitle : kv.qZoneDesc
                        });
                    }
                }, false, $('.ev_shareBtn'));
            },
            appFollow: function () {//解析app端分享出来的会议终端进行强制关注
                let t = this;
                let authState = t.param.authState;
                if (comm.getpara().appCode) {//app分享出的链接进行用户强制关注
                    if (t.param.sessionCustomerId &&  (authState == 2|| authState == 7 || authState == 8 || authState == 9 )) {//登录认证用户authState == 1 ||
                        if(followSta==false){
                            t.followOpFunc(xhrUrl.followUrl,0)//
                        }
                    } else {
                        user.privExecute({
                            operateType: 'auth',   //'login','auth','conference'
                            noNeedBack:true,
                            callback: function () {
                                if(!$(".ev-followBtn").hasClass("active")){
                                    $(".ev-followBtn").click();
                                }
                            }
                        });
                    }
                }
            },
        },
        filters:{
            titLen:function (txt) {//判断title长度进行显示长内容
                if(txt){
                    if(txt.length>12){
                        return txt.substring(0,12)+"..."
                    }else{
                        return txt;
                    }
                }else{
                    return
                }
                // return txt.length>=12?txt.substring(0,12)+'...':txt;
            }
        },
        mounted(){
            let t = this;
            t.meInfo();
            t.cusStatu();
            t.appFollow();
        }
    }
</script>

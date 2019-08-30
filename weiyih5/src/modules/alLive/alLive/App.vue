<template>
    <section class="al-mainInner">
        <section class="al-alLiveContainer" :style="videoStyle">
            <HeaderBar v-show="!landscape" @awakeApp="callApp"></HeaderBar>
            <VideoBar :style="videoStyle"></VideoBar>
            <PlayBackTitle v-if="liveType===1"></PlayBackTitle>
            <TabBar></TabBar>
        </section>
        <ContentView></ContentView>
        <!--<LiveDocument></LiveDocument>-->
    </section>
</template>

<script type="text/ecmascript-6">
    /*const vConsole = require('vconsole');
    new vConsole();*/
    const xhrUrl = {
        agenda:'/mcall/conference/index/getAgendaVideoList/',
        liveNum:'/mcall/conference/index/getLiveCount/',
        authority:'/mcall/conference/index/getAllSubConferenceListV2/'
    };
    const thirdPartyLiveSdk = {
      liveSdk:'//view.csslcloud.net/js/liveSDK.js',
      liveBackSdk:'//view.csslcloud.net/js/playbackSDK.js'
    };
    import user from "static/js/module.user.js";
    import comm from 'static/js/comm.js';
    import commApp from 'static/js/comm.app.js';
    import {mapActions,mapGetters} from 'vuex';
    import {shareAll} from '@allin/wap-share';
    window.shareAll = shareAll;
    import HeaderBar from './components/HeaderBar';
    import ContentView from './components/ContentView';
    import VideoBar from './components/VideoBar';
    import TabBar from './components/TabBar';
    import PlayBackTitle from './components/PlayBackTitle';
    import LiveDocument from './components/LiveDocument';
    import AlLiveSdk from  './untils/alLiveSdk';
    import TempCache from 'static/js/tempcache.js';
    import axios from 'axios';
    export default {
        components: {
            HeaderBar,
            VideoBar,
            TabBar,
            LiveDocument,
            ContentView,
            PlayBackTitle
        },
        data(){
            return {
                "conSubId": '',
                "conId": ''
            }
        },
        beforeMount(){
        },
        computed:{
            ...mapGetters(['landscape','windowWidth','windowHeight','liveType','loadOnOff','authority','conSubInfo','queryJson']),
            videoStyle(){
                let _this = this;

                let styleResult = [];
                if(_this.landscape){
                    //横屏状态下视频样式需要调整到全屏模式，需要做一定的样式处理
                    styleResult = [

                    {
                        height:'100%'
                    },

                    {
                        width:'100%'
                    }

                    ]
                }else{
                    //竖屏状态下视频样式需要调整到原始模式，不需要做任何样式处理
                }
                return styleResult;
            }
        },
        methods: {
            ...mapActions(['changeLandscape','setWindowSize','saveAgendaList','saveLiveNum','saveLiveType','saveDocumentType','saveAgendaStatus','saveConferenceId','saveAuthority','saveConSubInfo','saveQueryJson','changeLiveStatus']),
            triggerLandScape:function(){
                //用于检测平铺横竖屏的变化
                let _this = this;

                let screenDirection = window.matchMedia("(orientation: portrait)");

                screenDirection.addListener(handleOrientationChange);

                handleOrientationChange(screenDirection);

                function handleOrientationChange(screenDirection) {
                    if (screenDirection.matches) {
                        /* The device is currently in portrait orientation */
                        /* 竖屏处理事件 */
                        console.log('现在是竖屏');

                        _this.changeLandscape(false);
                    } else {
                        /* The device is currently in landscape orientation */
                        /* 横屏屏处理事件 */
                        console.log('现在是横屏');

                        _this.changeLandscape(true);
                    }
                }
                return _this;
            },
            storeWindowSize:function(){
                //初始化存储屏幕宽高尺寸
                let _this = this;
                _this.setWindowSize({
                  setType:0,
                  size: window.screen.width
                });
                _this.setWindowSize({
                    setType:1,
                    size: window.screen.height
                });
                return _this;
            },
            getLiveNum:function(){
                //实时获取在线人数
                let _this = this;
                let getLiveNumTimer = ()=>{
                    setInterval(()=>{
                        axios.post(xhrUrl.liveNum, {
                            params: {
                                paramJson:JSON.stringify(
                                    {
                                        "conSubId": _this.conSubId,
                                    }
                                )

                            }
                        })
                            .then(function (res) {
                                console.log(res);
                                if(res&&res.data&&res.data.responseObject&&res.data.responseObject.responseData&&res.data.responseObject.responseData.count){
                                    _this.saveLiveNum(parseInt(res.data.responseObject.responseData.count,10));
                                }else{
                                    _this.saveLiveNum(10);
                                }
                            })
                            .catch(function (error) {
                                ////console.log(error);
                            });
                    },60*1000);
                  };
                getLiveNumTimer();
                return _this;
            },
            getAgenda:function(){
                //获取会议日程
                let _this = this;
                axios.get(xhrUrl.agenda, {
                    params: {
                        paramJson:JSON.stringify(
                            {
                                "pageIndex": 1,
                                "pageSize": 100,
                                "conSubId":  _this.conSubId,
                                "conId": _this.conId
                            }
                        )

                    }
                })
                    .then(function (res) {
                        if(res&&res.data&&res.data.responseObject&&res.data.responseObject.responseMessage.length>0){
                           _this.saveAgendaList(_this.pretreatmentData(res.data.responseObject.responseMessage));
                           _this.saveAgendaStatus(1);
                        }else{
                            _this.saveAgendaStatus(0);
                        }
                    })
                    .catch(function (error) {
                        _this.saveAgendaStatus(0);
                        ////console.log(error);
                    });
                return _this;
            },
            pretreatmentData: function (data) {
                let returnData = {};
                let changeTimeStyle = function (time) {
                    if($.isEmptyObject(time)){
                        return '';
                    }
                    return time.split(" ")[0];
                };
                $.each(data, function (i, v) {
                    if (returnData[changeTimeStyle(v.startTime)]) {
                        returnData[changeTimeStyle(v.startTime)].push(v);
                    } else {
                        returnData[changeTimeStyle(v.startTime)] = [];
                        returnData[changeTimeStyle(v.startTime)].push(v);
                    }
                });
                return returnData;
            },
            shareInit(){
              let _this = this;
              let _shareTitle = comm.getStrLen(_this.conSubInfo.conSubName,30);
              let _desc = comm.getStrLen(_this.conSubInfo.conSubIntro,30);
              let _sharePic = _this.conSubInfo.conSubWebUrl;
              let _shareSence = parseInt(_this.liveType)?26:24;
              if(comm.isWeiXin()){
                  shareAll({
                      title:_shareTitle,
                      desc:comm.getStrLen(_desc,50),
                      pic:_sharePic?_sharePic:'http://m.allinmd.cn/image/allin_logo.png',
                      fnMessageSuc: function () {
                          comm.shareLog({shareSence: _shareSence, shareChannel: 4,shareContent:_shareTitle});
                      },
                      fnTimelineSuc: function () {
                          comm.shareLog({shareSence:_shareSence, shareChannel: 5,shareContent:_shareTitle});
                      }
                  },true);
              }
            },
            nothing(str){
                return comm.checkInvalid(str)?'0':str;
            },
            callApp(){
              let _this = this;
                let conId = _this.conId;
                let conSubId = _this.conSubId;
                let index = (parseInt(_this,10)===0)?11:12;
                let token = comm.checkInvalid(_this.queryJson.token)?"333333":_this.queryJson.token;
                let liveId = _this.nothing(_this.queryJson.liveId);
                let recordId = _this.nothing(_this.queryJson.recordid);
                let userId = _this.nothing(_this.queryJson.userid);
                let roomId= _this.nothing(_this.queryJson.roomid);
                let liveType= _this.nothing(_this.queryJson.liveType);//该参数有待考量
                let authority= _this.nothing(_this.conSubInfo.authority);
                let conSubName= _this.nothing(_this.conSubInfo.conSubName);
                let androidParam = `{scene:3,type:${index},conId:${conId},conSubId:${conSubId},liveId:${liveId},liveRoomId:${roomId},conName:${conSubName},livePassword:${token},liveType:${liveType},conPlayAuthority:${authority},liveRecordId:${recordId},liveUid:${userId}`;
                let iosParam = `scene=terminalPage&index=${index}&roomId=${roomId}&userId=${userId}&conSubId=${conSubId}&conName=${conSubName}&playType=${liveType}&playBackId=${recordId}&livePassword=${token}&liveId=${liveId}&conPlayAuthority=${authority}&conId=${conId}`;
                let callAppOptions = {
                    ios: "allinmdios://app.allinmd.cn/applinks.html?"+iosParam,
                    android: "allin://com.allin.social:75235?data="+androidParam,
                    ios9: "http://app.allinmd.cn/applinks.html?"+iosParam,
                    runAtOnce: false,
                    callback:function(){
                        $("video").hide();
                        $('iframe:eq(0)').height(0);
                    },
                    reCallBack:function(){
                        $("video").show();
                        $('iframe:eq(0)').height('100%');
                    }
                };
                commApp.appWakeUp('btn',callAppOptions,{dom:$('.al-indexHeaderItem').eq(2)});
                $(".al-appWakeUpBtn").on("touchstart",function(){
                    TempCache.setItem("appAwake",1);
                });
                /*"conSubId": '734',
                                "conId": '1516671613374'*/
            },
            checkAuthority(){
                let _this = this;
                axios({
                    url: xhrUrl.authority,
                    method: "POST",
                    data:{
                        "conId": _this.conId,
                        'id':_this.conSubId
                    },
                    transformRequest: [data=>{
                        return "paramJson=" + JSON.stringify(data);
                    }],
                    headers: {
                        'X-Requested-With': 'XMLHttpRequest'
                    },
                    timeout: 30000
                }).then(res=>{
                    if(res&&res.data&&res.data.responseObject&&res.data.responseObject.responseData&&res.data.responseObject.responseData.data_list.length>0){
                        let menuList = res.data.responseObject.responseData.data_list[0].menu_data_list;
                        _this.saveConSubInfo(menuList[0]);
                        _this.saveAuthority(menuList[0]['authority']);
                    }else{

                    }
                });
            },
            launchLive(){
                let _this = this;
                _this.triggerLandScape().storeWindowSize().getAgenda().getLiveNum().saveLiveType(parseInt(_this.queryJson.back,10));//初始化横竖屏、存储当前屏幕的尺寸、获取日程数据、获取直播数，启动直播SDK
            }
        },
        mounted(){
          let _this = this;
            _this.saveQueryJson(comm.getpara());
        },
        watch:{
            authority(n){
              let _this = this;
              //let authority = parseInt(n,10);//真实权限
              let authority = 1;//测试权限
                switch (authority) {
                    case 1://所有
                        _this.launchLive();
                        break;
                    case 2: //登录
                        TempCache.setItem("fromPage", (document.referrer)?document.referrer:'/dist/conference/meeting_detail.html?conId='+comm.getpara().conId);
                        if(/live_list.html/.test(document.referrer)){
                            TempCache.setItem("caosreferrer",'1')
                        }
                        user.privExecute({
                            operateType: 'login',   //'login','auth','conference'
                            callback: function () {
                                _this.launchLive();
                            }
                        });
                        break;
                    case 3: //认证
                        if(/live_list.html/.test(document.referrer)){
                            TempCache.setItem("caosreferrer",'1')
                        }
                        TempCache.setItem("fromPage", (document.referrer)?document.referrer:'/dist/conference/meeting_detail.html?conId='+comm.getpara().conId);
                        user.privExecute({
                            operateType: 'auth',   //'login','auth','conference'
                            callback: function () {
                                _this.launchLive();
                            }
                        });
                        break;
                    case 4:
                        g_sps.jump(null,"/");
                        break; //CAOS缴费
                    //default:
                    //    window.location.href = "/";
                }
            },
            landscape(n){//监听横竖屏
                console.log(n);
            },
            conSubInfo(n){
              let _this = this;
                document.title=n.conSubName+ "-会议直播-唯医,allinmd";
                _this.shareInit();
                _this.callApp();
            },
            liveType(n){
                let _this = this;
                let liveThirdPartySdk = '';
                let liveId = _this.nothing(_this.queryJson.liveId);
                let recordId = _this.nothing(_this.queryJson.recordId);
                switch (parseInt(n,10)) {
                    case 0://直播
                        liveThirdPartySdk = thirdPartyLiveSdk.liveSdk;
                        break;
                    case 1://回播
                        liveThirdPartySdk = thirdPartyLiveSdk.liveBackSdk;
                        break;
                }
                AlLiveSdk.initThirdPartySdk(
                    {
                        liveScriptSrc:liveThirdPartySdk
                    }
                    );
                AlLiveSdk.startLive(
                    {
                        liveId: liveId,
                        recordId: recordId,
                        liveType: parseInt(n, 10),
                        userid: '970459C074E0BA4B',
                        roomid: '21BC9F94D6152A849C33DC5901307461',
                        viewername: '1477540724325_2',
                        viewertoken: '333333',
                        viewercustomua: 'web',
                        language: 'en',
                        forcibly: true,
                        fastMode: true,
                        successCallBack: function (type) {
                            //0无文档，1有文档
                            console.log('设置文档类型值' + type);
                            _this.saveDocumentType(type);
                            _this.changeLiveStatus(1);
                        }
                }
                );
            },
            queryJson(n){
                let _this = this;
                _this.conSubId = n.conSubId;
                _this.conId = n.conId;
                _this.saveConferenceId({
                    "conSubId": _this.conSubId,
                    "conId": _this.conId
                });
                _this.checkAuthority();
            }
        }
    };
</script>
<style lang="scss" rel="stylesheet/scss">
    @import "scss/pages/conference/conference";
</style>



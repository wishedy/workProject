/**
 * @name:
 * @desc:
 * @example:
 * @depend:
 * @date: 2017/10/25
 * @author: sunhaibin
 */


//根据组获得通讯通道
var channel = GS.createChannel();

$(function(){
    var ctrl = {
        init:function(){
            //this.callApp();
            this.backBtn();
            this.checkAuthority();
            this.reRender();
            this.slideTab();
            this.replyFn();//公聊，私聊
            //this.getConSub();//日程
            this.shareFn();
            this.orientationChange();
            var playBackId = comm.getpara().playBackId;
            Log.createBrowse(((playBackId != "" && playBackId != undefined)?26:24), ((playBackId != "" && playBackId != undefined)?"会议回放页面":"会议直播页面"));
        },
        callApp:function(obj){
            //直播域名  boradcastDomain
            //直播房间号 boradcastRoomNum
            //直播观看密码boradcastAuthcode
            //会议类型直播/回播 broadcastType 11 直播  12回播
            //conPlayAuthority 权限
            var playBackId = comm.getpara().playBackId;
            var conId = comm.getpara().conId;
            var conSubId = comm.getpara().conSubId;
            var index = playBackId?12:11;
            // var token = comm.getpara().token||"333333";
          var amChannel = comm.getpara()._amChannel;
          var callAppOptions = {
            ios: "allinmdios://app.allinmd.cn/applinks.html?scene=terminalPage&index="+index+"&boradcastDomain=weiyiwang.gensee.com&boradcastRoomNum="+obj.boradcastRoomNum+"&boradcastAuthcode=333333&broadcastType="+obj.broadcastType+"&conPlayAuthority="+obj.conPlayAuthority+"&conId="+conId+"&conSubId="+conSubId+"&conName="+obj.conName+(amChannel?"&_amChannel="+amChannel:''),
            android: "allin://com.allin.social:75235?data={scene:3,type:"+index+",boradcastDomain:'weiyiwang.gensee.com',boradcastRoomNum:"+obj.boradcastRoomNum+",boradcastAuthcode:333333,broadcastType:"+obj.broadcastType+",conPlayAuthority:"+obj.conPlayAuthority+",conId:"+conId+",conSubId:"+conSubId+",conName:'"+obj.conName+"'"+(amChannel?",_amChannel:"+amChannel:'')+"}",
            ios9: "http://app.allinmd.cn/applinks.html?scene=terminalPage&index="+index+"&boradcastDomain=weiyiwang.gensee.com&boradcastRoomNum="+obj.boradcastRoomNum+"&boradcastAuthcode=333333&broadcastType="+obj.broadcastType+"&conPlayAuthority="+obj.conPlayAuthority+"&conId="+conId+"&conSubId="+conSubId+"&conName="+obj.conName+(amChannel?"&_amChannel="+amChannel:''),
                runAtOnce: false,
                callback:function(){
                    $('iframe:eq(0)').height(0);
                   
                },
                reCallBack:function(){
					$('iframe:eq(0)').height('100%');
                }
            };
            comm.appWakeUp('btn',callAppOptions,{dom:$('.al-indexHeaderItem').eq(2)});
        },
        backBtn:function(){
            //var playBackId = comm.getpara().playBackId;
            $('.al-indexHeaderItem').eq(0).click(function(){
                //comm.creatEvent({
                //    triggerType:"会议"+playBackId?"回播":"直播",
                //    triggerName:"会议"+playBackId?"回播返回":"直播返回",
                //    keyword:'会议-返回',
                //    browType:"",
                //    actionId:""
                //});
                //if (document.referrer.lastIndexOf("/passport/") > -1 || !document.referrer) {
                //    window.location.href = "/";
                //} else {
                    history.back();
                //}
            });
        },
        showBrowserNum:function(){
            function getNum(flag){
                $.ajax({
                    url:"/mcall/conference/index/getLiveCount/",
                    dataType:"json",
                    type:"post",
                    data:{paramJson:$.toJSON({conSubId:comm.getpara().conSubId})},
                    success:function(res){
                        if(comm.hasResponseData(res)){
                            var count = res.responseObject.responseData.count;
                            if(count){
                                $('.liveCount').html(count).show();
                                if(flag){
                                    $('.tabs ul').width('80%');
                                }
                            }
                        }
                    }
                });
            }
            getNum(true);
            setInterval(function(){
                getNum();
            },60*1000);//1分钟刷新一次
        },
        orientationChange:function(){
            var t=this;
            var dpr = $('html').attr('data-dpr');
            var scrW = window.screen.width*dpr;
            var scrH = window.screen.height*dpr;
            function onlyShowVideo(reRender){
                if(checkOrient()=="landscape"){
                    $('.al-indexHeader,.section-bottom').hide();
                    $('#topHalf').width(scrH).height(scrW);
                    if($('.chatInput').hasClass('onChat')){
                        $('.chatInput').hide();
                    }
                }else{
                    $('.al-indexHeader,.section-bottom').show();
                    $('#topHalf').width(scrW);
                    if(reRender){
                        t.reRender();
                    }
                    if($('.chatInput').hasClass('onChat')){
                        $('.chatInput').show();
                    }
                }
            }
            onlyShowVideo();
            function checkOrient() {
                if (window.orientation == 0 || window.orientation == 180){
                    var screenOrientation = 'portrait';
                }
                else if (window.orientation == 90 || window.orientation == -90){
                    var screenOrientation = 'landscape';
                }
                return screenOrientation;
            }
            $(window).on('orientationchange',function(){
                $('.ev-chatInput').blur();
                setTimeout(function(){onlyShowVideo(true);},100);
            });
        },
        reRender:function(){
            //设置区块高度
            var dpr = $('html').attr('data-dpr');
            var winWidth = window.screen.width*dpr;
            //var winHeight = window.screen.height*dpr;
            //var winWidth = document.documentElement.clientWidth;
            var winHeight =document.documentElement.clientHeight;
            var headHeight = $('.al-indexHeader').height();
            var video_height = parseInt((9 * winWidth)/16);
            $("#topHalf").height(video_height);
            var tabsHeight=$('.tabs').height();
            $('#doc-box,.chat-bd').height(winHeight-video_height-tabsHeight-headHeight);
            $('.qa_list_content').height(winHeight-video_height-tabsHeight-headHeight-$('.chatInput').outerHeight());  // 30为底部input高度
            $('.chapter-list-container').height(winHeight-video_height-tabsHeight-headHeight-$('.chapter-hd').height());
        },
        checkAuthority:function(){
            var t = this;
            t.data={};
            var isLive = comm.getpara().playBackId?false:true;
            if (checkIsChina()) {         // 国内
                function authorityHandle(rs) {
                    var data = rs.responseObject.responseData.data_list[0].menu_data_list,
                        conSubId = comm.getpara().conSubId,
                        authority = 1;
                    $.each(data, function (i, el) {
                        if (el.id == conSubId) {
                            authority = parseInt(el.authority);
                            t.data.conSubRoom = el.conSubRoom;
                            t.data.conName = el.conName;
                            t.data.isOnline = el.isOnline;
                            t.data.authority = authority;
                            if(isLive){//直播加浏览人数
                                t.showBrowserNum();
                            }
                            return false;
                        }
                    });

                    switch (authority) {
                        case 1://所有
                            break;
                        case 2: //登录
                            TempCache.setItem("fromPageConference", window.location.href);
                            user.privExecute({
                                operateType: 'login',   //'login','auth','conference'
                                callback: function () {}
                            });
                            break;
                        case 3: //认证
                            TempCache.setItem("fromPageConference", window.location.href);
                            user.privExecute({
                                operateType: 'auth',   //'login','auth','conference'
                                callback: function () {}
                            });
                            break;
                        case 4:
                            g_sps.jump(null,"/");
                            break; //CAOS缴费
                        //default:
                        //    window.location.href = "/";
                    }

                }
                //请求权限
                var authorityURL = "/mcall/conference/index/getAllSubConferenceListV2/",
                    conId = comm.getpara().conId,
                    dataParams = {};
                dataParams.paramJson = $.toJSON({conId: conId});
                $.ajax({
                    url: authorityURL,
                    type: "POST",
                    data: dataParams,
                    dataType:"json",
                    success: function (res) {
                        authorityHandle(res);
                        t.generateLiveUrl();
                        t.getConSub();
                    }
                });

            } else {       // 国外
                t.generateLiveUrl();
            }
        },
        generateLiveUrl:function(){//加载直播/回播框架
            var t = this;
            var fullname="";
            var auth = TempCache.getItem('auth');
            if(auth){
                var authInfo = JSON.parse(auth);
                var truename = authInfo.fullname?authInfo.fullname:authInfo.lastName+authInfo.firstName;
                fullname =truename +'_'+TempCache.getItem('userId')+"_2_"+comm.getpara().conSubId;
            }else if(TempCache.getItem('userId')){
                fullname = "游客" +'_'+TempCache.getItem('userId')+"_2_"+comm.getpara().conSubId;
            }else{
                fullname = '游客_0_2_'+comm.getpara().conSubId;
            }
            var playBackId = comm.getpara().playBackId;

            var gsDom = '<gs:'+(playBackId?"video-vod":"video-live")+' id="videoComponent" class="gsVideo" site="weiyiwang.gensee.com" ctx="webcast" bgimg="" ownerid='+(playBackId?playBackId:comm.getpara().liveId)+' uname="'+fullname+'" authcode="'+comm.getpara().token+'" bar="true">';
            var gsDoc = '<gs:doc id="docComponent" ctx="webcast" site="weiyiwang.gensee.com" ownerid="'+(playBackId?playBackId:comm.getpara().liveId)+'" authcode="'+comm.getpara().token+'" bgcolor="#ffffff"/>';
            $(".video-box").append(gsDom);
            $("#doc-box").append(gsDoc);
            if(playBackId){
                GS.loadTag('video-vod', document.getElementsByTagName("gs:video-vod")[0]);
                $('.onqa,.qa-container').remove();

            }else{
                GS.loadTag('video-live', document.getElementsByTagName("gs:video-live")[0]);
            }
            GS.loadTag('doc', document.getElementsByTagName("gs:doc")[0]);
            var ua = navigator.userAgent.toLowerCase();
            var isISO11 = false;
            if(comm.isWeiXin()){//IOS 11系统 提示处理 [微信]
                if(ua.indexOf('iphone os 11')>-1){
                    isISO11 = true;
                }
            }else{//[safari]
                if((ua.indexOf('iphone')>-1&&ua.split('version/')[1]&&ua.split('version/')[1].substring(0,2)==11) ){
                    isISO11 = true;
                }
            }
            if(isISO11){
                $('#topHalf').append('<div class="blackScreenTip">若由于IOS 11系统的兼容问题，如观看中视频黑屏，请尝试刷新页面~</div>');
                setTimeout(function(){
                    $('.blackScreenTip').remove();
                },5000);
            }

        },

        shareFn:function(){
            var t = this;
            $.ajax({
                    type: 'post',
                    dataType: 'json',
                    data: {paramJson: $.toJSON({conId: comm.getpara().conId})},
                    url: '/mcall/conference/index/getConferenceSubList/',
                    success: function (data) {
                        if (data != null && data != undefined && data.responseObject && data.responseObject.responseStatus) {
                            result = data.responseObject;
                            var data = result.responseMessage;
                            var info = result.responseData;
                            var playBackId = comm.getpara().playBackId;
                            var liveId = comm.getpara().liveId;
                            var conSubId = comm.getpara().conSubId;
                            var sharePic,conTime,conPlace,desc,shareTitle;
                            var _shareTitle,_desc;
                            if(playBackId){//如果是回播
                                for (var i = 0; i < data.length; i++) {
                                    if(data[i].id==conSubId){
                                        document.title=data[i].conSubName+"-"+info.conName + "-回播-唯医,allinmd";
                                        sharePic = data[i].conSubWebUrl;
                                        desc = comm.getStrLen(data[i].conSubIntro,30);
                                        shareTitle = comm.getStrLen(data[i].conSubName,30);
                                        conTime = data[i].startTime && data[i].startTime.substring(0, 10);
                                        conPlace = data[i].conSubPlace;
                                        break;
                                    }
                                }
                                _shareTitle = '[' + shareTitle + ']-会议回顾-唯医,allinmd';
                                _desc = "免费在线观看会议，让医学不再有时空的限制";
                            }else{
                                for (var i = 0; i < data.length; i++) {
                                    if (data[i].id == conSubId) {
                                        document.title = data[i].conSubName + "-" + info.conName + "-直播-唯医,allinmd";
                                        sharePic = data[i].conSubWebUrl;
                                        desc = comm.getStrLen(data[i].conSubIntro,30);
                                        shareTitle = comm.getStrLen(data[i].conSubName,30);
                                        conTime = data[i].startTime && data[i].startTime.substring(0, 10);
                                        conPlace = data[i].conSubPlace;
                                        break;
                                    }
                                }
                                _shareTitle = '[' + shareTitle + ']-会议直播-唯医,allinmd';
                                _desc = "会议时间:" + conTime + "，会议地点:" + conPlace + (desc != "" ? "," + desc : ", 汇集海量手术视频、医学文献、病例讨论、会议回放资源。医生专业互动社区。");
                            }
                            if(comm.isWeiXin()){
                                shareAll({
                                    title:_shareTitle,
                                    desc:comm.getStrLen(_desc,50),
                                    pic:sharePic?sharePic:'http://m.allinmd.cn/image/allin_logo.png',
                                    fnMessageSuc: function () {
                                        comm.shareLog({shareSence: playBackId?26:24, shareChannel: 4,shareContent:_shareTitle});
                                    },
                                    fnTimelineSuc: function () {
                                        comm.shareLog({shareSence: playBackId?26:24, shareChannel: 5,shareContent:_shareTitle});
                                    }
                                },true);
                            }
                        }
                    }
                });


        },

        //tab滑动
        slideTab:function(){
            var contentNum = parseInt($(".slider-box").size());
            $(".slider-wrapper").width(contentNum * 100 + "%");
            $(".slider-box").css("width", (100 / contentNum) + "%");
            $(".display-box li").off('click').on("click", function () {
                if(!$(this).hasClass('on')){
                    var role = $(this).index();
                    $(this).addClass('on').siblings().removeClass('on');
                    $(".slider-wrapper").css({"transform":"translateX(-" + (100 / contentNum) * role + "%)"});
                    if(role==2){
                        $('.chatInput').show().addClass('onChat');
                    }else{
                        $('.chatInput').hide().removeClass('onChat');
                    }
                }
            });
        },
        //聊天
        replyFn:function(){

            $('.chatInput span').click(function(){
                var $input = $(this).siblings('input');
                if($input.val()==""){return false;}
                //公聊 、私聊
                channel.send('submitChat',{content:$input.val()});
                $('#chat-msg-list1').append(myChatDom({content:$input.val()})).scrollTo();
                $input.val("").attr({'placeholder':"说点什么一起互动"});
            });
            var param;
            var regRule = /\uD83C[\uDF00-\uDFFF]|\uD83D[\uDC00-\uDE4F]/g;

            var qaHeight = $('.qa_list_content').height();
            var topHalfHeight = $('#topHalfHeight').height();   //视频高度
            var tabsHeight = $('.tabs').height();
            var ua = navigator.userAgent.toLowerCase();
            var timer = null;
            $('.ev-chatInput').on('input',function(){
                /*
                 禁用表情 各端支持不好
                 */
                param = $(this).val();
                if(param.match(regRule)) {
                    param = param.replace(/\uD83C[\uDF00-\uDFFF]|\uD83D[\uDC00-\uDE4F]/g, "");
                    $(this).val(param);
                }
            }).on('focus',function(){//输入时视频置顶
                if(/iphone/.test(ua)){
                    timer = setTimeout(function(){
                        $('body').css({
                            position:'relative',
                            height:$(window).height()+"px"
                        });
                        $('.chatInput').css({
                            position:'absolute',
                            bottom:'0.2rem'
                        });
                    },200);
                }

            }).on('blur',function(){
                if(/iphone/.test(ua)){
                    clearTimeout(timer);
                    $('body').css({
                        position:'',
                        height:''
                    });
                    $('.chatInput').css({
                        position:'fixed',
                        bottom:0
                    });
                }
            });


        },
        getConSub: function () {
            var t = this;
            var isPlayBack = false;
            if(comm.getpara().playBackId){
                isPlayBack =true;
            }
            var date = new Date();
            var month = date.getMonth()+1;
            var day = date.getDate();
            var todayStr = date.getFullYear()+"-"+(month<10?"0"+month:month)+'-'+(day<10?'0'+day:day);
            $.ajax({
                url: M_CALL + 'conference/index/getAgendaVideoList/',
                type: "post",
                data: {
                    paramJson: $.toJSON({
                        "pageIndex": 1, "pageSize": 100, "conSubId": comm.getpara().conSubId, "conId": comm.getpara().conId
                    })
                },
                success: function (opt) {
                    if(comm.hasResponseData(opt)){
                        var conName = opt.responseObject.responseData.conName;
                        t.callApp({
                            boradcastRoomNum:t.data.conSubRoom,
                            broadcastType:t.data.isOnline,
                            conPlayAuthority:t.data.authority,
                            conName:encodeURIComponent(conName)
                        });
                    }
                    if (comm.hasResponseMessage(opt)) {
                        var scheduleList = t.pretreatmentData(opt.responseObject.responseMessage);
                        var innerHtml = '';
                        var videoUrl = 'javascript:;';
                        var noVideoShow = "noVideoShow";
                        var outData ="";
                        $.each(scheduleList, function (ind, q) {
                            var dateList = '';
                            $.each(q, function (i, w) {
                                videoUrl = 'javascript:;';
                                noVideoShow = "noVideoShow";
                                if (w.videoUrl) {
                                    videoUrl = "/html/m/" + w.videoUrl;
                                    noVideoShow = "";
                                }
                                var dateTime = w.startTime.substring(w.startTime.indexOf(' '), w.startTime.length).substring(0, 6);
                                if(isPlayBack){//回播展示全部
                                    dateList += '<div class="scheduleCont">' +
                                        '<div class="scheduleTime">' + dateTime + '</div>' +
                                        '<div class="scheduleTitle" data-url=' + videoUrl + '>' +
                                        '<p class="gray">' + ($.isEmptyObject(w.conName) ? "&nbsp;" : w.conName) + '</p>' +
                                        '<p>主讲人：' + w.lecturer + '</p>' +
                                        '</div>' +
                                        '</div>';
                                }else{////直播展示当天的
                                    if(todayStr == ind){
                                        dateList += '<div class="scheduleCont">' +
                                            '<div class="scheduleTime">' + dateTime + '</div>' +
                                            '<div class="scheduleTitle" data-url=' + videoUrl + '>' +
                                            '<p class="gray">' + ($.isEmptyObject(w.conName) ? "&nbsp;" : w.conName) + '</p>' +
                                            '<p>主讲人：' + w.lecturer + '</p>' +
                                            '</div>' +
                                            '</div>';
                                    }
                                }

                            });
                            outData += dateList;
                                if(isPlayBack){
                                    innerHtml += '<aside class="scheduleList">' +
                                        '<div class="listLi">' +
                                        '<div class="scheduleContDate">' +
                                        '<div class="scheduleTime"></div>' +
                                        '<div class="scheduleTitle">' + ind + '</div>' +
                                        '</div>' +
                                        dateList +
                                        '</div>' +
                                        '</aside>';
                                }else if(ind == todayStr){
                                    innerHtml += '<aside class="scheduleList">' +
                                        '<div class="listLi">' +
                                        '<div class="scheduleContDate">' +
                                        '<div class="scheduleTime"></div>' +
                                        '<div class="scheduleTitle">' + ind + '</div>' +
                                        '</div>' +
                                        dateList +
                                        '</div>' +
                                        '</aside>';
                                }

                        });
                        if(!outData){
                            $('.ev-agenda').append('<div class="noMeetingPlan">暂无相关日程</div>');
                        }else{
                            $('.ev-agenda').append(innerHtml);
                        }

                    } else {
                        $('.ev-agenda').append('<div class="noMeetingPlan">暂无相关日程</div>');
                    }

                },
                error: function () {
                }
            });
        },
        /*分会数据预处理   只显示当天的*/
        pretreatmentData: function (data) {
            var returnData = {};
            var changeTimeStyle = function (time) {
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
        }
    };
    ctrl.init();


ctrl.defaultPlayTime=0;
function chatDom(data){//公聊
    var cId = data.sender.split('_')[1]?data.sender.split('_')[1].split('_')[0]:0;//用户id
    var isSelf = false;
    if(cId==TempCache.getItem('userId')){
        isSelf = true;
    }
    return '<li>' +
            '<div class="msg-info"><i class="headPng"></i>' +
                '<span class="ev_sender" sId="'+data.senderId+'" uId="'+data.senderUid+'" cId="'+cId+'">'+
        (isSelf?'我':((data.sender.split('_')[0]=="visitor"||data.sender.split('_')[0]=="游客")?"游客":comm.getStrLen(data.sender.split('_')[0],30)))+       //游客显示全称，用户显示名字
                '</span>' +
            '</div>' +
            '<div class="msg-content">'+data.richtext||data.content+'</div></li>';
}
function systemDom(data){//主播消息
    var cId = data.sender.split('_')[1]?data.sender.split('_')[1].split('_')[0]:0;//用户id
    return '<li class="">' +
        '<div class="msg-info"><i class="hostHeadPng"></i>' +
        '<span class="ev_sender" sId="'+data.senderId+'" uId="'+data.senderUid+'" cId="'+cId+'">'+
        "主播&nbsp;"+comm.getStrLen(data.sender.split('_')[0],30)+
        '</span>' +
        '</div>' +
        '<div class="msg-content">'+data.richtext||data.content+'</div></li>';
}
function getPriDom(data){//私聊
    return '<li><div class="msg-info"><i class="hostHeadPng"></i>' +
            '<span sId="'+data.senderId+'" class="ev_sender">'+
                ((data.sender.split('_')[0]=="visitor"||data.sender.split('_')[0]=="游客")?"游客":comm.getStrLen(data.sender.split('_')[0],30))+'</span><span>'+" 对 我 说"+
            '</span></div>' +
            '<div class="msg-content">'+data.richtext||data.content+'</div></li>';
}
function myChatDom(data){//我对他人的回复
    return '<li><div class="msg-info"><i class="headPng"></i>' +
            '<span sId="0" class="ev_sender">我&nbsp;'+'</span><span>'+(data.uName?('对 '+data.uName+' 说'):"")+
            '</span>' +
        '</div><div class="msg-content">'+data.content+'</div></li>';
}
function forbidTalk(str){
    return '<li class="sysContent">' +
        '<div class="msg-info">' +
        '<span>系统消息</span>' +
        '<div class="msg-content">'+str+'</div>'+
        '</div>' +
        '</li>';
}
channel.bind('onPublicChat',function(e){
    if((e.data.senderRole.indexOf('1')>-1&&e.data.senderRole.indexOf('16')==-1)||e.data.senderRole.indexOf('2')>-1||e.data.senderRole.indexOf('4')>-1){
        $('#chat-msg-list1').append(systemDom(e.data)).scrollTo();
    }else{
        $('#chat-msg-list1').append(chatDom(e.data)).scrollTo();
    }
    $('.msg-content').children().css('fontSize','auto');
});
channel.bind('onPriChat',function(e){
    $('#chat-msg-list1').append(getPriDom(e.data)).scrollTo();
    $('.msg-content').children().css('fontSize','auto');
});

channel.bind('onMessage',function(e){//系统消息
    if($('#chat-msg-list1 .msg-content:last').text()!=e.data.content){
        $('#chat-msg-list1').append(forbidTalk(e.data.content)).scrollTo();
    }
});
channel.bind('onKickOut',function(){
    popup('您被踢出房间');
    setTimeout(function(){
        history.back();
    },3000);
});
channel.bind("onSetting", function (evt) {   //功能配置更改通知
    var setting = evt.data;
    if (setting.option == "userlist") {

    } else if (setting.option == "onlineuser") {
        if(setting.enable){
            $(".liveCount").show();
        }else{
            $(".liveCount").hide();
        }
    } else if (setting.option == "chat" ) {
        if(setting.target=="all"){
            if (setting.enable) {
                channel.send("onMessage", {content: '现在允许聊天'});
                $('.chatInput input').attr({placeHolder:"说点什么一起互动"}).removeAttr('readonly');
                if($('#chat-msg-list1 .msg-content:last').text()!="现在允许聊天"){//防止连续多次出现此消息
                    $('#chat-msg-list1').append(forbidTalk('现在允许聊天')).scrollTo();
                }
            } else {
                channel.send("onMessage", {content: '现在禁止聊天'});
                $('.chatInput input').attr({placeHolder:"现在禁止聊天",readonly:true});
                $('#chat-msg-list1').append(forbidTalk("现在禁止聊天")).scrollTo();
            }
        }else if(setting.target=='self'){
            if (setting.enable) {
                channel.send("onMessage", {content: '现在允许聊天'});
                $('.chatInput input').attr({placeHolder:"说点什么一起互动"}).removeAttr('readonly');

            } else {
                channel.send("onMessage", {content: '现在禁止聊天'});
                $('.chatInput input').attr({placeHolder:"现在禁止聊天",readonly:true});

            }
        }

    }
});
});
$.fn.scrollTo = function(){//滚动到底部
    return this.each(function(){
        var self = $(this);
        var parent = self.parent();	//chat-list
        var height = self.outerHeight();//ev_chatBox
        parent.scrollTop(height);
    });
};
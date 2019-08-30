/*
* create By ZhangHeng on 2018/1/11
*/
$(document).ready(function(){
    var ccLive = {
        el: {
            sendBtn: $("#send-btn"),
            msgInput: $(".ev-chatInput"),
            msgList: $("#chat-msg-list1"),
            onLineNum:$(".liveCount")
        },
        init:function(){
            var t = this;
            //初始化直播信息
            DWLive.init({
                userid: t.data.userid,
                roomid: t.data.roomid,
                viewername: 'live-demo',
                viewertoken: 'nothing',
                viewercustomua: 'web-pc'
            });
            //初始化tab栏
            t.backBtn().checkAuthority().reRender().shareFn().orientationChange().slideTab().sendMsg().receiveMsg().onlineNum();
            function logInit(){
                var playBackId = comm.getpara().playBackId;
                Log.createBrowse(((playBackId != "" && playBackId != undefined)?26:24), ((playBackId != "" && playBackId != undefined)?"会议回放页面":"会议直播页面"));
            }
            logInit();
        },
        data:{
            userid: '0438CD3A0AB20794',
            roomid: 'C837DF69777B32DC9C33DC5901307461',
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
            return t;
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
            return t;
        },
        reRender:function(){
            //设置区块高度
            var t = this;
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
            return t;
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
                        //t.generateLiveUrl();
                        t.getConSub();
                    }
                });

            } else {       // 国外
                //t.generateLiveUrl();
            }
            return t;
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
        /*分会数据预处理   只显示当天的*/
        pretreatmentData: function (data) {
            var returnData = {};
            var changeTimeStyle = function (time) {
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
        backBtn:function(){
          var t = this;
            $('.al-indexHeaderItem').eq(0).click(function(){
                history.back();
            });
          return t;
        },
        onlineNum:function(){
            var t = this;
            DWLive.onUserCountMessage = function(data){
                console.log(data);
                t.el.onLineNum.html(data).show();
            };
            return t;
        },
        analysisMsg:function(msg){
            var str = '';
            var lastResult = '';
            if((msg.indexOf("[")>-1)&&(msg.indexOf("]")>-1)){
                str = msg.replace(/\[/g,'[]').replace(/\[\]/g,'&').replace(/\]/g,'[]').replace(/\[\]/g,'&');
                var dataList = str.split('&');
                for(var num = 0;num<dataList.length;num++){
                    var item = dataList[num];
                    if(item.length){
                        if((item.indexOf("gif")>-1)||(item.indexOf("png")>-1)||(item.indexOf("jpg")>-1)||(item.indexOf("jpeg")>-1)){
                            lastResult+='<img src="'+item+'"/>';
                        }else{
                            lastResult+=item;
                        }
                    }
                }
            }else{
                lastResult = msg;
            }
            return lastResult;
        },
        templateMsgItem: function (msg) {
            var t = this;
            var userid = msg.userid;
            var username = msg.username;
            var msgContent = msg.msg;
            var time = msg.time;
            return '<li><div class="msg-info"><i class="headPng"></i><span sid="0" class="ev_sender">'+((DWLive.viewerid===userid)?"(我)":username)+'&nbsp;说:</span><span></span></div><div class="msg-content">'+t.analysisMsg(msgContent)+'</div></li>';
        },
        receiveMsg:function(){
            var t = this;
            var msgAppend = function(m){
                // console.log(m);
                var data = JSON.parse(m);
                // console.log(data)
                t.el.msgList.append(t.templateMsgItem(data));
            };
            DWLive.onPublicChatMessage = function(msg){
                //三端可以相互接收消息，web端目前可以是表情和文本，app是文本，
                msgAppend(msg);
                t.el.msgInput.val("").attr({'placeholder':"说点什么一起互动"});//将输入栏清空
            };
            var privateAccept = function(msg){
                //接受所有私聊消息
                msg = JSON.parse(msg);
                var nowData = {
                    userid:msg.fromuserid,
                    username:msg.fromusername,
                    msg:msg.msg,
                    time:msg.time
                };
                msgAppend(JSON.stringify(nowData));
            };
            DWLive.onPrivateAnswer = function(msg){
                privateAccept(msg);
            };
            DWLive.onPrivateChatMessage = function(msg){
                // console.log(msg);
                privateAccept(msg);
            };
            return t;
        },
        sendMsg:function(){
          var t = this;
          t.el.sendBtn.off("click").on("click",function(){
              var msg = t.el.msgInput.val();
              if(msg.length){
                  //公聊
                  DWLive.sendPublicChatMsg(msg);
              }
          });
          return t;
        },
        slideTab:function(){
            var t = this;
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
            return t;
        }

    }
    ccLive.init();
});
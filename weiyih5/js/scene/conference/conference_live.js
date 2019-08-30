/*
* create By ZhangHeng on 2018/1/11
*/
$(document).ready(function(){
    var liveUserId = comm.getpara().userId||'0438CD3A0AB20794';
    var ccLive = {
        el: {
            sendBtn: $("#send-btn"),
            msgInput: $(".ev-chatInput"),
            msgList: $("#chat-msg-list1"),
            onLineNum:$(".liveCount")
        },
        getAuthInfo: function() {
            var t = this;
            var state = null;
            $.ajax({
                url: "/mcall/customer/auth/getCustomerAuth/",
                type: "get",
                async: false,
                dataType: "json",
                success: function(data) {
                    if(data&&data.responseObject&&data.responseObject.responseMessage){
                        var dataInfo = data.responseObject.responseMessage;
                        var trueName = (dataInfo.fullName&&(dataInfo.fullName).length)?dataInfo.fullName:dataInfo.lastName+dataInfo.firstName;
                        if(trueName.length){
                            TempCache.setItem("trueName",trueName);
                        }

                    }
                }
            });
            return state;
        },
        init:function(){
            var t = this;
            //初始化直播信息
            t.getAuthInfo();
            t.checkAuthority(function(){
                setTimeout(function(){
                    if(t.data.backOnOff){
                        g_sps.createBrowse({pageId:429});
                    }else{
                        g_sps.createBrowse({pageId:430});
                    }
                },2200);
                //Log.createBrowse(((t.data.backOnOff)?26:24), ((t.data.backOnOff)?"会议回放页面":"会议直播页面"));
                t.elementInIt();
                var container = $(".video-container");
                if(t.data.backOnOff){
                    t.backLiveInIt();
                }else{
                    t.liveInit();
                }
                container.show();
                clearInterval(timer);
                var timer = setInterval(function(){

                    if(container .find("video").length===1){
                        clearInterval(timer);
                        container.removeClass('video-container-ready').show();
                        $(".al-play-back").hide();
                        /*var myVideo=md=document.getElementsByTagName("video")[0];
                        myVideo.addEventListener('play',function(){
                            console.log("播放");
                        });*/
                    }
                },100);
            });


        },
        notice:function(msg){
            var time = '';
            var d = new Date();
            var my_hours=d.getHours();
            var my_minutes=d.getMinutes();
            var my_seconds=d.getSeconds();
            time = my_hours+":"+my_minutes+":"+my_seconds;
            return '<li class="msg-item msg-system">\n' +
                '                                <div class="msg-item-inner">\n' +
                '                                    <p class="msg-icon"></p>\n' +
                '                                    <p class="msg-sys-content">'+msg+'</p>\n' +
                '                                </div>\n' +
                '                            </li>'
        },
        elementInIt:function(){
            var t = this;
            var docBox = $("#doc-box");
            var videoBox = $(".video-box");
            if(t.data.backOnOff){
                $("#playbackPanel").remove();
                $("#playbackPlayer").remove();
                docBox.append('<div id="playbackPanel"></div>');
                videoBox.append('<div id="playbackPlayer"></div>');
            }else{
                $("#drawPanel").remove();
                $("#livePlayer").remove();
                docBox.append('<div id="drawPanel"></div>');
                videoBox.append('<div id="livePlayer"></div>');
            }

        },
        backLiveInIt:function(){
            var t = this;
            $('html').css({'background':'#F1F4F9'})
            $(".al-play-back").show();
            var backConfig = {
                userId: t.data.userid,
                roomId: t.data.roomid,
                liveId: t.data.liveId,
                viewername: t.getUserId(TempCache.getItem("userId"))+'_2',
                viewertoken: t.data.token,
                recordId: t.data.recordid
            };
            $.DW.config(backConfig);
            $('.playBackTitleWrap').find('.smallTitle').addClass('playBackTitle');
            t.checkDocument();
            $('.display-box').addClass('display-box-back');
            //初始化tab栏
            $(".ev-chatInput").attr({"disabled":"disabled"});
            t.backBtn().reRender().shareFn().orientationChange().slideTab().sendMsg().receiveMsg();
            function logInit(){
                var playBackId = comm.getpara().back;
                Log.createBrowse(((playBackId != "" && playBackId != undefined)?26:24), ((playBackId != "" && playBackId != undefined)?"会议回放页面":"会议直播页面"));
            }
            $(".onqa,.liveCount,.slider-box:last").remove();
            logInit();
        },
        getUserId:function(userId){
            var timestamp = Date.parse(new Date());

            if(((typeof  userId)==="string")&&(userId.length===0) ){
                userId = 'Y'+timestamp;
            }
            if(((userId == null)||(userId == "null")||(typeof userId == "null")||(userId == "undefined")||(typeof userId == "undefined"))){
                userId = 'Y'+timestamp;
            }
            return userId;
        },
        checkDocument:function(opt){
            var t = this;
            console.log('进入');
            var activeAgenda = function(){
                $('.tabs.border-box .on').removeClass('on');
                $('.ondoc,.document-container').remove();
                $('.display-box .hide').removeClass('hide');
                $(".onchat").addClass("on");
                if($('.border-box li').length===0){
                    $('.border-box').remove();
                    $('.slider-container').hide();
                    $(".playBackNothing").remove();
                    $('.section-bottom').append(
                        '<div class="playBackNothing">'+
                        '            <section class="logo"></section>'+
                        '</div>'
                    );
                }
            };
            console.log(t.data.backOnOff)
            if(t.data.backOnOff){
                window.on_cc_callback_pages = function(data){
                    console.log(data);
                    if((data.length===0)){
                        activeAgenda();
                    }else{
                        $(".ondoc").show();
                        $('.display-box .hide').removeClass('hide');
                    }
                }
            }else{
                if(opt&&opt.template&&((parseInt(opt.template.type,10)===4)||(parseInt(opt.template.type,10)===5))){
                    $(".ondoc").show();
                    $('.display-box .hide').removeClass('hide');
                    /*setTimeout(function(){
                        DWLive.getDocs(function(a,b){
                            console.log(a);
                            if(a.datas.docs.length===0){
                                activeAgenda();
                            }else{
                                $(".ondoc").show();
                                $('.display-box .hide').removeClass('hide');
                            }
                        });
                    },1000);*/
                }else{
                    activeAgenda();
                }
            }

        },
        checkInvalid(val){//检查一个字符串是否有效
            if(((typeof val =='string')&&(val.length==0))||(val==undefined)||(val=='undefined')||(val=='null')||(typeof val=='undefined')||(typeof val=='null')||(val==null)){
                return true;
            }else{
                return false;
            }
        },
        GetQueryString(name)
        {
            var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
            var r = window.location.search.substr(1).match(reg);
            if (r != null) return decodeURI(r[2]); return null;
        },
        liveInit:function(){
            var t = this;
            DWLive.init({
                userid: t.data.userid,
                roomid: t.data.roomid,
                viewername:t.getUserId(TempCache.getItem("userId"))+'_2',
                viewertoken: t.data.token,
                viewercustomua: 'web',
                language: 'en',
                forcibly: true,
                fastMode:true
            });
            DWLive.onLoginSuccess = function(opt){
                console.log(opt);
                t.checkDocument(opt);
            };
            if(TempCache.getItem("liveReload")){
                $("#video-box").addClass('video-container-ready').addClass('video-container-end').removeClass('video-container-start');
                localStorage.removeItem("liveReload");
            }
            if(TempCache.getItem("appAwake")){
                window.location.reload();
                localStorage.removeItem("appAwake");
            }
            var conTitle =  t.GetQueryString('title');
            if(!t.checkInvalid(conTitle)){
                var titleResult = comm.getStrLen(conTitle,10);
                $(".al-indexHeader .al-indexHeaderItem span").text(titleResult);
                document.title = titleResult+"-会议直播-唯医,allinmd";
            }
            function notice(msg){
                $(".chat-nothing").remove();
                $(".chatRecordNone").removeClass("chatRecordNone");
                t.el.msgList.append(t.notice(msg));
                t.el.msgInput.val("").attr({'placeholder':"想说什么 ,想问什么快来加入聊天"});//将输入栏清空
                $(".qa_list_content").animate({scrollTop: '1000000px'}, 400);
                $(".chat-msg-list1").animate({scrollTop: '1000000px'}, 400);
            }
            DWLive.onAnnouncementShow = function (j) {
                notice(j);

            };
            // 修改公告,发布公告
            DWLive.onAnnouncementRelease = function (j) {
                notice(j);
            };

            // 删除公告
            DWLive.onAnnouncementRemove = function (j) {
                $(".al-single-notice").remove();
            };
            //初始化tab栏
            t.backBtn().reRender().shareFn().orientationChange().slideTab().sendMsg().receiveMsg().onlineNum();
            function logInit(){
                var playBackId = comm.getpara().back;
                Log.createBrowse(((playBackId != "" && playBackId != undefined)?26:24), ((playBackId != "" && playBackId != undefined)?"会议回放页面":"会议直播页面"));
            }
            logInit();
        },
        data:{
            recordid:comm.getpara().recordId,
            liveId:comm.getpara().liveId,
            backOnOff: parseInt(comm.getpara().back, 10) === 1,
            userid: liveUserId,
            roomid: comm.getpara().roomId,
            conId: comm.getpara().conId,
            authority:parseInt(comm.getpara().authority,10),
            conSubId: comm.getpara().conSubId,
            ownerid: comm.getpara().ownerId,
            token:comm.getpara().token||333333,
            canvasHas:false,
            regionEmotion:"//img50.allinmd.cn/v3/conference/ccEmotion/",
        },
        shareFn:function(){
            var t = this;
            $.ajax({
                type: 'post',
                dataType: 'json',
                data: {paramJson: $.toJSON({pageIndex: 1, pageSize: 200,conId: comm.getpara().conId})},
                url: '/mcall/conference/index/getConferenceSubList/',
                success: function (data) {
                    var subConName = '';
                    if (data != null && data != undefined && data.responseObject && data.responseObject.responseStatus) {
                        result = data.responseObject;
                        var data = result.responseMessage;
                        var info = result.responseData;
                        var playBackId = comm.getpara().back;
                        var liveId = comm.getpara().liveId;
                        var conSubId = comm.getpara().conSubId;
                        var sharePic,conTime,conPlace,desc,shareTitle;
                        var _shareTitle,_desc;
                        if(parseInt(playBackId,10)!==0){//如果是回播
                            for (var i = 0; i < data.length; i++) {
                                if(data[i].id==conSubId){
                                    if(t.data.backOnOff){
                                        $('.playBackTitle').html('回播：'+data[i].conSubName).css({"display":"block",'textAlign':"left"});
                                        document.title=data[i].conSubName+"-"+info.conName + "-会议回播-唯医,allinmd";
                                        subConName = data[i].conSubName;
                                    }else{
                                        document.title=data[i].conSubName+"-"+info.conName + "-会议直播-唯医,allinmd";
                                        subConName = data[i].conSubName;

                                    }

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
                                    if(t.data.backOnOff){
                                        document.title=data[i].conSubName+"-"+info.conName + "-会议回播-唯医,allinmd";
                                        subConName = data[i].conSubName;
                                    }else{
                                        document.title=data[i].conSubName+"-"+info.conName + "-会议直播-唯医,allinmd";
                                        subConName = data[i].conSubName;

                                    }
                                    //document.title = data[i].conSubName + "-" + info.conName + "-直播-唯医,allinmd";
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
                        t.callApp({
                            boradcastRoomNum:t.data.conSubRoom,
                            broadcastType:t.data.isOnline,
                            conPlayAuthority:t.data.authority,
                            conName:encodeURIComponent(subConName)
                        });
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
            var chatHeight = $(".qa_list_content").height();
            $("#topHalf").height(video_height);
            var tabsHeight=$('.tabs').height();
            var titleHeight=$('.playBackTitle').height();
            $('#doc-box,.chat-bd').height(winHeight-video_height-tabsHeight-headHeight-titleHeight);
            $('.slider-container').height(winHeight-video_height-tabsHeight-headHeight-titleHeight);
            $('.playBackNothing').height(winHeight-video_height-tabsHeight-headHeight-titleHeight);
            $('.qa_list_content,.chat-nothing').height(chatHeight>(winHeight-video_height-tabsHeight-headHeight-$('.chatInput').outerHeight())?chatHeight:(winHeight-video_height-tabsHeight-headHeight-$('.chatInput').outerHeight()));  // 30为底部input高度
            $('.chapter-list-container').height(winHeight-video_height-tabsHeight-headHeight-$('.chapter-hd').height());
            return t;
        },
        checkAuthority:function(callBack){
            var t = this;
            var isLive = !t.data.backOnOff;

            if (checkIsChina()) {         // 国内
                function authorityHandle(rs) {
                    if(rs&&rs.responseObject&&rs.responseObject.responseData&&rs.responseObject.responseData.data_list){
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

                    }


                }
                //请求权限
                var authorityURL = "/mcall/conference/index/getAllSubConferenceListV2/",
                    conId = comm.getpara().conId,
                    dataParams = {};
                switch (t.data.authority) {
                    case 1://所有
                        callBack&&callBack();
                        break;
                    case 2: //登录
                        TempCache.setItem("fromPage", (document.referrer)?document.referrer:'/dist/conference/meeting_detail.html?conId='+comm.getpara().conId);
                        if(/live_list.html/.test(document.referrer)){
                            TempCache.setItem("caosreferrer",'1')
                        }
                        user.privExecute({
                            operateType: 'login',   //'login','auth','conference'
                            callback: function () {
                                callBack&&callBack();
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
                                callBack&&callBack();
                            }
                        });
                        break;
                    case 4:
                        g_sps.jump(null,"/");
                        break; //CAOS缴费
                    //default:
                    //    window.location.href = "/";
                }
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
            var cc = ccLive;
            var playBackId = comm.getpara().back;
            var conId = comm.getpara().conId;
            var conSubId = comm.getpara().conSubId;
            var index = (parseInt(playBackId,10)===0)?11:12;
            var token = comm.getpara().token||"333333";
            var amChannel = comm.getpara()._amChannel;

            function nothing(str){
                var username = str;
                if(((username == "null")||(typeof username == "null")||(username == "undefined")||(typeof username == "undefined"))){
                    return '0'
                }else{
                    return str
                }
            }
            var appendUrl = '&liveUid='+nothing(cc.data.userid)+'&liveRoomId='+nothing(cc.data.roomid)+'&liveId='+nothing(cc.data.liveId)+'&liveRecordId='+nothing(cc.data.recordid)+'&livePassword='+nothing(token);
            var appendData  = ',liveUid:'+nothing(cc.data.userid)+',liveRoomId:'+nothing(cc.data.roomid)+',liveId:'+nothing(cc.data.liveId)+',liveRecordId='+nothing(cc.data.recordid)+',livePassword:'+nothing(token);
            var callAppOptions = {
                ios: "allinmdios://app.allinmd.cn/applinks.html?scene=terminalPage&index="+index+"&boradcastDomain=weiyiwang.gensee.com&boradcastRoomNum="+obj.boradcastRoomNum+"&boradcastAuthcode=333333&broadcastType="+obj.broadcastType+"&conPlayAuthority="+obj.conPlayAuthority+"&conId="+conId+"&conSubId="+conSubId+"&conName="+obj.conName+(amChannel?"&_amChannel="+amChannel:'')+appendUrl,
                android: "allin://com.allin.social:75235?data={scene:3,type:"+index+",boradcastDomain:'weiyiwang.gensee.com',boradcastRoomNum:"+obj.boradcastRoomNum+",boradcastAuthcode:333333,broadcastType:"+obj.broadcastType+",conPlayAuthority:"+obj.conPlayAuthority+",conId:"+conId+",conSubId:"+conSubId+",conName:'"+obj.conName+"'"+(amChannel?",_amChannel:"+amChannel:'')+appendData+"}",
                ios9: "http://app.allinmd.cn/applinks.html?scene=terminalPage&index="+index+"&boradcastDomain=weiyiwang.gensee.com&boradcastRoomNum="+obj.boradcastRoomNum+"&boradcastAuthcode=333333&broadcastType="+obj.broadcastType+"&conPlayAuthority="+obj.conPlayAuthority+"&conId="+conId+"&conSubId="+conSubId+"&conName="+obj.conName+(amChannel?"&_amChannel="+amChannel:'')+appendUrl,
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
            comm.appWakeUp('btn',callAppOptions,{dom:$('.al-indexHeaderItem').eq(2)});
            $(".al-appWakeUpBtn").on("touchstart",function(){
                TempCache.setItem("appAwake",1);
            });
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
            if(comm.getpara().back){
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
                    }
                    if (comm.hasResponseMessage(opt)) {
                        var scheduleList = t.pretreatmentData(opt.responseObject.responseMessage);
                        var innerHtml = '';
                        var videoUrl = 'javascript:;';
                        var noVideoShow = "noVideoShow";
                        var outData ="";
                        var smallDataStr = '';
                        var sumNum = 0;
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
                            sumNum++;

                            var dateListItem = ind.split('-');

                            smallDataStr+='<li class="list-item">'+parseInt(dateListItem[1],10)+'月'+parseInt(dateListItem[2],10)+'日'+'</li>';


                        });
                        if(!outData){
                            $('.ev-agenda').append('<div class="noMeetingPlan">暂无相关日程</div>');
                            $(".agenda-remove").remove();
                        }else{
                            $('.ev-agenda').append(innerHtml);
                        }
                        if(sumNum>1){
                            $(".list-info").html(smallDataStr);
                            $('.small-agenda-list').show();
                        }
                        var scrollTopBox = [];
                        var scrollHeight = 0;
                        $(".scheduleList").each(function(i){
                            scrollHeight+=$(this).outerHeight()+10;
                            scrollTopBox.push(scrollHeight);
                        });
                        scrollTopBox.unshift(0);
                        $(".list-item").each(function(i){
                            $(this).off("touchstart click").on("touchstart click",function(){
                                $(".chat-bd").animate({scrollTop:scrollTopBox[i]},500)
                            });
                        });
                    } else {
                        $('.ev-agenda').append('<div class="noMeetingPlan">暂无相关日程</div>');
                        $(".agenda-remove").remove();
                        $('.small-agenda-list').hide();
                    }
                    $(".display-box .hide").removeClass('hide');

                },
                error: function () {
                }
            });
        },
        backBtn:function(){
            var t = this;
            $('.al-indexHeaderItem').eq(0).click(function(){
                if(document.referrer){
                    history.back();
                }else {
                    g_sps.jump(null,'/');
                }
            });
            return t;
        },
        onlineNum:function(){
            var t = this;
            t.el.onLineNum.show();
            /* DWLive.onUserCountMessage = function(data){
                 if(parseInt(data,10)){
                     t.el.onLineNum.html(data).show();
                 }else{
                     t.el.onLineNum("");
                 }

             };*/
            return t;
        },
        analysisMsg: function (msg) {
            //解析接收到的消息
            var t = ccLive;
            var str = '';
            var lastResult = '';
            // console.log(msg,t.data);

            if ((msg.indexOf("[") > -1) && (msg.indexOf("]") > -1)) {
                str = msg.replace(/\[/g, '[]').replace(/\[\]/g, '&').replace(/\]/g, '[]').replace(/\[\]/g, '&');
                var dataList = str.split('&');
                for (var num = 0; num < dataList.length; num++) {
                    var item = dataList[num];
                    if (item.length) {
                        if ((item.indexOf("em") > -1) || (item.indexOf("em2") > -1) ) {
                            var imgNum = item.split("_")[1];
                            imgNum = (parseInt(imgNum,10)<10)?'0'+parseInt(imgNum,10):imgNum;
                            if((item.indexOf("em2") > -1) ){
                                lastResult += '<img src="' + t.data.regionEmotion+imgNum+".png" + '"/>';

                            }else{
                                lastResult += '<img src="' + t.data.regionEmotion+imgNum+".gif" + '"/>';
                            }

                        } else {
                            lastResult += item;
                        }
                    }
                }
            } else {
                lastResult = msg;
            }
            return lastResult;
        },
        templateMsgItem: function (msg) {
            //渲染本条消息数据
            var t = this;
            var produceContent = function(arr){
                var  str = '';
                if(arr.length>1){
                    for(var num = 0;num<arr.length;num++){
                        if(num!=0){
                            str+=arr[num];
                        }
                    }
                    return str;
                }else{
                    return arr[0];
                }

            };
            var nameDes = function(username){
                if(((typeof  username)==="string")&&(username.length===0) ){
                    username = '游客';
                }
                if(((username == null)||(username == "null")||(typeof username == "null")||(username == "undefined")||(typeof username == "undefined"))){
                    username = '游客';
                }
                return username;
            };
            var username = nameDes(TempCache.getItem("trueName"));
            var allMsg = msg.msg.split(":");
            var msgContent = produceContent(allMsg);
            var time = msg.time;
            var timeClass = (time.length) ? "" : "hide";
            var itemClassName = '';
            var talkOrder = false;
            var orderStr = '';
            var teacherName = '';
            var talkerName = '';
            var to = '';
            switch (msg.msgType){
                case 0://我说的
                    itemClassName = 'al-single-me';
                    talkerName = username+'(我)';
                    break;
                case 1://别人说的
                    itemClassName = 'al-single-other';
                    talkerName = nameDes(allMsg[0]);
                    break;
                case 2://讲师说的
                    itemClassName = 'al-single-teacher';
                    talkerName = nameDes(msg.username)+'(主讲)';
                    break;
                case 5://讲师说的
                    itemClassName = 'al-single-teacher';
                    talkerName = nameDes(msg.username)+'(嘉宾)';
                    break;
                case 3://我对讲师说的
                    to = '对';
                    itemClassName = 'al-single-talk';
                    talkerName = username+'(我)';
                    teacherName = nameDes(msg.tousername)+'(主讲)';
                    break;
                case 4://讲师对我说的
                    to = '对';
                    itemClassName = 'al-single-talk';
                    teacherName = username+'(我)';
                    talkerName = nameDes(msg.fromusername)+'(主讲)';
                    talkOrder = true;
                    break;
            }
            return '<li class="msg-item '+itemClassName+'"><div class="msg-user"><em class="msg-time-tip '+timeClass+'">'+msg.time+'</em>'+talkerName+to+teacherName+'&nbsp;说：</div>' +
                '                                <div class="msg-content">'+t.analysisMsg(msgContent)+'</div>\n' +
                '                            </li>';

        },
        receiveMsg:function(){
            var t = this;

            var msgAppend = function(m){
                // console.log(m);
                var data = JSON.parse(m);
                // console.log(data)
                $(".chat-nothing").remove();
                $(".chatRecordNone").removeClass("chatRecordNone");
                t.el.msgList.append(t.templateMsgItem(data));
                t.el.msgInput.val("").attr({'placeholder':"想说什么 ,想问什么快来加入聊天"});//将输入栏清空
                $(".qa_list_content").animate({scrollTop: '1000000px'}, 400);
                $(".chat-msg-list1").animate({scrollTop: '1000000px'}, 400);
            };
            if (t.data.backOnOff) {
                window.on_cc_live_chat_msg_sync = function (msg) {
                    for (var num = 0; num < msg.length; num++) {
                        var item = msg[num];
                        if(item.userRole=='publisher'||item.userrole==='host'){
                            item.msgType = 2;
                        }else if(item.userRole==='teacher'){
                            item.msgType = 5;
                        }else{
                            if(item.userId==talkUserId){
                                item.msgType = 0;
                            }else{
                                item.msgType = 1;
                            }
                        }

                        msgAppend(JSON.stringify(item));
                    }

                };
                window.on_cc_live_qa_question = function (msg) {
                    for (var num = 0; num < msg.length; num++) {
                        var item = msg[num];
                        item.msg = item.content;
                        item.msgType = 3;
                        msgAppend(JSON.stringify(item));
                    }
                };
                window.on_cc_live_qa_answer = function(msg){
                    for (var num = 0; num < msg.length; num++) {
                        var item = msg[num];
                        item.msg = item.content;
                        item.msgType = 4;
                        msgAppend(JSON.stringify(item));
                    }
                }
            }else{
                var container = $(".video-container");
                var  talkUserId =TempCache.getItem("userId");
                DWLive.onPublicChatMessage = function (msg) {
                    //三端可以相互接收消息，web端目前可以是表情和文本，app是文本，
                    var resourceMsg = JSON.parse(msg);
                    if(resourceMsg.userrole==='publisher'||resourceMsg.userrole==='host'){
                        resourceMsg.msgType = 2;
                    }else if(resourceMsg.userrole==='teacher'){
                        resourceMsg.msgType = 5;
                    }else{
                        if(resourceMsg.userid==talkUserId){
                            resourceMsg.msgType = 0;
                        }else{
                            resourceMsg.msgType = 1;
                        }
                    }
                    var msgContent = JSON.stringify(resourceMsg);
                    msgAppend(msgContent);

                };

                DWLive.onPrivateAnswer = function (msg) {
                    var resourceMsg = JSON.parse(msg);
                    resourceMsg.msgType = 4;
                    var msgContent = JSON.stringify(resourceMsg);
                    msgAppend(msgContent);
                };
                DWLive.onPrivateChatMessage = function (msg) {
                    var resourceMsg = JSON.parse(msg);
                    resourceMsg.msgType = 3;
                    var msgContent = JSON.stringify(resourceMsg);
                    msgAppend(msgContent);
                };
                DWLive.onLiveEnd = function(){
                    container.addClass('video-container-ready').addClass('video-container-end').removeClass('video-container-start');
                };
                DWLive.onKickOut = function(){
                    alert("您被踢出");
                }
                DWLive.onLiveStart = function(){
                    $("#livePlayer").hide();
                    setTimeout(function(){
                        container.removeClass('video-container-ready').removeClass('video-container-end').addClass('video-container-start');
                        TempCache.setItem("liveReload",1);
                        window.location.reload();
                    },4000)
                    // window.location.reload();
                };
            }
            return t;
        },
        sendMsg:function(){
            var t = this;
            t.el.sendBtn.off("click").on("click",function(){
                var msg = t.el.msgInput.val();
                if(msg.length){
                    //公聊
                    //alert(TempCache.getItem("trueName")+"这是缓存取得");
                    var username = TempCache.getItem("trueName");
                    if(((username===null)||(username == "null")||(typeof username == "null")||(username == "undefined")||(typeof username == "undefined"))){
                        username = '游客';
                    }
                    var lastMsg  = username+":"+msg;
                    if(msg.length>260){
                        popup('聊天不能超过260个字符！');
                        return false;
                    }else{
                        DWLive.sendPublicChatMsg(lastMsg);
                    }

                    $(".qa_list_content").animate({scrollTop: '1000000px'}, 400);
                    $(".chat-msg-list1").animate({scrollTop: '1000000px'}, 400);
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
                    var chatTab = $(this).find('span').text()==='聊天互动';
                    $(this).addClass('on').siblings().removeClass('on');
                    $(".slider-wrapper").css({"transform":"translateX(-" + (100 / contentNum) * role + "%)"});
                    if(chatTab){
                        $('.chatInput').show().addClass('onChat');
                    }else{
                        $('.chatInput').hide().removeClass('onChat');
                    }
                }
            });
            return t;
        }

    };
    ccLive.init();
});
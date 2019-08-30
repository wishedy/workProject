/**
 * Created by ALLIN on 2016/11/15.
 */
FastClick.attach(document.body);
var param = medCommon.getparaNew();
var originalHeight = 422;
//Log.createBrowse(151,'UGC直播终端-直播中');
var chatPage={
    default:{
        userName:"",
        initData:null
    },
    oriHeight:0,
    platTime:0,
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
                    var trueName = ((dataInfo.fullName)&&(dataInfo.fullName).length)?dataInfo.fullName:dataInfo.lastName+dataInfo.firstName;
                    if(trueName.length){
                        TempCache.setItem("trueName",trueName);
                    }

                }
            }
        });
        return state;
    },
    landscapeOri:-1,//1代表竖屏，0代表横屏
    initLandOnOff:false,
    init:function(){
        var t=this;
        t.getAuthInfo();
        if(TempCache.getItem("UGCreload")){
            $("#livePlayer").css({"background-image":"url('//img50.allinmd.cn/live/live_ended.png')","background-size":"cover","background-repeat":"no-repeat",'background-position':"center 50%"});
        }else{
            $("#livePlayer").css({"background-image":"url('//img50.allinmd.cn/live/live_start.png')","background-size":"cover","background-repeat":"no-repeat",'background-position':"center 50%"});
        }
        t.landscapeOri = (t.checkOrient()=="landscape")?0:1;
        //console.log(t.landscapeOri);
        t.tabAction();
        t.resize();
        //t.authInit();
        t.getCustomerName();
        t.leaveUpdate();
        t.orientationChange();
        originalHeight = window.screen.height*dpr - $(".al-livingWatcherMsg").height();
        if(t.landscapeOri===1){
            $('.al-livingVideoBox').css({"height":'5.62667rem'});
        }else{
            $('.al-livingVideoBox').width($(window).width()).height($(window).height());
        }

    },
    authInit:function(){
      var t = this;
        if(!user.isRenZhengStatus){
            comm.confirmAuthBox({
                ensureCallback:function(){
                    TempCache.setItem('fromPage',location.href);
                    comm.redirect("/pages/passport/auth/auth.html?isFollow=1", 0);
                },
                cancelCallback:function(){
                    $(".authPopup").remove();
                }
            });
        }
    },
    tabAction:function(){
        $('.ev-chatNav').click(function(){
            $(this).addClass('active').siblings().removeClass('active');
            $('.al-livingWatcherContent').hide().eq(0).show();
        });
        $('.ev-infoNav').click(function(){
            $(this).addClass('active').siblings().removeClass('active');
            $('.al-livingWatcherContent').hide().eq(1).show();
        });
    },
    resize:function(){
        var t = this;
        //消息层 = 全屏 - 视频; 对话 = 消息 - 导航; 对话box = 对话 - input
        var inputHeight = $('.al-commentInputBar').height();
        $('.al-livingWatcherMsg').height($(window).height()-$('.al-livingVideoBox').height());
        t.reRender();
        $('.ev_info').height($('.al-livingWatcherMsg').height()-$('.al-livingWatcherChangeBar').height());
    },
    getCustomerName:function(){
        var t=this;
        var cid = TempCache.getItem('userId');
        var name="";
        if(cid){
            $.ajax({
                url:M_CALL+"customer/unite/getMapById/",
                data:{paramJson:$.toJSON({customerId:cid,logoUseFlag:4})},
                type:'post',
                dataType:"json",
                success:function(res){
                    if(res&&res.responseObject&&res.responseObject.responseData&&!$.isEmptyObject(res.responseObject.responseData)){
                        var ca = res.responseObject.responseData.data_list[0].customer_auth;
                        var bi = res.responseObject.responseData.data_list[0].customer_baseinfo;
                        name = (ca.lastName+ca.firstName||bi.nickname)+"_"+ca.customerId+"_2"+"_"+comm.getpara().liveId;
                        t.default.userName =name;
                        t.getData();
                    }else{

                        name='vistor_0_2_'+comm.getpara().liveId;
                        t.default.userName =name;
                        t.getData();
                    }
                    t.checkCustomerSpeak();
                },
                error:function(){
                    name='vistor_0_2_'+comm.getpara().liveId;
                    t.default.userName =name;
                    t.getData();
                }
            })
        }else{
            user.privExecute({
                operateType: 'login',
                callback: function () {

                },
                noNeedBack:true
            });
        }

    },
    checkCustomerSpeak:function(){
        var t=this;
        var cid = TempCache.getItem('userId');
        $.ajax({
            url:M_CALL+'broadcast/audience/getMapById/',
            data:{paramJson:$.toJSON({
                sessionCustomerId:cid,
                liveId:comm.getpara().liveId,
                refCustomerId:cid,
                siteId:2
            })},
            dataType:"json",
            type:'post',
            success:function(d){
                if(d&&d.responseObject&&d.responseObject.responseData&&d.responseObject.responseData.data_list&&d.responseObject.responseData.data_list.length){
                    if(d.responseObject.responseData.data_list[0].isSpeak==1){
                        t.forbidSpeak =true;
                    }
                }
            }
        });
    },
    createWatcher:function(){
        var t=this;
        $.ajax({
            url:M_CALL+'broadcast/audience/create/',
            data:{paramJson:$.toJSON({
                sessionCustomerId:TempCache.getItem('userId'),
                refUserId: t.senderId,
                liveId:comm.getpara().liveId,
                liveUserRole:1,
                state:1,
                siteId:2
            })},
            dataType:"json",
            type:'post',
            success:function(){

            }
        });
    },
    reRender:function(){
        //设置区块高度
        var t = this;
        var dpr = $('html').attr('data-dpr');
        var winWidth = window.screen.width*dpr;
        var winHeight =document.documentElement.clientHeight;
        var video_height = parseInt((9 * winWidth)/16);
        $("#topHalf").height(video_height);
        var tabsHeight=$('.al-livingWatcherChangeBar').height();
        var chatBox= $(".al-livingWatcherContent");
        var lastHeight = chatBox.height();
        //chatBox.css({'height':'8.55rem'});
        $('#chat-list').height(winHeight-video_height-tabsHeight-$('.al-commentInputBar').outerHeight());  // 30为底部input高度
        $('.ev_info').height(winHeight-video_height-tabsHeight);
        //$('.chapter-list-container').height(winHeight-video_height-tabsHeight-headHeight-$('.chapter-hd').height());
        return t;
    },
    leaveUpdate:function(){
        $(window).bind('beforeunload',function (evt) {
            $.ajax({
                url:M_CALL+'broadcast/audience/update/',
                data:{paramJson:$.toJSON({
                    sessionCustomerId:TempCache.getItem('userId'),
                    liveId:comm.getpara().liveId,
                    liveUserRole:1,
                    state:1,
                    siteId:2,
                    isValid:0
                })},
                async:false,
                dataType:"json",
                type:'post',
                success:function(d){

                }
            });
        });

    },
    getData:function(){
        var t=this;
        var cid=TempCache.getItem('userId');
       $.ajax({
            url: M_CALL+"broadcast/home/getMapById/",
            type: "get",
            dataType:"json",
            data: {
                paramJson: $.toJSON({
                    visitSiteId: 2,
                    liveId: param.liveId,
                    sessionCustomerId:cid?cid:""
                })
            },
            success: function (data) {
                if (data && data.responseObject && data.responseObject.responseData && data.responseObject.responseData.data_list && data.responseObject.responseData.data_list[0]) {
                    t.dataProcessing(data.responseObject.responseData.data_list[0]);
                    t.sendMessage();
                }
            }
        });
    },
    initLandscape:function(){
      var t = this;
        if(!t.initLandOnOff){
            //t.initLandOnOff = true;
            if(t.landscapeOri===1){
                //console.log('来源是竖屏');
                setTimeout(function(){
                    $(".al-livingWatcherMsg").height($(window).height()-$("#livePlayer").height());
                    $(".ev_info").height($(".al-livingWatcherMsg").height()-$(".al-livingWatcherChangeBar").height())
                },300)
            }else{
                //console.log('来源是横屏');
            }
        }
    },
    orientationChange:function(){
        var t=this;
        var dpr = $('html').attr('data-dpr');
        var scrW = window.screen.width*dpr;
        var scrH = window.screen.height*dpr;
        function onlyShowVideo(reRender){
            if(t.checkOrient()=="landscape"){//横屏
                $('.al-livingWatcherMsg').hide();
                $('#livePlayer').width(scrH).height(scrW);
                if($('.ev_chat').hasClass('onChat')){
                    $('.ev_chat').hide();
                }
            }else{
                $('.al-livingWatcherMsg').show();
                $('#livePlayer').width($(window).width()).css({"height":'5.62667rem'});
                if(reRender){
                    setTimeout(function(){
                      t.reRender();
                    },300);
                }
                if($('.ev_chat').hasClass('onChat')){
                    $('.ev_chat').show();
                }
                //t.initLandscape();
            }
        }
        onlyShowVideo();

        $(window).on('orientationchange',function(event){
            $('.ev_chat').blur();
            /*window.orientation = window.orientation?window.orientation:(window.orientation = event.orientation|screen.orientation.angle);//等于0|180、90|-90度来判断横竖屏*/

            setTimeout(function(){onlyShowVideo(true);},100);
        });
        return t;
    },
    checkOrient: function () {
        if (window.orientation == 0 || window.orientation == 180) {//竖屏
            var screenOrientation = 'portrait';
        }
        else if (window.orientation == 90 || window.orientation == -90) {//横屏
            var screenOrientation = 'landscape';
        }
        return screenOrientation;
    },
    toWK:function(x){
        if (isNaN(parseInt(x))) return 0;

        if (parseInt(x) < 10000 && parseInt(x) > 999) {
            return Math.floor(parseInt(x) / 1000) + "K+";
        } else if (parseInt(x) > 9999) {
            return Math.floor(parseInt(x) / 10000) + "万+";
        } else {
            return x;
        }
    },
    //数据处理
    dataProcessing:function(data,name){
        var t=this;
        document.title = data.liveTitle+"- 在线直播,唯医,allinmd";
        var _name = t.default.userName;
        //console.log(data);
        t.default.initData = {
            userid: '0438CD3A0AB20794',
              roomid: data.liveNum,
             // roomid: '916751E393529C829C33DC5901307461',
            viewername:t.getUserId(TempCache.getItem("userId"))+'_2',
            viewertoken: '333333',
            viewercustomua: 'h5',
            forcibly: true
        };
        DWLive.init(t.default.initData);
        t.shareAction(resetNavWidth);
        //发送默认系统消息
        setTimeout(function(){
            DWLive.sendPublicChatMsg('✿欢迎'+(TempCache.getItem('trueName')?TempCache.getItem('trueName'):"游客")+'来到直播间');
        },3000);
        var videoTimer = null;
        videoTimer = setInterval(function(){
            if($("video").length>0){
                t.videoError();
                clearInterval(videoTimer);
            }
        },500);

        DWLive.onLiveEnd = function(){
            $('.ev_videoDefaultBg').show();
            t.onLiveStop();
        };
        DWLive.onKickOut = function(){

        };
        DWLive.onLiveStart = function(){
            $("#livePlayer").hide();
            setTimeout(function(){
                //TempCache.setItem("UGCLiveReload",1);
                //t.onLivePlay();
                //window.location.reload();
                if(t.platTime!==0){
                    t.startLiveAgain();
                }
                //window.location.href=window.location.href;
            },1000)

        };
        DWLive.onUserCountMessage = function(data){
            var numObj = $('.ev-countNav');
            if(parseInt(data,10)){
                numObj.find('#ev_countNo').html(data);
                numObj.show();
                resetNavWidth();
            }else{
                numObj.hide();
                resetNavWidth();
                numObj.find('#ev_countNo').html("")
            }

        };

        t.chatInit();
        var type='';
        switch(parseInt(data.liveType)){//直播类型(1-手术直播，2-学术会议，3-产品推荐，4-器械操作，5-手术解说，6-病例讨论)
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
        }
        //主播信息

        var authHtml =  '<header class="al-livingPersonalMsg">'+
            '<figure class="al-livingPersonalImg">'+
            '<a href="/pages/personal/others_contribution.html?cid='+data.authInfo.authCustomerId+'">'+
            '<img src="'+data.authInfo.logoUrl+'" alt="">'+
            '</a>'+
            '</figure>'+
            '<figcaption>'+
            '<h3><a href="/pages/personal/others_contribution.html?cid='+data.authInfo.authCustomerId+'">'+data.authInfo.authName+'</a><i class="al-vipUser"></i></h3>'+
            '<p><span class="job">'+data.authInfo.authTitleName+'</span><span class="hospital">'+data.authInfo.authCompany+'</span></p>'+
            //'<button class="btn-switch"></button>'+
            '</figcaption>'+
            '</header>'+
            '<article class="al-livingBaseMsg">'+
            '<h3>'+data.liveTitle+'</h3>'+
            '<p><span class="type">'+type+'</span><em class="point"></em><span class="hot">人气<i>'+t.toWK(data.followNum)+'</i></span></p>'+
            '</article>'+
            '<section class="al-livingNoticeContent">'+
            (data.liveNotice!=""?('<header class="al-livingNoticeTips"><i class="icon-livingNoticeIcon"></i><span>直播公告</span></header>'+
            '<article class="al-livingNoticeText">'+data.liveNotice+'</article>'):"")+
            '</section>';
        $(".ev_info").html(authHtml);
        t.callApp();
        if(data.state==3){
            $('.ev_videoDefaultBg').show();
        }
        function resetNavWidth(){
            var len = $('.al-livingWatcherChangeBar a:visible').length;
            var widt = 0;
            if(len==2){
                widt='50%';
            }else if(len==4){
                widt='25%';
            }else{
                widt='33.3333%';
            }
            $('.al-livingWatcherChangeBar a').width(widt);
        }
    },
    startLiveAgain:function(){
      var t = this;
        t.setLivePlayerBg(true);
        $("video").hide().remove();
        DWLive.init(t.default.initData);
        //$('.ev_chatBox').html('');
        var state = (t.checkOrient()=="landscape")?0:1;
        if(state===1){
            $('.al-livingVideoBox').css({"height":'5.62667rem'}).show();
            $(".al-livingWatcherMsg").height($(window).height()-$('.al-livingVideoBox').height());
        }else{
            $('.al-livingVideoBox').show();
        }
        var videoTimer = null;
        videoTimer = setInterval(function(){
            if($("video").length>0){
                t.videoError();
                clearInterval(videoTimer);
            }
        },500);
    },
    videoError:function(){
        var t = this;
        var myVid=document.getElementsByTagName("video")[0];
        myVid.addEventListener("loadeddata", function()
            {
                $("#livePlayer").css({"background-image":"none"});
            }
        );
        myVid.addEventListener("stalled", function()
            {
                //这个事件浏览器可以监听到
                //alert("可以监听到的视频加载失败1");
                //TempCache.setItem("UGCreload",1);
                //window.location.reload(false);
            }
        );
        myVid.addEventListener("error", function()
            {
                //alert("可以监听到的视频加载失败2");
                TempCache.setItem("UGCreload",1);
                window.location.reload(false);
            }
        );
        myVid.addEventListener('seeked',function(){
           console.log("浏览器停止请求数据")
        });
        //console.log(myVid)
    },
    onLivePlay:function(){
      var t = this;
        $('.ev_videoDefaultBg').hide();
        t.setLivePlayerBg(false);
        $("video").show();
        $('.al-livingVideoBox').height($(window).height()*0.5);
        chatPage.resize();
        if(!user.isRenZhengStatus){
            setTimeout(function(){
                user.privExecute({
                    operateType: 'auth',
                    callback: function () {

                    }
                });
            },60000);
        }
        //alert("开始");
        clearTimeout(t.chatTimer);
        t.chatTimer = null;
        return t;
    },
    setLivePlayerBg:function(onOff){
        var t = this;
        if(onOff){
            $("#livePlayer").css({"background-image":"url('//img50.allinmd.cn/live/live_ended.png')","background-size":"cover","background-repeat":"no-repeat",'background-position':"center 50%"});
        }else{
            $("#livePlayer").css({"background-image":"","background-size":"cover","background-repeat":"no-repeat",'background-position':"center 50%"});
        }
    },
    chatTimer:null,
    onLiveStop:function(){
      var t = this;
      t.platTime++;
        t.setLivePlayerBg(true);
        $("video").hide();
        function resetNavWidth(){
            var len = $('.al-livingWatcherChangeBar a:visible').length;
            var widt = 0;
            if(len==2){
                widt='50%';
            }else if(len==4){
                widt='25%';
            }else{
                widt='33.3333%';
            }
            $('.al-livingWatcherChangeBar a').width(widt);
        }
        $('.ev-shareNav').hide();
        resetNavWidth();
        //$('.al-livingVideoBox').height($('.al-livingVideoBox').attr('preH'));
        //chatPage.resize();
       // alert("停止");

        t.chatTimer = setTimeout(function(){
            $('.ev_chat').attr('readonly','readonly');
        },30*60*1000);
        //$('.ev_videoDefaultBg').attr('src','//img50.allinmd.cn/live/live_ended.png').show();
        //$('.ev_chat').attr('readonly','readonly');
      return t;
    },
    shareAction:function(fn){
      var t=this;
        $.ajax({
            url:M_CALL+'comm/data/share/getMapList3/',
            data:{
                paramJson:$.toJSON({
                    resourceId:comm.getpara().liveId,
                    resourceType:51,
                    sessionCustomerId:TempCache.getItem('userId')||'',
                    sceneType:24,//23-ugc直播（主播分享）（正在直播）,24-ugc直播（观众分享）（正在直播）,25-ugc直播（主播分享）（预约）,26-ugc直播（观众分享）（预约）
                    visitSiteId:2
                })
            },
            dataType:"json",
            type:"post",
            success:function(d){
                if(d&&d.responseObject&&d.responseObject.responseData&&!$.isEmptyObject(d.responseObject.responseData)){
                    if(d.responseObject.responseData.data_list.length){
                        var res = d.responseObject.responseData.data_list[0];
                        $('.ev-shareNav').show();
                        var sinaTitle,qqTitle,qzoneTitle,timeLineTitle,wxTitle,wxDesc,summary;
                        $.each(res.share_channel,function(i,el){
                            if(el.shareChannel=='Sina'){
                                sinaTitle=el.shareDesc;
                            }else if(el.shareChannel=="QQFriend"){
                                qqTitle = el.shareTitle;
                                summary =el.shareDesc;
                            }else if(el.shareChannel=="QZone"){
                                qzoneTitle=el.shareTitle;
                            }else if(el.shareChannel=="WechatTimeline"){
                                timeLineTitle = el.shareTitle;
                            }else if(el.shareChannel=="WechatFriend"){
                                wxTitle=el.shareTitle;
                                wxDesc = el.shareDesc;
                            }
                        });

                        shareAll({
                            title: document.title,
                            url: window.location.href,
                            pic: res.share_comm.shareImageUrl,
                            summary: summary, //qzone描述
                            sinaTitle: sinaTitle,
                            sinaDesc: sinaTitle,
                            qzoneTitle: qzoneTitle,
                            qqTitle: qqTitle,
                            wxTitle: wxTitle, //微信分享标题
                            wxDesc: wxDesc, //微信分享描述
                            timeLineTitle: timeLineTitle,
                            qShareLog:function(x){    //分享新浪，空间成功与否都执行
                                comm.shareLog({
                                    shareType: "",
                                    resourceId: param.liveId,
                                    resourceType:"",
                                    refId: param.liveId,
                                    shareSence: 67,
                                    shareChannel: x=='sina'?3:1,
                                    shareContent: x=='sina'?sinaTitle:qzoneTitle,
                                    refCustomerId: TempCache.getItem('userId')||0
                                });
                            },
                            fnMessageSuc:function(obj){
                                comm.shareLog({
                                    shareType: "",
                                    resourceId:param.liveId ,
                                    resourceType: "",
                                    refId: param.liveId,
                                    shareSence:67,
                                    shareChannel:4,
                                    shareContent:obj.wxTitle?obj.wxTitle:obj.title,
                                    refCustomerId: TempCache.getItem('userId')||0
                                });
                            },      //分享好友成功回调
                            fnTimelineSuc:function(obj){
                                comm.shareLog({
                                    shareType: "",
                                    resourceId:param.liveId ,
                                    resourceType: "",
                                    refId: param.liveId,
                                    refUrl:obj.url,
                                    shareSence:67,
                                    shareChannel:5,
                                    shareContent:obj.timeLineTitle?obj.timeLineTitle:obj.title,
                                    refCustomerId: TempCache.getItem('userId')||0
                                });
                            }
                        },false,$('.ev-shareNav'));
                        fn&&fn();
                    }
                }
            }
        });
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
    templateMsgItem:function(msg){
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
        var roleStr= '';
        switch (msg.msgType){
            case 0://我说的
                itemClassName = 'al-single-me';
                talkerName = nameDes(allMsg[0]);
                break;
            case 1://别人说的
                itemClassName = 'al-single-other';
                talkerName = nameDes(allMsg[0]);
                break;
            case 2://讲师说的
                itemClassName = 'al-single-teacher';
                talkerName = nameDes(allMsg[0])+'';
                roleStr = '<i class="icon-livingMaster"></i>';
                break;
            case 3://我对讲师说的
                to = '对';
                itemClassName = 'al-single-talk';
                talkerName = username+'(我)';
                teacherName = nameDes(msg.tousername)+'';
                break;
            case 4://讲师对我说的
                to = '对';
                itemClassName = 'al-single-talk';
                teacherName = username+'(我)';
                talkerName = nameDes(msg.fromusername)+'';
                talkOrder = true;
                break;
            case 5://讲师说的
                itemClassName = 'al-single-teacher';
                talkerName = nameDes(msg.username)+'(嘉宾)';
        }
        return '<article class="al-livingWatcherContentItem">'+roleStr+
            '   <a href="javascript:;" class="al-livingUser">'+talkerName+to+teacherName+':</a>'+
            '<span class="al-livingComment" style="word-break:break-all;">'+t.analysisMsg(msgContent)+'</span>'+
            '</article>';

    },
    analysisMsg: function (msg) {
        //解析接收到的消息
        var t = this;
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
    nowMsg:{},
    checkUpdate:function(obj){
      var t = this;
      var same = false;
        if($.isEmptyObject(t.nowMsg)){
            t.nowMsg = obj
        }else{
            for(var key in obj ){
                if(t.nowMsg[key]&&t.nowMsg[key]){
                    if(t.nowMsg[key]!==obj[key]){
                        t.nowMsg = obj;
                        same = true;
                    }
                }

            }
        }
        return same;
    },
    chatInit:function(){
        var t = this;
        var msgAppend = function(m){
            // console.log(m);
            var data = JSON.parse(m);
            // console.log(data)
            $('.ev_chatBox').append(t.templateMsgItem(data));
            $(".al-livingWatcherContent").animate({scrollTop: '1000000px'}, 400);
        };
        var  talkUserId =TempCache.getItem("userId");
        DWLive.onPublicChatMessage = function (msg) {
            //三端可以相互接收消息，web端目前可以是表情和文本，app是文本，
            var resourceMsg = JSON.parse(msg);

            var same = t.checkUpdate(resourceMsg)
            //console.log(t.nowMsg,resourceMsg,same)
            if(!same){
                $(".al-livingWatcherContentItem:last").remove();
            }
            if(resourceMsg.time&&resourceMsg.time.length&&resourceMsg.msg.indexOf("✿")>-1) {//系统消息
                var arrStr = resourceMsg.msg.split("欢迎")[1];
                var name = arrStr.split("来到")[0];

                var userIn='<article class="al-livingWatcherContentItem">'+
                    '  <i class="icon-systemMark"></i>'+
                    '<span class="al-livingComment">欢迎<a href="javascript:;" class="welcomeUser">'+name+'</a>来到直播间</span>'+
                    '</article>';
                $(".al-livingWatcherContent").animate({scrollTop: '1000000px'}, 400);
                $(".ev_chatBox").append(userIn);
                /*$(".ev_chatBox").scrollTo({
                    fn: function () {

                    }
                });//发送后，内容滚至底部*/
                t.senderId=resourceMsg.userid;
                t.createWatcher();//创建直播观众
            }else{
                if(resourceMsg.msg.indexOf("✿")>-1){
                    return ;
                }else{
                    if(resourceMsg.userrole==='publisher'){
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
                }
            }


        };

        DWLive.onPrivateAnswer = function (msg) {
            var resourceMsg = JSON.parse(msg);
            var same = t.checkUpdate(resourceMsg);
            if(!same){
                $(".al-livingWatcherContentItem:last").remove();
            }
            resourceMsg.msgType = 4;
            var msgContent = JSON.stringify(resourceMsg);
            msgAppend(msgContent);
        };
        DWLive.onPrivateChatMessage = function (msg) {
            var resourceMsg = JSON.parse(msg);
            var same = t.checkUpdate(resourceMsg);
            if(!same){
                $(".al-livingWatcherContentItem:last").remove();
            }
            resourceMsg.msgType = 3;
            var msgContent = JSON.stringify(resourceMsg);
            msgAppend(msgContent);
        };
    },
    sendMessage:function(){
        var t=this;
        var name = t.default.userName.split('_')[0];
        var channel=channel||GS.createChannel();
        var val="";
        if(parseInt(TempCache.getItem("customerRole"))===3){

            $('.ev_chat').attr('readonly','readonly').off("click").on("click",function(){
                popup("你没有此操作权限");
            });
        }else{
            $('.ev_chat').removeAttr('readonly');//attr('readonly','readonly');
        }
        if(user.isRenZhengStatus==true){
            $('.ev_chat').on('keyup',function(e){
                val  = $(this).val();
                if(val!=""){
                    if(e.which==13){
                        var username = TempCache.getItem("trueName");
                        if(((username===null)||(username == "null")||(typeof username == "null")||(username == "undefined")||(typeof username == "undefined"))){
                            username = '游客';
                        }
                        if(((typeof  username)==="string")&&(username.length===0) ){
                            username = '游客';
                        }
                        var lastMsg  = username+":"+val;
                        if(val.length>260){
                            popup('聊天不能超过260个字符！');
                            return false;
                        }else{
                            DWLive.sendPublicChatMsg(lastMsg);
                            var sChatMsgEle ='<article class="al-livingWatcherContentItem">'+
                                '   <a href="javascript:;" class="al-livingUser">'+name.split('_')[0]+':</a>'+
                                '<span class="al-livingComment" style="word-break:break-all;">'+val+'</span>'+
                                '</article>';
                           /* $('.ev_chatBox').scrollTo({
                                fn:function(){
                                    //$('.ev_chatBox').append(sChatMsgEle);
                                }
                            });*/
                            $(this).val("").blur();
                        }

                    }
                }
            });
        }else{
            $('.ev_chat').attr('readonly','readonly').off("click").on("click",function(){
                if(parseInt(TempCache.getItem("customerRole"))===3){
                    popup("你没有此操作权限");
                }
                comm.confirmAuthBox({
                    ensureCallback:function(){
                        TempCache.setItem('fromPage',location.href);
                        comm.redirect("/pages/passport/auth/auth.html?isFollow=1", 0);
                    },
                    cancelCallback:function(){
                        $(".authPopup").remove();
                    }
                });
            });
        }


    },
    callApp:function(){
        $('.btn-switch').on("click", function() {
            comm.appWakeUp('confirm',{})
        });
    }
};

var cid =TempCache.getItem('userId');
if(cid){
    chatPage.init();
}else{
    user.privExecute({
        operateType: 'login',
        callback: function () {

        }
    });
}
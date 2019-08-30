/**
 * 功能描述：  观看直播
 * 使用方法:
 * 注意事件：
 * 引入来源：  作用：
 *
 * Created by LiChunHui on 2016/11/26.
 */
$(function(){
    function iframeHide(callback) {
        $("iframe").css("visibility", "visible");
        callback();
    }
    function iframeShow() {
        setTimeout(function() {
            $("iframe").css("visibility", "visible")
        }, 800)
    }
    //var channel = channel||GS.createChannel();
    var liveWatch={};
    var videoWidth=$(".videoIndexArea").width();
    var videoHeight=$(".videoIndexArea").height();
    var docWidth=$(".al_offsideDoc").width();
    var docHeight=$(".al_offsideDoc").height();
    liveWatch= {
        config: {},
        path: {
            getAuth:PC_CALL + "customer/auth/getAuthBycustomerId/",
            getLive:PC_CALL + "broadcast/home/getMapById/",
            share:PC_CALL +"comm/data/share/getMapList3/",//分享
            createCore:PC_CALL +"broadcast/audience/create/",//进入创建
            initCore : PC_CALL+"broadcast/audience/getMapById/", //个人信息
            updateCore: PC_CALL+'broadcast/audience/update/',
            createReport: PC_CALL+"broadcast/report/create/",//举报
            createShied: PC_CALL+"broadcast/shield/create/",//屏蔽
            allList: PC_CALL+"broadcast/home/getMapList/",//直播结束推荐
            order:PC_CALL+"broadcast/audience/create/"
        },
        init: function () {
            var t=this;
            t.shieldList="";
            this.param=comm.getpara();
            this.nameAjax();
            this.updateAudience();
            this.getLive();
            this.getAudience();//获取当前用户观看者的信息
            this.liveStop();
            this.chat();
            this.reportLive();//举报主播
            this.reportShiedClick();
            this.windowChange();
            this.composite();
            this.share();
            //公告
            this.notice();

        },
        //选择文字
        selectText:function(){
            var text = document.getElementById("ev_linkUrl");
            if (document.body.createTextRange) {
                var range = document.body.createTextRange();
                range.moveToElementText(text);
                range.select();
            } else if (window.getSelection) {
                var selection = window.getSelection();
                var range = document.createRange();
                range.selectNodeContents(text);
                selection.removeAllRanges();
                selection.addRange(range);
                /*if(selection.setBaseAndExtent){
                 selection.setBaseAndExtent(text, 0, text, 1);
                 }*/
            } else {
                alert("none");
            }
        },
        //分享
        share:function(){
            var t=this;
            //链接
            $("#ev_linkUrl").text(window.location.href);
            $(".ev-link").attr("on","true");
            $(".ev-link").on("click",function(){
                if($(".ev-erweima").length>0){
                    $(".ev-tweixin").attr("on","true");
                    $(".ev-erweima").hide();
                }
                if($(this).attr("on")=="true"){
                    $(this).attr("on","false");
                    $(".al-shareVideoLinkBox").show();
                    $("#ev_copyLink").on("click",function(e){
                        t.selectText();
                    })
                    /*$("#ev_copyLink").zclip({
                        path:"/js/third-party/jquery-zclip/ZeroClipboard.swf",
                        setHandCursor:true,
                        copy:function(){//复制
                            return $("#ev_linkUrl").html();
                        },
                        afterCopy:function(){
                            alert("ok");
                        }
                    })*/

                }else{
                    $(this).attr("on","true");
                    $(".al-shareVideoLinkBox").hide();
                }
                return false;
            });
            $(".al-shareVideoLinkBox").on("click",function(){
                return false;
            });
            t.shareAction();
            //分享
            $("#ev_share").bind("click",function(){
                //公告,举报关闭
                $("#ev-report").attr("on","true");
                $(".al-reportAnchorPop").hide();
                $("#ev_notice").attr("on","true");
                $(".al-noticePopBox").hide();
            });
        },
        //分享事件
        shareAction:function(){
            var t=this;
            var h5Url="http://m.allinmd.cn/pages/live/living_watch.html?liveId="+ t.param.liveId;
            module.share({
                container:$("#ev_share"),//存放分享组件的父级
                type:5,//默认为1  1：社交分享  2：页面左下角全站分享
                title:"",//分享标题
                h5Url:h5Url,//h5页面链接
                shareTrend:0,//0:不需要站内动态分享  1：需要站内动态分享
                trendUrl:'',//分享到站内动态的接口
                data:{},//分享到站内动态的接口参数
                callback:function(){},//分享到站内动态成功后回调函数
                triggerRequest:function(content){//事件点击
                    //获取分享话术
                    var data={
                        resourceId: t.param.liveId,
                        resourceType:51,
                        sessionCustomerId:t.User.id,
                        visitSiteId:1,
                        sceneType: t.sceneType
                    };
                    $.ajax({
                        url: t.path.share,
                        type: "post",
                        data: {paramJson: $.toJSON(data)},
                        dataType: 'json',
                        async:false,
                        success: function (d) {
                            if (d && d.responseObject.responseData && !$.isEmptyObject(d.responseObject.responseData) && d.responseObject.responseData.data_list.length) {
                                var item = d.responseObject.responseData.data_list[0];
                                content.pic = item.share_comm.shareImageUrl;
                                if(!content.pic){
                                    content.pic="//img10.allinmd.cn/v3/terminal/webcastNoImg.png";
                                }
                                content.title=item.share_comm.shareTitle!=""?item.share_comm.shareTitle:document.title;
                                $.each(item.share_channel,function(i,el){
                                    if(el.shareChannel=='Sina'){
                                        content.sinaTitle=el.shareDesc;
                                    }else if(el.shareChannel=="QQFriend"){
                                        content.qqTitle = el.shareTitle;
                                        content.qqSummary = el.shareDesc;
                                    }else if(el.shareChannel=="QZone"){
                                        content.qqZoneTitle=el.shareTitle;
                                        content.qqZoneSummary = el.shareDesc;
                                    }
                                });
                            }
                        }

                    });
                },
                shareQQSuc:function(){//分享qq成功
                    comm.shareLog({
                        shareType: "",
                        resourceId:"" ,
                        resourceType: "",
                        refId: "",
                        isValid: 1,
                        shareSence: t.shareSence,
                        shareChannel:2,
                        shareContent:document.title
                    });
                },
                shareQzoneSuc:function(){
                    comm.shareLog({
                        shareType: "",
                        resourceId:"" ,
                        resourceType: "",
                        refId: "",
                        isValid: 1,
                        shareSence:t.shareSence,
                        shareChannel:1,
                        shareContent:document.title
                    });
                },//分享qzone成功
                shareSinaSuc:function(){
                    comm.shareLog({
                        shareType: "",
                        resourceId:"" ,
                        resourceType: "",
                        refId: "",
                        isValid: 1,
                        shareSence:t.shareSence,
                        shareChannel:3,
                        shareContent:document.title
                    });
                }//分享sina成功
            });
        },
        //直播公告
        notice:function(){
            $("#ev_notice").attr("on","true");
            $("#ev_notice").on("click",function(){
                if($(this).attr("on")=="true"){
                    $(this).attr("on","false");
                    $(".al-noticePopBox").show();
                    //举报,分享关闭
                    $(".al-shareBox").hide();
                    $("#ev-report").attr("on","true");
                    $(".al-reportAnchorPop").hide();
                }else{
                    $(this).attr("on","true");
                    $(".al-noticePopBox").hide();
                }
            });
            $(".al-noticePopBox").on("click",function(){
                return false;
            });
            $("#ev_noticeClose").on("click",function(){
                $("#ev_notice").attr("on","true");
                $(".al-noticePopBox").hide();
            });
        },
        nameAjax: function () { //获取名字
            var t=this;
            this.User = {};
            $.ajax({
                url: t.path.getAuth,
                type: "POST",
                data: {},
                async: false,
                success: function (data) {
                    if (data.responseObject.lastName + data.responseObject.firstName) {
                        t.User.nickname = data.responseObject.customerId + "_1";
                    } else {
                        t.User.nickname = (data.responseObject.customerId ? data.responseObject.customerId : 0) + "_1";
                    }
                    t.User.trueName = data.responseObject.firstName?(data.responseObject.lastName + data.responseObject.firstName):"游客";
                    t.User.id = data.responseObject.customerId;
                    t.User.state = data.responseObject.state;
                }
            });
            User = this.User;
        },
        //获取当前观看直播用户信息
        getAudience:function(){
            var t=this;
            $.ajax({
                type : "post",
                url : t.path.initCore,
                data : {paramJson: $.toJSON({sessionCustomerId: t.User.id,refCustomerId: t.User.id,liveId: t.param.liveId,siteId:1})},
                dataType : "json",
                async:false,
                success : function(rep){
                    if(!rep || !rep.responseObject.responseStatus){
                        if(t.User.id!=t.anchorUserId){//当前用户不为主播时
                            t.createAudience();//没有数据时创建一条直播用户
                        }
                        return false;
                    }else {
                        var list = rep.responseObject.responseData.data_list[0];
                        t.shieldList=list.shieldList;//屏蔽列表
                        if(list.isSpeak==1){//被禁言
                            //channel.send("onMessage", {content:i18n("sys.message.chat.disabled")});
                            $(".enabledChat").hide();
                            $(".disabledChat").show();
                        }
                    }
                },
                error:function(){}
            });
        },
        //创建直播观众
        createAudience:function(){
            var t=this;
            var data={
                sessionCustomerId: t.User.id,
                refUserId: t.User.id,
                liveId: t.param.liveId,
                liveUserRole:1,
                state:1,
                siteId:1
            };
            $.ajax({
                type : "post",
                url : t.path.createCore,
                data : {paramJson: $.toJSON(data)},
                dataType : "json",
                success : function(rep){

                },
                error:function(){}
            });
        },
        updateAudience:function(){
            var t=this;
            $(window).on('beforeunload',function (evt) {
                $.ajax({
                    url: t.path.updateCore,
                    data:{paramJson:$.toJSON({
                        sessionCustomerId:t.User.id,
                        liveId: t.param.liveId,
                        liveUserRole:1,
                        state:1,
                        siteId:1,
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
        //flash判断
        flashState: function () {
            function flashChecker() {
                var hasFlash = 0;         //是否安装了flash
                var flashVersion = 0; //flash版本
                var isIE = /*@cc_on!@*/0;      //是否IE浏览器

                if (isIE) {
                    var swf = new ActiveXObject('ShockwaveFlash.ShockwaveFlash');
                    if (swf) {
                        hasFlash = 1;
                        VSwf = swf.GetVariable("$version");
                        flashVersion = parseInt(VSwf.split(" ")[1].split(",")[0]);
                    }
                } else {
                    if (navigator.plugins && navigator.plugins.length > 0) {
                        var swf = navigator.plugins["Shockwave Flash"];
                        if (swf) {
                            hasFlash = 1;
                            var words = swf.description.split(" ");
                            for (var i = 0; i < words.length; ++i) {
                                if (isNaN(parseInt(words[i]))) continue;
                                flashVersion = parseInt(words[i]);
                            }
                        }
                    }
                }
                return {f: hasFlash, v: flashVersion};
            }

            function demo() {
                var flag = false;
                if (window.ActiveXObject) {
                    try {
                        var swf = new ActiveXObject("ShockwaveFlash.ShockwaveFlash");
                        if (swf) {
                            flag = true;
                        }
                    } catch (e) {
                    }
                } else {
                    try {
                        var swf = navigator.plugins['Shockwave Flash'];
                        if (swf) {
                            flag = true;
                        }
                    } catch (e) {
                    }
                }
                if (flag) {
                    return true
                } else {
                    return false;
                }
            }

            var fls = flashChecker();
            var s = "";
            return fls.f && demo();
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
        getLive:function(){
            var t=this;
            var userId,site,roomid,authcode;
            var data={};
            data.sessionCustomerId=t.User.id;
            data.visitSiteId=1;
            data.liveId= t.param.liveId;
            var liveInfo;
            $.ajax({
                type : "post",
                url : t.path.getLive,
                data : {paramJson: $.toJSON(data)},
                dataType : "json",
                async:false,
                success : function(rep){
                    if(rep&&rep.responseObject.responseData.data_list){
                        liveInfo=rep.responseObject.responseData.data_list[0];
                        userId=liveInfo.userId;
                        site=liveInfo.liveDomain;
                        roomid=liveInfo.liveNum;
                        authcode=liveInfo.liveAttendeeToken;
                        $("#ev_liveTitle").text(liveInfo.liveTitle);
                        $("#ev_authName").text(liveInfo.authInfo?liveInfo.authInfo.authName:'');
                        $("#ev_authName").parent().attr("href","/pages/personal/others_contribution.html?cid="+liveInfo.authInfo.authCustomerId);
                        t.anchorUserId=liveInfo.authInfo?liveInfo.authInfo.authCustomerId:'';//主播用户ID
                        $("#ev-report").attr("uid",t.anchorUserId);
                        if(!liveInfo.liveNotice){
                            $("#ev_notice").hide();
                            $(".al-reportBox").css({'margin-top':0});
                        }
                        $("#ev_liveNotice").text(liveInfo.liveNotice?comm.getStrLen(liveInfo.liveNotice,130):'');
                        $(".ev-startTime").text(liveInfo.liveStartTime);
                        if(liveInfo.isOrder=="1"){
                            $(".ev-orderBtn").attr("isOrder",1).addClass("active").text("已预约");
                        }
                        document.title="["+liveInfo.liveTitle+"] - 在线直播,唯医,allinmd";
                    }
                },
                error:function(){}
            });
            if(liveInfo.liveState==1||liveInfo.liveState==2){//直播未开始
                t.sceneType=26;
                t.shareSence=shareSenceConst.live_audience;
                t.noStart();
            }
            if(liveInfo.liveState==3){//正在直播
                t.sceneType=24;
                t.shareSence=shareSenceConst.live_orderAudience;
                //comm.Log.createBrowse({href:location.href,id:151,name:'UGC直播终端-直播中'});
                setTimeout(function(){
                    g_sps&&g_sps.createBrowse({pageId:394});
                },2200);

            }
            if(liveInfo.liveState==4||liveInfo.liveState==5){//直播结束
                t.stopAction();
                t.sceneType=24;
                t.shareSence=shareSenceConst.live_orderAudience;
                //comm.Log.createBrowse({href:location.href,id:152,name:'UGC直播终端-结束'});
                setTimeout(function(){
                    g_sps&&g_sps.createBrowse({pageId:395});
                },2200);

            }
            //video
            //uname=id_渠道
            //12342342_2
            if (!t.flashState()) {
                $("#livePlayer").html('<object type="application/x-shockwave-flash"' +
                    '                               data="your-flash-file.swf"' +
                    '                               width="100%" height="100%">' +
                    '                          <param name="movie" value="your-flash-file.swf" />' +
                    '                           <param name="quality" value="high"/>' +
                    '</object>')
            } else {
                DWLive.init({
                    userid: userId,
                    roomid: roomid,
                    viewername: t.getUserId(t.User.id)+"_1",
                    viewertoken: 'nothing',
                    viewercustomua: 'pc',
                    forcibly: true
                });
            }

            //通过通道监听在线人数事件
            DWLive.onUserCountMessage=function(count) {
                $("#ev_watchNum").html(count+"人");
            };
            //直播开启
            DWLive.onLiveStart = function(event) {
                $("#ev-report").css("cursor","pointer");
                $(".al-webcastEndPop").hide();
                $(".al-orderWebcastArea").hide();
                t.sceneType=24;
                t.shareSence=shareSenceConst.live_orderAudience;
                t.shareAction();
            };
            //发送默认系统消息
            setTimeout(function(){
                DWLive.sendPublicChatMsg('✿欢迎'+t.User.trueName+'来到直播间');
            },2000)
        },
        //直播未开始
        noStart:function(){
            var t=this;
            $("#ev-report").css("cursor","default");
            $(".al_offsideDoc").hide();
            $(".al-offsideNoContent").show();
            $(".al-orderWebcastArea").show();
            $(".ev-orderBtn").on("click",function(){
               var $this=$(this);
               if(!$(this).attr("isOrder")){
                   user.login({
                       callback: function () {
                           var data={};
                           data.sessionCustomerId= t.User.id;
                           data.liveId= t.param.liveId;
                           data.liveUserRole=1;
                           data.state=0;
                           data.isSpeak=0;
                           data.isShield=0;
                           data.siteId=1;
                           $.ajax({
                               type : "post",
                               url : t.path.order,
                               data : {paramJson: $.toJSON(data)},
                               dataType : "json",
                               success : function(rep){
                                   if(rep&&rep.responseObject.responseStatus){
                                       $this.attr("isOrder","1");
                                       $this.text("已预约");
                                       $this.addClass("active");
                                   }
                               },
                               error:function(){}
                           });
                       },
                       scene: privilegeSceneConst.eSceneTypeAuth,
                       onClose:function(){
                           history.back(-1);
                       },
                       noAuthReload:true
                   });
               }
            });
        },
        //直播停止
        liveStop:function(){
            var t=this;
            DWLive.onLiveEnd=function(){//直播停止
                if(!t.noAuth){
                    t.stopAction();
                }
                t.timer=setTimeout(function(){//30分钟内可以聊天
                    $("#ev_chatAre").attr("disabled",true);
                },30*60*1000);
            };

            DWLive.onLiveStart = function(){
                clearTimeout(t.timer);
                $("#ev_chatAre").attr("disabled",false);
                $(".al_offsideDoc").show();
                $(".al-offsideNoContent").hide();
                $(".al-webcastEndPop").hide();
                $(".al-orderWebcastArea").hide();
                //未认证用户可以观看60s
                setTimeout(function(){
                    if(t.User.state!=2&&t.User.state!=7&&t.User.state!=8&&t.User.state!=9){//未认证
                        t.noAuth=true;
                        $("#ev_chatAre").attr("disabled",true);

                        user.login({
                            callback: function () {
                                location.reload()
                            },
                            scene: privilegeSceneConst.eSceneTypeAuth,
                            onClose:function(){
                                history.back(-1);
                            },
                            onAuthCancel:"back",
                            noAuthReload:true
                        });
                    }
                },60*1000);
            }
        },
        //直播结束需要请求推荐
        stopAction:function(){
            $(".al_offsideDoc").hide();
            $(".al-offsideNoContent").show();
            $(".al-webcastEndPop").show();
            var t=this;
            var data={};
            data.visitSiteId=1;
            data.isHome=1;
            data.sessionCustomerId= t.User.id;
            data.sortType=5;
            data.pageIndex=1;
            data.pageSize=2;
            comm.LightBox.showloading();
            $.ajax({
                type : "post",
                url : t.path.allList,
                data : {paramJson:$.toJSON(data)},
                dataType : "json",
                success : function(rep){
                    comm.LightBox.hideloading();
                    if(rep&&rep.responseObject.responseData){
                        var repData=rep.responseObject.responseData;
                        if(repData.data_list&&repData.data_list.length>0){
                            var data_list=repData.data_list;
                            var defaultImg="//img10.allinmd.cn/v3/terminal/webcastNoImg.png";
                            var html="";
                            $.each(data_list,function(i,val){
                                html+='<figure><a href="/pages/live/living_watch.html?liveId='+val.liveId+'">'+
                                '<img src="'+(val.attUrl?val.attUrl:defaultImg)+'" alt=""/>'+
                                '<b></b>'+
                                '<div class="al-videoDemoInfo">'+
                                '<p>'+val.liveTitle+'</p>'+
                                '</a><figure>'+
                                '<span>'+val.authInfo.authName+'</span>'+
                                '<i>'+val.onlineNum+'</i>'+
                                '</figure>'+
                                '</div>'+
                                '</figure>'
                            });
                            $(".ev-recomendList").html(html);
                        }
                    }
                },
                error:function(){}
            });
        },
        //聊天
        chat:function(){
            var t=this;
            DWLive.onPublicChatMessage = function(msg){//公共消息
                //console.log(msg);
                var nowData = JSON.parse(msg);
                var contentMsg = nowData.msg;
                if(contentMsg&&contentMsg.indexOf("✿")>-1){//系统消息
                    var arrStr = msg.split("欢迎")[1];
                    var name = arrStr?arrStr.split("来到")[0]:'';
                    if(nowData&&nowData.time&&nowData.time.length){
                        t.appendUser({cId:nowData.userid,name:name,senderId:nowData.userid});
                        /*if(nowData.userid==TempCache.getItem("userId")){
                            t.senderId=nowData.userid;
                            t.createWatcher();//创建直播观众
                        }*/
                    }
                }else{//公共聊天信息
                    t.loadPublicMsgUI(JSON.parse(msg));
                }
            };
            /*channel.bind("onMessage",function(evt){//系统消息
                t.loadMsg(evt.data.content);
            });*/

            //通知
            /*DWLive.onInformation = function(j){ // 禁言
                console.log("通知"+j);
            };*/
            DWLive.showUserCount = function(j){
                if(j==1){ //显示在线人数
                    $("#userOnlineNumber").show();
                }else{
                    $("#userOnlineNumber").hide();
                }
            };

            /*channel.bind("onSetting", function(evt){
                var setting = evt.data;
                if(setting.option=="onlineuser"){
                    if(setting.enable=="true"){
                        $("#userOnlineNumber").show();
                    }else{
                        $("#userOnlineNumber").hide();
                    }
                }else if(setting.option=="chat"){//聊天设置
                    if(setting.enable=="true"){//
                        channel.send("onMessage", {content:i18n("sys.message.chat.enabled")});
                        $(".enabledChat").show();
                        $(".disabledChat").hide();
                    }else{//禁言
                        channel.send("onMessage", {content:i18n("sys.message.chat.disabled")});
                        $(".enabledChat").hide();
                        $(".disabledChat").show();
                    }
                }
            });*/
            //用户新加入添加系统消息
            /*channel.bind("onUserJoin", function(evt){
                var list = evt.data.list;
                for(var i in list){
                    var user = list[i];
                    t.appendUser(user, i);
                    if(user.name.split("_")[1]== t.User.id){//当前用户
                        t.senderId=user.id;
                        t.createAudience();//创建直播观众
                    }
                    if(user.name.split("_")[1]==$("#ev-report").attr("uid")){//主播
                        $("#ev-report").attr("userId",user.id);
                        clearTimeout(t.timer);
                        $(".al-webcastEndPop").hide();
                        $(".al-orderWebcastArea").hide();
                    }
                }
            });*/
            //提交聊天
            $("#ev_chatAre").on("keyup",function(ev){
                if(ev.keyCode==13){//回车提交
                    if(t.User.state!=2&&t.User.state!=7&&t.User.state!=8&&t.User.state!=9) {//未认证
                        user.login({
                            callback: function () {
                                location.reload()
                            },
                            scene: privilegeSceneConst.eSceneTypeAuth,
                            onClose:function(){
                                history.back(-1);
                            },
                            noAuthReload:true
                        });
                    }else{
                        t.submitMsg();
                    }
                    return false;
                }
            })
            $("#ev_chatSubmit").off("click").on("click", function(){
                if(t.User.state!=2&&t.User.state!=7&&t.User.state!=8&&t.User.state!=9) {//未认证
                    user.login({
                        callback: function () {
                            location.reload()
                        },
                        scene: privilegeSceneConst.eSceneTypeAuth,
                        onClose:function(){
                            history.back(-1);
                        },
                        noAuthReload:true
                    });
                }else{
                    t.submitMsg();
                }

            });
        },
        //聊天信息提交
        submitMsg: function(){
            var t=this;
            var richText = $("#ev_chatAre").val().replace("\n","");
            if(richText){
                if(richText.length>260){
                    $.topTip({content:"聊天不能超过260个字符",mark:'warn'});
                    return false;
                }
                var msg = t.User.trueName+":"+richText;
                DWLive.sendPublicChatMsg(msg);
                //setTimeout(function(){//延迟一秒提交聊天
                    /*channel.send("submitChat", {"richtext":richText}, function(data){
                        if(data&&data.result==false){
                            if(data.data&&data.data.richtext){
                                t.loadMinIntervalError({"content":data.data.richtext});
                            }
                        }
                    });*/
                    //t.loadPublicMsgUI({"username": t.User.id+"_1","msg": t.User.nickname+":"+richText});
                //},1000);
                $("#ev_chatAre").val("");
            }
            return false;
        },
        //加载公共聊天ui
        loadPublicMsgUI :function(msg){
            var t=this;
            var allMsg = msg.msg.split(":");
            var name=msg.msg.indexOf(":")>-1?allMsg[0]:msg.username;//观众名
            var content=msg.msg.indexOf(":")>-1?allMsg[1]:msg.msg;//聊天正文
            var cId = msg.username.split("_")[0];//唯医用户ID
            var newContent=content;
            var sChatMsgEle="";
            if(content.match(/&&\d+_&sys#_/)||content.match(/&sys#_/)){//禁言的区分
                if(content.match(/&&\d+_&sys#_/)){
                    con=content.replace(/&&\d+_&sys#_/,'');
                }else{
                    con=content.replace(/&sys#_/,'');
                }
                sChatMsgEle='<figure class="al-chatItem al-newJoinChat">'+
                    '<div>'+
                    '  <p class="al-systemPrompt">系统</p>'+
                    '  <span class="al-newUserJoin">'+con+'</span>'+
                    '</div>'+
                    '</figure>';
            }else{//正常的聊天
                sChatMsgEle = '<figure class="al-chatItem"><div>'
                    //+Util.replaceholder(i18n('chat.msg.speek'), [t.getNameSpan(msg.senderId, msg.sender, true)])
                +t.getNameSpan(msg.userrole, cId, name, true, msg.userid)
                +htmlToString(newContent)
                +'</div></figure>';
            }

            if(t.shieldList.lastIndexOf(cId)>-1){//被屏蔽
                return false;
            }

            $("#ev_chatList").append(sChatMsgEle);
            var parent = $("#ev_chatList").parent()[0];
            parent.scrollTop=parent.scrollHeight;
            //发送后，内容滚至底部
            //点击用户显示举报弹层
            $("#ev_chatList .al-chatUserName").off("click").on("click",function() {
                var uid=$(this).attr("uid");//唯医用户id
                var userId=$(this).attr("userId");//展示互动用户id
                var top=$(this).offset().top-$(".al-interactiveChatBox").offset().top;
                if($(this).offset().top+$(".al-chatReportBox").height()>$(document).height()){
                    top=top-$(".al-chatReportBox").height();
                }
                var left="-260px";
                if(t.User.state!=2&&t.User.state!=7&&t.User.state!=8&&t.User.state!=9){//未认证
                    user.login({
                        callback: function () {
                            location.reload()
                        },
                        scene: privilegeSceneConst.eSceneTypeAuth,
                        onClose:function(){
                            history.back(-1);
                        },
                        noAuthReload:true
                    });
                }else {
                    t.report(uid, userId, top, left);
                }
            })
        },
        //举报主播
        reportLive:function(){
            var t=this;
            $("#ev-report").attr("on","true");
            $("#ev-report").off("click").on("click",function() {
                var uid=$(this).attr("uid");//唯医用户id
                var userId=$(this).attr("userId");//展示互动用户id
                if(t.User.state!=2&&t.User.state!=7&&t.User.state!=8&&t.User.state!=9){//未认证
                    user.login({
                        callback: function () {
                            location.reload()
                        },
                        scene: privilegeSceneConst.eSceneTypeAuth,
                        onClose:function(){
                            history.back(-1);
                        },
                        noAuthReload:true
                    });
                }else{
                    if($(this).attr("on")=="true"){
                        $(this).attr("on","false");
                        t.anchorReport(uid,$(this));
                    }
                }
                //公告,分享关闭
                $(".al-shareBox").hide();
                $("#ev_notice").attr("on","true");
                $(".al-noticePopBox").hide();

            })
        },
        //举报主播
        anchorReport:function(uid,$this){
            var t=this;
            if(t.hasReport){
                $this.attr("on","true");
                $(".al-chatRepoetedPop").show();
                return false;
            }
            if(t.hasClick){
                t.anchorReportAction(uid);
                return false;
            }
            if(uid&&uid!= t.User.id){
                t.hasClick=true;
                $.ajax({
                    type : "post",
                    url : t.path.initCore,
                    data : {paramJson: $.toJSON({sessionCustomerId: t.User.id,refCustomerId: uid,liveId: t.param.liveId,siteId:1})},
                    dataType : "json",
                    success : function(rep){
                        if(!rep || !rep.responseObject.responseStatus){
                            return false;
                        }else{
                            var list = rep.responseObject.responseData.data_list[0];
                            var reportList = list.reportList;

                            t.hasReport=false;
                            if(list.isReport=="1"){
                                $(".al-chatRepoetedPop").show();
                                t.hasReport=true;
                            }

                            if(!t.hasReport){
                                t.anchorReportAction(uid);
                            }

                        }
                    },
                    error:function(){}
                });
            }
        },
        //点击举报主播的弹层处理
        anchorReportAction:function(uid){
            var t=this;
            $(".al-reportAnchorPop").show();
            $("#anchor_reportCancel").on("click",function(){
                $("#ev-report").attr("on","true");
                $(".al-reportAnchorPop").hide();
                //事件埋点
                comm.creatEvent({
                    triggerType:"全站功能按钮点击",
                    keyword:"UGC直播-观看直播举报主播取消",
                    actionId:45
                });
            });
            $("#anchor_reportSure").off("click").on("click",function(){
                var data={};
                data.refCustomerId=uid;//被举报会员id
                data.liveId= t.param.liveId;
                data.sessionCustomerId= t.User.id;
                data.reportObject= 2;
                data.reportType=0;//举报类型 0-主播
                data.siteId=1;
                $.ajax({
                    type : "post",
                    url : t.path.createReport,
                    data : {paramJson:$.toJSON(data)},
                    dataType : "json",
                    success : function(rep){
                        $("#ev-report").attr("on","true");
                        if(rep&&rep.responseObject.responseStatus){
                            t.hasReport=true;
                            $(".al-reportAnchorPop").hide();
                            $.topTip({content:"举报成功！",mark:"success"});
                        }
                    },
                    error:function(){}
                });
            })
        },
        //举报
        report:function(uid,userId,top,left){
            var t=this;
            $(".al-chatReportBox").hide();
            $(".al-chatReportBox").css({top:top,left:left});
            if(uid&&uid!= t.User.id){
                $.ajax({
                    type : "post",
                    url : t.path.initCore,
                    data : {paramJson: $.toJSON({sessionCustomerId: t.User.id,refCustomerId: uid,liveId: t.param.liveId,siteId:1})},
                    dataType : "json",
                    success : function(rep){
                        if(!rep || !rep.responseObject.responseStatus){
                            $(".al-chatReportBox").hide();
                            return false;
                        }else{
                            var list = rep.responseObject.responseData.data_list[0];
                            var reportList = list.reportList;
                            if (list.state!=2&&list.state!=7&&list.state!=8&&list.state!=9) {//未认证
                                $(".ev_vipIcon").hide();
                            }else{
                                $(".ev_vipIcon").show();
                            }
                            var name = list.customerName;
                            $(".ev_userName").text(name);
                            $(".ev_userUnit").text(comm.strHandle.cutDoctorTitle(comm.cutLine(list.titleName,"_",",")));
                            var logoUrl = "//img10.allinmd.cn/default-user/user_img65.png";
                            if (list.logoUrl !== "") logoUrl = list.logoUrl;
                            $(".ev_userLink").attr("href","/pages/personal/others_contribution.html?cid="+uid);
                            $(".ev_userLink img").attr("src",logoUrl);
                            var hasReport=false;
                            if(list.isReport=="1"){
                                $(".al-chatRepoetedPop").show();
                                hasReport=true;
                            }

                            if(!hasReport){
                                $("#ev_reportSure").attr("customerId",uid);
                                $("#ev_shieldSure").attr("customerId",uid).attr("userId",userId);
                                $(".al-chatReportBox").show();
                                $("#ev_reportInfo").show();
                                $("#ev_reportSureBox").hide();
                                $(".ev_selectBox").hide();
                                $(".ev_selectBox").eq(0).show();
                            }

                        }
                    },
                    error:function(){}
                });
            }

        },
        //举报屏蔽点击
        reportShiedClick:function(){
            var t=this;
            var reportType="";
            $(".ev_hasReportClose").on("click",function(){
                $(".al-chatRepoetedPop").hide();
                //事件埋点
                comm.creatEvent({
                    triggerType:"全站功能按钮点击",
                    keyword:"UGC直播-观看直播举报关闭",
                    actionId:43
                });
            });
            $("#ev_mainSelect figure").on("click",function(){
                var index=$(this).index();
                $(".ev_selectBox").hide();
                $(".ev_selectBox").eq(index).show();
            });
            $("#ev_cancelBox").on("click",function(){
                $(".al-chatReportBox").hide();
                //事件埋点
                comm.creatEvent({
                    triggerType:"全站功能按钮点击",
                    keyword:"UGC直播-观看直播举报取消",
                    actionId:45
                });
            });
            //举报
            $(".al-cancelBtn").on("click",function(){
                $(".al-chatReportBox").hide();
                //事件埋点
                comm.creatEvent({
                    triggerType:"全站功能按钮点击",
                    keyword:"UGC直播-观看直播举报取消",
                    actionId:45
                });
            });
            $("#ev_reportInfo p").on("click",function(){
                if($(this).attr("reportType")!=""){
                    reportType=$(this).attr("reportType");//举报类型
                    $("#ev_reportInfo").hide();
                    $("#ev_reportSureBox").show();
                }
            });
            $("#ev_reportCancel").on("click",function(){
                $("#ev_reportInfo").show();
                $("#ev_reportSureBox").hide();
                //事件埋点
                comm.creatEvent({
                    triggerType:"全站功能按钮点击",
                    keyword:"UGC直播-观看直播举报取消",
                    actionId:45
                });
            });
            $("#ev_reportSure").on("click",function(){
                var data={};
                data.refCustomerId=$("#ev_reportSure").attr("customerId");//被举报会员id
                data.liveId= t.param.liveId;
                data.sessionCustomerId= t.User.id;
                data.reportObject= 1;
                data.reportType=reportType;//举报类型
                data.siteId=1;
                $.ajax({
                    type : "post",
                    url : t.path.createReport,
                    data : {paramJson:$.toJSON(data)},
                    dataType : "json",
                    success : function(rep){
                        if(rep&&rep.responseObject.responseStatus){
                            $(".al-chatReportBox").hide();
                            $.topTip({content:"举报成功！",mark:"success"});
                        }
                    },
                    error:function(){}
                });
            })

            //屏蔽
            $("#ev_shieldCancel").on("click",function(){
                $(".al-chatReportBox").hide();
                //事件埋点
                comm.creatEvent({
                    triggerType:"全站功能按钮点击",
                    keyword:"UGC直播-观看直播屏蔽取消",
                    actionId:45
                });
            });
            $("#ev_shieldSure").on("click",function(){
                var data={};
                data.refCustomerId=$("#ev_shieldSure").attr("customerId");//被举报会员id
                data.liveId= t.param.liveId;
                data.sessionCustomerId= t.User.id;
                data.userId= $("#ev_shieldSure").attr("userId");//展示互动id
                data.visitSiteId=1;
                $.ajax({
                    type : "post",
                    url : t.path.createShied,
                    data : {paramJson:$.toJSON(data)},
                    dataType : "json",
                    success : function(rep){
                        if(rep&&rep.responseObject.responseStatus){
                            t.shieldList+=data.refCustomerId+",";
                            $("#ev_chatList .al-chatItem").each(function(i,em){
                                if(t.shieldList.lastIndexOf($(em).find(".al-chatUserName").attr("uid"))>-1){
                                    $(em).hide();
                                }
                            });
                            $(".al-chatReportBox").hide();
                            $.topTip({content:"屏蔽用户成功！",mark:"success"});
                        }
                    },
                    error:function(){}
                });
            })
        },

        //聊天信息中用户名
        getNameSpan:function(role, uid, uname, subject, userId){
            //var isMine = (Util.trim(uid)==User.id);
            var isAnchor = (role=="publisher");//是主播
            var sEl = (isAnchor?'<p>主播</p>':'')+'<span uid="'+uid+'" userId="'+userId+'" class="al-chatUserName">'+uname+(role=="teacher"?"(嘉宾)":'')+'：</span>';
            return sEl;
        },
        //用户加入 系统消息
        appendUser:function(users){
            var t=this;
            var html='<figure class="al-chatItem al-newJoinChat">'+
                '<div>'+
                '  <p class="al-systemPrompt">系统</p>'+
                '  <span class="al-newUserJoin">欢迎<i uid="'+users.cId+'" userId="'+users.senderId+'">'+(users.name?users.name:'游客')+'</i>来到直播间！</span>'+
                '</div>'+
                '</figure>';
            //发送后，内容滚至底部
            $("#ev_chatList").append(html);
            var parent = $("#ev_chatList").parent()[0];
            parent.scrollTop=parent.scrollHeight;
            //点击用户显示举报弹层
            $("#ev_chatList .al-newUserJoin i").off("click").on("click",function() {
                var uid=$(this).attr("uid");//唯医用户id
                var userId=$(this).attr("userId");//展示互动用户id
                var top=$(this).offset().top-$(".al-interactiveChatBox").offset().top;
                var left="-260px";
                if(t.User.state!=2&&t.User.state!=7&&t.User.state!=8&&t.User.state!=9){//未认证
                    user.login({
                        callback: function () {
                            location.reload()
                        },
                        scene: privilegeSceneConst.eSceneTypeAuth,
                        onClose:function(){
                            history.back(-1);
                        },
                        noAuthReload:true
                    });
                }else {
                    t.report(uid, userId, top, left);
                }
            })
        },
        //发送聊天失败
        loadMinIntervalError:function(msg){
            var sSysMsgEle = '<figure class="al-chatItem al-newJoinChat">'+
                '<div>'+
                '  <p class="al-systemPrompt">系统</p>'+
                '  <span class="al-newUserJoin">'
                +msg.content+
                +'</span>'+
                +'</div></figure>';
            $("#ev_chatList").append(sSysMsgEle);
            var parent = $("#ev_chatList").parent()[0];
            parent.scrollTop=parent.scrollHeight;
            //发送后，内容滚至底部
        },
        //加载系统消息
        loadMsg:function(msg){
            var html='<figure class="al-chatItem al-newJoinChat">'+
                '<div>'+
                '  <p class="al-systemPrompt">系统</p>'+
                '  <span class="al-newUserJoin">'+msg+'</span>'+
                '</div>'+
                '</figure>';
            //发送后，内容滚至底部
            $("#ev_chatList").append(html);
            var parent = $("#ev_chatList").parent()[0];
            parent.scrollTop=parent.scrollHeight;
        },
        //合成模式
        composite:function(){
            var t=this;
            t.changeClick=false;
            $("#ev_composite").attr("on","true");
            $("#ev_composite").on("click",function(){
                if(t.changeClick){
                    return false;
                }else{
                    $(".al-offsideNoContent").show();
                    if($(this).attr("on")=="true"){
                        $(this).attr("on","false");
                        iframeHide(function(){
                            $(".al_offsideDoc").animate({
                                left:-(docWidth+60),
                                top:videoHeight-docHeight+50
                            },500)
                        })
                    }else {
                        $(this).attr("on","true");
                        iframeHide(function () {
                            $(".al_offsideDoc").animate({
                                left: 0,
                                top: 0
                            }, 500)
                        })
                    }
                }
            });

        },
        //切换屏幕
        windowChange:function(){
            var t=this;
            $("#ev_changeWindows").toggle(function() {
                t.changeClick=true;
                $(".al-offsideNoContent").hide();
                iframeHide(function() {
                    $(".videoIndexArea").animate({
                        width : docWidth+"px",
                        height : docHeight+"px"
                    }, 0, function() {
                        $(".al_offsideVideo").animate({
                            width : docWidth+"px",
                            height : docHeight+"px",
                            left:videoWidth+20,
                            top:'20px'
                        },500)
                    });

                    $(".al-offsideContent").animate({
                        width : videoWidth+"px",
                        height : videoHeight+"px"
                    }, 0, function() {
                        $(".al_offsideDoc").animate({
                            width : videoWidth+"px",
                            height : videoHeight+"px",
                            left:-(videoWidth+20),
                            top:'120px'
                        }, 500)
                    });
                });

            }, function() {
                t.changeClick=false;
                $(".al-offsideNoContent").show();
                iframeHide(function() {
                    //$(".overlay").show();
                    $(".al-offsideContent").animate({
                        width : docWidth+"px",
                        height : docHeight+"px"
                    }, 0, function() {
                        $(".al_offsideDoc").animate({
                            width : docWidth+"px",
                            height : docHeight+"px",
                            left:0,
                            top:0
                        }, 500)
                    });

                    $(".videoIndexArea").animate({
                        width : videoWidth+"px",
                        height : videoHeight+"px"
                    }, 0, function() {
                        $(".al_offsideVideo").animate({
                            width : videoWidth+"px",
                            height : videoHeight+"px",
                            left:0,
                            top:'140px'
                        }, 500)
                    });
                });
            });
        }
    };

    user.login({
        callback: function () {
            liveWatch.init();
        },
        scene: privilegeSceneConst.eSceneTypeNeedManufactureLogin,
        onClose:function(){
            history.back(-1);
        },
        noAuthReload:true
    });

})
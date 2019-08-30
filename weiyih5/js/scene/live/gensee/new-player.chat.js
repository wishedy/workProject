/*
 聊天
 */
var Channel = Channel || GS.createChannel();

(function (chat, window) {
    //准备
    var timer  =null;
    chat.bind("onPublicChat", loadPublicChat);  //收到公聊消息
    chat.bind("onPriChat", loadPrivateChat);  // 收到私聊消息
    chat.bind("onMessage", loadSysMessage);
    chat.bind("onPublicChatList", loadPublicMsgListUI);
    chat.bind("onVideoConfig", loadVideoConfig);  //视频配置更改通知
    chat.bind('onUserJoin',userJoin)
    chat.bind("onSetting", function (evt) {   //功能配置更改通知
        var setting = evt.data;
        if (setting.option == "userlist") {
            if (setting.enable) {
                $("#userListBtn").show();
            } else {
                $("#userListBtn").hide();
                $("#userListBox").hide();
            }
        } else if (setting.option == "onlineuser") {
            if(setting.enable){
                $(".slide-navbar article:eq(2)").show();
                resetNavWidth();
            }else{
                $(".slide-navbar article:eq(2)").hide();
                resetNavWidth();
            }
        } else if (setting.option == "chat" ) {//&& setting.target != "self"
            if (setting.enable) {
                Channel.send("onMessage", {content: i18n("sys.message.chat.enabled")});
                $('.al-commentInputBar').removeClass('gag').find('input').removeAttr('readonly').val("");
            } else {
                Channel.send("onMessage", {content: i18n("sys.message.chat.disabled")});
                $('.al-commentInputBar').addClass('gag').find('input').attr('readonly','readonly').val('你已被禁言');
            }
        } else if (setting.option == "question" && setting.target != "self") {
            if (setting.enable) {
                Channel.send("onMessage", {content: i18n("sys.message.qa.enabled")});
            } else {
                Channel.send("onMessage", {content: i18n("sys.message.qa.disabled")});
            }
        }
    });
    chat.bind("onUserList", function (evt) {    //用户列表
        var list = evt.data.list;
        var isAuIn = false; //主播不在线
        for (var i=0;i<list.length;i++) {
            var user = list[i];
            //appendUser(user, i);
            if (user.role.split(',').indexOf('1')>-1) {
                isAuIn = true;
                break;
            }
        }
        if (!isAuIn) { //主播不在线时
            $('.ev_videoDefaultBg').show();
            //$('.al-livingVideoBox').height($('.al-livingVideoBox').attr('preH'));
            //chatPage.resize();
            timer =setTimeout(function(){
                $('.ev_chat').attr('readonly','readonly');
            },30*60*1000);//
        }

    });
    chat.bind('onUserOnline',function(evt){
        $('#ev_countNo').html(toWK(evt.data.count));
    });
    function toWK(x){
        if (isNaN(parseInt(x))) return 0;

        if (parseInt(x) < 10000 && parseInt(x) > 999) {
            return Math.floor(parseInt(x) / 1000) + "K+";
        } else if (parseInt(x) > 9999) {
            return Math.floor(parseInt(x) / 10000) + "W+";
        } else {
            return x;
        }
    }
    //加载系统消息
    function loadSysMessage(evt) {
        loadSysMsgUI(evt.data);
    }

    function loadSysMsgUI(msg) {
        //var sSysMsgEle = '<article class="al-livingWatcherContentItem">'
        //    +'<i class="msg-time">'
        //    + (msg.time?Util.formatTime(msg.time*1000):Util.currentTime())
        //    +'</i>' +
        //    + '<span class="">' + i18n("chat.system.system") + '</span>'
        //    + Util.formatUrl(Util.escapeHTML(msg.content))
        //    + '</article>';
        var sSysMsgEle ='<article class="al-livingWatcherContentItem">'+
                        '  <i class="icon-systemMark"></i>'+
                        '<span class="al-livingComment">'+msg.content+'</span>'+
                        '</article>';

        $(".ev_chatBox").scrollTo({
            fn: function () {
                $(".ev_chatBox").append(sSysMsgEle);
            }
        });//发送后，内容滚至底部
    }

    //加载公聊信息，私聊信息（用户ID>用户名确认信息身份，支持表情，常用表情本地记录）
    function loadPublicChat(evt) {
        loadPublicMsgUI(evt.data);
        console.log(evt);
    }

    function loadPublicMsgUI(msg) {   // 加载公聊信息，私聊信息（用户ID>用户名确认信息身份，支持表情，常用表情本地记录）
        //var iAmSender = (msg.senderId == User.id);
        //var sChatMsgEle = '<li class="' + (iAmSender ? 'my-msg' : 'not-mine') + '">';
        //sChatMsgEle += '<i class="msg-time">'
        //    + Util.currentTime()
        //    + '</i>'
        //    + Util.replaceholder(i18n('chat.msg.speek'), [getNameSpan(msg.senderId, msg.sender, true)])
        //    + Util.formatUrl(msg.richtext || msg.content)
        //    + '</li>';
        //var sChatMsgEle = '<article class="al-livingWatcherContentItem">' +
        //    ($('i').hasClass('icon-livingMaster')?'<i class="icon-livingMaster"></i>':'') +
        //    Util.replaceholder(i18n('chat.msg.speek'), [getNameSpan(msg.senderId, msg.sender, true)]) +
        //    Util.formatUrl(msg.richtext || msg.content)+
        //    '</article>';
        var _content =  msg.richtext!=""?msg.richtext:msg.content;
        var sChatMsgEle="";
        if(_content.match(/&&\d+_&sys#_/)||_content.match(/&sys#_/g)){//禁言的区分
            var _content=_content.replace(/&&\d+_&sys#_/,'').replace(/&sys#_/g,"");
            sChatMsgEle = '<article class="al-livingWatcherContentItem">'+
                            '  <i class="icon-systemMark"></i>'+
                            '<span class="al-livingComment" style="word-break:break-all;">'+_content+'</span>'+
                            '</article>';
        }else{
            sChatMsgEle ='<article class="al-livingWatcherContentItem">'+
                ((msg.senderRole=="1,2,4"||msg.senderRole=="1,2")?'<i class="icon-livingMaster"></i>':"")+
                '   <a href="javascript:;" class="al-livingUser">'+msg.sender.split('_')[0]+':</a>'+
                '<span class="al-livingComment" style="word-break:break-all;">'+htmlToString(_content)+'</span>'+
                '</article>';
        }
        $(".ev_chatBox").scrollTo({
            fn: function () {
                $(".ev_chatBox").append(sChatMsgEle);
            }
        });//发送后，内容滚至底部
    }
    function loadPrivateChat(){

    }
    function loadPublicMsgListUI(){

    }
    function loadVideoConfig(){

    }
    function userJoin(msg){
        var userIn="";
        for(var i=0;i<msg.data.list.length;i++){
            var newuser = msg.data.list[i];
            userIn +='<article class="al-livingWatcherContentItem">'+
                '  <i class="icon-systemMark"></i>'+
                '<span class="al-livingComment">欢迎<a href="javascript:;" class="welcomeUser">'+newuser.name.split('_')[0]+'</a>来到直播间</span>'+
                '</article>';
            if(newuser.role.split(',').indexOf('1')>-1){
                $('.ev_videoDefaultBg').hide();
                $('.ev_chat').removeAttr('readonly');
                //$('.al-livingVideoBox').height($(window).height()*0.5);
                //chatPage.resize();
                clearTimeouf(timer);
            }
        }
        $(".ev_chatBox").scrollTo({
            fn: function () {
                $(".ev_chatBox").append(userIn);
            }
        });//发送后，内容滚至底部

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
    /*chat.bind('onUserLeave',function(d){
        var arr = d.data.list[0].role.split(",");
        if(arr.indexOf('1')>-1){
            $('.ev_videoDefaultBg').show();
            //$('.al-livingVideoBox').height($('.al-livingVideoBox').attr('preH'));
            //chatPage.resize();
            timer = setTimeout(function(){
                $('.ev_chat').attr('readonly','readonly');
            },30*60*1000);//
        }
    });*/
})(Channel, window);

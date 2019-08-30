/*
 * ====================================================
 * 聊天
 */
var Channel = Channel||GS.createChannel();

(function(chat, window){
	//准备
	chat.bind("onPublicChat", loadPublicChat);
	chat.bind("onPriChat", loadPrivateChat);
	chat.bind("onSetting", function(evt){
		var setting = evt.data;
		if(setting.option=="userlist"){
			if(setting.enable=="true"){
				$("#userListBtn").show();
			}else{
				$("#userListBtn").hide();
				$("#userListBox").hide();
			}
		}else if(setting.option=="onlineuser"){
			if(setting.enable=="true"){
				$("#userOnlineNumber").show();
			}else{
				$("#userOnlineNumber").hide();
			}
		}else if(setting.option=="chat"){
			if(setting.enable=="true"){
				Channel.send("onMessage", {content:i18n("sys.message.chat.enabled")});
			}else{
				Channel.send("onMessage", {content:i18n("sys.message.chat.disabled")});
			}
		}else if(setting.option=="question"){
			if(setting.enable=="true"){
				Channel.send("onMessage", {content:i18n("sys.message.qa.enabled")});
			}else{
				Channel.send("onMessage", {content:i18n("sys.message.qa.disabled")});
			}
		}
	});
	chat.bind("onUserList", function(evt){
		$("#userList").html("");
		var list = evt.data.list;
		for(var i in list){
			var user = list[i];
			appendUser(user, i);
		}
	});
	
	chat.bind("onUserJoin", function(evt){
		var list = evt.data.list;
		for(var i in list){
			var user = list[i];
			if($("#userList").find("#user-"+user.id).length>0){
				break;
			}
			appendUser(user, i);
		}
	});
	function appendUser(user, idx){
		var sli = '<li id="user-'+user.id+'" '+ (idx%2==0?'':'class="even"')+'><a href="javascript:;">'+user.name+'</a></li>';
		$("#userList").append(sli);
	}
	
	chat.bind("onUserLeave", function(evt){
		var list = evt.data.list;
		for(var i in list){
			var user = list[i];
			$("#userList").find("#user-"+user.id).remove();
		}
	});
	chat.bind("onUserUpdate", function(evt){
		var list = evt.data.list;
		for(var i in list){
			var user = list[i];
			var $li = $("#userList").find("#user-"+user.id);
			if($li.length>0){
				$li.find("a").text(user.name);
			}
		}
	});
	chat.bind("onUserOnline", function(evt){
		$("#userOnlineNumber").text("("+evt.data.count+")");
	});
	
	$(function(){
		$("#chat-submit").off("click").on("click", submitMsg);
		
		if(window.webPriChat !== false){
			$("#chat-list").bind("click", changeChatTo);
		}
		
		$("#chatto-list").bind("click", function(event){
			var $li = $(event.target).closest("li");
			var uid = $li.attr("uid");
			var uname = $li.text();
			selectChatTo(uid, uname);
			changetoChatTo(uid, uname);
		});
		
		$("#chatto-box").click(function(){
			if($("#chatto-list").css("display")=="none"){
				$("#chatto-list").slideDown(function(){
					$(this).css("overflow","auto");
				});
			}else{
				$("#chatto-list").slideUp();
			}
		});
		
		$("#chat-area").on("keydown", function(event){
		    if(event.keyCode == 13){
		    	event.preventDefault();
		        $("#chat-submit").click();
		        return false;
		    }
		});
		
		//dragover dragenter dragleave
		$('[contenteditable]').on('drop', function (e) {
		    e.preventDefault();
		    console.debug(e);
		    return false;
		});
		
		$('[contenteditable]').on('paste', function (e) {
			var pastedText = null;
			if (window.clipboardData && window.clipboardData.getData) { // IE
				pastedText = window.clipboardData.getData('Text');
			} else if (e.clipboardData && e.clipboardData.getData) {
				pastedText = e.clipboardData.getData('text/plain');
			} else if (e.originalEvent && e.originalEvent.clipboardData && e.originalEvent.clipboardData.getData) {
				e = e.originalEvent;
				pastedText = e.clipboardData.getData('text/plain');
			}
			if(Util.isNotEmpty(pastedText))Util.pasteHtmlAtCaret(pastedText);
			return false;
		});
		
		//表情
		$(".phiz-list img,.phiz-btn-b img").bind("click", function(e){
			$("#chat-area").focus();
			Util.pasteHtmlAtCaret($(this)[0].outerHTML);
//			$("#chat-area").blur();
		});
		
		//在线用户
		$("#userListBtn").click(function(){
			var userListDiv = $(".user-list-wrap");
			if(!$(this).hasClass("user-icon-open")){
				userListDiv.show();
				$(this).addClass("user-icon-open");
			}else{
				userListDiv.hide();
				$(this).removeClass("user-icon-open");
			}
		});
	});
	
	//加载系统消息
	function loadSysMessage(evt){
		loadSysMsgUI(evt.data);
	}

	//加载公聊信息，私聊信息（用户ID>用户名确认信息身份，支持表情，常用表情本地记录）
	function loadPublicChat(evt){
		loadPublicMsgUI(evt.data);
	}

	function loadPrivateChat(evt){
		try{
			evt.data.receiverId = User.id;
			evt.data.receiver = User.nickname;
		}catch(e){
			//console.log(e);
		}
		loadPrivateMsgUI(evt.data);
		
		//私聊用户自动添加到聊天用户选择列表
		var uid = evt.data.senderId;
		var uname = evt.data.sender;
		if(!isExistInChatTo(uid)){
			appendChatTo(uid, uname);
		}
	}
	
	//选择对象或所有人聊天
	function submitMsg(){
		var richText = $("#chat-area").html().replace(/\/js\/third-party\/gensee\/image\/emotion\//g,"https://static.gensee.com/webcast/static/emotion/").replace(/\/\/other.allinmd.cn\/gensee\/image\/emotion\//g,"https://static.gensee.com/webcast/static/emotion/");
		if(Util.isNotEmpty(richText)){
			var uid = $("#selectedUser").attr("uid");
			if(Util.isEmpty(uid)||uid=="0"){
				chat.send("submitChat", {"richtext":richText}, function(data){
					if(data&&data.result==false){
						if(data.data&&data.data.richtext){
							loadMinIntervalError({"content":data.data.richtext});
						}
					}
				});
				loadPublicMsgUI({"senderId":User.id,"sender":User.nickname,"richtext":richText});
			}else{
				var uname = $("#selectedUser").text();
				chat.send("submitChatTo", {"receiverId":uid,"receiver":uname,"richtext":richText}, function(data){
					if(data&&data.result==false){
						if(data.data&&data.data.richtext){
							loadMinIntervalError({"content":data.data.richtext});
						}
					}
				});
				loadPrivateMsgUI({"senderId":User.id,"sender":User.nickname,"receiverId":uid,"receiver":uname,"richtext":richText});
			}
			$("#chat-area").text("");
		}
		return false;
	}
	
	function emotionNormalize(richText, replace){
		richText = richText.replace(/<img.*?emotion\/(.+?).(gif|png)\".*?>/gi, function (match, capture) {
						var note;
						switch(capture){
							case "feedback.quickly":
								note = i18n("emotion.feedback.quickly");
								break;
							case "feedback.slowly":
								note = i18n("emotion.feedback.slowly");
								break;
							case "feedback.agreed":
								note = i18n("emotion.feedback.agreed");
								break;
							case "feedback.against":
								note = i18n("emotion.feedback.against");
								break;
							case "feedback.applaud":
								note = i18n("emotion.feedback.applaud");
								break;
							case "feedback.think":
								note = i18n("emotion.feedback.think");
								break;
							default:
								note = "";
						}
						return replace?note:match + note;
					}); 
		return richText;
	}
	
	function changeChatTo(evt){
		var el = evt.target;
		var uname = $(el).text();
		var uid = $(el).attr("uid");
		if(isValidChatTo(uid)){
			if(!selectChatTo(uid, uname)){
				appendChatTo(uid, uname);
			}
			selectChatTo(uid, uname);
			changetoChatTo(uid, uname);
		}
	}
	
	function isValidChatTo(uid){
		if(Util.isEmpty(uid))return false;
		if(User.id==uid)return false;
		return true;
	}
	
	function selectChatTo(uid, uname){
		var exist = false;
		$("#chatto-list li").each(function(){
			if($(this).attr("uid")==uid || Util.isEmpty(uid)){
				exist = true;
				$(this).siblings().css({"font-weight": ""});
				$(this).css({"font-weight": "bold"});
				return false;
			}
		});
		return exist;
	}

	function isExistInChatTo(uid){
		var exist = false;
		$("#chatto-list li").each(function(){
			if($(this).attr("uid")==uid || Util.isEmpty(uid)){
				exist = true;
				return false;
			}
		});
		return exist;
	}
	
	function changetoChatTo(uid, uname){
		$("#selectedUser").text(uname);
		if(Util.isNotEmpty(uid)){
			$("#selectedUser").attr("uid", uid);
		}else{
			$("#selectedUser").removeAttr("uid", uid);
		}
	}
	
	function appendChatTo(uid, uname){
		var sEl = '<li uid="'
			+uid
			+'" style="font-weight:bold"><a href="javascript:;">'
			+uname
			+'</a></li>';
		$(".select-option ul").append(sEl);
	}

	//------------------------------
	//UI
	function loadSysMsgUI(msg){
		var sSysMsgEle = '<li class="sys-msg">'
		+'<i class="msg-time">'
		+ (msg.time?Util.formatTime(msg.time*1000):Util.currentTime())
			+'</i><span class="">'+i18n("chat.system.system")+'</span>'
			+Util.formatUrl(msg.content)
		+'</li>';
		$("#chat-list").append(sSysMsgEle);
		var parent = $("#chat-list").parent()[0];
		parent.scrollTop=parent.scrollHeight;
		/*$("#chat-list").scrollTo({
		 fn:function(){
		 $("#chat-list").append(sSysMsgEle);
		 }
		 });*///发送后，内容滚至底部
	}
	
	function loadMinIntervalError(msg){
		var sSysMsgEle = '<li class="warning-msg">'
		+'<i class="msg-time">'
		+ (msg.time?Util.formatTime(msg.time*1000):Util.currentTime())
			+'</i> "'
			+Util.formatUrl(msg.content)
			+'" '
			+i18n("common.system.sendfail")
			+'('+i18n("chat.system.submittoooften")+')'
		+'</li>';
		$("#chat-list").append(sSysMsgEle);
		var parent = $("#chat-list").parent()[0];
		parent.scrollTop=parent.scrollHeight;
        /*$("#chat-list").scrollTo({
            fn:function(){
                $("#chat-list").append(sSysMsgEle);
            }
        });*///发送后，内容滚至底部
	}
	
	function loadPublicMsgUI(msg){
		var iAmSender = (msg.senderId == User.id);
		var sChatMsgEle = '<li class="'+(iAmSender?'my-msg':'not-mine');
		sChatMsgEle+='">'
			//todo 因返回数据取不到时间，此处公共消息的时间都是客户端当前时间，故注释掉
			//+'<i class="msg-time">'
			//+Util.currentTime()
			//+'</i>'
			+Util.replaceholder(i18n('chat.msg.speek'), [getNameSpan(msg.senderId, msg.sender, true)])
			+Util.formatUrl(msg.richtext||msg.content)
			+'</li>';

		$("#chat-list").append(sChatMsgEle);
		var parent = $("#chat-list").parent()[0];
		parent.scrollTop=parent.scrollHeight;
		/*$("#chat-list").scrollTo({
		 fn:function(){
		 $("#chat-list").append(sSysMsgEle);
		 }
		 });*///发送后，内容滚至底部
	}
	
	function loadPrivateMsgUI(msg){
		var iAmSender = (msg.senderId == User.id);
		var iAmReceiver = (msg.receiverId == User.id);
		debugger;
		var sChatMsgEle = '<li class="'
			+(iAmSender?'my-msg':'')
			+(iAmSender||iAmReceiver?'':' not-mine')
			+'"><i class="msg-time">'
			+Util.currentTime()
			+'</i>'
			+Util.replaceholder(i18n('chat.msg.speekto'), [getNameSpan(msg.senderId, msg.sender, true),getNameSpan(msg.receiverId, msg.receiver)])
			+Util.formatUrl(msg.richtext||msg.content)
			+'</li>';

        $("#chat-list").scrollTo({
            fn:function(){
                $("#chat-list").append(sChatMsgEle);
            }
        });//发送后，内容滚至底部
	}
	
	function getNameSpan(uid, uname, subject){
		var isMine = (Util.trim(uid)==User.id);
		var sEl = '<span uid="'+uid+'"'
				+(isMine?' class="role-me name"':' class="name" ')
				+((window.webPriChat !== false)?' style="text-decoration: underline; padding-left:0;"':' style="padding-left:0;"')
				+'>'
				+(isMine?(uname.split("_")[0]+(subject?i18n('chat.msg.I'):i18n('chat.msg.me'))):uname.split("_")[0])
				+'</span>';
		return sEl;
	}
	
})(Channel, window);








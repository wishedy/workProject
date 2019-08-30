
/*
 * ====================================================
 * 用户信息
 * TODO:由外部初始化
 */
var User = User||{};
var Channel = Channel||GS.createChannel();

/*
 * ====================================================
 * 
 */
$(function(){
	Channel.bind("onLottery", handleLottery);
	
	//音量
	$("#volSlider").on( "slidechange", function( event, ui ) {
		Channel.send("submitVolume", {"value":ui.value/100});
		$("#soundBtn").removeClass("horn-off-icon");
	});
	
	//静音
	$("#soundBtn").on("click", soundBtnClick);
	
	function soundBtnClick(evt){
		if($("#soundBtn").hasClass("horn-off-icon")){
			Channel.send("submitMute", {"mute":false});			
		}else{
			Channel.send("submitMute", {"mute":true});
		}
		$("#soundBtn").toggleClass("horn-off-icon");
	}
	
	Channel.bind("onMute", function(evt){
		if(evt.data){
			if(evt.data.mute == "true" || evt.data.mute == true){
				$("#soundBtn").addClass("horn-off-icon");
				$("#volSlider").slider("disable");
				$("#soundBtn").off("click");
			}else{
				$("#soundBtn").removeClass("horn-off-icon");
				$("#volSlider").slider("enable");
				$("#soundBtn").on("click", soundBtnClick);
			}
		}
	});
	//同步用户提前变更的操作
	Channel.bind("onDataReady", function(){
		var v = $("#volSlider").slider( "option", "value");
		Channel.send("submitVolume", {"value":v/100});
		if($(this).hasClass("horn-off-icon")){
			Channel.send("submitMute", {"mute":true});
		}else{
			Channel.send("submitMute", {"mute":false});			
		}
	});
});

/*
 * 第三方问卷
 */
Channel.bind("onUrlOpen", thirdpartSurvey);
function thirdpartSurvey(event){
	var myWindow=window.open(event.data.url);
	myWindow.focus();
	//提示用户点击（a标签），不会被拦截
}

/*
 * ====================================================
 * API调用错误监控
 */
Channel.bind("onAPIError", apiErrorHandler);
function apiErrorHandler(evt){
	console.warn(evt.data);
}

/*
 * ====================================================
 * 抽奖
 */
function handleLottery(evt){
	if(evt.data.action=="start"){
		startLottery(evt.data);
	}else if(evt.data.action=="stop"){
		stopLottery(evt.data);
	}else if(evt.data.action=="abort"){
		abortLottery(evt.data);
	}
}

//开始
function startLottery(lottery){
	$("#lottery-result").html("");
	$("#lottery-result").hide();
	$("#widget-lottery-bat").hide();
	$("#lottery-animation").show();
	$("#widget-lottery").show().css("z-index","999");;
}

//结束
function stopLottery(lottery){
	$("#lottery-animation").hide();
	var users = Util.escapeHTML(lottery.user);
	
	if(users && users.indexOf("\n")<(users.length-1)){
		loadWinnerList(users);
		$("#widget-lottery").hide();
		$("#widget-lottery-bat").show();
	}else{
		$("#lottery-result").html(Util.replaceholder(i18n("lottery.info.congratulatewinner"), ["<span>"+Util.escapeHTML(lottery.user)+"</span>"]));
		$("#lottery-result").show();
		$("#widget-lottery").show().css("z-index","999");;
	}
}

function loadWinnerList(users){
	var el = '<table class="prize-winner-table" cellpadding="0" cellspacing="0" width="100%">';
	var winners = users.split("\n");
	var i=0;
	for(;i<winners.length;i++){
		if(i%2==0){
			el+='<tr><td width="50%">'+winners[i]+'</td>';
		}else{
			el+='<td width="50%">'+winners[i]+'</td></tr>';
		}
	}
	if(i%2!=0)el+='<td width="50%"></td></tr>';
	el +='</table>';
	$("#widget-lottery-bat .prize-winner-box").html(el);
}

//废弃
function abortLottery(lottery){
	$("#widget-lottery").hide();
	$("#widget-lottery-bat").hide();
	$("#lottery-result").html("");
}

/*
 * ====================================================
 * 问答
 */
//准备

$(function(){
	Channel.bind("onQAList", loadQaList);
	Channel.bind("onQA", loadQa);
	Channel.bind("onQARemove", removeQa);
	Channel.bind("onTagAudio", todoQaHighlight);
	Channel.bind("onQAHighlight", qaHighlight);
	Channel.bind("onCancelHighlight", cancelQaHighlight);
	$("#cb-qa-show-mine").bind("click", changeQaShow);
	$("#qa-submit").bind("click", submitQa);
	
	$("#qa-text-area").on("keydown", function(event){
	    if(event.keyCode == 13){
	        $("#qa-submit").click();
	        return false;
	    }
	});
});

//加载历史数据
function loadQaList(evt){
	//清空问答，保留本地提交信息
	var qalocal = $("#qa-list").find(".qa-local").clone();
	$("#qa-list ul").html("");
	$("#qa-list ul").append(qalocal);
	
	var qaList = evt.data;
	for(var i in qaList.list){
		loadQaUI(qaList.list[i]);
	}
}

//加载即时数据
function loadQa(evt){
	loadQaUI(evt.data);
}

//删除某一旧数据
function removeQa(evt){
	removeQaUI({id:evt.data.id});
}

//只显示我的问答
function changeQaShow(){
	if($("#cb-qa-show-mine")[0].checked){
		$("#qa-list").addClass("qa-show-mine");
	}else{
		$("#qa-list").removeClass("qa-show-mine");
	}
}


//提问[,显示提问内容]
function submitQa(){
	var content = $("#qa-text-area").val();
	if(Util.isNotEmpty(content)){
		Channel.send("submitQuestion", {"content":content}, function(data){
			if(data&&data.result==false){
				if(data.data&&data.data.content){
					loadMinIntervalError2QaList({"content":data.data.content});
				}
			}
		});
		$("#qa-text-area").val("");
		loadQaUI({id:"local",question:content,answer:"",submitor:User.nickname,submitTime:(new Date().getTime()/1000)});
	}
}

function loadMinIntervalError2QaList(msg){
	var sSysMsgEle = '<li class="warning-msg"><div>'
	+'<i class="msg-time">'
	+ (msg.time?Util.formatTime(msg.time*1000):Util.currentTime())
		+'</i> "'
		+msg.content
		+'" '
		+i18n("common.system.sendfail")
		+'('+i18n("qa.system.submittoooften")+')'
	+'</div></li>';

    $("#qa-list ul").scrollTo({
        fn:function(){
            $("#qa-list ul").append(sSysMsgEle);
        }
    });
}
//------------------------------
//UI

function loadQaUI(qa){
	qa.answer = Util.escapeHTML(qa.answer);
	qa.question = Util.escapeHTML(qa.question);
	var sQaEle = '<li class="qa-'+qa.id+'">';
	if(Util.isNotEmpty(qa.answer)){
		sQaEle += getAElem(qa);
		sQaEle += '<div class="qa-quote">';
		sQaEle += '<span class="quote-arrow"></span>';
		sQaEle += getQElem(qa);
		var his = getHisAElem(qa);
		if(Util.isNotEmpty(his))sQaEle += his;
		sQaEle += '</div>';
	}else{
		sQaEle += getQElem(qa);
	}
	sQaEle += '</li>';
	var $qaEle = $(sQaEle);
	if(Util.trim(qa.submitor)!=User.nickname)$qaEle.addClass("not-mine");

    $("#qa-list ul").scrollTo({
        fn:function(){
            $("#qa-list ul").append($qaEle);
        }
    });
}

function getQElem(qa){
	var sQElem = '<div class="Q">'+
	    '<i class="q-icon"></i><b class="name">'+qa.submitor+i18n("base.common.colon")+'</b><span class="question">'+qa.question+'</span><span class="voi-re"></span>'+
	    '<em class="s-time">'+Util.formatTime(Number(qa.submitTime)*1000)+'</em>'+
	    '</div>';
	return sQElem;
}
function getAElem(qa){
	var sAElem = '<div class="A">'+
	    '<b class="name">'+qa.answerBy+i18n("base.common.colon")+'</b><span class="answer">'+qa.answer+'</span>'+
	    '<em class="s-time">'+Util.formatTime(Number(qa.answerTime)*1000)+'</em>'+
	    '</div>';
	return sAElem;
}
function getHisAElem(qa){
	var el = "";
	$(".qa-"+qa.id).each(function(){
		$node = $(this).find(".A :first");
		if($node.length>0){
			el += $node[0].outerHTML;
		}
	});
	return el;
}
function removeQaUI(qa){
	$(".qa-"+qa.id).remove();
}

//----------语音问答-------------
$(function(){
	$("#qa-highlight-widget .title").text(i18n("qa.audio.title"));
	$("#qa-highlight-widget .i18n-colon").text(i18n("base.common.colon"));
});

function todoQaHighlight(evt){
	var qa = {id:evt.data.id};
	$(".qa-"+qa.id+" .voi-re").text(i18n("qa.audio.tag.todolist"));
}

function qaHighlight(evt){
	var qa = {id:evt.data.id};
	$("#qa-highlight-widget .username").text($(".qa-"+qa.id+" .Q .name").first().text());
	$("#qa-highlight-widget .question").text($(".qa-"+qa.id+" .question").first().text());
/*	$("#qa-highlight-widget .answerer").text($(".qa-"+qa.id+" .A .name").text());
	$("#qa-highlight-widget .answer").text($(".qa-"+qa.id+" .A .answer").text());*/
	$("#qa-highlight-widget").show();
}

function cancelQaHighlight(evt){
	var qa = {id:evt.data.id};
	$("#qa-highlight-widget").hide();
	$(".qa-"+qa.id+" .voi-re").text(i18n("qa.audio.tag.answered"));
}


/*
 * ====================================================
 * 文字直播
 */
function loadTextInfo(info){
	var d = new Date();
	d.setTime(info.time*1000);
	var time = Util.formatDate(d);
	var lang = 'cn';
	switch(info.lang){
		case "en_US":
			lang = 'en';break;
		case "ja_JP":
			lang = 'jp';break;
		default:;
	}
	var eMsg = '<li class="text-'+lang+'">'+Util.escapeHTML(info.content)+'<i>['+time+']</i></li>';
    $("#text-live-list").scrollTo({
        fn:function(){
            $("#text-live-list").append(eMsg);
        }
    });
	if($("#text-live-widget").css("display")=="none"){
		$("#text-live-widget").show();
	}
}

$(function(){
	//文字直播选择语言
	$("#lang-box").click(function(){
		var list = $(".lang-list");
		if(list.css("display")=="none"){
			list.slideDown(200);
		}else{
			list.slideUp(200);
		}
	});
	$("#lang-list").click(function(e){
		var idx = $("#lang-list li").index($(e.target).closest("li"));
		switch(idx){
			case 0:
				$("#lang-cur").html('<em class="lang-ch"></em><span>'+i18n("textlive.lang.chinese")+'</span><s></s>');
				$("#text-live-list").addClass("show-cn");
				$("#text-live-list").removeClass("show-en");
				$("#text-live-list").removeClass("show-jp");
				break;
			case 1:
				$("#lang-cur").html('<em class="lang-en"></em><span>'+i18n("textlive.lang.english")+'</span><s></s>');
				$("#text-live-list").addClass("show-en");
				$("#text-live-list").removeClass("show-cn");
				$("#text-live-list").removeClass("show-jp");
				break;
			case 2:
				$("#lang-cur").html('<em class="lang-jp"></em><span>'+i18n("textlive.lang.japanese")+'</span><s></s>');
				$("#text-live-list").addClass("show-jp");
				$("#text-live-list").removeClass("show-en");
				$("#text-live-list").removeClass("show-cn");
				break;
			default:;
		}
	});
	
});

/*
 * ====================================================
 * 模块聚焦
 */
Channel.bind("onModuleFocus", function(evt){
	var d = Number(evt.data.focus);
	switch(d){
	case 0://文档为主
        webplayer.config.pptIsMain = widgetCssOpts.pptIsMain = true;
		$(Channel).trigger("docToMain");
		break;
	case 1://视频最大化
		$(Channel).trigger("videoToFullscreen");
		break;
	case 2://文档最大化
		$(Channel).trigger("docToFullscreen");
		break;
	case 3://视频为主
        webplayer.config.pptIsMain = widgetCssOpts.pptIsMain = false;
		$(Channel).trigger("videoToMain");
		break;
		default:;
	}
});

Channel.bind("onVideoConfig", function(evt){
	var d = evt.data;
	switch(d.type){
		case "share start":
			$(Channel).trigger("videoToMain");
			break;
		case "share stop":
			$(Channel).trigger("docToMain");
			break;
		default:;
	}
});

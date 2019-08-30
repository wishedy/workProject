

var Channel = Channel||GS.createChannel();

/*
 * ====================================================
 * 视频
 */
//服务状态
Channel.bind("onStatus", function(evt){
	var status = evt.data;
	switch(status.type){
		case 1:
			$(".alert-container .alert-main").text(Util.isEmpty(licenseNotEnoughNoticeText)?i18n("core.status.licencenotenough"):licenseNotEnoughNoticeText);
			$(".alert-container").show();
			break;
		case 2:
			$("#status-bar").text(i18n("core.status.live.notstarted"));
			break;
		case 3:
			$("#status-bar").text(i18n("core.status.buffering"));
			break;
		case 4:
			$("#status-bar").text(i18n("core.status.refusetojoin"));
			break;
        case 6:
            $("#status-bar").text(i18n("core.status.kickoutbyself"));
            $(".alert-container .alert-main").text(i18n("core.status.kickoutbyself"));
            $(".alert-container").show();
            break;
        case 7:
            $(".alert-container .alert-main").text(i18n("core.status.lockroom"));
            $(".alert-container").show();
            break;
		default:;
	}
});
//播放状态
Channel.bind("onStart", function(evt){
	$("#status-bar").text(i18n("core.status.playing"));
});
Channel.bind("onPlay", function(evt){
	$("#status-bar").text(i18n("core.status.playing"));
});
Channel.bind("onPause", function(evt){
	$("#status-bar").text(i18n("core.status.paused"));
});
Channel.bind("onStop", function(evt){
	$("#status-bar").text(i18n("core.status.ended"));
});
Channel.bind("onKickOut", function(evt){
	$("#status-bar").text(i18n("core.status.disconnected"));
});

$(function(){
	$("#videoCtrlBtn").attr("title",i18n("core.info.closevideo"));
	$("#videoCtrlBtn").on("click",function(evt){
		if($(this).hasClass("btn-open-video")){
			Channel.send("submitOpenVideo", {"openvideo":"true"});			
			$(this).removeClass("btn-open-video");
			$(this).addClass("btn-close-video");
			$(this).attr("title",i18n("core.info.closevideo"));
		}else{
			Channel.send("submitOpenVideo", {"openvideo":"false"});			
			$(this).removeClass("btn-close-video");
			$(this).addClass("btn-open-video");
			$(this).attr("title",i18n("core.info.openvideo"));
		}
	});
	$("#btn-choose-net").attr("title",i18n("core.info.netchosse"));
	

});

//Chrome下权限控制条用户气泡引导
var isWebVoiceInviting = false;     //是否语音邀请中，在接收到语音邀请后为true
var isVoiceFirstResize = true;      //出现权限控制条时第一次resize
var isVoiceTipsShowed = false;      //是否已经显示提示气泡
var bodyStartHeight,bodyEndHeight;  //窗口resize时开始和结束的高度
$(function(){
    Channel.bind("onWebAudioInvite", function(){
        isWebVoiceInviting = true;
        bodyStartHeight = $(window).height();
    });

	Channel.bind("onWebVoiceStatus", function(evt){
		if(evt.data.type === "3" ){
			isWebVoiceInviting = false;
		}
	});

    if(/Chrome/.test(navigator.userAgent)){
        $(window).bind("resize",function(){
            if(isWebVoiceInviting){
                if(isVoiceFirstResize){
                    isVoiceFirstResize = false;
                    setTimeout(function(){
                        bodyEndHeight = $(window).height();
                        //前后高度变化范围（chrome权限控制条高度37px,不同版本可能有差异）
                        if(bodyStartHeight - bodyEndHeight >35 && bodyStartHeight - bodyEndHeight < 40){
                            $("#webVoiceTips").show();
                            isVoiceTipsShowed = true;
                        }
                    },1000);
                }
                if(isVoiceTipsShowed){
                    isVoiceTipsShowed = false;
                    $("#webVoiceTips").hide();
                }
            }
        });
    }

});

//广播和系统消息
$(function(){
	Channel.bind("onKickOut", function(evt){
		if(evt.data && (evt.data.reason == 0||evt.data.reason == "0")){
			loadSysMsgUI({"content":i18n("core.status.kickout")});
		}else{
			loadSysMsgUI({"content":i18n("core.status.kickoutbyself")});
		}
	});
	
	Channel.bind("onMessage", loadSysMessage);
	
	var sysMsgNum = 0;
	//加载系统消息
	function loadSysMessage(evt){
		(function(num){
			setTimeout(function(){
				$("#sys-msg-"+num).remove();
			}, 15000);			
		})(sysMsgNum);
		loadSysMsgUI(evt.data, sysMsgNum);
		sysMsgNum++;
	}
	function loadSysMsgUI(msg, smnum){
		var sSysMsgEle = '<div id="sys-msg-'+smnum+'" class="state-tips ui-draggable">'
		+'<a class="close-btn" href="javascript:;" onclick="$(this).parent().hide()">×</a>'
		+'<h3><i class="i-horn"></i><span>'+i18n("sys.message.title")+'</span></h3>'
		+'<div class="cnt"><span class="c-red">'+Util.formatUrl(Util.escapeHTML(msg.content))+'</span></div>'
		+'</div>';
		$(".main").append(sSysMsgEle);
	}

});

//优选网络
$(function(){
	$("#btn-choose-net").on("click", function(){
		Channel.send("requireNetSettings");
	});
});

/*
 * ====================================================
 * Web语音
 */
var device = {};//{ micAllow:false, ownerId:"6e20781b686144d6ae983017c5cb647a", hasDevice:true, widgetId:""}
function webaudiocallback(data){
	device = data;
	Channel.send("submitWebVoiceMicVolume", {"value": 0.75});
}

function prepareWebVoice(){
	Channel.send("submitWebVoiceResponse", {"value": "accept"});
	Channel.send("requestWebVoiceMicList");
	$("#webVoiceWorking").css("left","");
	$("#webVocieInvite").hide();
	waitingAllowedWebVoice();
}

function waitingAllowedWebVoice(){
	if(device.hasDevice && device.micAllow){//不等待，直接开启
		startWebVoice();
	}else{//进入等待
		$("#webVoiceWorking").addClass("webvoice-step-1").removeClass("webvoice-step-2");
		deviceAcceptCountdown();
	}
}

//接受语音邀请后，“flash-设备”（拒绝状态切换到允许状态）等待倒计时
var deviceAcceptCountdownId = null;
function deviceAcceptCountdown(){
	deviceAcceptCountdownId = setTimeout(function(){
		Channel.send("submitWebVoiceResponse", {"value": "reject"});
		closeWebVoice();
	}, 15000);
}

$(function(){
	Channel.bind("onWebVoiceStatus", function(evt){//4 – 麦克风允许使用，5 – 麦克风禁止使用
		if(evt.data.type === "4"){
			device.micAllow=true;
			if(deviceAcceptCountdownId!==null){
				startWebVoice();
			}
		}else if(evt.data.type === "5"){
			device.micAllow=false;
			if(deviceAcceptCountdownId!==null){
				Channel.send("submitWebVoiceResponse", {"value": "reject"});
				closeWebVoice();
			}
		}
	});
});

function startWebVoice(){
	$("#webVoiceWorking").addClass("webvoice-step-2").removeClass("webvoice-step-1");
	if(deviceAcceptCountdownId)clearInterval(deviceAcceptCountdownId);
	deviceAcceptCountdownId = null;
}

function closeWebVoice(){
	$("#webVocieInvite").hide();
	$("#webVoiceWorking").css("left","-9999px");
	if(deviceAcceptCountdownId)clearInterval(deviceAcceptCountdownId);
	clearVoiceTime();
}

$(function(){
	Channel.bind("onWebAudioInvite", function(evt){
		clearVoiceTime();
		$("#webVocieInvite .webvoice-msg").text(Util.replaceholder(i18n("webvoice.process.invite"),[evt.data.inviter]));
		$("#webVocieInvite").show();
	});

	Channel.bind("onWebVoiceMicList", function(evt){
		var mics = evt.data.list;
		if(Util.isEmpty(mics) || mics.length==0){
			$("#webVoiceWorking").css("left","-9999px");
			return;
		}
		$("#webVoiceWorking .device-list").empty();
		for(var i in mics){
			var mic = mics[i];
			$("#webVoiceWorking .device-list").append("<option value='"+mic.id+"'"+(mic.selected?"selected":"")+">"+mic.name+"</option>");
		}
		
	});
	
	Channel.bind("onWebAudioClose", function(evt){
		closeWebVoice();
	});
	
	Channel.bind("onStatus", function(evt){
		if(evt.data.type == "5" && voiceStartTime!=0){
			Channel.send("submitWebVoiceResponse", {"value": "hangup"});
			$("#webVoiceWorking").css("left","-9999px");
			$("#webVocieInvite").hide();
		}
	});
	
	$("#wvRefuseBtn").on("click", function(){
		Channel.send("submitWebVoiceResponse", {"value": "reject"});
		$("#webVocieInvite").hide();
	});
	$("#wvAcceptBtn").on("click", function(){
		prepareWebVoice();
	});
	$("#wvHangupBtn").on("click", function(){
		Channel.send("submitWebVoiceResponse", {"value": "hangup"});
		$("#webVoiceWorking").css("left","-9999px");
	});
	$("#webVoiceWorking .device-list").on("change", function(){
		Channel.send("chooseMicrophone", {"value": $("#webVoiceWorking .device-list").val()});
	});
	$("#webvoiceVolSlider").slider({
		value: 75,
		range: "min",
		change: function() {
		},
		stop:function( evt, ui) {
			Channel.send("submitWebVoiceMicVolume", {"value": ui.value/100});
		}
	});
	$("#webVoiceSettingBtn").click(function(){
		$("#webVoiceWorking").toggleClass("webvoice-widget-show");
		if($("#webVoiceWorking").hasClass("webvoice-widget-show")){
			Channel.send("submitWebVoiceResponse", {"value": "settings"});//如何使用？
		}
	});
	
});

//语音计时
var voiceStartTime = 0;
var interval;
$(function(){
	Channel.bind("onWebVoiceStatus", function(evt){
		if(evt.data.type === "1" && voiceStartTime === 0){
			voiceStartTime = new Date().getTime();
			interval = setInterval(function(){
				flushVoiceTime();
			}, 900);
		}
	});
});
function flushVoiceTime(){
	var time = new Date().getTime() - voiceStartTime;
	$("#webVoiceWorking .webvoice-time").text(Util.timeDuration(time/1000));
}
function clearVoiceTime(){
	voiceStartTime = 0;
	$("#webVoiceWorking .webvoice-time").empty();
	clearInterval(interval);
}


/*
 * ====================================================
 * 文字直播
 */
Channel.bind("onTextWebcast", function(evt){
	loadTextInfo(evt.data);
});

/*
 * ====================================================
 * 终端升级
 */
Channel.bind("onUpgradeRequired", function(evt){
	var r=confirm(i18n("core.client.upgraderequired"));
	if (r==true){
		Channel.send("submitUpgrade", {"agree" : "true"});
	}else{
		Channel.send("submitUpgrade", {"agree" : "false"});
	}
});

Channel.bind("onSubmitUpgrade", function(evt){
	window.location = evt.data.url;
});

/*
 * ====================================================
 * 互动语音
 */
$(function(){
	$("#applyVoiceSubmitBtn").on("click", function(){
		Channel.send("applyUpgrade", {apply : "true"});
		$("#applyfor-voice-container").hide();
	});
	$("#applyVoiceCancelBtn").on("click", function(){
		Channel.send("applyUpgrade", {apply : "false"});
		$("#applyfor-voice-container").hide();
	});
	$("#voiceInteractionBtn").on("click", function(){
		if($("#applyfor-voice-container").css("display") == "none"){
			$("#applyfor-voice-container").show();
		}else{
			$("#applyfor-voice-container").hide();
		}
	});
	
});

/*
 * ====================================================
 * 举手
 */
var countdownSecond;
$(function(){
	$("#gs-handup").on("click", function(){
		Channel.send("submitHandup", {handup:true});
		countdownSecond = 60;
		if(window.handupcountdown)clearInterval(window.handupcountdown);
		window.handupcountdown = setInterval(function(){
			$("#gs-handup-countdown").text("("+(countdownSecond--)+i18n("handup.countdown.unit")+")");
			if(countdownSecond<=0){
				clearInterval(window.handupcountdown);
				$("#gs-handup-countdown").text("");
				Channel.send("submitHandup", {handup:false});
			};
		}, 1000);
	});
});

/*
 * ====================================================
 * Web用户关注状态（window聚焦且非静音）
 */
(function() {
	var focus = true;
	var focused = null;
	function onBlur() {
		focus = false;
	};
	function onFocus(){
		focus = true;
	};
	
	if (/*@cc_on!@*/false) { // check for Internet Explorer
		document.onfocusin = onFocus;
		document.onfocusout = onBlur;
	} else {
		window.onfocus = onFocus;
		window.onblur = onBlur;
	}
	
	function syncAttention(){
		if(focused !== focus){
			focused = focus;
			var mute = $("#soundBtn").hasClass("horn-off-icon");
			var attention = ((!mute)&&focus)?"true":"false";
			Channel.send("submitAttention", {"attention" : attention});
		}
	}
	
	function loopSubmitAttention(){
		setTimeout(function(){
			syncAttention();
			loopSubmitAttention();
		}, 30000);
	}
	
	syncAttention();
	loopSubmitAttention();
})();

/*
 * ====================================================
 * 
 */
$(function(){
	$("#widget-qa").bind("ready", function(){
		$( "#widget-qa" ).resizable({
			containment: ".web",
			minWidth: 188,
			minHeight: 188,
			resize: function( event, ui ) {
				webplayer.qaInnerSize();
			}
		});
	});
	$("#widget-lottery").bind("ready", function(){
		$( "#widget-lottery" ).addClass("drag-level-2");
		$( "#widget-lottery" ).draggable({
			containment: ".web",
			handle: ".gs-titlebar",
			cursor: "move",
			stack: ".drag-level-2"
		});
	});
	
	$("#widget-vote").bind("item", function(evt, data){
		$(data.targetElem).addClass("drag-level-2");
		$(data.targetElem).draggable({
	        containment: ".web",
	        handle: ".gs-titlebar",
	        cursor: "move",
	        stack: ".drag-level-2"
	    });
	});
	$("#widget-vote-result").bind("item", function(evt, data){
		$(data.targetElem).addClass("drag-level-2");
		$(data.targetElem).draggable({
			containment: ".web",
			handle: ".gs-titlebar",
			cursor: "move",
			stack: ".drag-level-2"
		});
	});
});

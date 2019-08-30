//允许播放时间
time = 180;
var loginStatus =user.getLoginStatus();
var renZhengStatus =user.getRenZhengStatus();
var wanShanStatus =user.getWanShanStatus() ;
//SWF
function ckplayer_status(str) {
    console.log(str);
var nowTime = str.substr(str.lastIndexOf(":")+1);
    if(str.indexOf("->101")>0){
        $("#MeadiaCon").hide();
        $("#recommendPic").show();
    }

    var ap = TempCache.getItem("autoPlay");
    if(ap!=undefined && ap!=null){
        setTimeout(function(){
            CKobject.getObjectById("CKa1").ckplayer_seek(180);
        },1000);
        TempCache.removeItem("autoPlay");
    }

	if(time<nowTime){
			var html = "";
            console.log("user.getLoginStatus()"+loginStatus);
            if(!loginStatus){ //未登录
				html = "<img id=\"goLogin\" src=\"\/image\/video_detail\/notlogin.png\" style=\"width:"+ v_width +"px;height:"+ v_height +"px;\"/>";
			}else{  //  已登录
                if(renZhengStatus){
                    if(!wanShanStatus){    // 未完善
                        html = "<img id=\"goLogin\" src=\"\/image\/video_detail\/notwanshan.png\" style=\"width:"+ v_width +"px;height:"+ v_height +"px;\">";
                    }
                }else{
                    html = "<img id=\"goLogin\" src=\"\/image\/video_detail\/notrenzheng.png\" style=\"width:"+ v_width +"px;height:"+ v_height +"px;\">";
                }
            }
			
			if(html.length>0){
                window.location.href= "http://"+ location.host + window.location.pathname+"?refresh=refresh";
                CKobject.getObjectById('CKa1').ckplayer_pause();
				//$("#a1").hide();
				$("#a1").css("position","absolute").css("top","-10000px");
				$("#video").prepend(html);
				/*$("#video img").on("click",function(){
					user.login({
						callback:function(){
							$("#a1").css("position","static");
							$("#goLogin").remove();
							CKobject.getObjectById('CKa1').ckplayer_play();
							time = 50000000;
						},operateType:"viewResource"
					});
				});*/


                $("#goLogin").on("vclick",function(){
                    user.needRenZhengHandler();
                });
			}
	}	
}	

//H5
var H5Time = setInterval(getNowTime,1000);
function getNowTime(){
	nowTime = document.all.CKa1.currentTime;

    var ap = TempCache.getItem("autoPlay");
    if(ap!=undefined && ap!=null){
        $("video").get(0).currentTime=180;
        TempCache.removeItem("autoPlay");
    }

    if(time<nowTime){
		window.clearInterval(H5Time);
		if(typeof $("video")!="undefined"){
			var html = "";
            if(!user.getLoginStatus()){ //未登录
                html = "<img id=\"goLogin\" src=\"\/image\/video_detail\/notlogin.png\" style=\"width:"+ v_width +"px;height:"+ v_height +"px;\"/>";

            }else if(user.getLoginStatus() && !user.getRenZhengStatus()){
                html = "<img id=\"goLogin\" src=\"\/image\/video_detail\/notrenzheng.png\" style=\"width:"+ v_width +"px;height:"+ v_height +"px;\">";
            }
			
			if(html.length>0){
                window.location.href="http://"+ location.host + window.location.pathname+"?refresh=refresh";
				document.all.CKa1.pause();
				$("video").before("<div id='videoDisable' style='position:absolute;z-index: 9;width:"+ v_width +"px;height:"+ v_height +"px;'></div>");
				$("#video>video").hide();
                $("#videoDisable").html(html);
				/*$("#videoDisable").html(html).on("click",function(){
					user.login({
						callback:function(){
							$("#video>video").show();
							$("#goLogin").remove();
							document.all.CKa1.play();
							$("#videoDisable").css("display","none");
						},operateType:"viewResource"
					});
				});*/

                $("#goLogin").on("vclick",function(){
                    user.needRenZhengHandler();
                });

            }
		}
	}
}







//function ckplayer_status(str) {
//	var nowTime = str.substr(str.lastIndexOf(":")+1);
//
//	if(time<nowTime){
//		
//		if(!user.getLoginStatus() ||(user.getLoginStatus() && !user.getRenZhengStatus())){
//			CKobject.getObjectById('CKa1').ckplayer_pause(); 
//			var html = "";
//			if(!user.getLoginStatus()){ //未登录
//				html = "<img id=\"goLogin\" src=\"//img00.allinmd.cn/login_v2/immediatelyLogin.png\" style=\"width:722px;height:450px;\"/>";
//			}else if(user.getLoginStatus() && !user.getRenZhengStatus()){
//				html = "<img id=\"goLogin\" src=\"//img00.allinmd.cn/login_v2/immediatelyAccreditation.png\" style=\"width:722px;height:450px;\">";
//			}
//			
//			if(html.length>0){
//				$("#a1").css("display","none");
//				$("#video").prepend(html).on("click",function(){
//					user.login({
//						callback:function(){
//							$("#a1").css("display","block");
//							$("#goLogin").remove();
//							CKobject.getObjectById('CKa1').ckplayer_play();
//							time = 50000000;
//						},operateType:"viewResource",
//					});
//				});
//			}
//		}
//	}
//	}

$("video").on("webkitfullscreenchange mozfullscreenchange fullscreenchange", function () {
    alert(5);
});


//点击最大化视频时触发
//var screen_change_events = "webkitfullscreenchange mozfullscreenchange fullscreenchange";
//$(kk).on(screen_change_events, function () {
//	if(!this[0]){
//		this[0]=true; 
//	}else{
//		this[0]=false;
//	}
//});



//function toggleFullScreen(ele) {
//	if (!ele.fullscreenElement &&    // alternative standard method
//	      !ele.mozFullScreenElement && !ele.webkitFullscreenElement) {  // current working methods
//		    if (ele.requestFullscreen) {
//		    		ele.requestFullscreen();
//		    } else if (ele.mozRequestFullScreen) {
//		    		ele.mozRequestFullScreen();
//		    } else if (ele.webkitRequestFullscreen) {
//		    		ele.webkitRequestFullscreen(Element.ALLOW_KEYBOARD_INPUT);
//		    }
//	} else {
//		    if (ele.cancelFullScreen) {
//		    		ele.cancelFullScreen();
//		    } else if (ele.mozCancelFullScreen) {
//		    		ele.mozCancelFullScreen();
//		    } else if (ele.webkitCancelFullScreen) {
//		    		ele.webkitCancelFullScreen();
//		    }
//	}
//}






/*********************************************/
//if((str.indexOf('103')>-1 || str.indexOf('102')>-1) &&( !user.getLoginStatus() ||(user.getLoginStatus() && !user.getRenZhengStatus()) )){
//回调函数的使用ckplayer_status(str)
//
//ckplayer_status(str)函数是实时的监听播放器里各状态的值的函数。
//
//用该函数可以实时的知道用户的动作和播放器的状态，如是否在播放介段，当前的音量大小，是否全屏状态，当前播放时间等等
//
//要使用该函数需要开启，开启的方面是在ckplayer.jsr的ck.setup或ckplayer.xml里的里的第21个参数设置成>0
//
//这里的值需要注意一下，这里设置的是返回参数的等级，等级越高，返回的参数越多，具体的要根据自己的需要使用
//
//0是不返回任何参数
//1返回播放器在播放的时候的最简单的状态，可以进行简单的交互
//2返回全部参数
//3返回全部参数，并且在参数前加上"播放器ID->"，用于多播放器的监听
//
//如果开启了使用，那么需要在播放页里放置相关函数来接受播放器里的状态参数
//
//例
//
//<script type="text/javascript">
//  function ckplayer_status(str){
//		//str即是返回的状态参数，在测试时可以用一个文本框来接收显示
//	}
//  </script>
// 
//
//以下列出大部份实用的返回状态
//
//返回字符	说明	等级
//Success:图片地址	界面元素加载成功	2
//Error:图片地址	界面元素加载失败	2
//Front:Url.ok	使用网址形式的广告地址，地址加载成功	2
//Front:Url.error	使用网址形式的广告地址，地址加载失败	2
//Front:NetStatusEvent.视频链接状态	前置广告播放视频广告时返回的状态	2
//Front:Volume.数字(0-100)	前置视频广告的音量大小	2
//Front:Load.error	前置广告加载失败	2
//Front:Start	前置广告开始播放	2
//Front:End	前置广告播放结束(这里用户点击跳过时也会返回)	2
//Front:Number.数字	正在播放的广告编号	2
//video:Load	视频开始加载	2
//video:Url.error	采用URL或XML方式加载视频时，加载URL或XML失败	2
//video:swf.error	采用SWF形式加载视频时，SWF加载失败	2
//video:Calculate.NetStatusEvent.视频链接状态	计算视频大小时的链接状态	2
//video:duration.段数索引.时长	多段视频时返回每段的时长	2
//video:bytesTotal.段数索引.字节数	多段视频时返回每段的字节数	2
//video:Official.NetStatusEvent.视频链接状态	播放视频时的链接状态	2
//nowtime:数字	已播放的秒数	2
//video:End.Number.数字	多段视频分段播放结束	2
//Marquee:Load	滚动文字广告加载成功	2
//Marquee:Close	关闭滚动文字广告	2
//Marquee:Error	没有读取到广告文字内容	2
//Plug:插件名称	调用插件名称准备加载	2
//Plug:Load.ok	插件加载成功	2
//Plug:Load.Error	插件加载失败	2
//Schedule:Down	鼠标在进度栏上按下	2
//Progress:Down	鼠标拖动按钮上按下	2
//Volume:Down	鼠标在调节音量框里按下	2
//Volume:Up	鼠标在调节音量框里松开	2
//Progress:Up	鼠标在进度栏上松开	2
//0-100	音量调节时返回	1
//101	视频播放结束	1
//102	正在播放	1
//103	暂停状态	1
//104	没有全屏，普通状态	1
//105	视频处于全屏状态	1
//106	打开视频失败	1
//107	前置视频广告结束返回状态	1
//108	视频加载结束返回	1
/***************************************/
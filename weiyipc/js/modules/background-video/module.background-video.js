/**
 * 功能描述：背景层上的视频
 * 使用方法：
 * 注意事件：
 * 引入来源：comm.LightBox.js comm.func.js 作用：
 *
 * Created by QiaoLiang on 2016/06/20.
 */

module.backgroundVideo = function(Obj){
	var ctrl= {
		opts: {
			videoSrc : ''
		},	
		init: function(obj){
			var _t= this;
			$.extend(_t.opts, obj);
			if(_t.opts.videoSrc){
				$("body").append($(_t.template(_t.opts.videoSrc)));

				if(comm.LightBox.count>0){
					var zIndex= comm.LightBox.getZIndex();
					$("#ev-BgVideo").css("zIndex",zIndex+3);
					comm.LightBox.zIndexUp();
					comm.LightBox.count++;
				}else{
					comm.LightBox.show('70','#000');
				}
				_t.pluginCKplayerCode(_t.opts.videoSrc);
				comm.setCenter($("#ev-BgVideo"));
				$("body").attr("style","");
			}

		},
		template: function(path){
			return '<div id="bg" style="width: 100%; height: 100%; background: rgb(0, 0, 0); position: fixed; z-index: 10; top: 0px; left: 0px;display: none;"></div>' +
					'<div id="ev-BgVideo" style="position: absolute;z-index:10;">' + //width:220px;height:220px;background: white;
						'<div id="videoArea" style="position: relative;z-index: 11;">'+
							'<video id="ev-videoArea" class="video-js vjs-default-skin vjs-no-flex vjs-big-play-centered" oncontextmenu="return false">'+
								'<source src="'+path+'" type="video/mp4"/>'+
							'</video>'+
						'</div>'+
						'<div id="videoAreaBg" style="width:100%;height:100%;background: #000;position: fixed;top:0;left:0;display: none;"></div>'+
					'</div>';
		},
		pluginCKplayerCode: function(path){
			//视频初始化
			//$("#ev-videoArea source").attr("src",path);
			var player2 = new AllinmdPlayer('ev-videoArea', {
				width:600,
				height:400,
				poster:"//img10.allinmd.cn/v3/terminal/defaultVideo.jpg",  //播放之前需要放置的海报图片
				//IE8下使用的swf地址
				flash: {
					swf:'//paas.allinmd.cn/modules/allinmdplayer/allinmdplayer.swf'
				},
				//需要使用的插件，清晰度切换(videoJsResolutionSwitcher)，关键点显示(progress)
				/*plugins: {
				 videoJsResolutionSwitcher:{"default": 'high', dynamicLabel: "true"}
				 },*/
				//设置播放权限时间，使用时需保证allow值为true
				limitPlayTime:{
					allow:false,
					value:3
				},//设置允许最大的快进时长，用于限制用户拖拽至不允许播放的时间点，使用时需保证allow值为true
				setMaxPlayTime:{
					allow:false,
					value:0
				}
			},function(){
				//console.log("videojs对象初始化后的回调函数");
				if(player2!=undefined){
					player2.player.play();
				}else{
					this.play();
				}

			});
			player2.player.on("play",function(){
				if(comm.players){
					$.each(comm.players,function(i,val){
						val.player.pause();//暂停其他播放
					});
				}
			});
			player2.player.on("ended",function(){
				setTimeout(function(){
					comm.LightBox.hide();
					player2.player.dispose();
					$("#ev-BgVideo,#bg").remove();
					if(comm.players) {
						$.each(comm.players, function (i, val) {
							val.player.play();//暂停其他播放
						});
					}
				},1000);
			});
			$("#videoArea").append('<a class="ev-videoPopUpWindowClose" href="javascript:;" style="display:block;width:42px;height:42px;position:absolute;top:-10px;right:-25px;z-index:12;"><img src="//img00.allinmd.cn/detail/close.png"/></a>')
		   .find(".ev-videoPopUpWindowClose").on("click",function(e){
				 comm.LightBox.hide();
				 player2.player.dispose();
				 $("#ev-BgVideo,#bg").remove();
				 if(comm.players) {
					$.each(comm.players, function (i, val) {
						val.player.play();//暂停其他播放
					});
				 }
				//事件埋点
				comm.creatEvent({
					triggerType:"全站功能按钮点击",
					keyword:"视频弹层关闭",
					actionId:43
				});
		   });
		}
	};
	ctrl.init(Obj);
};

function playerstop(){//ckPlayer内置回调只有当调用视频播放器时设置e=0或4时会有效果
	comm.LightBox.hide();
	$("#ev-BgVideo").remove();
	$("#bg").remove();
}

function closelights(){//关灯
	document.getElementById('bg').style.display='block';
}
function openlights(){//开灯
	document.getElementById('bg').style.display='none';
}
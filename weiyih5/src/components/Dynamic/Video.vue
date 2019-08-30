<template>
	<figure class="ev-video" :data-videoSrc="attachment.videoInfo.attUrl" :class="setStyle()">

		<section v-if="attachment.videoInfo.qiniuStatus==2" @click = 'addPlayer'>
			<img class="al-commentContentVideoImg notShow" :src="attachment.videoInfo.videoAttUrl||attachment.videoInfo.topicAttUrl||attachment.videoInfo.attLogoUrl||attachment.videoInfo.logoUrl" alt="">
			<i class="al-commentContentVideoBtn">
				<img class="notShow" src="./assets/videoPlay_btn.png" alt="">
			</i>
			<span class="al-commentContentVideoTime">{{attachment.videoInfo.playTime}}</span>
		</section>
		<section v-if="attachment.videoInfo.qiniuStatus==1">
			<img class="al-commentContentVideoImg notShow" src="//img10.allinmd.cn/default/qiniu296_196.jpg" alt="视频上传转码中">
		</section>
		<section v-if="attachment.videoInfo.qiniuStatus==4">
			<img class="al-commentContentVideoImg notShow" src="//img50.allinmd.cn/case/videoFailing.png" alt="视频转码失败">
		</section>
	</figure>
</template>
<style>
	.threeImgs.al-commentContentVideo{
		float:left;
		width:3.6rem;
		height:2.4rem;
		box-sizing:border-box;
		padding:0.13rem;
		padding-left:0;
	}
	.threeImgs.al-commentContentVideo .al-commentContentVideoBtn{
		width: 0.66667rem;
		height: 0.66667rem;
		border-radius: 50%;
		background-color: #ffffff;
		position: absolute;
		left: 50%;
		top: 50%;
		margin-left: -0.33333rem;
		margin-top: -0.33333rem;
	}
	.al-commentItem .threeImgs .video-js .vjs-big-play-button,
	.al-commentItem .oneImg .video-js .vjs-big-play-button{
		width: 0.66667rem;
		height: 0.66667rem;
		margin-left: -0.33333rem;
		margin-top: -0.33333rem;
	}
	.threeImgs.al-commentContentVideo .al-commentContentVideoTime{
		background-color: transparent;
		background-image: -webkit-linear-gradient(left, transparent, rgba(0, 0, 0, 0.3));
		background-image: linear-gradient(to right,transparent, rgba(0, 0, 0, 0.3));
		padding: 0.13333rem;
		padding-left: 0.8rem;
		position: absolute;
		right: 0.13333rem;
		bottom: 0;
		color: #fff;
	}
	.twoImgs.al-commentContentVideo{
		display: block;
		float: left;
		width: 4.8rem;
		height: 3.26rem;
		padding-top: 0.13333rem;
		padding-right: 0.13333rem;
		box-sizing: border-box;
	}
	.twoImgs.al-commentContentVideo .al-commentContentVideoBtn{
		width: 0.66667rem;
		height: 0.66667rem;
		border-radius: 50%;
		background-color: #ffffff;
		position: absolute;
		left: 50%;
		top: 50%;
		margin-left: -0.33333rem;
		margin-top: -0.33333rem;
	}
	.twoImgs.al-commentContentVideo .al-commentContentVideoTime{
		background-color: transparent;
		background-image: -webkit-linear-gradient(left, transparent, rgba(0, 0, 0, 0.3));
		background-image: linear-gradient(to right,transparent, rgba(0, 0, 0, 0.3));
		padding: 0.13333rem;
		padding-left: 0.8rem;
		position: absolute;
		right: 0.13333rem;
		bottom: 0;
		color: #fff;
	}
	.oneImg.al-commentContentVideo{
		display: block;
		float: left;
		width: 3.6rem;
		height: 2.4rem;
		padding-top: 0.13333rem;
		padding-right: 0.13333rem;
		box-sizing: border-box;
	}
	.oneImg.al-commentContentVideo .al-commentContentVideoBtn{
		width: 0.66667rem;
		height: 0.66667rem;
		border-radius: 50%;
		background-color: #ffffff;
		position: absolute;
		left: 50%;
		top: 50%;
		margin-left: -0.33333rem;
		margin-top: -0.33333rem;
	}
	.oneImg.al-commentContentVideo .al-commentContentVideoTime{
		background-color: transparent;
		background-image: -webkit-linear-gradient(left, transparent, rgba(0, 0, 0, 0.3));
		background-image: linear-gradient(to right,transparent, rgba(0, 0, 0, 0.3));
		padding: 0.13333rem;
		padding-left: 0.8rem;
		position: absolute;
		right: 0.13333rem;
		bottom: 0;
		color: #fff;
	}

</style>
<script>
	import comm from 'static/js/comm.js';
	import Log from 'static/js/log.js';
	export default{
		data(){
			return{

			}
		},
		props:['attachment'],
		mounted(){

		},
		methods:{
			setStyle(){
				if(this.attachment.videoInfo.qiniuStatus==2){//视频有效
					if(this.attachment.picAtt.length>=3){
						return 'al-commentContentVideo threeImgs';
					}else if(this.attachment.picAtt.length==2){
						return 'al-commentContentVideo twoImgs';
					}else if(this.attachment.picAtt.length==1){
						return "al-commentContentVideo oneImg";
					}else {
						return "al-commentContentVideo";
					}
				}else{//视频无效
					return 'al-commentContentImg';
				}
			},
			addPlayer(){
				let that = this.$el;
				if($(that).find('video').length == 0) {
					var _w = $(that).find('img').eq(0).width();
					var _h = $(that).find('img').eq(0).height();
					var poster = $(that).find('img').eq(0).attr('src');
					var n = $('video').length + 2;
					var videoItem = ' <video id="CKa' + n + '" class="video-js vjs-default-skin vjs-no-flex vjs-big-play-centered">' +
						'  <source src="' + $(that).attr('data-videoSrc') + '">' +
						'  </video>';
					$(that).children().hide();
					$(that).append(videoItem);
					var players = [];
					players[n] = new AllinmdPlayer('CKa' + n, {
						width: _w,
						height: _h,
						poster: poster,  //播放之前需要放置的海报图片
						//设置播放权限时间，使用时需保证allow值为true
						limitPlayTime: {allow: false, value: 180},//设置允许最大的快进时长，用于限制用户拖拽至不允许播放的时间点，使用时需保证allow值为true
						setMaxPlayTime: {allow: false, value: 0},
						isH5: true
					}, function () {
						var isIOS = comm.browser.versions.ios;
						var ua = navigator.userAgent.toLowerCase();
						var isAndroidChrome = /chrome\/[\d|.]+ mobile safari\/[\d|.]+$/g.test(ua);  //android手机chrome浏览器
						if (isIOS || isAndroidChrome) {  //ios放出全屏（版本10以下playsinline无效，暂无解决方法）
							$('.vjs-fullscreen-control').show().css('marginRight', '0');
							$('.allinmd-time-elements').css({
								float: 'left',
								margin: "2px 0 0 0"
							});
						}
					});
					players[n].player.play();
					comm.players.push(players[n]);
					var _player = players[n].player;
					$.each(comm.players, function (ix, plea) {
						if (_player != plea.player) {
							plea.player.pause();
						}
					});
				}
			}
		}
	}
</script>

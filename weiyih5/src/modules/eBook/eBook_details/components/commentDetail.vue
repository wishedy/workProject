<template>
	<section class="al-terminalCommentItem">
		<header class="al-terminalCommentItemHeader">
			<figure class="al-terminalCommentItemImg">
				<a :href="'/dist/personal/others_index.html?cid='+obj.cid">
					<img :src="obj.reviewCustomerLogo">
				</a>
			</figure>
			<figcaption class="al-terminalCommentItemHeadMsg">
				<h3>
					<a :href="'/dist/personal/others_index.html?cid='+obj.cid">{{obj.commentUserName}}</a>
					<i class="al-vipUser"></i>
					<span></span>
				</h3>
				<p>{{obj.company}}</p>
				<span class="al-terminalCommentTime">{{timeFormat()}}</span>
			</figcaption>
		</header>
		<article class="al-terminalCommentContent">
			<p class="content commentTexttt" v-html="htmlString(obj.reviewContent)"></p>
		</article>
		<!--视频-->
		<section class="al-terminalImgVideo" v-if="obj.videoInfo.attUrl">
			<!--有效-->
			<figure class="al-terminalImg" :data-atturl="obj.videoInfo.attUrl" style="min-height:3.111rem" v-if="obj.videoInfo.qiniuStatus==2"  @click.stop = 'addPlayer' ref="videoArea">
				<img :src="obj.videoInfo.attLogoUrl" alt="" class="decorBox ev-VideoPic"/>
				<i class="al-terminalVideoBtn ev-commentPlayBtn">
					<img src="//img50.allinmd.cn/pages/case/video.png" alt="" class="ev-VideoPic"/>
				</i>
				<span class="al-videoTime">{{obj.videoInfo.playTime}}</span>
			</figure>
			<!--无效-->
			<figure class="al-terminalImg" v-if="obj.videoInfo.qiniuStatus==1">
				<img src='//img50.allinmd.cn/case/videoFormating.jpg' alt="" class="ev-VideoPic"/>
			</figure>
			<figure class="al-terminalImg" v-if="obj.videoInfo.qiniuStatus==4">
				<img src='//img50.allinmd.cn/case/videoFailing.jpg' alt="" class="ev-VideoPic"/>
			</figure>
		</section>
		<!--视频-->
		<!--图片，最多显示6个+还有N张-->
		<section class="al-terminalCommentImgBox ev-picList" :class="obj.imgArr.length==1?'al-terminalCommentImgOne':'al-terminalCommentImgMore'" v-if="obj.imgArr.length">
			<figure class="al-terminalCommentImg" v-for="(value,key) in obj.imgArr" :key="key" :style="(key>5?'display:none;':'')">
				<img :src="value.attUrl" :alt="value.reviewAttName" :data-attwidth="value.originalAttWidth" :data-attheight="value.originalAttHeight">
				<div class="alImgHasMore" v-if="key==5&&obj.imgArr.length>6" @click="imgTrigger($event)">还有{{obj.imgArr.length-6}}张></div>
			</figure>
		</section>
		<p class="quote" v-if="obj.hasQuote">
			引用{{quoteType(obj.quoteType)}}<a :href="obj.quoteUrl">《{{obj.quoteResourceName}}》</a>
		</p>
	</section>
</template>
<script>
	import comm from 'static/js/comm.js';
	import commdate from 'static/js/comm.date.js';
	import Log from 'static/js/log.js';
	export default {
		data(){
			return {

			}
		},
		props:['obj'],
		methods:{
			quoteType(type){
				let x = '资源';
				switch(type){
					case 1:
						x='视频';break;
					case 2:
						x='文库';break;
					case 4:
						x='话题';break;
					case 7:
						x='病例';break;
				}
				return x;
			},
			timeFormat(){
				if(this.obj.collectionTime){
					return commdate.diffDay_one(this.obj.collectionTime,commdate.local_time());
				}else{
					return "";
				}
			},
			htmlString(x){
				//标签转成字符串，a链接加链接
				if(x){
					let content = x;
					content=content.replace(/<(\/*?[b-z].*?)>/g,"&lt;$1&gt;").replace(/&lt;br\/&gt;/g,'<br/>').replace(/href="?(\d)"?/g,'href=/dist/personal/others_index.html?cid=$1');
					return content;
				}
			},
			addPlayer(){
				let that = this.$refs.videoArea;
				if($(that).find('video').length == 0) {
					var _w = $(that).find('img').eq(0).width();
					var _h = $(that).find('img').eq(0).height();
					var poster = $(that).find('img').eq(0).attr('src');
					var n = $('video').length + 2;
					var videoItem = ' <video id="CKa' + n + '" class="video-js vjs-default-skin vjs-no-flex vjs-big-play-centered">' +
						'  <source src="' + $(that).attr('data-atturl') + '">' +
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
			},
			imgTrigger(e){
				$(e.target).siblings('img').click();
			}
		},
		mounted(){
			bigPicShow.init({
				/**
				 * 指定多个class|| ID
				 * */
				domIdList: [".ev-picList"],
				topSwiperOptions: {
					isInit: true,//是否需要初始化,
					onInit: function () {

					},
					zoom: true
				},
				imgClickCallBack: function (index, ele) {
					if (comm.players.length) {
						for (var i = 0; i < comm.players.length; i++) {
							comm.players[i] && comm.players[i].player.pause();
						}
					}
					//Log.createBrowse(188, '点击大图');
                    setTimeout(function(){
                        if(g_sps) {
                            g_sps.createBrowse({pageId: 432});
                        }
                    },2200);
					$('html').attr('sT', $(window).scrollTop());
					$('html,body').css({height: '100%', overflow: 'hidden'});
					if(!window.stopScroll){
						window.stopScroll='a';
					}
					return false;
				},
				bottomSwiperOptions: {
					isInit: false,//是否需要初始化,
				},
				theme: 'dark',
				closeCallBack: function () {
					$('html,body').css({height: 'auto', overflow: 'auto'});
					$(window).scrollTop($('html').attr('sT') || 0);
					$('html').removeAttr('sT');
					if(window.stopScroll){
						window.stopScroll=undefined;
					}
				},
				topTitle: {
					isInit: true,
					title: ""
				}
			});

		}
	}
</script>

<style>
	.commentTexttt a{
		color:rgb(53, 152, 219)
	}
</style>
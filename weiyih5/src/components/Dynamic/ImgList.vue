<template>
	<section class="al-commentContentImgPart ev-picList" v-if="attachment.picAtt.length||attachment.videoInfo">

		<!--0个图片 1个视频-->
		<section v-if="attachment.picAtt.length==0">
			<VideoDom :attachment="attachment" v-if="attachment.videoInfo&&(attachment.videoInfo.attUrl||attachment.videoInfo.qiniuStatus!=2)"></VideoDom>
		</section>
		<!--1个图片 1个视频 非分享视频-->
		<section v-if="attachment.picAtt.length==1 && !(attachment.opId==2&&attachment.trendType==1)">
			<VideoDom :attachment="attachment" v-if="attachment.videoInfo && (attachment.videoInfo.attUrl||attachment.videoInfo.qiniuStatus!=2)"></VideoDom>
			<figure class="al-commentContentImg" v-for="(val,key) in attachment.picAtt" :key='key' v-if="attachment.videoInfo">
				<img :src="val.videoAttUrl||val.attUrl||val.docAttUrl||val.topicAttUrl" alt="" :attwidth="val.originalAttWidth" :attheight="val.originalAttHeight"/>
			</figure>
			<!--如果有视频，显示小图片，没有视频，显示大图-->
			<figure class="al-commentContentVideo" v-for="(val,key) in attachment.picAtt" :key='key' v-if="!attachment.videoInfo">
				<a v-if='attachment.trendType==1' :href="attachment.tplPath==286||attachment.tplPath==287?'/dist/eBook/eBook_details.html?bId='+attachment.refId:attachment.resourceUrl">
				<img class="al-commentContentVideoImg notShow" :src="val.videoAttUrl||val.attUrl||val.docAttUrl||val.topicAttUrl" alt="">
				<i class="al-commentContentVideoBtn">
				<img class="notShow" src="./assets/videoPlay_btn.png" alt="">
				</i>
				<span class="al-commentContentVideoTime">{{attachment.playTime}}</span>
				</a>
				<img v-if="attachment.trendType!=1" :src="val.videoAttUrl||val.attUrl||val.docAttUrl||val.topicAttUrl" alt="" :attwidth="val.originalAttWidth" :attheight="val.originalAttHeight"/>
			</figure>



		</section>
		<!--分享视频-->
		<section v-if="attachment.opId==2&&attachment.trendType==1">
			<figure class="al-commentContentVideo">
				<a :href="attachment.tplPath==286||attachment.tplPath==287?'/dist/eBook/eBook_details.html?bId='+attachment.refId:attachment.resourceUrl">
					<img class="al-commentContentVideoImg notShow" :src="attachment.picAtt[0].videoAttUrl" alt="">
					<i class="al-commentContentVideoBtn">
						<img class="notShow" src="./assets/videoPlay_btn.png" alt="">
					</i>
					<span class="al-commentContentVideoTime">{{attachment.playTime}}</span>
				</a>
			</figure>
		</section>
		<!--2个图片-->
		<section v-if="attachment.picAtt.length==2">
			<!--有视频-->
			<VideoDom :attachment="attachment" v-if="attachment.videoInfo&&(attachment.videoInfo.attUrl||attachment.videoInfo.qiniuStatus!=2)"></VideoDom>
			<figure v-if="attachment.videoInfo" class="al-commentContentImg" v-for="(val,key) in attachment.picAtt"
					:key='key'
					style="width: 2.46667rem;height: 1.63333rem;padding-top: 0.13333rem;">
				<img :src="val.attUrl||val.docAttUrl||val.topicAttUrl" alt="" :attwidth="val.originalAttWidth"
					 :attheight="val.originalAttHeight"/>
			</figure>
			<!--无视频-->
			<figure v-if="!attachment.videoInfo" class="al-commentContentImg" v-for="(val,key) in attachment.picAtt"
					:key='key'>
				<img :src="val.attUrl||val.docAttUrl||val.topicAttUrl" alt="" :attwidth="val.originalAttWidth"
					 :attheight="val.originalAttHeight"/>
			</figure>
		</section>

		<section v-if="attachment.picAtt.length==3">
			<!--al-commentContentVideo-->
			<!--3个图片无视频-->
			<figure v-if="!attachment.videoInfo" class="al-commentContentImg" v-for="(val,key) in attachment.picAtt"
					:key='key'
					:style="key==0?
				'width: 4.8rem;height: 3.26rem;':
				'width: 2.46667rem;height: 1.63333rem;padding-top: 0.13333rem;'"
			>
				<img :class="key==0?'al-commentContentVideoImg':''" :src="val.attUrl||val.docAttUrl||val.topicAttUrl"
					 alt=""
					 :attwidth="val.originalAttWidth" :attheight="val.originalAttHeight"/>
			</figure>

			<VideoDom :attachment="attachment" v-if="attachment.videoInfo&&(attachment.videoInfo.attUrl||attachment.videoInfo.qiniuStatus!=2)"></VideoDom>
			<figure v-if="attachment.videoInfo" class="al-commentContentImg" v-for="(val,key) in attachment.picAtt"
					:key='key'>
				<img :src="val.attUrl||val.docAttUrl||val.topicAttUrl" alt="" :attwidth="val.originalAttWidth"
					 :attheight="val.originalAttHeight"/>
			</figure>
		</section>
		<section v-if="attachment.picAtt.length==4">
			<!--有视频-->
			<VideoDom :attachment="attachment" v-if="attachment.videoInfo&&(attachment.videoInfo.attUrl||attachment.videoInfo.qiniuStatus!=2)"></VideoDom>
			<figure class="al-commentContentImg" v-for="(val,key) in attachment.picAtt" :key='key'
					v-if="attachment.videoInfo&&key<3">
				<img :src="val.attUrl||val.docAttUrl||val.topicAttUrl" alt="" :attwidth="val.originalAttWidth"
					 :attheight="val.originalAttHeight"/>
			</figure>
			<!--无视频-->
			<figure v-if="!attachment.videoInfo" class="al-commentContentImg" v-for="(val,key) in attachment.picAtt"
					:key='key'>
				<img :src="val.attUrl||val.docAttUrl||val.topicAttUrl" alt="" :attwidth="val.originalAttWidth"
					 :attheight="val.originalAttHeight"/>
			</figure>
		</section>
	</section>
</template>
<style></style>
<script>
	import comm from 'static/js/comm.js';
	import Log from 'static/js/log.js';
	import VideoDom from './Video.vue';

	export default {
		data() {
			return {}
		},
		components: {
			VideoDom
		},

		props: ['attachment'],
		mounted() {

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
                    setTimeout(function(){
                        g_sps.createBrowse({pageId:432});
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
		},
		methods: {}
	}
</script>
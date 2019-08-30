<template>
	<nav class="al-personalNavbar ev-collectionNav" data-alcode-mod='470' data-alcode-item-selector="figure">
		<div class="swiper-container">
			<div class="swiper-wrapper">
				<router-link to="/collectCase" class="al-personNavbarItem swiper-slide" tag="figure"  v-if="num.caseNum>0" replace>
					<figcaption>病例</figcaption>
				</router-link>
				<router-link to="/collectVideo" class="al-personNavbarItem swiper-slide" tag="figure"  v-if="num.videoNum>0" replace>
					<figcaption>视频</figcaption>
				</router-link>
				<router-link to="/collectCourse"  class="al-personNavbarItem swiper-slide" tag="figure"  v-if="num.courseNum>0" replace>
					<figcaption>系列课</figcaption>
				</router-link>
				<router-link to="/collectDoc"  class="al-personNavbarItem swiper-slide" tag="figure"  v-if="num.docNum>0" replace>
					<figcaption>文库</figcaption>
				</router-link>
				<router-link to="/collectComment"  class="al-personNavbarItem swiper-slide" tag="figure"  v-if="num.reviewNum>0" replace>
					<figcaption>评论</figcaption>
				</router-link>
				<router-link to="/collectBook" class="al-personNavbarItem swiper-slide" tag="figure"  v-if="num.ebookNum>0" replace>
					<figcaption>书籍</figcaption>
				</router-link>
				<router-link to="/collectTopic" class="al-personNavbarItem swiper-slide" tag="figure"  v-if="num.topicNum>0" replace>
					<figcaption>话题</figcaption>
				</router-link>
			</div>
		</div>
	</nav>
</template>
<style>
	.al-personalNavbar{
		width: 100%;
		display: -webkit-box;
		display: -webkit-flex;
		display: -ms-flexbox;
		display: flex;
		-webkit-justify-content: center;
		justify-content: center;
		-ms-flex-pack: center;
		-webkit-box-pack: center;
		-webkit-box-align: center;
		-webkit-align-items: center;
		-ms-flex-align: center;
		align-items: center;
		background-color: #fff;
		padding-top: 0.4rem;
		border-bottom: 1px solid #e4e9ed;
		z-index: 3;
	}
	.router-link-active{
		color: #3598bd;
		border-bottom: 0.05333rem solid #3598db;
	}
</style>
<script>
	import comm from "static/js/comm.js";
	import Vue from "vue";
	export default{
		data(){
			return {

			}
		},
		mounted(){
			let t = this;
			setTimeout(function(){
				if(t.num.navLen>4){
					let swiper = new Swiper('.swiper-container', {
						slidesPerView: "auto",
						freeMode:true,
						freeModeMomentum : false
					});
				}
			},500);
		},
		props:['num']
	};

</script>
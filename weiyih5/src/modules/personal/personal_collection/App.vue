<template>
	<section class="al-mainInner">
		<HeaderBar :header-config="headerConfig"></HeaderBar>
		<section class="al-noContentTips" v-if="noCollectData">
			<figure>
				<img src="//img50.allinmd.cn/pages/personal/no_collect.png" alt="">
			</figure>
		</section>
		<NavLi :num="num" v-if="!noCollectData"></NavLi>
		<router-view  v-if="!noCollectData"></router-view>
	</section>
</template>
<style rel="stylesheet/scss" lang="scss">
	@import "scss/base";
	@import "scss/pages/personal/personal_collection";
	.al-personalContributionOver {
		text-align: center;
		padding-top: 0.66667rem;
		padding-bottom: 0.93333rem;
		font-size: 0.4rem;
		color: #626f8c;
		background-color: #eff4f8;
	}
</style>
<script>
	import Vue from "vue";
	import comm from 'static/js/comm.js';
	import commDate from 'static/js/comm.date.js';
	import HeaderBar from 'components/HeaderBar/HeaderBar.vue';
	import NavLi from './components/Nav.vue';
	import List from 'components/ListTemplate/OneImgList.vue';
	import collectBook from './components/CollectBook';
	import collectCase from './components/CollectCase';
	import collectVideo from './components/CollectVideo';
	import collectTopic from './components/CollectTopic';
	import collectDoc from './components/CollectDoc';
	import collectComment from './components/CollectComment';
	import collectCourse from './components/CollectCourse';
	import {shareAll} from '@allin/wap-share';
	window.shareAll = shareAll;
	// import VueAwesomeSwiper from 'vue-awesome-swiper';
	const CollectUrl = '/mcall/customer/collection/getResourceNum/';
	export default{
		data(){
			return {
				headerConfig:{
					title:"收藏的",
					backFn:function(){
						history.back();
					},
					backOnOff:true,
					share: {
						onOff: false,
					},
					feedback: {
						onOff: false
					},
				},
				num:{},
				noCollectData:false
			}
		},
		components:{
			HeaderBar,NavLi,List
		},
		beforeMount(){
			this.$router.replace({
				path:'/',
			});
		},
		mounted(){
			this.getNum();
			localStorage.setItem('readCollectionTime',commDate.local_time());
 		},
		methods:{
			getNum(){
				let t= this;
				$.ajax({
					url:CollectUrl,
					type:"get",
					dataType:"json",
					success:function(res){
						let dataList = res.responseObject.responseData.data_list;
						 // dataList = {"docNum":1,"ebookNum":0,"videoNum":0,"topicNum":0,"courseNum":0,"reviewNum":0,"caseNum":0};
						let total = 0;
						let _navLen = 0;
						for(var i in dataList){//收藏的资源总数
							total+= dataList[i];
							if(dataList[i]>0){
								_navLen++;
							}
						}
						if(total!=0){
							t.noCollectData = false;
						}else{//无收藏
							t.noCollectData = true;
						}
						//动态加载路由（倒序）
						t.num = dataList;
						t.num.navLen = _navLen;

						if(t.num.caseNum>0){
							t.$router.replace({
								name:'collectCase'
							});
							return false;
						}
						if(t.num.videoNum){
							t.$router.replace({
								name:'collectVideo'
							});
							return false;
						}
						if(t.num.courseNum){
							t.$router.replace({
								name:'collectCourse'
							});
							return false;
						}
						if(t.num.docNum){
							t.$router.replace({
								name:'collectDoc'
							});
							return false;
						}
						if(t.num.reviewNum){
							t.$router.replace({
								name:'collectComment'
							});
							return false;
						}
						if(t.num.ebookNum){
							t.$router.replace({
								name:'collectBook'
							});
							return false;
						}

						if(t.num.topicNum){
							t.$router.replace({
								name:'collectTopic'
							});
							return false;
						}

					}
				});
			}
		}

	}
</script>
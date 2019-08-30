<template>
	<section class="al-mainInner">
		<HeaderBar :header-config="headerConfig"></HeaderBar>
		<section class="al-noContentTips" v-if="surgeryNoComment">
			<figure>
				<img src="//img50.allinmd.cn/pages/personal/others_no_active.png" alt="">
			</figure>
		</section>
		<section class="ev-list al-comment" data-alcode-mod="475">
			<h2 class="al-commentRecommend" v-if="noComment && isBone"><i class="icon-recommend"></i>为你推荐</h2>
			<personalDynamic v-for="(value,key) in commentData" :obj="value" :key="key"></personalDynamic>
		</section>
		<section class="al-personalContributionOver" v-show="(noData&&!noComment&&!surgeryNoComment)||(noData&&hasLoadedRecommend)">~  没有更多了  ~</section>
		<!--骨科无数据-->
		<Loading v-show="isLoading"></Loading>
	</section>
</template>
<style rel="stylesheet/scss" lang="scss">
	@import "scss/base";
	@import "scss/pages/personal/personal_myComment";
	.al-personalContributionOver {
		text-align: center;
		padding-top: 0.66667rem;
		padding-bottom: 0.93333rem;
		font-size: 0.4rem;
		color: #626f8c;
		background-color: #eff4f8;
	}
	.al-comment{
		margin-top: 0.26667rem;
	}
	.icon-recommend:before{
		content: "";
		display: inline-block;
		width: 0.42667rem;
		height: 0.37333rem;
		vertical-align: middle;
		background-image: url(//img50.allinmd.cn/pages/index/comment_recommend.png);
		background-size: contain;
		margin-right: 0.13333rem;
	}
</style>
<script type="text/ecmascript-6">
	import Vue from "vue";
	import comm from 'static/js/comm.js';
	import Loading from 'components/Loading/Loading.vue';
	import HeaderBar from 'components/HeaderBar/HeaderBar.vue';
	import personalDynamic from 'components/Dynamic/PersonalDynamic.vue'
	import user from 'static/js/module.user.js';
	import FastClick from "fastclick";
	import commPopup from 'static/js/commPopup.js';
	import {shareAll} from '@allin/wap-share';
	window.shareAll = shareAll;
	window.FastClick = FastClick;
	FastClick.attach(document.body);
	const CollectUrl = '/mcall/customer/trends/getMapList/';
	window.user = user;
	export default{
		data(){
			return {
				headerConfig:{
					title:"朋友圈",
					backFn:function(){
						history.back();
					},
					backOnOff:true,
					release:true,
					share: {
						onOff: false,
					},
					feedback: {
						onOff: false
					},
				},
				noData: false,
				isLoading: false,
				isBone:localStorage.getItem('department')==1,	//是否是骨科，骨科没有数据时显示为你推荐，手外不显示推荐
				commentData: [],
				noComment: false,
				surgeryNoComment:false,//手外无数据
				userId:  localStorage.getItem('userId'),
				userName: '',
				userLogo: '',
				params: {
					customerId: localStorage.getItem('userId'),
					sessionCustomerId: localStorage.getItem('userId'),
					dataFlag: 7,
					logoUseFlag: 3,
					attUseFlag: 2,
					visitSiteId: 2,
					pageIndex: 1,
					pageSize: 20
				},
				recommendParams:{//推荐数据
					dataFlag:5,
					opId:0,
					trendTypes:"1,2,4,7",
					logoUseFlag:3,
					attUseFlag:2,
					visitSiteId:2,
					scene:2,
					pageIndex:1,
					pageSize:50
				},
				hasLoadedRecommend:false	//已加载推荐数据
			}
		},
		components: {
			personalDynamic, Loading,HeaderBar
		},
		mounted() {
			let t=this;
			user.privExecute({
				operateType:'login',
				callback:function(){
					t.getComment();
				}
			});
		},
		methods: {
			getComment() {
				let t = this;
				this.ajax();
				let scrollTop = 0;
				window.addEventListener('scroll', function () {
					scrollTop = window.pageYOffset || document.documentElement.scrollTop;
					if (scrollTop + document.documentElement.clientHeight > document.documentElement.scrollHeight - 50) {
						if (!t.isLoading && !t.noData &&!window.stopScroll){ //stopScroll是查看大图关闭期间滚动加载
							t.ajax();
						}
					}
				}, false);
			},
			ajax(recommendParams) {
				let t = this;
				t.isLoading = true;
				if(t.hasLoadedRecommend){	//已加载过推荐数据
					return false;
				}
				comm.ajax2({
					url:'/mcall/customer/trends/getMapList/',
					type:"get",
					data:{paramJson:JSON.stringify(recommendParams?recommendParams:t.params)},
					dataType:"json",
					success:function(res){
						t.isLoading = false;
						if (res && res.responseObject && res.responseObject.responseData && res.responseObject.responseData.customer_att) {
							t.userLogo = res.responseObject.responseData.customer_att.logoUrl;
						}
						if (res && res.responseObject && res.responseObject.responseData && res.responseObject.responseData.customer_auth) {
							t.userName = res.responseObject.responseData.customer_auth.fullName;
						}
						if (comm.hasResponseData(res)) {
							let dataList = res.responseObject.responseData.data_list;
							if (dataList && dataList.length) {
								let json = {};
								for (var i = 0, l = dataList.length; i < l; i++) {
									json = {};
									let e = dataList[i];
									json.opId = e.customer_trends.opId; //'0-发布、1-回应、2-转发、3-收藏、4-分享、5-赞（拼串存放操作id）'
									json.trendType = e.customer_trends_type;
									json.reviewContent = e.customer_trends.trendContent;
									json.commentText = e.customer_trends.trendContent;
									json.upNum = json.trendType!=8?parseInt(e.resource_valid.preferUpNum):parseInt(e.customer_trends.upNum); 	//资源的数目显示resource_valid下，评论显示的动态下
									json.reviewNum = json.trendType!=8?parseInt(e.resource_valid.reviewNum):parseInt(e.customer_trends.reviewNum);
									json.collectionTime = e.customer_trends.opDate;
									json.resourceUrl = e.customer_trends.resourceUrl;
									json.reviewType = e.customer_trends.resourceType;		//评论的类型，1视频，2文库，4话题，7病例
									json.parentId = e.customer_trends.parentCiteId;			//父评论id
									json.refName = e.customer_trends.resourceName;			//资源名称
									json.refId = e.customer_trends.resourceId;			//资源名称
									json.reviewId = e.customer_trends.citeId;//当前评论的id
									// 用户信息
									// json.cid = t.userId;
									// json.commentUserName = t.userName;
									json.reviewCustomerLogo = e.customer_att.logoUrl;
									json.cid = e.customer_auth.customerId;
									json.commentUserName = e.customer_auth.fullName || e.customer_auth.lastName + e.customer_auth.firstName;


									json.refCustomerId = e.customer_trends.parentCustomerId;

									json.reviewStatus = e.customer_trends_type == 8 ? e.customer_review.reviewStatus : 1;//评论的状态 1-发布；2-系统屏蔽；3-用户删除；４－草稿

									json.parentReviewContent = e.customer_trends_type == 8 ? e.parent_customer_review.reviewContent : '';	//父评论
									json.parentReviewStatus = e.customer_trends_type == 8 ? (e.parent_customer_review.reviewStatus == "" ? 1 : e.parent_customer_review.reviewStatus) : '';
									json.parentReivewId = e.customer_trends_type == 8 ? e.parent_customer_review.id : '';	//父评论id
									json.parentAuthorName = comm.getStrLen(e.parentOwnerNameStr,30);

									json.tplPath = e.resource_valid.tpl_Path;
									// 引用
									json.hasQuote = e.customer_quote && e.customer_quote.length ? true : false;	//是否有引用资源
									json.quoteUrl = e.customer_quote && e.customer_quote.length ? e.customer_quote[0].web_storage_path : ""; //引用资源url
									json.quoteResourceName = e.customer_quote && e.customer_quote.length ? e.customer_quote[0].refQuoteName : "";//引用资源名称
									json.quoteAuthorName = e.customer_quote && e.customer_quote.length ? e.customer_quote[0].web_storage_path : ""; //引用资源作者
									//资源

									json.res_authorName = comm.getStrLen(e.parentOwnerNameStr,30);
									switch (parseInt(e.customer_trends_type)) {
										case 1:
											json.picAtt = e.cms_video_attachment && e.cms_video_attachment.length ? e.cms_video_attachment.splice(0, 4) : [];//图片 ，只取前四个
											json.videoInfo = e.cms_video_list && e.cms_video_list[0] ? e.cms_video_list[0] : ""; //视频信息
											json.playTime = e.resource_valid.playTime;
											break;
										case 2:
											json.picAtt = e.cms_doc_attachment && e.cms_doc_attachment.length ? e.cms_doc_attachment.splice(0, 4) : [];//图片 ，只取前四个
											json.videoInfo = ""; //视频信息
											break;
										case 4:
											json.picAtt = e.cms_topic_attachment && e.cms_topic_attachment.length ? e.cms_topic_attachment.splice(0, 4) : [];//图片 ，只取前四个
											json.videoInfo = e.cms_topic_video && e.cms_topic_video[0] ? e.cms_topic_video[0] : ""; //视频信息
											break;
										case 7:
											json.picAtt = e.case_attachment_list && e.case_attachment_list.length ? e.case_attachment_list.splice(0, 4) : [];//图片 ，只取
											json.videoInfo = e.case_video_list && e.case_video_list[0] ? e.case_video_list[0] : ""; //视频信息

											break;
										case 8:
											json.picAtt = e.customer_review_attachment_list && e.customer_review_attachment_list.length ? e.customer_review_attachment_list.splice(0, 4) : [];//图片 ，只取前四个
											json.videoInfo = e.customer_review_video_list && e.customer_review_video_list[0] ? e.customer_review_video_list[0] : ""; //视频信息
											break;
										// case 16:
										//
										// 	json.picAtt = [{attUrl:e.activity.activityPicUrl}];
										// 	break;
										default:
											json.picAtt = [];//图片 ，只取前四个
											json.videoInfo = ""; //视频信息
									}
									json.attachment = {};
									json.attachment.picAtt = json.picAtt;
									json.attachment.videoInfo = json.videoInfo;
									if(json.trendType==16){
										json.attachment.picAtt = [{attUrl:e.activity.activityPicUrl}];
									}
									json.attachment.trendType = json.trendType;
									json.attachment.opId = json.opId;
									json.attachment.refId = json.refId;
									json.attachment.resourceUrl = json.resourceUrl;
									json.attachment.tplPath = json.tplPath;
									json.attachment.playTime = json.playTime;


									json.preferState = e.customer_prefer.isValid;	//是否点赞
									json.collectState = e.customer_collection.isValid;	//是否点赞

									json.isValid = e.resource_valid.resourceValid;

									t.commentData.push(json);
								}

								if(recommendParams){//判断当前请求参数中是否有推荐数据的参数，有=请求推荐数据 ， 没有= 请求朋友圈数据
									t.hasLoadedRecommend = true;		//已请求推荐数据
									t.noData = true;					//显示没有更多
								}else{//请求个人朋友圈数据
									t.params.pageIndex++;
								}
							}
							if (dataList.length < 20) {
								t.noData = true;
							}
						} else {
							if(recommendParams) {//判断当前请求参数中是否有推荐数据的参数，有=请求推荐数据 ， 没有= 请求朋友圈数据
								t.noComment = true;  //如果推荐的数据也没有，就显示无动态， 不再显示为你推荐
								t.surgeryNoComment = true;
							}else{
								if (t.params.pageIndex == 1) {//第一页就没数据
									if(!t.isBone){//如果是手外
										t.surgeryNoComment = true;
									}
									t.noComment = true;
									if(t.isBone){
										t.ajax(t.recommendParams);
									}
								}
								t.noData = true;
							}

						}
					}
				});
			}
		}
	}
</script>
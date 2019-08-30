<template>
	<section class="al-mainInner">
		<HeaderBar :header-config="headerConfig"></HeaderBar>
		<section class="al-noContentTips" v-if="noComment">
			<figure>
				<img src="//img50.allinmd.cn/pages/personal/no_comment.png" alt="">
			</figure>
		</section>
		<section class="ev-list al-comment" data-alcode-mod="475">
			<my-comment v-for="(value,key) in commentData" :obj="value" :key="key"></my-comment>
		</section>
		<section class="al-personalContributionOver" v-show="noData&&!noComment">~  没有更多了  ~</section>
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
</style>
<script>
	import Vue from "vue";
	import comm from 'static/js/comm.js';
	import Loading from 'components/Loading/Loading.vue';
	import HeaderBar from 'components/HeaderBar/HeaderBar.vue';
	import MyComment from 'components/Dynamic/MyComment.vue'
	import user from 'static/js/module.user.js';
	import FastClick from "fastclick";
	import {shareAll} from '@allin/wap-share';
	window.shareAll = shareAll;
	window.FastClick = FastClick;
	FastClick.attach(document.body);
	const CollectUrl = '/mcall/customer/review/json_list/';
	window.user = user;
	export default{
		data(){
			return {
				headerConfig:{
					title:"我评论的",
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
				noData:false,
				isLoading:false,
				commentData:[],
				noComment:false,
				userId:localStorage.getItem('userId'),
				userName:localStorage.getItem('trueName'),
				userLogo:'',
				params:{
					dataFlag:3,
					customerId:localStorage.getItem('userId')||1399252409974,
					reviewType:0,
					sortType:7,
					isTotalCount:1,
					sessionCustomerId:localStorage.getItem('userId')||1399252409974,
					scene:2,
					reviewStatus:1,
					logoUseFlag:3,
					attUseFlag:3,
					pageIndex:1,
					pageSize:20
				}
			}
		},
		components:{
			HeaderBar,MyComment,Loading
		},
		mounted(){
			let t= this;
			// user.privExecute({
			// 	operateType:'auth',
			// 	callback:function(){
					t.getComment();
			// 	}
			// });
		},
		methods:{
			getComment(){
				let t = this;
				this.ajax();
				let scrollTop = 0;
				window.addEventListener('scroll',function(){
					scrollTop = window.pageYOffset||document.documentElement.scrollTop;
					if(scrollTop+document.documentElement.clientHeight > document.documentElement.scrollHeight - 50){
						if(!t.isLoading && !t.noData &&!window.stopScroll){
							t.ajax();
						}
					}
				},false);
			},
			ajax(){
				let t = this;
				t.isLoading = true;
				comm.ajax2({
					url:CollectUrl,
					type:"get",
					data:t.params,
					dataType:"json",
					success:function(res){
						t.isLoading = false;
						if(res&&res.responseObject&&res.responseObject.responseData&& res.responseObject.responseData.customer_att){
							t.userLogo = res.responseObject.responseData.customer_att.logoUrl;
						}
						if(!t.userName){
							if(res&&res.responseObject&&res.responseObject.responseData&& res.responseObject.responseData.customer_auth){
								t.userName = res.responseObject.responseData.customer_auth.fullName;
							}
						}
						if(comm.hasResponseData(res)){
							let dataList = res.responseObject.responseData.data_list;
							if(dataList&&dataList.length){
								let json={};
								for(var i=0,l = dataList.length;i<l;i++){
									json={};
									let e = dataList[i];
									json.isValid = e.resource_valid;
									// 用户信息
									json.cid = t.userId;
									json.commentUserName = t.userName;
									json.reviewCustomerLogo = t.userLogo;

									json.refId = e.customer_review_insite.refId;
									json.reviewId = e.customer_review_insite.id;//当前评论的id
									json.parentId = e.customer_review_insite.parentId;
									json.reviewType = e.customer_review_insite.reviewType;		//评论的类型，1视频，2文库，4话题，7病例
									json.reviewNum = e.customer_review_insite.reviewNum;
									json.reviewContent = e.customer_review_insite.reviewContent;
									json.commentText = e.customer_review_insite.reviewContent;
									json.refCustomerId = e.customer_review_insite.refCustomerId;
									json.collectionTime = e.customer_review_insite.publishTime;
									json.refName = e.customer_review_insite.refName;
									json.resourceUrl =e.customer_review_insite.refUrlWap;
									json.upNum = e.customer_review_insite.upNum;

									json.reviewStatus = e.customer_review_insite.reviewStatus;//评论的状态 1-发布；2-系统屏蔽；3-用户删除；４－草稿

									json.parentReviewContent = e.parent_review_insite.reviewContent;	//父评论
									json.parentReviewStatus = e.parent_review_insite.reviewStatus==""?1:e.parent_review_insite.reviewStatus;
									json.parentReivewId = e.parent_review_insite.id;	//父评论id
									json.parentAuthorName = comm.getStrLen(e.parentOwnerNameStr,30);

									// 引用
									json.hasQuote = e.customer_quote&&e.customer_quote.length?true:false;	//是否有引用资源
									json.quoteUrl = e.customer_quote&&e.customer_quote.length?e.customer_quote[0].web_storage_path:""; //引用资源url
									json.quoteType = e.customer_quote&&e.customer_quote.length?e.customer_quote[0].quoteType:""; //引用资源url
									json.quoteResourceName = e.customer_quote&&e.customer_quote.length?e.customer_quote[0].refQuoteName:"";//引用资源名称
									json.quoteAuthorName = e.customer_quote&&e.customer_quote.length?e.customer_quote[0].web_storage_path:""; //引用资源作者
									//资源

									json.res_authorName = comm.getStrLen(e.parentOwnerNameStr,30);

									json.picAtt = e.customer_review_insite_attachment&&e.customer_review_insite_attachment.length?e.customer_review_insite_attachment.splice(0,4):[];//图片 ，只取前四个
									json.videoInfo =e.customer_review_insite_attachment_video&&e.customer_review_insite_attachment_video[0]?e.customer_review_insite_attachment_video[0]:""; //视频信息

									json.preferState = e.customer_prefer.isValid;	//是否点赞
									json.collectState = e.customer_collection.isValid;	//是否点赞
									json.attachment = {};
									json.attachment.picAtt = json.picAtt;
									json.attachment.videoInfo = json.videoInfo;
									t.commentData.push(json);
								}
								t.params.pageIndex++;
							}
							if(dataList.length<20){
								t.noData = true;
							}
						}else{
							if(t.params.pageIndex==1){
								t.noComment = true;
							}
							t.noData = true;
						}

					}
				});
			}
		}

	}
</script>
<template>
	<section>
		<section class="al-personalContent al-personalIndex al-comment" data-role="" data-alcode-mod="565">
			<Dynamic v-for="(value,key) in collectData" :obj="value" :key="key"></Dynamic>
		</section>
		<Loading v-show="isLoading"></Loading>
		<section class="al-personalContributionOver" v-show="noData&&!noCollectData">~  没有更多了  ~</section>
	</section>
</template>
<style></style>
<script>
	import comm from 'static/js/comm.js';
	import Dynamic from 'components/Dynamic/Dynamic.vue';
	import Loading from "components/Loading/Loading.vue";
	const CollectUrl = '/mcall/customer/collection/json_list/';
	export default{
		data(){
			return {
				collectData:[],
				isLoading:false,
				noData:false,
				noCollectData:false,
				collectionParam:{
					collectionType:8,
					dataFlag:3,
					customerId:localStorage.getItem('userId'),
					sessionCustomerId:localStorage.getItem('userId'),
					reviewType:0,
					isTotalCount:1,
					scene:2,
					reviewStatus:1,
					logoUseFlag:3,
					attUseFlag:3,
					pageIndex:1,
					pageSize:20
				},
				noChangeTab:true
			}
		},
		components:{
			Dynamic,Loading
		},
		beforeDestroy(){
			this.noChangeTab =false;
		},
		mounted(){
			this.getFollowCase();
		},
		methods:{
			getFollowCase(){
				let t = this;
				this.ajax();
				let scrollTop = 0;
				window.addEventListener('scroll',function(){
					scrollTop = window.pageYOffset||document.documentElement.scrollTop;
					if(scrollTop+document.documentElement.clientHeight > document.documentElement.scrollHeight - 50){
						if(!t.isLoading && !t.noData && t.noChangeTab &&!window.stopScroll){
							t.isLoading = true;
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
					type:"post",
					data:t.collectionParam,
					dataType:"json",
					success:function(res){
						t.isLoading = false;
						if(comm.hasResponseData(res)){
							let dataList = res.responseObject.responseData.data_list;
							if(dataList&&dataList.length){
								let json={};
								for(var i=0,l = dataList.length;i<l;i++){
									json={};
									let e = dataList[i];
									json.isValid = e.resource_valid.resourceValid;
									// 用户信息
									json.cid = e.review_customer.customerId;
									json.commentUserName = e.review_customer.fullName||e.review_customer.lastName+e.review_customer.firstName;
									json.reviewCustomerLogo = e.review_customer_logo.logoUrl;

									json.collectionTime = e.customer_collection.collectionTime;
									json.refName = e.customer_collection.refContent;
									json.commentText = e.customer_collection.refName;

									json.refId = e.customer_review_insite.refId;
									json.reviewId = e.customer_review_insite.id;//当前评论的id
									json.parentId = e.customer_review_insite.parentId;
									json.reviewType = e.customer_review_insite.reviewType;		//评论的类型，1视频，2文库，4话题，7病例
									json.reviewContent = e.customer_review_insite.reviewContent;
									json.refCustomerId = e.customer_review_insite.refCustomerId;
									json.reviewStatus = e.customer_review_insite.reviewStatus;//评论的状态 1-发布；2-系统屏蔽；3-用户删除；４－草稿
									json.parentReviewContent = e.parent_customer_review.reviewContent;	//父评论
									json.parentReviewStatus = e.parent_customer_review.reviewStatus;
									json.parentReivewId = e.parent_customer_review.id;	//父评论id
									json.parentAuthorName = e.parent_customer_auth.lastName+e.parent_customer_auth.firstName;

									// 引用
									json.hasQuote = e.customer_quote&&e.customer_quote.length?true:false;	//是否有引用资源
									json.quoteUrl = e.customer_quote&&e.customer_quote.length?e.customer_quote[0].web_storage_path:""; //引用资源url
									json.quoteResourceName = e.customer_quote&&e.customer_quote.length?e.customer_quote[0].refQuoteName:"";//引用资源名称
									json.quoteAuthorName = e.customer_quote&&e.customer_quote.length?e.customer_quote[0].web_storage_path:""; //引用资源作者
									//资源
									json.resourceUrl =e.resource&&e.resource.webStoragePath?e.resource.webStoragePath:'';
									json.res_authorName = e.parent_customer_auth.lastName+e.parent_customer_auth.firstName;

									json.picAtt = e.customer_review_attachment_list?e.customer_review_attachment_list.splice(0,4):[];//图片 ，只取前四个
									json.videoInfo =e.customer_review_video_list&&e.customer_review_video_list[0]?e.customer_review_video_list[0]:""; //视频信息

									json.tplPath = e.resource_valid.tplPath;
									//处理isValid
									json.attachment = {};
									json.attachment.picAtt = json.picAtt;
									json.attachment.videoInfo = json.videoInfo;



									t.collectData.push(json);
								}
								t.collectionParam.pageIndex++;
							}
							if(dataList.length<20){
								t.noData = true;
							}
						}else{
							if(t.collectionParam.pageIndex==1){
								t.noCollectData = true;
							}
							t.noData = true;
						}

					}
				});
			},
		}
	}
</script>
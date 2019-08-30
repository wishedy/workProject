<template>
	<section>
		<List v-for="(value,key) in followCase" v-bind:item ="value"  :key="key"></List>
		<section class="al-noContentTips" v-if="noFollowCase">
			<figure>
				<img src="//img50.allinmd.cn/pages/personal/no_follow_case.png" alt="">
			</figure>
		</section>
		<section class="al-personalContributionOver" v-if="noData&&!noFollowCase">~  没有更多了  ~</section>
		<Loading v-show="isLoading"></Loading>
	</section>
</template>
<style rel="stylesheet/scss">
	.al-personalContributionOver {
		text-align: center;
		padding-top: 0.66667rem;
		padding-bottom: 0.93333rem;
		font-size: 15px;
		color: #626f8c;
		background-color: #eff4f8;
	}
</style>
<script>

	import comm from "static/js/comm.js";
	import List from "components/ListTemplate/OneImgList.vue";
	import Loading from "components/Loading/Loading.vue";
	const FollowUrl = '/mcall/customer/follow/resource/getMapList3/';
	export default{
		data(){
			return{
				followCase:[],
				followCaseParam:{
					customerId : localStorage.getItem('userId')||1399252409974,
					followType : 7,
					pageIndex : 1,
					pageSize : 20,
					logoUseFlag : 2,
					attUseFlag : 5,
					visitSiteId : 2
				},
				noChangeTab:true,
				noData:false,
				isLoading:false,
				noFollowCase:false
			}
		},
		components:{
			List,Loading
		},
		mounted(){
			this.$nextTick(function(){
				this.getFollowCase();
			});
		},
		beforeDestroy(){
			this.noChangeTab =false;
		},
		methods:{
			getFollowCase(){
				let t = this;
				this.ajax();
				let scrollTop = 0;
				window.addEventListener('scroll',function(){
					scrollTop = window.pageYOffset||document.documentElement.scrollTop;
					if(scrollTop+document.documentElement.clientHeight > document.documentElement.scrollHeight - 50){
						if(!t.isLoading && !t.noData && t.noChangeTab){
							t.ajax();
						}
					}
				},false);
			},
			ajax(){
				let t = this;
				t.isLoading = true;
				comm.ajax2({
					url:FollowUrl,
					type:"post",
					data:{paramJson:JSON.stringify(t.followCaseParam)},
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
									let isValidRes = t.isValidResource({isValid:e.resource.isValid,itemTitle:e.resource.resourceName,itemUrl:e.resource.webStoragePath});
									json.currentScoreNum = (e.resource.isValid==0||e.resource.isValid==2||e.resource.isValid==3?0:e.currentScoreNum);
									json.currentStarLevel = e.currentStarLevel;
									json.itemType = 7;
									json.itemTitle = isValidRes.itemTitle;
									json.itemUrl = isValidRes.itemUrl;
									json.ownerName = e.customer_auth.lastName+e.customer_auth.firstName;
									json.browseNum = e.resource.browseNum;
									json.commentNum = e.resource.reviewNum;
									json.picNum = (e.resource.isValid==0||e.resource.isValid==2||e.resource.isValid==3?0:e.resource_att.attUrl?1:0);
									json.picUrl = e.resource_att.attUrl;
									json.isValid = e.resource.isValid;
									t.followCase.push(json);
								}
								t.followCaseParam.pageIndex++;
							}
							if(dataList.length<20){
								t.noData = true;
							}
						}else{
							if(t.followCaseParam.pageIndex==1){
								t.noFollowCase = true;
							}
							t.noData = true;
						}

					}
				});
			},
			isValidResource(obj){
				 if(obj.isValid==1||obj.isValid==undefined){
				 	return obj;
				 }else if(obj.isValid==0){
				 	return {
				 		itemUrl:'javascript:;',
						itemTitle:'该病例已被系统屏蔽',
					}
				 }else if(obj.isValid==2){
					 return {
						 itemUrl:'javascript:;',
						 itemTitle:'该病例已被用户删除',
					 }
				 }else if(obj.isValid==3){
					 return {
						 itemUrl:'javascript:;',
						 itemTitle:'该病例已被作者删除',
					 }
				 }
			}
		}
	}
</script>
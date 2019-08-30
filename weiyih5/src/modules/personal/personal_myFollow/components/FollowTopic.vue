<template>
	<section>
		<List v-for="(value,key) in followTopic" v-bind:item ="value"  :key="key"></List>
		<section class="al-noContentTips" v-if="noFollowTopic">
			<figure>
				<img src="//img50.allinmd.cn/pages/personal/no_follow_topic.png" alt="">
			</figure>
		</section>
		<section class="al-personalContributionOver" v-if="noData&&!noFollowTopic">~  没有更多了  ~</section>
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
				followTopic:[],
				followTopicParam:{
					customerId : localStorage.getItem('userId')||1399252409974,
					followType : 4,
					pageIndex : 1,
					pageSize : 20,
					logoUseFlag : 2,
					attUseFlag : 5,
					visitSiteId : 2
				},
				noChangeTab:true,
				noData:false,
				isLoading:false,
				noFollowTopic:false
			}
		},
		components:{
			List,Loading
		},
		beforeDestroy(){
			this.noChangeTab =false;
		},
		mounted(){
			this.$nextTick(function(){
				this.getFollowTopic();
			});
		},
		methods:{
			getFollowTopic(){
				let t =this;
				let scrollTop = 0;
				t.ajax();
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
					data:{paramJson:JSON.stringify(t.followTopicParam)},
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
									json.itemType = 4;
									json.itemTitle = isValidRes.itemTitle;
									json.itemUrl = isValidRes.itemUrl;
									json.ownerName = e.customer_auth.lastName+e.customer_auth.firstName;
									json.browseNum = e.resource.browseNum;
									json.commentNum = e.resource.reviewNum;
									json.picNum = (e.resource.isValid==0||e.resource.isValid==2||e.resource.isValid==3?0:e.resource_att.attUrl?1:0);
									json.picUrl = e.resource_att.topicAttUrl;
									json.isValid = e.resource.isValid;
									t.followTopic.push(json);
								}
								t.followTopicParam.pageIndex++;
							}
							if(dataList.length<20){
								t.noData = true;
							}
						}else{
							t.noData = true;
							if(t.followTopicParam.pageIndex==1){
								t.noFollowTopic = true;
							}
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
						itemTitle:'该话题已被系统屏蔽',
					}
				}else if(obj.isValid==2){
					return {
						itemUrl:'javascript:;',
						itemTitle:'该话题已被用户删除',
					}
				}else if(obj.isValid==3){
					return {
						itemUrl:'javascript:;',
						itemTitle:'该话题已被作者删除',
					}
				}
			}
		}
	}
</script>
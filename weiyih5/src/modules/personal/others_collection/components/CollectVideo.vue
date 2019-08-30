<template>
	<section>
		<section class="al-personalContent al-personalIndex"data-alcode-mod="562">
			<List v-for="(value,key) in collectData" v-bind:item ="value"  :key="key"></List>
			<section class="al-noContentTips" v-if="noCollectData">
				<figure>
					<img src="//img50.allinmd.cn/pages/personal/no_collect" alt="">
				</figure>
			</section>
			<section class="al-personalContributionOver" v-if="noData&&!noCollectData">~  没有更多了  ~</section>
			<Loading v-show="isLoading"></Loading>
		</section>
	</section>

</template>
<style rel="stylesheet/scss">

</style>
<script>
	import comm from "static/js/comm.js";
	import List from "components/ListTemplate/OneImgList.vue";
	import Loading from "components/Loading/Loading.vue";
	const CollectUrl = '/mcall/customer/collection/json_list/';
	export default{
		data(){
			return{
				collectData:[],
				collectionParam:{
					collectionType:1,
					attUseFlag: 5, //300*200 新的
					logoUseFlag: 2,
					customerId:comm.getpara().cid,
					pageIndex: 1,
					pageSize: 20
				},
				noData:false,
				isLoading:false,
				noCollectData:false,
				noChangeTab:true
			}
		},
		components:{
			List,Loading
		},
		beforeDestroy(){
			this.noChangeTab =false;
		},
		mounted(){
			this.getCollectVideo();
		},
		methods:{
			getCollectVideo(){
				let t =this;
				let scrollTop = 0;
				t.ajax();
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
									let isValidRes = t.isValidResource({isValid:e.resource_valid.resourceValid,itemTitle:e.cms_video.videoName,itemUrl:e.cms_video.webStoragePath});
									json.currentScoreNum = (e.resource_valid.resourceValid==0||e.resource_valid.resourceValid==2||e.resource_valid.resourceValid==3?0:e.cms_video.currentScoreNum);
									json.currentStarLevel = e.cms_video.currentStarLevel;
									json.itemType = 1;
									json.itemTitle = isValidRes.itemTitle;
									json.itemUrl = isValidRes.itemUrl;
									json.ownerName = e.publish_customer.lastName+e.publish_customer.firstName;
									json.browseNum = e.cms_video.playNum;
									json.commentNum = e.cms_video.reviewNum;
									json.picNum = (e.resource_valid.resourceValid==0||e.resource_valid.resourceValid==2||e.resource_valid.resourceValid==3?0:e.cms_video_attachment.videoAttUrl?1:0);
									json.picUrl = e.cms_video_attachment.videoAttUrl;
									json.isValid = e.resource_valid.resourceValid;
									t.collectData.push(json);
								}
								t.collectionParam.pageIndex++;
							}
							if(dataList.length<20){
								t.noData = true;
							}
						}else{
							t.noData = true;
							if(t.collectionParam.pageIndex==1){
								t.noCollectData = true;
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
						itemTitle:'该视频已被系统屏蔽',
					}
				}else if(obj.isValid==2){
					return {
						itemUrl:'javascript:;',
						itemTitle:'该视频已被用户删除',
					}
				}else if(obj.isValid==3){
					return {
						itemUrl:'javascript:;',
						itemTitle:'该视频已被作者删除',
					}
				}
			}
		}
	}
</script>
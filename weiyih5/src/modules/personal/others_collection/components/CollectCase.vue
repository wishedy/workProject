<template>
	<section>
		<section class="al-personalContent al-personalIndex"data-alcode-mod="471">
			<List v-for="(value,key) in followData" v-bind:item ="value"  :key="key"></List>
			<section class="al-noContentTips" v-if="noFollowData">
				<figure>
					<img src="//img50.allinmd.cn/pages/personal/no_collect.png" alt="">
				</figure>
			</section>
			<section class="al-personalContributionOver" v-if="noData&&!noFollowData">~  没有更多了  ~</section>
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
				followData:[],
				collectionParam:{
					collectionType:7,
					attUseFlag: 5, //300*200 新的
					logoUseFlag: 2,
					customerId: comm.getpara().cid,
					pageIndex: 1,
					pageSize: 20
				},
				noData:false,
				isLoading:false,
				noFollowData:false,
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
									let isValidRes = t.isValidResource({isValid:e.resource_valid.resourceValid,itemTitle:e.case_baseinfo.caseName,itemUrl:e.case_baseinfo.webStoragePath});
									json.currentScoreNum = (e.resource_valid.resourceValid==0||e.resource_valid.resourceValid==2||e.resource_valid.resourceValid==3?0:e.case_baseinfo.currentScoreNum);
									json.currentStarLevel = e.case_baseinfo.currentStarLevel;
									json.itemType = 7;
									json.itemTitle = isValidRes.itemTitle;
									json.itemUrl = isValidRes.itemUrl;
									json.ownerName = e.publish_customer.lastName+e.publish_customer.firstName;
									json.browseNum = e.case_baseinfo.browseNum;
									json.commentNum = e.case_baseinfo.reviewNum;
									json.picNum = (e.resource_valid.resourceValid==0||e.resource_valid.resourceValid==2||e.resource_valid.resourceValid==3?0:e.case_attachment.attUrl?1:0);
									json.picUrl = e.case_attachment.attUrl;
									json.isValid = e.resource_valid.resourceValid;
									t.followData.push(json);
								}
								t.collectionParam.pageIndex++;
							}
							if(dataList.length<20){
								t.noData = true;
							}
						}else{
							if(t.collectionParam.pageIndex==1){
								t.noFollowData = true;
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
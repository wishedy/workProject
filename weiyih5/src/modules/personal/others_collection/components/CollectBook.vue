<template>
	<section>
		<section class="al-personalContent al-personalIndex"data-alcode-mod="566">
			<section class="al-contentPartModule" v-for="(value,key) in collectData" :key="key">
				<section class="al-tableBox">
					<article class="al-contentText">
						<a href="javascript:;" class="al-contentTitle" :bookid="value.docId" @click="callApp(value.docId)">
							<span>{{value.docName}}</span>
						</a>
						<p class="al-contentOtherMsg"><span class="icon-contentWatchedNum">{{value.browseNum}}</span></p>
					</article>
					<figure class="al-contentImgBox aaaaaa" style="width:1.6rem;" v-if="value.attUrl">
						<a href="javascript:;" :bookid="value.docId"  @click="callApp(value.docId)">
							<img :src="value.attUrl" :alt="value.docName">
						</a>
					</figure>
				</section>
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
	import commApp from 'static/js/comm.app.js';
	import Loading from "components/Loading/Loading.vue";
	const CollectUrl = '/mcall/customer/collection/json_list/';
	export default{
		data(){
			return{
				collectData:[],
				collectionParam:{
					collectionType:17,
					attUseFlag: 5, //300*200 新的
					logoUseFlag: 2,
					customerId: comm.getpara().cid,
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
			Loading
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
						if(!t.isLoading && !t.noData && t.noChangeTab && !window.stopScroll){
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
									json.docName = e.cms_book.docName;
									json.browseNum = comm.toWKH(e.cms_book.browseNum);
									json.docId = e.cms_book.docId;
									json.attUrl = e.cms_book_attachment.docAttUrl;
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
			callApp(refId){
                let amChannel = comm.getpara()._amChannel;
				var callAppOptions ={
					ios: "allinmdios://app.allinmd.cn/applinks.html?scene=terminalPage&index=2&sourceId=" + refId + "&tplPath=286&share=app&visitSiteId=5" + (amChannel?"&_amChannel="+amChannel:''),
					android: "allin://com.allin.social:75235?data={scene:3,type:2,sourceId:"+ refId +",tplPath:286"+ (amChannel?",_amChannel:"+amChannel:'')+ "}",
					ios9: "http://app.allinmd.cn/applinks.html?scene=terminalPage&index=2&sourceId=" + refId+ "&tplPath=286&share=app&visitSiteId=5" + (amChannel?"&_amChannel="+amChannel:''),
					runAtOnce: false
				};
				commApp.appWakeUp("confirm", callAppOptions);//唤醒app弹层
			}
		}
	}
</script>
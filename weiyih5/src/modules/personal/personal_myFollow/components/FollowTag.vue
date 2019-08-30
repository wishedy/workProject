<template>
	<section>
		<section class="al-searchInputBar ev-searchTag" style="" v-if="!noFollowTag">
			<i class="icon-searchWhite"></i>
			<input type="text" placeholder="查找我关注的标签"
				   :class="(inputFocus?'focus':'')"
				   @click="focusFn()"
				   @blur="blurFn()"
				   v-model.trim="searchWord"
				   @keyup.enter="search()"
			>
			<button class="al-searchCancel" v-show="inputFocusDelay"
					@click="cancelSearch"
					style="display:inline-block">
				<i class="icon-searchCancel" ></i>取消
			</button>
		</section>
		<section class="al-noContentTips" v-show="noFollowTag">
			<figure>
				<img src="//img50.allinmd.cn/pages/personal/no_follow_tags.png" alt="">
			</figure>
		</section>
		<section class="al-searchResult" data-alcode-mod="574" v-show="!searchAction">
			<TagLi v-for="(value,key) in followTagData" :key="key" :tag = "value"></TagLi>
		</section>
		<section class="al-searchResult" data-alcode-mod="574" v-show="searchAction">
			<TagLi v-for="(value,key) in searchData" :key="key" :tag = "value"></TagLi>
		</section>
		<a href="/dist/discover/discover_tag.html" class="btn-primary-lg icon-whitePlus ev-followTag" style="position: fixed; bottom: 0px;">
			添加更多标签
		</a>

	</section>
</template>
<style>

</style>
<script>
	import comm from 'static/js/comm.js';
	import Vue from 'vue';
	import TagLi from './Tag.vue';
	import Loading from 'components/Loading/Loading.vue';
	const FollowUrl = '/mcall/customer/follow/resource/getMapList3/';
	export default{
		data(){
			return {
				noFollowTag:false,
				inputFocus:false,
				searchWord:'',
				followTagData:[],//存放已关注的默认数据
				tempData:[],//存放已关注的默认数据
				inputFocusDelay:false,
				searchData:[],	//存放搜索数据
				pageIndex:1,
				searchAction:false,
				isLoading:false,
				noData:false,
				ajaxParam:{//搜索请求的参数
					logoUseFlag:3,
					sortType:2,
					customerId:localStorage.getItem('userId'),
					maxResult:1000,
					attUseFlag:5,
					followType:61,
					refName:"",
					firstResult:0,
					visitSiteId:2
				},
				param:{//页面请求关注标签的参数
					customerId:localStorage.getItem('userId'),
					followType:61,
					pageIndex:1,
					pageSize:20,
					logoUseFlag:2,
					attUseFlag:5,
					visitSiteId:2
				},
				noChangeTab:true
			}
		},
		mounted(){
			this.$nextTick(function(){
				this.getFollowTags();
			});
		},
		beforeDestroy(){
			this.noChangeTab =false;
		},
		methods:{
			cancelSearch(){
				this.inputFocus = false;
				this.inputFocusDelay = false;
				this.followTagData = this.tempData;
				if(this.followTagData.length){
					this.noFollowTag = false;
				}else{
					this.noFollowTag = true;
				}
				this.searchAction = false;
			},
			ajax(opt){
				let t = this;
				t.isLoading = true;
				comm.ajax2({
					url:FollowUrl,
					type:'post',
					dataType:"json",
					data:{paramJson:JSON.stringify(opt.data)},
					success:function(res){
						t.isLoading = false;
						if(comm.hasResponseData(res)){
							let dataList = res.responseObject.responseData.data_list;
							for(let i=0,l = dataList.length;i<l;i++){
								let json = {};
								json.name = dataList[i].resource.propertyName;
								json.id = dataList[i].resource.propertyId;
								if(json.name&&json.id){
									opt.dataArr.push(json);
									if(opt.tempData){
										opt.tempData.push(json);
									}
								}
							}
							t.param.pageIndex++;
							if(dataList.length<20){
								t.noData = true;//没有更多了
							}
						}else{
							if(t.param.pageIndex==1||opt.type=="searchTags"){//请求关注标签第一页无数据，或搜索时无数据
								t.noFollowTag = true;
							}
							t.noData = true;
						}
					}
				})
			},
			getFollowTags(){//页面加载后请求关注标签
				var t =this;
				t.ajax({
					data:t.param,
					type:"getTags",
					dataArr:t.followTagData,
					tempData:t.tempData
				});
				let scrollTop = 0;
				window.addEventListener('scroll',function(){
					scrollTop = window.pageYOffset||document.documentElement.scrollTop;
					if(scrollTop+document.documentElement.clientHeight > document.documentElement.scrollHeight - 50){
						if(!t.isLoading && !t.noData && t.noChangeTab){
							t.ajax({
								data:t.param,
								type:"getTags",
								dataArr:t.followTagData,
								tempData:t.tempData
							});
						}

					}
				},false);
			},
			search(){
				let t = this;
				if(!t.searchWord) {//无搜索内容，返回
					return false;
				}
				t.searchAction = true;
				t.ajaxParam.refName=t.searchWord;
				t.searchData = [];
				t.ajax({
					data:t.ajaxParam,
					type:"searchTags",
					dataArr:t.searchData
				});
			},
			focusFn(){
				let t =this;
				t.inputFocus = true;
				t.followTagData=[];
				setTimeout(function(){
					t.inputFocusDelay = true;
				},200);
			},
			blurFn(){
				this.inputFocus = false;
				this.followTagData = this.tempData;
				this.followTagData = this.tempData;
				this.inputFocusDelay = false;
			},
		},
		components: {
			TagLi,Loading
		}
	}
</script>
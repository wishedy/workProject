<template>
	<section>
		<section class="al-personalContent al-personalIndex" data-alcode-mod="471">
			<ul class="courseList data_list">
				<li v-for="(val,key) in collectData" :key="key"
					:data-href="getUrl(val)"
					:data-seriesid="val.tId">
					<a :href="getUrl(val)">
						<img :src="val.coverPicUrl"></a>
					<aside>
					<p>
						<a :href="getUrl(val)">{{val.refName}}</a>
					</p>
						<p><span><i></i>{{val.totalLearnNum|toWKH}}</span><span>{{val.catalogNum||0}}节课</span></p></aside>
				</li>
			</ul>
		</section>
		<section class="al-personalContributionOver" v-if="noData&&!noCollectData">~  没有更多了  ~</section>
		<Loading v-show="isLoading"></Loading>
	</section>

</template>
<style></style>
<script>
	import Vue from 'vue';
	import comm from 'static/js/comm.js';
	import Loading from 'components/Loading/Loading.vue';
	const CollectUrl = '/mcall/customer/collection/json_list/';
	export default {
		data() {
			return {
				collectData: [],
				noData: false,	//没有更多了
				noCollectData: false,//无数据
				isLoading: false,
				collectionParam: {
					collectionType: 18,
					attUseFlag: 5,
					logoUseFlag: 2,
					customerId: comm.getpara().cid,
					pageIndex: 1,
					pageSize: 20
				},
				noChangeTab:true
			}
		},
		components: {
			Loading
		},
		beforeDestroy(){
			this.noChangeTab =false;
		},
		mounted(){
			this.getCollect();
		},
		methods: {
			getUrl(val) {
				return "/dist/discover/discover_seriesDetail.html?tId=" + val.tId;
			},
			getCollect() {
				let t = this;
				this.ajax();
				let scrollTop = 0;
				window.addEventListener('scroll', function () {
					scrollTop = window.pageYOffset || document.documentElement.scrollTop;
					if (scrollTop + document.documentElement.clientHeight > document.documentElement.scrollHeight - 50) {
						if (!t.isLoading && !t.noData&&t.collectionParam.pageIndex>1 && t.noChangeTab && !window.stopScroll) {
							t.isLoading = true;
							t.ajax();
						}
					}
				}, false);
			},
			ajax() {
				let t = this;
				t.isLoading = true;
				comm.ajax2({
					url: CollectUrl,
					type: "post",
					data: t.collectionParam,
					dataType: "json",
					success: function (res) {
						t.isLoading = false;
						if (comm.hasResponseData(res)) {
							let dataList = res.responseObject.responseData.data_list;
							if (dataList && dataList.length) {
								let json={};
								for(var i=0,l = dataList.length;i<l;i++){
									json={};
									let e = dataList[i];
									json.tId =e.customer_collection.refId;
									json.catalogNum = e.customer_collection.catalogNum;
									json.coverPicUrl = e.customer_collection.coverPicUrl;
									json.isValid = e.customer_collection.isValid;
									json.refName = e.customer_collection.refName;
									json.totalLearnNum = e.customer_collection.totalLearnNum;
									t.collectData.push(json);

								}
								t.collectionParam.pageIndex++;
							}
							if (dataList.length < 20) {
								t.noData = true;
							}
						} else {
							if (t.collectionParam.pageIndex == 1) {
								t.noCollectData = true;
							}
							t.noData = true;
						}
					}
				});
			}
		}
	}
	Vue.filter('toWKH', function(value) {
		return comm.toWKH(value);
	});
</script>
<template>
    <section>
        <section class="al-eBookItemContent slide-content" data-role="comment">
            <section class="al-terminalComment">
                <!--评论区-->
                <section class="al-terminalMainContent al-terminalCommentContent Ev-discussArea">
                    <h2 class="ev_commentNav" v-show="onlyComment">
                        评论({{revNum}})
                    </h2>
                    <section class="al-terminalComment">
                        <div id="EQ_newReplyList" data-alcode-mod='442'>
                            <commentDetail v-for='(value,key) in commentData' :obj="value" :key="key"></commentDetail>
                        </div>
                        <section class="al-terminalNoComment" v-show="noComment">
                            <span>暂无评论，快说出您的看法</span>
                        </section>
                    </section>
                </section>
                <!--评论区结束-->
                <!--没有更多-->

                <Loading v-show="isLoading"></Loading>
            </section>
        </section>
        <article class="al-terminalFinish" v-show="noData&&commentData.length">
            ~<span>没有更多了</span>~
        </article>
    </section>

</template>
<style>
    .al-terminalMainContent{
        margin-bottom:0;
    }
    .al-terminalFinish{
        padding:0.3rem 0;
    }
    .al-eBookContentWrapper:after{
        clear:both;
        display:block;
    }
    .al-terminalFinish span {
        margin-top: 0.5rem;
        display: inline-block;
    }
</style>
<script>
	import Vue from "vue";
	import comm from 'static/js/comm.js';
	import Loading from 'components/Loading/Loading.vue';
	import commentDetail from './commentDetail.vue';
	import user from 'static/js/module.user.js';
	import FastClick from "fastclick";

	window.FastClick = FastClick;
	FastClick.attach(document.body);
	const CollectUrl = '/mcall/customer/review/json_list/';
	window.user = user;
	export default{
		data(){
			return {
				noData:false,
				isLoading:false,
				commentData:[],
				noComment:false,
				userId:localStorage.getItem('userId'),
				userName:localStorage.getItem('trueName'),
				userLogo:'',
				params:{
					dataFlag:1,
					reviewType:2,
					sortType:3,
					scene:2,
					reviewStatus:1,
					logoUseFlag:3,
					attUseFlag:3,
					refId:comm.getpara().bId,
					pageSize:20,
					pageIndex:1
				},
                noChangeTab:true
			}
		},
		beforeDestroy(){
			this.noChangeTab =false;
		},
        computed:{
		    revNum(){
		    	return this.$store.state.reviewNum;
            },
            onlyComment(){
		    	return this.$store.state.onlyComment;
            }
        },
		components:{
			commentDetail,Loading
		},
		mounted(){
			let t= this;
			t.getComment();
		},
		methods:{
			getComment(){
				let t = this;
				this.ajax();
				let scrollTop = 0;
				window.addEventListener('scroll',function(){
					scrollTop = window.pageYOffset||document.documentElement.scrollTop;
					if(scrollTop+document.documentElement.clientHeight > document.documentElement.scrollHeight - 50){
						if(!t.isLoading && !t.noData &&!window.stopScroll && t.noChangeTab ){
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
									// 用户信息
									json.cid = e.customer_auth.customerId;
									json.commentUserName = e.customer_auth.fullName||e.customer_auth.lastName+e.customer_auth.firstName;
									json.reviewCustomerLogo = e.customer_att.logoUrl;
									json.reviewContent = e.customer_review.reviewContent;
									json.collectionTime = e.customer_review.publishTime;
									json.company = e.customer_auth.company;
									// 引用
									json.hasQuote = e.customer_quote&&e.customer_quote.length?true:false;	//是否有引用资源
									json.quoteUrl = e.customer_quote&&e.customer_quote.length?e.customer_quote[0].web_storage_path:""; //引用资源url
									json.quoteType = e.customer_quote&&e.customer_quote.length?e.customer_quote[0].refQuoteType:""; //引用资源url
									json.quoteResourceName = e.customer_quote&&e.customer_quote.length?e.customer_quote[0].refQuoteName:"";//引用资源名称
									json.quoteAuthorName = e.customer_quote&&e.customer_quote.length?e.customer_quote[0].web_storage_path:""; //引用资源作者
									//资源


									json.imgArr = e.customer_review_insite_attachment;//图片 ，只取前四个
									json.videoInfo =e.customer_review_insite_attachment_video.length?e.customer_review_insite_attachment_video[0]:{}; //视频信息
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
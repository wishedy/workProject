<!--用于个人我的评论-->
<template>
	<section class="al-commentItem">
		<!--头像-->
		<figure class="al-commentUserImg">
			<a :href="personalUrl" style="word-break: break-all;">
				<img :src="obj.reviewCustomerLogo" alt="">
			</a>
		</figure>
		<!--头像-->
			<article class="al-commentContent" >
				<!--评论者的名称+时间-->
				<h2 class="al-commentUserName">
					<a :href="personalUrl">
						{{obj.commentUserName|wordLen(20)}}
					</a>
					<span class="al-commentTime">{{timeFormat()}}</span>
				</h2>
				<!--评论者的名称+时间-->
				<section>
					<a href="javascript:;" style="word-break: break-all;"  v-if="obj.reviewStatus!=1">
						<p class="al-commentContentText" style="word-break: break-all;">
							<span style="color:#aaaaaa;">该评论{{getDealName(obj.reviewStatus)}}</span>
						</p>
					</a>
					<!--评论的资源且评论有效 或者 评论的评论，父子评论都有效-->
					<section v-if="obj.reviewStatus==1"> <!-- v-if="obj.parentId||obj.isValid==1"-->
						<a v-if="obj.reviewContent!='该条评论已被作者删除'" :href="obj.parentId==0||obj.parentId==undefined?detailUrl:discussUrl"
						   style="word-break: break-all;">
							<p class="al-commentContentText" style="word-break: break-all;" v-html="htmlString(obj.commentText)">
								<!--{{obj.commentText|wordLen(36)}}-->
							</p>
						</a>
						<!--图片集-->
						<ImgList :attachment="obj.attachment" v-if="obj.attachment.picAtt.length||obj.attachment.videoInfo"></ImgList>
						<!--图片集-->
						<!--引用资源-->
						<p class="al-commentContentQuote" v-if="obj.hasQuote">
							引用{{obj.quoteType==8?'评论':''}}：
							<a :href="obj.quoteUrl" style="word-break: break-all;">
								{{obj.quoteType==8?'':'《'}}<span>{{obj.quoteResourceName|wordLen(20)}}</span>{{obj.quoteType==8?'':'》'}}
							</a>
						</p>
						<!--引用资源-->
						<!--直接评论资源-->
						<article class="al-commentShareContent" v-if="!obj.parentId">
							<a v-if="obj.parentId==0||obj.parentId==undefined" :href="obj.isValid==1?obj.resourceUrl:'javascript:;'" style="word-break: break-all;">
								<span v-if="obj.isValid==1">
									{{obj.res_authorName}}{{obj.res_authorName?': ':''}}《{{obj.refName|wordLen(20)}}》
								</span>
								<span v-if="obj.isValid!=1">
									该{{getType(obj.reviewType)+getDealName(obj.isValid)}}
								</span>
							</a>
						</article>
						<!--评论父评论-->
						<article class="al-commentShareContent" v-if="obj.parentId&&obj.parentId!=0">
							<!--评论 parentId==0为直接对资源的评论，此处点击跳转到资源页，parentId!=0是对评论的评论，点击跳转讨论页-->
							<a v-if="obj.parentReviewStatus==1" :href="discussUrl" style="word-break: break-all;">
								<span class='commentTexttt' v-html="obj.parentAuthorName?(obj.parentAuthorName+': '+convertVideoWord(obj.parentReviewContent)):convertVideoWord(obj.parentReviewContent)">

									<!--{{obj.parentAuthorName}}{{obj.parentAuthorName?': ':''}}-->
									<!--{{convertVideoWord(obj.parentReviewContent)=='【影像】'?'【影像】':convertVideoWord(obj.parentReviewContent)}}-->
								</span>
							</a>
							<a v-if="obj.parentReviewStatus!=1" href="javascript:;" style="word-break: break-all;">
								<span>
									该评论{{getDealName(obj.parentReviewStatus)}}
								</span>
							</a>
						</article>
						<section class="al-commentOtherMsg">
							<span class="al-myCommentDelete" @click="deleteReview($event)">
								<i class="icon-delete"></i>删除
							</span>
							<span @click='comment'>
								  <i class="icon-commentNum"></i>
								<span class="ev-reviewNum" style="margin-left: 0;">{{obj.reviewNum<=0?'评论':obj.reviewNum}}</span>
							</span>
							<span class="al-commentLikeNum" :class="preferState==1?'al-timelineContentLiked':''" @click="preferChange">
								<i class="icon-commentLikeNum"></i>
								<span class="ev-preferNum" style="margin-left: 0;">{{preferNum>0?preferNum:'点赞'}}</span>
							</span>
							<figure class="al-commentShare ev-shareAndCollect" @click.stop="shareShow">···
								<section class="al-commentShareBtn" v-show="shareCollectShow" style="display:block;">
									<p class="al-commentShareSns icon-commentShare" :ref="'share'+obj.reviewId" :data-url="'https://m.allinmd.cn'+detailUrl">分享</p>
									<p class="al-commentCollection icon-commentCollect" :class="collectState?'icon-commentCollected':''" @click="collect($event)">收藏</p>
								</section>
							</figure>
						</section>
					</section>
				</section>

			</article>
	</section>
</template>
<style>
	.al-commentShareBtn{
		display:block;
	}
	.al-commentContentText a{
		color:rgb(53, 152, 219)
	}
	.commentTexttt a{
		color:rgb(53, 152, 219)
	}
</style>
<script>
	import comm from 'static/js/comm.js';
	import commdate from 'static/js/comm.date.js';
	import ImgList from './ImgList.vue';
	import VideoDom from './Video.vue';
	import Vue from 'vue';
	Vue.filter('wordLen',function(str,len){
		if(str){
			return comm.getStrLen(str,len);
		}
	});
	export default{
		data(){
			return {
				shareCollectShow:false,		//收藏分享显示状态
				preferState:false,				//是否已点赞
				prefering:false,					//是否正在点赞
				preferNum:0,					//点赞数
				collectState:false,
				collecting:false,
				collectNum:0,
				userId:localStorage.getItem('userId'),
				userName:localStorage.getItem('trueName')

			}
		},
		computed:{
			personalUrl:function(){
				if(this.obj.cid==localStorage.getItem('userId')){//个人贡献页
					return '/dist/personal/personal_index.html?#/contribution';
				}else{//他人贡献页
					return '/dist/personal/others_index.html?cid='+this.obj.cid;
				}
			},
			discussUrl:function(){//讨论页
				return '/dist/personal/details_discuss.html?' +
					'refCustomerId='+ this.obj.refCustomerId+
					'&refId='+       this.obj.refId+
					'&refType=' +	this.obj.reviewType+
					'&reviewId=' +this.obj.reviewId+
					'&refName=' +encodeURIComponent(this.obj.refName)+
					'&refUrl='+this.obj.resourceUrl;
			},
			detailUrl:function(){	//正文页
				return '/dist/personal/details_content.html?' +
					'refCustomerId='+ this.obj.refCustomerId+
					'&refId='+       this.obj.refId+
					'&refType=' +	this.obj.reviewType+
					'&reviewId=' +this.obj.reviewId+
					'&refName=' +encodeURIComponent(this.obj.refName)+
					'&refUrl='+this.obj.resourceUrl;
			}
		},
		props:['obj'],
		components:{
			ImgList,VideoDom
		},
		mounted(){
			this.preferState = this.obj.preferState==1?true:false;
			this.collectState =this.obj.collectState==1?true:false;
			this.preferNum = this.preferState&&this.obj.upNum==0?1:this.obj.upNum;
			// this.share();
		},
		methods:{
			getType(y){
				switch(parseInt(y)){
					case 8:
						return "评论"; break;
					case 1:
						return '视频';break;
					case 2:
						if(this.tplPath==286){
							return "书籍"
						}else{
							return '文章';
						}
						break;
					case 4:
						return '话题';break;
					case 7:
						return '病例';break;
					case 17:
						return '书籍';break;
					default:
						return '评论';
				}
			},
			htmlString(x){
				//标签转成字符串，a链接加链接
				if(x){

					let content = x;
					// let aLen = x.match(/<a/g).length;
					// let endALen = x.match(/\/a>/g).length;
					// if(aLen!=endALen){
					// 	content +='</a>';
					// }
					content=content.replace(/<(\/*?[b-z].*?)>/g,"&lt;$1&gt;").replace(/&lt;br\/&gt;/g,'<br/>').replace(/href="?(\d)"?/g,'href=/dist/personal/others_index.html?cid=$1');

					return content;
				}
			},
			getDealName(x){
				switch(parseInt(x)){
					case 0:
						return '已被系统屏蔽';break;
					case 2:
						return '已被用户删除';break;
					case 3:
						return '已被作者删除';break;
					default:return "";

				}
			},
			getAuthor(){
				let uNameOrBName="";
				if(this.authorName&& $.trim(this.authorName)){
					if(kv.videoType&&(kv.videoType==17||kv.videoType==18||kv.videoType==19)){
						uNameOrBName='<span class="al-contentAuthor bookNameIcon">'+kv.author+'</span>';
					}else{
						uNameOrBName='<span class="al-contentAuthor icon-contentAuthor">'+kv.author+'</span>';//icon-contentAuthor
					}
				}else{
					uNameOrBName="";
				}
				return uNameOrBName;
			},
			timeFormat(){
				if(this.obj.collectionTime){
					return commdate.diffDay_one(this.obj.collectionTime,commdate.local_time());
				}else{
					return "";
				}
			},
			convertVideoWord: function(str){ //转成【影像】文字
				if(/\[影像\]/.test(str) || str==""){
					return '【影像】';
				}else{
					// return comm.getStrLen(str,20);
					return this.htmlString(str);
				}
			},
			deleteReview(){
				let t = this;
				let reviewParams= {
					paramJson: JSON.stringify({id: this.obj.reviewId,reviewStatus: 3})
				};
				comm.ajax2({
					url: '/mcall/customer/review/delete/',
					data: reviewParams,
					dataType:'json',
					type:'get',
					success: function(){
						document.querySelectorAll('.al-comment')[0].removeChild(t.$el);
					}
				});
			},
			comment(){
				let url = '/pages/common/comment.html?' +
					'resourceId=' + this.obj.refId +
					'&username=' + this.userName +
					'&type=' + this.obj.reviewType +
					'&parentId=' + this.obj.reviewId;
                g_sps.jump(null,url);

			},
			preferChange(){
				let t = this;
				if(this.prefering){return false;}
				let params = {
					customerId: this.userId,//opts.customerId,
					sessionCustomerId:this.userId,
					usefulType: 8,//'类型（1-视频，2-文库，3-会议，4-话题 ,5-笔记  6-人 7-病例 8评论）',"+
					upDownType: this.preferState?0:1, //0-cai 1-zan
					refId: this.obj.reviewId //  评论ID
				};
				this.prefering = true;
				comm.ajax2({
					url:t.preferState?'/mcall/customer/prefer/delete/':'/mcall/customer/prefer/create/',
					data:{paramJson:JSON.stringify(params)},
					type:"get",
					dataType:'json',
					success:function(res){
						t.prefering =false;
						if(res&&res.responseObject&&res.responseObject.responseStatus){
							if(t.preferState){//取消点赞
								t.preferState = false;
								t.preferNum = t.preferNum-1>=0?t.preferNum-1:0;
							}else{//点赞
								t.preferState = true;
								t.preferNum++;
							}
						}
					},
					error:function(){
						t.prefering =false;
					}
				});
			},
			collect(e){
				let t=this;
				// this.shareCollectShow = false;
				if(t.collecting){return false;}
				this.collecting = true;
				let params={
					customerId:this.userId,
					collectionType:8,
					refId:this.obj.reviewId
				};
				comm.ajax2({
					url:'/mcall/customer/collection/'+(t.preferState?'delete/':'create/'),
					data:{paramJson:JSON.stringify(params)},
					type:"get",
					dataType:'json',
					success:function(res){
						t.collecting =false;
						if(res&&res.responseObject&&res.responseObject.responseStatus){
							if(t.collectState){//取消点赞
								t.collectState = false;
							}else{//点赞
								t.collectState = true;
							}
						}
					},
					error:function(){
						t.collecting =false;
					}
				});
				e.stopPropagation();
			},
			shareShow(){
				let t = this;
				shareAll({
					title:t.obj.refName,
					trendUrl:"/mcall/customer/reprint/create/",
					data:{
						"dataFlag":2,
						"attUseFlag":3,
						"refId":t.obj.trendType != 8 ? t.obj.refId : t.obj.reviewId, //  评论ID t.obj.reviewId,
						"trendsId":0,
						"logoUseFlag":3,
						"refCustomerId":t.userId,
						"visitSiteId": "2",
						"reprintType":t.obj.trendType
					},
					url:t.$refs['share'+t.obj.reviewId].getAttribute('data-url'),
					noPJ:0,
					pic:t.obj.picAtt.length?t.obj.picAtt[0].attUrl:'https://m.allinmd.cn/image/allin_logo.png',
					wxDesc:t.obj.reviewContent,
					summary:t.obj.reviewContent,
                    triggerEventFn:function(){
                      t.shareCollectShow = false;
                    },
                    qShareLog:function(x,obj){    //分享新浪，空间成功与否都执行
						comm.shareLog({
							shareType: "",
							resourceId: "",
							resourceType:"",
							refId: "",
							refUrl:t.$refs['share'+t.obj.reviewId].getAttribute('data-url'),
							shareSence: '',
							shareChannel: x=='sina'?3:1,
							shareContent: t.obj.refName,
							refCustomerId: t.userId
						});
					},
					fnMessageSuc:function(obj){
						comm.shareLog({
							shareType: "",
							resourceId:"" ,
							resourceType: "",
							refId: "",
							refUrl:t.$refs['share'+t.obj.reviewId].getAttribute('data-url'),
							shareSence:"",
							shareChannel:4,
							shareContent: t.obj.refName,
							refCustomerId: t.userId
						});
					},      //分享好友成功回调
					fnTimelineSuc:function(obj){
						comm.shareLog({
							shareType: "",
							resourceId:"" ,
							resourceType: "",
							refId: "",
							refUrl:t.$refs['share'+t.obj.reviewId].getAttribute('data-url'),
							shareSence:"",
							shareChannel:5,
							shareContent: t.obj.refName,
							refCustomerId: t.userId
						});
					}      //分享朋友圈成功回调

				},false,jQuery(t.$refs['share'+t.obj.reviewId]));
				this.shareCollectShow = !this.shareCollectShow;
			}
		}
	}
</script>
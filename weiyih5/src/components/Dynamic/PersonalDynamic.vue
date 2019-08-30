<!--用于个人中心我的动态,他人动态，朋友圈-->
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
					<span class="al-commentShareTips">{{(obj.trendType==16&&obj.opId==2)?'分享活动':(obj.opId==2?'分享':'')}}</span>
					<span class="al-commentTime">{{timeFormat()}}</span>
				</h2>
				<!--评论者的名称+时间-->
				<section v-if="obj.trendType==8">
					<a href="javascript:;" style="word-break: break-all;display:block;"  v-if="obj.reviewStatus!=1">
						<!--<p class="al-commentContentText" style="word-break: break-all;">-->
							<!--<span style="color:#aaaaaa;"></span>-->
						<!--</p>-->
						<article class="al-commentShareContent"><span>该{{getType(obj.reviewType)}}{{getDealName(obj.reviewStatus)}}</span></article>
					</a>
					<section v-if="obj.reviewStatus==1">
						<a v-if="obj.reviewContent!='该条评论已被作者删除'" :href="obj.parentId==0||obj.parentId==undefined?detailUrl:discussUrl"
						   style="word-break: break-all;">
							<p class="al-commentContentText" style="word-break: break-all;"
							   v-html="(obj.opId==2&&obj.parentAuthorName?obj.parentAuthorName+': ':'')+htmlString(obj.commentText,obj.opId)">
								<!--{{obj.opId==2&&obj.parentAuthorName?obj.parentAuthorName+': ':''}}{{obj.commentText|wordLen(obj.opId==2?50:36)}}-->

							</p>
						</a>

						<!--图片集-->
						<ImgList :attachment = 'obj.attachment' v-if="obj.attachment.picAtt||obj.attachment.videoInfo"></ImgList>
						<!--图片集-->
						<!--引用资源-->
						<p class="al-commentContentQuote" v-if="obj.hasQuote&&obj.opId!=2">
							引用：
							<a :href="obj.quoteUrl" style="word-break: break-all;">
								《<span>{{obj.quoteResourceName|wordLen(20)}}</span>》
							</a>
						</p>
						<!--引用资源-->
						<!--直接评论资源-->
						<article class="al-commentShareContent" v-if="!obj.parentId&&obj.opId!=2">
							<a v-if="obj.parentId==0||obj.parentId==undefined" :href="obj.isValid==1?obj.resourceUrl:'javascript:;'" style="word-break: break-all;">
								<span v-if="obj.isValid==1">
									{{obj.res_authorName}}{{obj.res_authorName?': ':''}}《{{obj.refName}}》
								</span>
								<span v-if="obj.isValid!=1">
									该{{getType(obj.reviewType)+getDealName(obj.isValid)}}
								</span>
							</a>
						</article>
						<!--评论父评论-->
						<article class="al-commentShareContent" v-if="obj.parentId&&obj.parentId!=0&&obj.opId!=2">
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
						<!--社交操作-->
						<section class="al-commentOtherMsg" v-if="obj.tplPath!=286&&obj.tplPath!=287"><!--书籍无社交操作-->
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
									<p class="al-commentShareSns icon-commentShare" :ref="'share'+obj.reviewId">分享</p>
									<p class="al-commentCollection icon-commentCollect" :class="collectState?'icon-commentCollected':''" @click="collect($event)">收藏</p>
								</section>
							</figure>
						</section>
						<!--社交操作-->
					</section>
				</section>
				<section v-if="obj.trendType!=8">
					<!--评论删除-->
					<a href="javascript:;" style="word-break: break-all;"  v-if="obj.isValid!=1">
						<article class="al-commentShareContent"><span>该{{getType(obj.reviewType)}}{{getDealName(obj.isValid)}}</span></article>
					</a>
					<section v-if="obj.isValid==1">
						<p class="al-commentContentText" style="word-break: break-all;" v-if="obj.opId!=2">
							<a :href="obj.tplPath==286||obj.tplPath==287?'/dist/eBook/eBook_details.html?bId='+obj.refId:obj.resourceUrl" style="word-break: break-all;color:#333;" v-html="obj.refName">
								<!--{{obj.refName}}&lt;!&ndash;|wordLen(36)&ndash;&gt;-->
							</a>
						</p>
						<p class="al-commentContentText" style="word-break: break-all;" v-if="obj.opId==2">
							<a :href="obj.tplPath==286||obj.tplPath==287?'/dist/eBook/eBook_details.html?bId='+obj.refId:obj.resourceUrl" style="word-break: break-all;color:#333;">
							{{obj.tplPath==286||obj.tplPath==287?"":(obj.parentAuthorName?obj.parentAuthorName+':':'')}}{{obj.trendType==16?obj.refName:'《'+obj.refName+'》'}}<!--|wordLen(36)-->
							</a>
						</p>

						<!--图片集-->
						<ImgList :attachment = 'obj.attachment' v-if="obj.attachment.picAtt||obj.attachment.videoInfo"></ImgList>
						<!--图片集-->
						<!--社交操作-->
						<section class="al-commentOtherMsg" v-if="obj.tplPath!=286&&obj.tplPath!=287">
							<span @click='comment' v-if="obj.trendType!=16">
								  <i class="icon-commentNum"></i>
								<span class="ev-reviewNum" style="margin-left: 0;">{{obj.reviewNum<=0?'评论':obj.reviewNum}}</span>
							</span>
							<span class="al-commentLikeNum" :class="preferState==1?'al-timelineContentLiked':''" @click="preferChange" v-if="obj.trendType!=16">
								<i class="icon-commentLikeNum"></i>
								<span class="ev-preferNum" style="margin-left: 0;">{{preferNum>0?preferNum:'点赞'}}</span>
							</span>
							<figure class="al-commentShare ev-shareAndCollect" @click.stop="shareShow">···
								<section class="al-commentShareBtn" v-show="shareCollectShow" style="display:block;">
									<p class="al-commentShareSns icon-commentShare" :ref="'share'+(obj.opId==2&&obj.trendType!=8?obj.refId:obj.reviewId)" :data-v ="'share'+(obj.opId==2&&obj.trendType!=8?obj.refId:obj.reviewId)" >分享</p>
									<p class="al-commentCollection icon-commentCollect" :class="collectState?'icon-commentCollected':''" @click="collect($event)" v-if="obj.trendType!=16">收藏</p>
								</section>
							</figure>
						</section>
						<!--社交操作-->
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
	import user from 'static/js/module.user.js';
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
				userName:localStorage.getItem('trueName'),
				hasAuth:false//有登录认证权限
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
			let state = localStorage.getItem('auth')&&JSON.parse(localStorage.getItem('auth')).state;
			if(state==2||state==7||state==8||state==9){
				this.hasAuth =true;
			}
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
				}
			},
			getDealName(x){
				switch(parseInt(x)){
					case 0:
						return '已被系统屏蔽';break;
					case 2:
						return '已被系统屏蔽';break;
						// return '已被用户删除';break;
					case 3:
						return '已被作者删除';break;
					default:return "";

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
				}else{
					return "";
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
					// return comm.getStrLen(str,20)
					return this.htmlString(str);
				}
			},
			comment(){
				let t =this;
				if(t.hasAuth){
					let url = '//m.allinmd.cn/pages/common/comment.html?' +
						'resourceId=' + t.obj.refId +
						'&username=' + t.obj.commentUserName +
						'&type=' + t.obj.reviewType +
						'&parentId=' + t.obj.reviewId;
                    g_sps.jump(null,url);
				}else{
					user.privExecute({
						operateType:'auth',
						callback:function(){
							let url = '//m.allinmd.cn/pages/common/comment.html?' +
								'resourceId=' + t.obj.refId +
								'&username=' + t.obj.commentUserName +
								'&type=' + t.obj.reviewType +
								'&parentId=' + t.obj.reviewId;
                            g_sps.jump(null,url);
						},
						noNeedBack:true
					});
				}
			},
			preferChange(){
				let t = this;
				let fn = function(t){
					if (t.prefering) {
						return false;
					}
					let params = {
						customerId: t.userId,//opts.customerId,
						sessionCustomerId: t.userId,
						usefulType: t.obj.reviewType,//'类型（1-视频，2-文库，3-会议，4-话题 ,5-笔记  6-人 7-病例）',"+
						upDownType: t.preferState ? 0 : 1, //0-cai 1-zan
						refId: t.obj.trendType != 8 ? t.obj.refId : t.obj.reviewId //  评论ID
					};
					t.prefering = true;
					comm.ajax2({
						url: t.preferState ? '/mcall/customer/prefer/delete/' : '/mcall/customer/prefer/create/',
						data: {paramJson: JSON.stringify(params)},
						type: "get",
						dataType: 'json',
						success: function (res) {
							t.prefering = false;
							if (res && res.responseObject && res.responseObject.responseStatus) {
								if (t.preferState) {//取消点赞
									t.preferState = false;
									t.preferNum = t.preferNum - 1 >= 0 ? t.preferNum - 1 : 0;
								} else {//点赞
									t.preferState = true;
									t.preferNum++;
								}
							}
						},
						error: function () {
							t.prefering = false;
						}
					});
				};
				if(t.hasAuth){
					fn(t);
				}else{
					user.privExecute({
						operateType: 'auth',
						noNeedBack: true,
						callback: function () {
							fn(t);
						}
					});
				}

			},
			collect(e){
				let t=this;
				let fn = function(t){
					if(t.collecting){return false;}
					t.collecting = true;
					let params={
						customerId:t.userId,
						collectionType:8,
						refId:t.obj.trendType!=8?t.obj.refId:t.obj.reviewId
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
				};
				if(t.hasAuth){
					fn(t);
				}else{
					user.privExecute({
						operateType:'auth',
						noNeedBack:true,
						callback:function(){
							fn(t);
						}
					});
				}
			},
			shareShow(){
				let t = this;
				let shareTitle,username,QQTitle,QQContent,WXTitle,WXContent,SinaTitle,SinaContent,content,pic;
				shareTitle = this.obj.refName;
				let refType = parseInt(this.obj.trendType);
				let shareContent = t.obj.reviewContent;
					username = t.obj.commentUserName;
				switch (refType) { //发布1247
					case 1:
					case 2:
					case 4:
					case 7:
						if (this.obj.opId == 2) {
							username = this.obj.parentAuthorName;
						}
						QQTitle = "[" + username + "]发布《" + shareTitle + "》";
						QQContent = shareContent;
						WXTitle = "[" + username + "]发布了[" + t.getType(refType) + "]《" + shareTitle + "》";
						WXContent = shareContent;
						SinaTitle = "[" + username + "]发布了[" + t.getType(refType) + "]《" + shareTitle + "》，点击查看：";
						SinaContent = "[" + username + "]发布了[" + t.getType(refType) + "]《" + shareTitle + "》，点击查看：";
						break;
					case 16: //活动
						if (this.obj.opId == 2) {//分享场景
							content = "分享";
						} else {
							content = "参加";
						}
						QQTitle = '[' + username + ']' + content + '[' + shareTitle + ']';  //[参加者姓名]参加了"[活动title]"活动
						QQContent = shareContent;
						WXTitle = '[' + username + ']' + content + '了[' + shareTitle + ']活动';
						WXContent = shareContent;
						SinaTitle = '[' + username + ']' + content + '了[' + shareTitle + ']活动，点击查看活动详情：';
						SinaContent = '[' + username + ']' + content + '了[' + shareTitle + ']活动，点击查看活动详情：';
						break;
					case 8:
						if (this.obj.parentId == 0) { //回复发布
							if (this.obj.opId == 2) {//分享场景
                                username = this.obj.parentAuthorName;
								QQTitle = '[' + username + ']发表了回复"' + shareContent + '"';
								QQContent = shareContent;
								WXTitle = '[' + username + ']发表了回复"' + shareContent + '"';
								WXContent = shareContent;
								SinaTitle = '[' + username + ']发表了回复"' + shareContent + '"，点击查看：';
								SinaContent = '[' + username + ']发表了回复"' + shareContent + '"，点击查看：';
							} else {
								QQTitle = "[" + username + "]回复《" + shareTitle + "》";
								QQContent = shareContent;
								WXTitle = "[" + username + "]回复了[" + t.getType(refType) + "]《" + shareTitle + "》";
								WXContent = shareContent;
								SinaTitle = "[" + username + "]回复了[" + t.getType(refType) + "]《" + shareTitle + "》，点击查看：";
								SinaContent = "[" + username + "]回复了[" + t.getType(refType) + "]《" + shareTitle + "》，点击查看：";
							}

						} else { //回复评论
							if (this.obj.opId == 2) {//分享场景
                                username = this.obj.parentAuthorName;
								QQTitle = '[' + username + ']发表了回复"' +shareContent + '"';
								QQContent = shareContent;
								WXTitle = '[' + username + ']发表了回复"' + shareContent + '"';
								WXContent = shareContent;
								SinaTitle = '[' + username + ']发表了回复"' + shareContent + '"，点击查看：';
								SinaContent = '[' + username + ']发表了回复"' + shareContent + '"，点击查看：';
							} else {
								QQTitle = "[" + username + "]回复[" + this.obj.parentAuthorName + "]";
								QQContent = shareContent;
								WXTitle = '[' + username + ']回复[' + this.obj.parentAuthorName + ']"' + shareContent + '"';
								WXContent = shareContent;
								SinaTitle = '[' + username + ']回复[' + this.obj.parentAuthorName + ']"' + shareContent + '"，点击查看：';
								SinaContent = '[' + username + ']回复[' + this.obj.parentAuthorName + ']"' + shareContent + '"，点击查看：';
							}
						}
						break; //parentId 0 [回复者姓名]回复了[资源类型]《title》 parentId !=0 [回复者姓名]回复[原回复作者]"回复内容"
					default:
				}
                pic = t.obj.picAtt.length?t.obj.picAtt[0].attUrl:'https://m.allinmd.cn/image/allin_logo.png';
				if(refType==1){//视频
				  pic = t.obj.picAtt.length?t.obj.picAtt[0].videoAttUrl:'https://m.allinmd.cn/image/allin_logo.png';
				}
				shareAll({
					title:WXTitle,
					trendUrl:"/mcall/customer/reprint/create/",
					data:{
						"dataFlag":2,
						"attUseFlag":3,
						"refId":t.obj.trendType != 8 ? t.obj.refId : t.obj.reviewId, //  评论ID  t.obj.reviewId,
						"trendsId":0,
						"logoUseFlag":3,
						"refCustomerId":t.userId,
						"visitSiteId": "2",
						"reprintType":t.obj.trendType
					},
					// url:t.$refs['share'+t.obj.reviewId],//.getAttribute('data-url'),
					url:t.obj.trendType!=8?t.obj.resourceUrl:(t.obj.parentId==0||t.obj.parentId==undefined?"https://m.allinmd.cn"+t.detailUrl:"https://m.allinmd.cn"+t.discussUrl),//如果不是评论分享资源链接， 是评论，直接评论资源的分享正文页，有父评论分享讨论页
					noPJ:0,
					pic:pic,
					wxDesc:t.obj.reviewContent,
					sinaTitle:SinaTitle,
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
							refUrl:t.obj.trendType!=8?t.obj.resourceUrl:(t.obj.parentId==0||t.obj.parentId==undefined?t.detailUrl:t.discussUrl),
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
							refUrl:t.obj.trendType!=8?t.obj.resourceUrl:(t.obj.parentId==0||t.obj.parentId==undefined?t.detailUrl:t.discussUrl),
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
							refUrl:t.obj.trendType!=8?t.obj.resourceUrl:(t.obj.parentId==0||t.obj.parentId==undefined?t.detailUrl:t.discussUrl),
							shareSence:"",
							shareChannel:5,
							shareContent: t.obj.refName,
							refCustomerId: t.userId
						});
					}      //分享朋友圈成功回调(obj.opId==2?obj.refId:obj.reviewId)

				},false,jQuery(t.$refs['share'+(t.obj.opId==2&&t.obj.trendType!=8?t.obj.refId:t.obj.reviewId)]));
				this.shareCollectShow = !this.shareCollectShow;
			}
		}
	}
</script>
<!--用于我的收藏中收藏的评论，没有下边删除，评论，点赞等功能-->
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
					<!--父评论被删除|评论删除显示删除-->
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
						<!--视频集-->
						<!--<VideoDom :videoInfo="obj.videoInfo" v-if="obj.videoInfo"></VideoDom>-->
						<!--视频集-->
						<!--图片集-->
						<ImgList :attachment = 'obj.attachment' v-if="obj.attachment.picAtt.length||obj.attachment.videoInfo"></ImgList>
						<!--图片集-->
						<!--引用资源-->
						<p class="al-commentContentQuote" v-if="obj.hasQuote">
							引用：
							<a :href="obj.quoteUrl" style="word-break: break-all;">
								《<span>{{obj.quoteResourceName|wordLen(20)}}</span>》
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
								<span class="commentTexttt" v-html="obj.parentAuthorName?(obj.parentAuthorName+': '+convertVideoWord(obj.parentReviewContent)):convertVideoWord(obj.parentReviewContent)">
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
					</section>
			</article>
	</section>
</template>
<style>
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
		return comm.getStrLen(str,len);
	});
	export default{
		data(){
			return {

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
					'&refName=' +this.obj.refName+
					'&refUrl='+this.obj.resourceUrl;
			},
			detailUrl:function(){	//正文页
				return '/dist/personal/details_content.html?' +
					'refCustomerId='+ this.obj.refCustomerId+
					'&refId='+       this.obj.refId+
					'&refType=' +	this.obj.reviewType+
					'&reviewId=' +this.obj.reviewId+
					'&refName=' +this.obj.refName+
					'&refUrl='+this.obj.resourceUrl;
			}
		},
		props:['obj'],
		components:{
			ImgList,VideoDom
		},
		mounted(){

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
			htmlString(x){
				//标签转成字符串，a链接加链接
				if(x){
					let content = x;
					content=content.replace(/<(\/*?[b-z].*?)>/g,"&lt;$1&gt;").replace(/&lt;br\/&gt;/g,'<br/>').replace(/href="?(\d)"?/g,'href=/dist/personal/others_index.html?cid=$1');
					return content;
				}
			},
		}
	}
</script>
/**
 * 功能描述：支持relation2 使用  下层回复列表  i>0注意没加
 * 使用方法：support.downstairs(obj);
 *                  必备参数，参照opts
 *
 * 引入来源：plugin.relation2.js  作用：引入社交
 *
 * Created by QiaoLiang on 2015-04-07.
 */
support.downstairs = function(obj){
		var controller = {
			config : {pageSize : 50},	
			path : {
				replyList : PC_CALL+"review/json_list/"  //回复列表
			},	
			opts : {
				initLiNum : 1,//初始化显示几条数据
				showReplyList : "off", //是否显示本回复列表 
				selector : "",  //将要插到的位置
				parentEle : "",   //最高父元素位置 ，防止选择器会出现乱版，只置入到父元素下的选择器中
				refType : "",
				refId : "",
				reviewId : "",
				destroy : false, //如果destroy为true则删除结构;
				uiCallback: null
			},
			init : function(obj){
				var t = this;
				$.extend(t.opts,obj);
				//执行销毁
				if(t.opts.destroy){
					var ele = $(t.opts.parentEle).find(".downstairsUl");
					if(ele.length>0){ele.remove();return false;}
				}
				
				var params = {
						 dataFlag : 3,  //1-全体 2-本人 3-取当前被访问人的数据
						 useFlag : UseFlag.c,  
						 logoUseFlag : UseFlag.c,
						 reviewType : t.opts.refType, //评论类型（1-视频，2-文库，3-会议，4-话题 ,5-笔记 ， 6-人,7-病例）
						 refId : t.opts.refId,      // 关联ID     
						 sortType : 1,//排序 1- 默认(最新）2-评论数(最热) 3-推荐数 4-收藏数  5－转发数 6-点赞数
						 parentId :	t.opts.reviewId,//  当前评论Id 
						 isCurrentRow : 0,  //是否含有当前评论（1是 0否）
						 pageIndex : 1, //一次性全部列出，无所谓pageIndex是几
						 pageSize : t.config.pageSize	
				};
				t.fns.ajaxResult(t.path.replyList,params);
			},
			dataCtrl : function(kv){
				var t = this;
				var ulHtml = "<ul class=\"downstairsUl\"></ul>"; //放置下层的包装
				$(t.opts.selector,t.opts.parentEle).after(ulHtml);
				var tempHtml = "";
				var len = kv.length ; //统计记录总数
				for(var i = 0; i< len;i++){
					tempHtml = module.listTemplate({tempName : "personal>downstairs"})({
						name : "<a class=\"name-card\" customerId=\""+kv[i].customer_auth.customerId+"\" href=\"/pages/personal/home.html?cid="+kv[i].customer_auth.customerId+"\">"+(kv[i].customer_auth.lastName+kv[i].customer_auth.firstName===""?"匿名用户":kv[i].customer_auth.lastName+kv[i].customer_auth.firstName)+"</a>",
						time : comm.date.diffDay_one(kv[i].customer_review.publishTime,comm.date.local_time()),
						content : kv[i].customer_review.reviewContent,
						logoUrl : "<a href=\"/pages/personal/home.html?cid="+kv[i].customer_auth.customerId+"\"><img src=\""+(kv[i].customer_att.logoUrl===""?"//img10.allinmd.cn/default-user/user_img65.png":kv[i].customer_att.logoUrl)+"\"/></a>", //当前人头像
						vip : false, //kv[i].customer_auth.state===1 || kv[i].customer_auth.state===2 ? true : false
						reviewId : kv[i].customer_review.id,
						medicalTitle: kv[i].customer_auth.medicalTitleShow,
						company: kv[i].customer_auth.company,
						quote : (function(){
							var cq = kv[i].customer_quote;
							if(cq.length===0){ return ''; }
							var result = '引用',tempPrefix= '';
							switch(cq[0].refQuoteType){
								case 1: tempPrefix = '视频'; break;
								case 2: tempPrefix = '文库'; break;
								case 4: tempPrefix = '话题'; break;
								case 7: tempPrefix = '病例'; break;
							}
							return result+tempPrefix+ '<a href="'+cq[0].pageStoragePath+'" target="_blank" style="color:#73859e;">《'+cq[0].refQuoteName+'》</a>';
						})(),
						videoSrc: (function(){
							var criav= kv[i].customer_review_insite_attachment_video;
							if(criav.length>0 && criav[0].qiniuStatus == "2")
								return '<div style="margin-top:12px;width:225px;position:relative;" class="evBgVideo" data-videosrc="'+criav[0].attUrl+'"><img src="//img00.allinmd.cn/meeting/player.png" style="position: absolute;top:0;left:0;z-index:2;cursor:pointer;"><img style="width:225px;height:150px;" src="'+criav[0].attLogoUrl+'"/></div>';
								else if(criav.length>0 && criav[0].qiniuStatus == "1")
									return '<div><img src="//img10.allinmd.cn/default/qiniu225_150.jpg"/></div>';
									else return '';
						})()
					});
					
					if(i===3 && len>5){ //当数据大于5条时，在第四条数据后加入 显示查看ＸＸ条回复
						tempHtml += '<li class=\"showMoreReviewList cursor\"><div class="moreReviewList more_pointer font_yahei">查看'+(len-4)+'条回复</div></li>';
					}
					
					var createElement = $(tempHtml);
					
					//下层图片集
					if(kv[i].customer_review_insite_attachment !== undefined){
						var criaArr = kv[i].customer_review_insite_attachment;
						var criaArrLen = criaArr.length;
						var html = "";
						for(var j=0;j<criaArrLen;j++){
							html+=picTemplate(criaArr[j].attUrl);
						}
						
						//进行下层九宫图样式
						if(criaArrLen===2 || criaArrLen===3 || (criaArrLen>4 && criaArrLen<10)){ //	三张
							 createElement.find("ul").addClass("p_three_img");
						 }else if(criaArrLen===4){ // 两张
							 createElement.find("ul").addClass("p_four_img");
						 }else if(criaArrLen>9){ // 大于九张时
							 createElement.find("ul").addClass("case_more_img");
							 createElement.find("ul").append(
									 "<div class=\"sh_float_bg\"></div>"+
									 "<div class=\"sh_float_text font_yahei\">图集共"+imgLen+"张图片</div>");
						 }
					}
					
					function picTemplate(picHref){ //图片碎模版
						if(picHref	!==	"")
							return "<li class=\"personal_ads\"><img src=\""+picHref+"\"></li>";
						return "";	
					}
					
					//元素从list-template中查看，时间问题，不细想
					createElement.find(".ev-content").append(html);
					
//					createElement.find(".call-relation2").relation2({
//						selector : t.opts.selector,
//						callDialogueSource : "downstairs",
//						showReplyList : t.opts.showReplyList,
//						reprintNum : kv[i].customer_review.reprintNum,
//						reviewNum : kv[i].customer_review.reviewNum,
//						collectionNum : kv[i].customer_review.collectionNum,
//						praiseNum : kv[i].customer_review.upNum,
//						reviewId : kv[i].customer_review.parentId, //回复的主键id 76 119047
//						refCid : kv[i].customer_review.customerId,//资源人id 1397640872703
//						refType : kv[i].customer_review.reviewType, //资源类型
//						refId : kv[i].customer_review.refId, //资源id 1398583718434
//						userLogoUrl : kv[i].customer_att.logoUrl===""?"//img10.allinmd.cn/default-user/user_img65.png":kv[i].customer_att.logoUrl, //当前人头像
//						nickname : kv[i].customer_auth.lastName+kv[i].customer_auth.firstName===""?"匿名用户":kv[i].customer_auth.lastName+kv[i].customer_auth.firstName, //对方的称呼
//					});

					createElement.find(".evBgVideo").on("click", function(){
						module.backgroundVideo({videoSrc:$(this).attr("data-videosrc")});
					});
					
					$(".downstairsUl",t.opts.parentEle).append(createElement);
				}
				t.opts.uiCallback && t.opts.uiCallback($(".downstairsUl",t.opts.parentEle));
				
				//决定可见部分
				$(".downstairsUl>li:eq(0)",t.opts.parentEle).show();
				$(".downstairsUl>li:eq(1)",t.opts.parentEle).show();
				$(".downstairsUl>li:eq(2)",t.opts.parentEle).show();
				$(".downstairsUl>li:eq(3)",t.opts.parentEle).show();
				if(len>5){
					$(".downstairsUl>li:eq("+len+")",t.opts.parentEle).show();
				}else{
					$(".downstairsUl>li:eq(4)",t.opts.parentEle).show();
				}
				
				//生成评论给显示条数绑定事件，显示全部回复列表
				if($(".showMoreReviewList").size()>0){//如果存在则绑
					$(".showMoreReviewList",t.opts.parentEle).off("click").on("click",function(){
						$(".downstairsUl>li",t.opts.parentEle).show();
						$(this).remove();
					});
				}
			},
			fns : {
				ajaxResult : function(url,params){
					var t = controller;
					$.ajax({
						url : url,
						type : "POST",
						data : params,
						success : function(data){
							if(data.responseObject.responseStatus)
								t.dataCtrl(data.responseObject.responseData.data_list);
						}
					})
				}
			}
			
				
		}
		controller.init(obj);
};
/**
 * 功能描述：支持relation2 使用 上层回复列表
 * 使用方法：support.upstairs(obj);
 *                  必备参数，参照opts
 *
 * 引入来源：plugin.relation2.js  作用：引入社交
 *
 * Created by QiaoLiang on 2015-04-07.
 */

support.upstairs = function(obj){
	var controller = {
		config : {pageSize:100},
		path : {
			replyList : PC_CALL+"review/json_list/"  //回复列表 
		},
		opts : {
			selector : "",
			parentEle : "",
			refType : 0,
			refId : 0,
			reviewId : 0,
			showReplyList : "off",
			firstTitle : "",
			destroy : false
		},
		init : function(obj){
			var t = this;
			$.extend(t.opts,obj);
			comm.fastError.missParams(t.opts,"relation2.upstairs.js");
			
			//执行销毁
			if(t.opts.destroy){
				var ele = $(t.opts.parentEle).find(".upstairsUl");
				if(ele.length>0){ele.remove();return false;}
			}
			
			var params = {
				 dataFlag : 3,  // 1-全体 2-本人 3-取当前被访问人的数据
				 useFlag : UseFlag.c,   
				 logoUseFlag : UseFlag.c,
				 reviewType : t.opts.refType, //评论类型（1-视频，2-文库，3-会议，4-话题 ,5-笔记 ， 6-人,7-病例）
				 refId : t.opts.refId,      // 关联ID
				 currentReviewId :	t.opts.reviewId,//  当前评论Id
				 pageSize : t.config.pageSize,
				 isCurrentRow : 0  //是否含有当前评论（1是 0否）
				 
				 //sortType : 1,//排序 1- 默认(最新）2-评论数(最热) 3-推荐数 4-收藏数  5－转发数 6-点赞数
				 //pageIndex : 1, //一次性全部列出，无所谓pageIndex是几
			};
			
			t.fns.ajaxResult(t.path.replyList,params);
		},
		dataCtrl : function(kv){
			var t = this;
			var ulHtml = "<ul class=\"upstairsUl\"></ul>"; //放置上层的包装
			$(t.opts.parentEle).children(t.opts.selector).before(ulHtml);
			
			var tempHtml = "";
			for(var i = 0,len = kv.length; i< len;i++){
				tempHtml = module.listTemplate({tempName : "personal>upstairs"})({
					name : "<a class=\"name-card\" customerId=\""+kv[i].customer_auth.customerId+"\" href=\"/peges/personal/home.html?cid="+kv[i].customer_auth.customerId+"\">"+(kv[i].customer_auth.lastName+kv[i].customer_auth.firstName===""?"匿名用户":kv[i].customer_auth.lastName+kv[i].customer_auth.firstName)+"</a>",
					time : comm.date.diffDay_one(kv[i].customer_review.publishTime,comm.date.local_time()),
					content : kv[i].customer_review.reviewContent,
					logoUrl : "<a href=\"/peges/personal/home.html?cid="+kv[i].customer_auth.customerId+"\"><img src=\""+(kv[i].customer_att.logoUrl===""?"//img10.allinmd.cn/default-user/user_img65.png":kv[i].customer_att.logoUrl)+"\"/></a>", //当前人头像
					vip : false,//kv[i].customer_auth.state===1 || kv[i].customer_auth.state===2 ? true : false
					reviewId : kv[i].customer_review.id,
					medicalTitle: kv[i].customer_auth.medicalTitleShow,
					company: kv[i].customer_auth.company
				});
				
				if(len>3 && i===kv.length-3){ //数据超过三条后，显示更多回复
					tempHtml+="<div class=\"viewAllData cursor\">"+i+"条更多回复</div>";
				}
				
				var createElement = $(tempHtml);
				
				//上层图片集
				if(kv[i].customer_review_insite_attachment !== undefined){
					var criaArr = kv[i].customer_review_insite_attachment;
					var criaArrLen = criaArr.length;
					var html = "";
					for(var j=0;j<criaArrLen;j++){
						html+=picTemplate(criaArr[j].attUrl);
					}
				}
				
				function picTemplate(picHref){ //图片碎模版
					if(picHref	!==	"")
						return "<div class=\"personal_ads\"><img src=\""+picHref+"\"></div>";
					return "";	
				}
				
//				createElement.find(".call-relation2").relation2({
//					selector : t.opts.selector,
//					callDialogueSource : "upstairs",
//					showReplyList : t.opts.showReplyList,
//					reprintNum : kv[i].customer_review.reprintNum,
//					reviewNum : kv[i].customer_review.reviewNum,
//					collectionNum : kv[i].customer_review.collectionNum,
//					praiseNum : kv[i].customer_review.upNum,
//					reviewId : kv[i].customer_review.parentId, //回复的主键id 76 119047
//					refCid : kv[i].customer_review.customerId,//资源人id 1397640872703
//					refType :kv[i].customer_review.reviewType, //资源类型
//					refId : kv[i].customer_review.refId, //资源id 1398583718434
//					userLogoUrl : kv[i].customer_att.logoUrl===""?"//img10.allinmd.cn/default-user/user_img65.png":kv[i].customer_att.logoUrl, //当前人头像
//					nickname : kv[i].customer_auth.lastName+kv[i].customer_auth.firstName===""?"匿名用户":kv[i].customer_auth.lastName+kv[i].customer_auth.firstName, //对方的称呼
//					dialogueCallback : t.fns.dialogueLine
//				});
				
				$(".upstairsUl",t.opts.parentEle).append(createElement);
				
				if(i===0){ // 第一条加入标题
					$(".ev-loadTitlePlaceDown",t.opts.parentEle).after(t.opts.firstTitle);
				}
				
				//第一条与倒数第一二条显示
				if(i===kv.length-2 || i===kv.length-1 || i===0){
					$(".upstairsUl>li:last").attr("data-show",true);
				}
				
			}
			
			$(".upstairsUl>[data-show]",t.opts.parentEle).show();
			
			//载入名片
			module.nameCard({
                selector:".name-card"
            });
			
			//载入对话线
			t.fns.dialogueLine();
			
			//绑定折起更多事件
			var ele = $(".viewAllData",$(t.opts.parentEle).find(".upstairsUl"));
			if(ele.size()>0){
				ele.off("click").on("click",function(){
					$(this).remove();
					$(".upstairsUl>li",t.opts.parentEle).show();
					t.fns.dialogueLine();
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
			},
			dialogueLine : function(){ //对话线
				var t = controller;
				var html = "<div class=\"dialogue-line\"></div>";
				$(".upstairsUl",t.opts.parentEle).prepend(html);
				
				var upstairsHeight = $(".upstairsUl").height()-40+72;
				$(".dialogue-line").css({height:upstairsHeight});
				
			}
		
		}
			
	};
	
	controller.init(obj);
	
		
};
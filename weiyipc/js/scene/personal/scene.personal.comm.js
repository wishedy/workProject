/**
 * 功能描述：个人主页与个人首页公共部分 用于导航触发
 * 使用方法:
 * 
 * 注意事件：
 * 引入来源：  作用：
 *
 * Created by QiaoLiang on 2015-04-16.
 */

//个人首主页导航执行列表
scene.personalNavExecuteList= function(obj){
	var controller = {
		opts : {
			scrollPlace : null,
			listSelectorEl : null,
			pagerEl : null,
			isSelfUseTips : false,
			tempLib : {} //total opType title url params 
		},
		init : function(obj){
			comm.LightBox.showloading();
			var t = this;
			$.extend(t.opts,obj);
			t.ajax();
			
			//载入翻页
			if(t.opts.tempLib.total>0){
				t.opts.pagerEl.parent().show();
				t.opts.pagerEl.pager({pagenumber: 1, pagecount:t.opts.tempLib.total, buttonClickCallback:t.pageAjax});
			}else{
				t.opts.pagerEl.parent().hide();
			}
		},
		controllerCenter : function(data){
			var t = this;
			var html = "";
			//先清空原位置数据，重新输出
			t.opts.listSelectorEl.empty();
			//t.opts.listSelectorEl.html("<div class=\"no_dongtai font_yahei ev-onLoadTips\">加载数据失败！</div>");
			
			//解析rows与data_list的区别
			var newData = {};
			var dataListOutSideObj = null; //数据列表外部对象处理 非rows列表会将个人信息放置外部
			var opType = t.opts.tempLib.opType;
			if(opType === "relation"){
				isRowsStyle = true;
				newData = data.rows;
			}else if(opType === "trends" || opType === "reprint" || opType==="remind" || 
					opType=== "collection" || opType==="reviewMe" || opType=== "trendsMe" ||
					opType === "discuss" ){
				newData = data.data_list;
			}else{
				dataListOutSideObj = {  
					logoUrl : data.customer_att.logoUrl, //头像
					nickname : data.customer_auth.lastName+data.customer_auth.firstName, //姓名
					refCustomerId : data.customer_auth.customerId 
				}
				newData = data.data_list;
			};
		
			for(var xi=0;xi<newData.length;xi++){//TODO: each中处理 后期优化
				//根据不同类型解析对应的数据
				var el = t.parserData(newData[xi]);
				
				//如果是发布类 0为发布，并且资源是无效时，退出
				if(el.otherId === 0 && el.resourceValid !== 1 ){ continue;} 
				
				if(opType === "discuss" ){ //关注提醒
					html = module.listTemplate({tempName: "personal>followRemind"})({
						logoUrl : el.logoUrl,
						resourceValid : el.resourceValid,
						nickname : el.nickname,		
						messageNum : el.messageNum,
						title : el.title,
						refUrl : el.refUrl,
						refId : el.refId,
						refType : el.refType,
						time : comm.date.diffDay_one(el.time,comm.date.local_time()),
						content : el.content
					});
					
					var tempCE = $(html);
					
					//头像处理
					if(typeof el.logoUrl === "object"){
						tempCE.find(".evBorder").html(this.faceGroup(el.logoUrl));
					};
					
				   	tempCE.off("click").on("click",function(event){
				   		//资源被删除时
				   		if($(this).attr("data-valid") === "off"){
				   			return event.preventDefault;
				   			return false;
				   		}
				   		
				   		var isReadURL = PC_CALL+"customer/message/updateIsRead/";
				   		var param = {};
				   		param.paramJson = $.toJSON({dataFlag:2,messageType: 1, resourceType : parseInt($(".evFollowRemindTitle",this).attr("data-reftype")),refId : parseInt($(".evFollowRemindTitle",this).attr("data-refid"))});
				  
				   		window[0] = $(this).attr("data-href"); //临时存放跳转地址
				   		$.ajax({
				   			url : isReadURL,
				   			type : 'post',
				   			data : param,
				   			success : function(data){
				   				location.href = window[0];
				   			}
				   		});
				   	});
					
					t.opts.listSelectorEl.append(tempCE);
					comm.LightBox.hideloading();
					
					continue;
				}else{
					html = module.listTemplate({tempName : "personal>list"})({
						vip : false,
						cid : convertCallStyle("refCustomerId",el),
						name : "<a class=\"name-card\" customerId=\""+convertCallStyle("refCustomerId",el)+"\" href=\"/pages/personal/home.html?cid="+convertCallStyle("refCustomerId",el)+"\">"+convertCallStyle("nickname",el)+"</a>",
						time : comm.date.diffDay_one(el.time,comm.date.local_time()),
						title : el.title,
						content : el.content,
						reviewId:el.reviewId,
						refType:el.refType,
						refId:el.refId,
						logoUrl : convertCallStyle("logoUrl",el)===""?"//img10.allinmd.cn/default-user/user_img65.png":convertCallStyle("logoUrl",el), 
						allinAuth :  false, //这期不做
						quote: el.quote,
						videoSrc: el.videoSrc
					});
				}
				
				//otherId 特指转发还是评论还是其它,0-发布、1-回应、2-转发、3-收藏、4-分享、5-赞
				function convertCallStyle(type,kv){ //处理上述解析区别的具体细节
					if(dataListOutSideObj!==null){
						return dataListOutSideObj[type];
					}else if(kv.otherId==2){
						if(type==="refCustomerId") return kv.parentCustomerId;
							else return kv[type];
					}else{
						return kv[type];
					}	
				}
				
				//临时处理，回复状态是自己时 后期更改
				if(opType === "review" || opType === "caze" || opType === "topic"
					 || opType === "video" || opType === "doc"){
					el.refCustomerId = dataListOutSideObj.refCustomerId;
					el.nickname = dataListOutSideObj.nickname;
					el.logoUrl = dataListOutSideObj.logoUrl;
				}
				
				//头像从当前页(index home)的类ev-logoUrl 作用放到回复头像位置 
				el.userLogoUrl = $(".ev-logoUrl img").attr("src");
				
				var createElement = $(html);
				
				createElement.find(".call-relation2").relation2({ //加三种状态收藏赞转发
					selector:".inside-selector",
					showReplyList : "on",
					//基础数据
					callSource : opType,
					reprintNum : el.reprintNum,
					reviewNum : el.reviewNum,
					collectionNum : el.collectionNum,
					praiseNum : el.praiseNum,
					parentReviewId : el.parentReviewId,
					reviewPrivateType : el.reviewPrivateType, //回复私有类型
					opId : el.otherId, //用来区分是否转发类型
					trendsId : el.trendsId, //动态主键id
					refParentCid : el.parentCustomerId, //在转发资源时customerId采用这个
					reviewId : el.reviewId, //回复的主键id 76 119047
					refCid : el.refCustomerId, //资源人id1397640872703
					refType : el.refType, //资源类型2
					refId : el.refId,//资源id1398583718434
					praiseVaild : el.praiseValid, //赞状态
					reprintValid : el.reprintValid,//转发状态
					collectionValid : el.collectionValid, //收藏状态
					headerValid : el.headerValid, //置顶状态
					userLogoUrl : el.userLogoUrl===""?"//img10.allinmd.cn/default-user/mr_img.png":el.userLogoUrl,
					nickname : el.nickname//"可可西里" //对方的称呼
				});
				
				//----------------只有动态会调用这句
				if(el.otherId!==undefined){
					if(el.otherId==2){ //处理由XXX转发
						createElement.find(".inside-selector").prepend("<div class=\"zf_top font_yahei\"><span></span>由 "+el.otherName+" 转发</div>");
					}
				}
				//--------------------------------------
				
				//处理时间Icon 文字描述 及标题  无图标及默认标题
				var timeClass = "p_l_t_r_none",iconDescriptor = "";
				var title = "发布了<a href=\""+el.refUrl+"\">《"+(el.title==""?"邀你讨论":comm.getStrLen(el.title,70))+"》</a>";
				
				if(el.otherId===2 && el.resourceValid !==1 && el.refType !== 8){
					title = "<div style=\"color:#A8A4A4\">该资源类型已被作者删除/管理员屏蔽</div>"
				}

				switch(el.refType){
					case 1 : timeClass = "p_l_t_r_video"; iconDescriptor = "视频"; break; //视频
					case 2 : timeClass = "p_l_t_r_doc"; iconDescriptor = "文库"; break;  //文库
					case 4 : timeClass = "p_l_t_r_topic"; iconDescriptor = "话题"; break; //话题 
					case 7 : timeClass = "p_l_t_r_case"; iconDescriptor = "病例"; break; //病例
					case 8 : //评论
						var tempTitle = comm.getStrLen(el.title,70);
						if(t.opts.tempLib.opType === "trends"){ //动态下回复样式
							//如果为回复时,并且无效
							if(el.otherId === 1 && el.resourceValid !== 1){
								title = "<div style=\"color:#A8A4A4\">回复了《"+tempTitle+"》</div>";
							}else{
								title = "<a href=\""+el.refUrl+"\"><span class=\"list_title_zt\">回复了</span><span class=\"list_title_name\">《"+tempTitle+"》</span></a>";
							}
						}else if(opType === "reviewMe"){//回复你的样式 针对个人首页中回复我，默认已过滤删除过的数据 标题
							createElement.find(".ev-TitlePlaceDown > .ev-nickname").append("<span>回复了</span>");
							
							if(el.parentReviewId > 0){ //有父层回复
								title = "<span class=\"list_titile_90\">你的评论：<a href=\""+el.refUrl+"\">\""+comm.getStrLen(el.parentConent,70)+"\"</a></span>";
							}else{
								title = "<span class=\"list_titile_90\">你的"+this.typeDescriptor(el.reviewPrivateType)+"：<a href=\""+el.refUrl+"\">《"+tempTitle+"》</a></span>";
							}
						}else if(opType === "review"){ //个人主页中回复的内容 标题
							title = "<span class=\"color:#A8A4A4\">回应了《"+tempTitle+"》</div>";
						}
						
					break;
				}
				
				//处理名称部位
				if(opType === "remind"){ //提醒你看
					createElement.find(".ev-TitlePlaceDown > .ev-nickname").append("<span>提醒你看</span>");
					title = "TA的"+this.typeDescriptor(el.refType)+"：<a href=\""+el.refUrl+"\">"+comm.getStrLen(el.title,70)+"</a>";
				}
				
				createElement.find(".evIconTime").prepend("<p class=\""+timeClass+"\"></p><span style=\"margin:0 15px 0 5px;display:inline-block;\">"+iconDescriptor+"</span>");
				createElement.find(".evTitle").html(title);
				
				//是本人时 文库返回文库状态 文库的审核等状态 及文库提示事件
				if(t.opts.isSelfUseTips == true && el.docStatus !== undefined){
					var docStatusPic = "";
					switch(el.docStatus){
					case 1: docStatusPic="doc-status-waiting.png"; break; //1
					case 2: docStatusPic = "doc-status-pass.png"; break;//2
					case 3: docStatusPic='doc-status-nopass-up.png'; break;//3
					}
					
					var imgDocStatus = "<img style=\"margin-right:11px;\" data-status=\"on\" src=\"//img00.allinmd.cn/channel/doc/"+docStatusPic+"\"/>";
					var tempTimeDom = createElement.find(".evIconTime");
					var concatDom = "<div class=\"ev-docStatusAddStatus\" style=\"position:relative;float:right;\">"+imgDocStatus+"</div>";
					createElement.find(".ev-docStatusAddStatus").append(tempTimeDom);
					createElement.find(".ev-TitlePlaceDown>div:eq(1)").after(concatDom);
					
					if(el.docStatus === 3){
						var docTipsArrow = "doc-tips-arrow.png";
						var docTipsClose = "doc-tips-close.png";
						var css = "padding:6px 18px;width:240px;" +
								"background:#fefad8;border:1px solid #ffb786;" +
								"color:#808080;font-size:12px;position: absolute;z-index: 1;" +
								"left: -123px;top: 35px;";
						
						var noPassHtml = "<div style=\""+css+"\" class=\"ev-docNoPassTips\">" +
								"<div style=\"position:relative;top:-12px;left:140px;width:10px;height:6px;\"><img src=\"//img00.allinmd.cn/channel/doc/"+docTipsArrow+"\"/></div>" +
								"<div style=\"  position: absolute;right: 4px;top: 4px;\" class=\"ev-docTipsClose\"><img src=\"//img00.allinmd.cn/channel/doc/"+docTipsClose+"\"/></div>"+
								el.reason+"</div>";
						createElement.find(".ev-docStatusAddStatus").append(noPassHtml);
						
						$(".ev-docTipsClose").off("click").on("click",function(){
							$(this).parents(".ev-docNoPassTips").fadeOut(); //
							$(this).parents(".ev-docStatusAddStatus").find("[data-status=on]").attr("src","//img00.allinmd.cn/channel/doc/doc-status-nopass-down.png");
							$(this).parents(".ev-docStatusAddStatus").find("[data-status=on]").attr("data-status","off");
						});
						
						$("[data-status=off]").live("click",function(){
							$(this).attr("src","//img00.allinmd.cn/channel/doc/doc-status-nopass-up.png");
							$(this).attr("data-status","on");
							$(this).parent().find(".ev-docNoPassTips").fadeIn();
						});
					}
					 
				}
				
				//图片处理
				var picLen = el.imgArr.length;//图片长度 防止里面有空图，加入下方代码重新计算长度
					if(picLen>0){
						var x=picLen; 
						for(var i=0;i<picLen;i++){
							if(el.imgArr[i]===""){x--;}
						}
						picLen = x; 
					}
				var picHtml = ""; //图片组装
				var isOne = false; //一张时特殊处理不作任何修饰
				var isFour = false; //是否四张时，四张时与其它张数时显示有所不同
				var isMore = false; //是否超过九张 超过九张只显示一张出现图集

				//图片分类
				if(picLen===0){
					picHtml = "";
				}else if(picLen===1){
					isOne = true; picHtml = picTemplate(el.imgArr[0]);
				}else if(picLen===4){
					isFour = true; 
					for(var i=0;i<picLen;i++){ picHtml += picTemplate(el.imgArr[i]);};
				}else if(picLen===2 || picLen===3 || (picLen>4 && picLen<10)){
					for(var i=0;i<picLen;i++){ picHtml += picTemplate(el.imgArr[i]);}
				}else{
					isMore = true;
					picHtml = picTemplate(el.imgArr[0]);
				}
							
				function picTemplate(picHref){ //图片碎模版
					if(picHref	!==	"")
						return "<li class=\"personal_ads\"><img src=\""+picHref+"\"></li>"; // data-original=\""+picHref+"\"
					return "";	
				}
				
				//组装后的图片

				if(el.refType==ResouceType.video || el.refType == ResouceType.doc){
					createElement.find(".evPic").prepend("<a href=\""+el.refUrl+"\">"+picHtml+"</a>");
				} else{
					createElement.find(".evPic").prepend(picHtml);
				}

				//区别对待
				if(isOne) createElement.find(".evPic").removeClass("p_normal_img");
				if(isFour) createElement.find(".evPic").addClass("p_four_img");
				if(isMore){
					var moreHtml = "<div class=\"sh_float_bg\"></div>"+ 
					"<div class=\"sh_float_text font_yahei\">图集共"+picLen+"张图片，点击查看详情</div>";
					createElement.find(".evPic .personal_ads").addClass("case_more_img");
					createElement.find(".evPic .personal_ads").append(moreHtml);
				}
				
				//如视频时添加视频播放按钮 并固定规格大小
			   	if(el.refType===1 && createElement.find(".evPic>a>li:first>img").length>0){
			   		var videoBtnHtml = "<div class=\"video_ads_b\"><img src=\"//img00.allinmd.cn/personal/video_b.png\"></div>";			
			   		createElement.find(".evPic>a>li:first>img").css({"height":150,"width":225});
			   		createElement.find(".evPic>a>li:first").append(videoBtnHtml);
				}
			   	
			   	//relation与他相关 特有操作
			   	if(opType==="relation"){
			   		//将头像部位替换为类型图片
			   		var resourcePic = "";
			   		if(el.refType === ResouceType.doc) resourcePic = "//img00.allinmd.cn/personal/personal_doc.png"; 
			   		else if(el.refType === ResouceType.video) resourcePic = "//img00.allinmd.cn/personal/personal_video.png"; 
			   		
			   		$(".evBorder",createElement).html("<img src=\""+resourcePic+"\"/>");
			   		
			   		title = "<a href=\""+el.refUrl+"\">"+comm.getStrLen(el.title,40)+"</a>";
			   		//移除原有结构
			   		$(".p_list_top,.evTitle",createElement).remove();
			   		var str = "";
			   		switch(el.authorType){
			   		case 1 : str = "第一作者"; break;
			   		case 2 : str = "他的译作"; break;
			   		case 3 : str = "联合作者"; break;
			   		case 4 : str = "联合译作"; break;
			   		};
				   	relationTopHtml = "<div class=\"p_list_top\">"+
	                    "<div class=\"p_xg_title font_yahei\">"+title+"</div>"+
	                    "<div class=\"p_l_t_author\">"+str+"</div>"+
	                    "<div class=\"p_l_t_r_none\">"+(el.time!==""?comm.date.diffDay_one(el.time,comm.date.local_time()):"未知")+"</div>"+
	                    "<div class=\"clear\"></div>"+
	                  "</div>";
				   	
				   	$(".p_cont_list_r",createElement).prepend(relationTopHtml);
			   	}
			   	
			   	//加入展开收缩
			   	$(".ev-content",createElement).expandShrink({len:230,parent:$(".ev-content",createElement)});
			   	
			   	//内容中@名字处理
			   	$(".ev-content>a",createElement).on("click", function(){
			   		 if(/^\d+$/g.test($(this).attr("href"))){
						var href='/pages/personal/home.html?cid='+$(this).attr("href");
						g_sps.jump(null,href,true);
					 }
					 return false;
			   	});
			   	
			   	//视频播放
			   	createElement.find(".evBgVideo").on("click", function(){
					module.backgroundVideo({videoSrc:$(this).attr("data-videosrc")});
				});
			   	
				//输出
			    t.opts.listSelectorEl.append(createElement);
			    comm.LightBox.hideloading();
			    
			}; 
			
			//检测是否没有符合条件的数据－(存在自己把自己数据删除或文章未通过审核等情况)
			if(t.opts.listSelectorEl.children("li").length===0){ //无数据－指有数据但是都是未审核过或被删除清空
				t.opts.listSelectorEl.html("<div class=\"no_dongtai font_yahei\">"+(t.opts.isSelfUseTips?"你":"TA")+"还没有"+t.notDataTips()+"哦～</div>");
				comm.LightBox.hideloading();
			}else{
				/*// 延迟加载
	            $(".personal_ads img").lazyload({
	                effect:"fadeIn",
	                event:"scrollstop"
	            });*/
				
				//载入名片
				module.nameCard({
	                selector:".name-card"
	            });
			}
			//如果为与他相关移除标题 好像在上方处理未测，有问题再说
			//if(t.opts.tempLib.opType === "relation") $(".ev-nickname").remove();
			
			//移除提示
			$(".ev-onLoadTips").remove();
			
			
		},
		parserData : function(kv){ //解析请求的数据
			var t = this;
			
			// 收藏 -- 转发 转成动态DOM
			if(t.opts.tempLib.opType==="collection" || 
					t.opts.tempLib.opType==="remind" ||
					t.opts.tempLib.opType==="reprint" ||
					t.opts.tempLib.opType==="trendsMe")  
			t.opts.tempLib.opType = "trends";
			
			return comm.dataAdapter[t.opts.tempLib.opType](kv);
		},
		ajax : function(){
			var t = this;
			$.ajax({
				url : t.opts.tempLib.url,
				type : "POST",
				data : t.opts.tempLib.params,
				success : function(data){
					if(t.opts.tempLib.opType==="relation" && !$.isEmptyObject(data) && !$.isEmptyObject(data.rows)) //针对rows 与他相关
						t.controllerCenter(data);
					else if(data.responseObject !== undefined && data.responseObject.responseStatus)
						t.controllerCenter(data.responseObject.responseData);
					else{
						t.opts.listSelectorEl.html("<div class=\"no_dongtai font_yahei\">"+(t.opts.isSelfUseTips?"你":"TA")+"还没有"+t.notDataTips()+"哦～</div>");
						comm.LightBox.hideloading();
					}
				},
				error : function(){
					t.opts.listSelectorEl.html("<div class=\"no_dongtai font_yahei\">加载数据失败！</div>");
					comm.LightBox.hideloading();
				}
			});
		},
		pageAjax : function(pageclickednumber){
			var t = controller;

			//防data.rows; 分解   记号
			var tempParams = {};
			if(t.opts.tempLib.opType === "reviewMe" || t.opts.tempLib.opType === "relation" || t.opts.tempLib.opType === "review" || t.opts.tempLib.opType === "topic") 
				tempParams = t.opts.tempLib.params; 
			else	
				tempParams = $.parseJSON(t.opts.tempLib.params.paramJson);
			
			tempParams.pageIndex = parseInt(pageclickednumber);
			
			//防data.rows 组装
			if(t.opts.tempLib.opType !== "reviewMe" && t.opts.tempLib.opType !== "relation" && t.opts.tempLib.opType !== "review" && t.opts.tempLib.opType !== "topic")
				tempParams = {paramJson:$.toJSON(tempParams)};
			
			//用来进行翻页后回到标题滚动回标题处位置
			var offset = t.opts.scrollPlace.offset();
			document.body.scrollTop = offset.top;
			
			$.ajax({
				url : t.opts.tempLib.url,
				type : "POST",
				data : tempParams,
				success : function(data){
					if(t.opts.tempLib.opType === "relation" && !$.isEmptyObject(data)){
						t.controllerCenter(data);
						t.opts.pagerEl.pager({pagenumber: pageclickednumber, pagecount: t.opts.tempLib.total, buttonClickCallback:t.pageAjax});
					}else if(data.responseObject !== undefined && data.responseObject.responseStatus){
						t.controllerCenter(data.responseObject.responseData);
						t.opts.pagerEl.pager({pagenumber: pageclickednumber, pagecount: t.opts.tempLib.total, buttonClickCallback:t.pageAjax});
					}
				}
			});
		},
		notDataTips : function(){ //无数据提示信息
			var t = this,word = "";
			switch(t.opts.tempLib.opType){
			case "caze" : word = "病例"; break;
			case "topic" : word = "话题"; break;
			case "video" : word = "视频"; break;
			case "doc" : word = "文章"; break;
			case "review" : word = "回复"; break;
			case "collection" : word = "收藏"; break;
			case "reprint" : word = "转发"; break;
			case "relation" :
				if(t.opts.isSelfUseTips) word = "与我相关的数据";
					else	word = "与他相关的数据";
				break;
			case "remind" : word = "提醒我的"; break;
			case "discuss" : word = "关注提醒"; break;
			default : word = "动态";
			}
			return word;
		},
		typeDescriptor : function(type){ //类型描述
			var word = "";
			switch(type){
			case 1 : word = "视频"; break; 
			case 2 : word = "文库"; break;
			case 4 : word = "话题"; break;
			case 7 :	 word = "病例"; break;
			case 8 : word = "评论"; break;
			}
			return word;
		},
		faceGroup : function(faceArr){ //头像组处理
			var faceLen = faceArr.length,faceGroupHtml = "";
			switch(faceLen){
				case 1 :
					faceGroupHtml = '<div class="p_cont_list_l evBorder"><img src="'+faceArr[0].logoUrl+'"></div>'
				case 2 : 
					faceGroupHtml = '<div class="faceGroup">'+
				        '<img src="'+faceArr[0].logoUrl+'" class="radius absolute" style="width:49%;height:49%;margin: 8%;"/>'+
				        '<img src="'+faceArr[1].logoUrl+'" class="radius absolute" style="width:49%;height:49%;margin:43% 0 0 43%;"/>'+
				    '</div>';
					break;
				case 3 :
					faceGroupHtml = '<div class="faceGroup">'+
				        '<img src="'+faceArr[0].logoUrl+'" class="radius absolute" style="width:45%;height:45%;margin:1% 27%;"/>'+
				        '<img src="'+faceArr[1].logoUrl+'" class="radius absolute" style="width:45%;height:45%;margin:40% 5% 0;"/>'+
				        '<img src="'+faceArr[2].logoUrl+'" class="radius absolute" style="width:45%;height:45%;margin:40% 0 0 50%;"/>'+
				    '</div>';
					break;
				case 4 :
					faceGroupHtml = '<div class="faceGroup">'+
				        '<img src="'+faceArr[0].logoUrl+'" class="radius absolute" style="width:41%;height:41%;margin: 9%;"/>'+
				        '<img src="'+faceArr[1].logoUrl+'" class="radius absolute" style="width:41%;height:41%;margin: 9% 0 0 50%;"/>'+
				        '<img src="'+faceArr[2].logoUrl+'" class="radius absolute" style="width:41%;height:41%;margin: 50% 0 0 9%;"/>'+
				        '<img src="'+faceArr[3].logoUrl+'" class="radius absolute" style="width:41%;height:41%;margin: 50% 0 0 50%;"/>'+
				    '</div>';
					break;
				default : 
					faceGroupHtml = '<div class="faceGroup">'+
				        '<img src="'+faceArr[0].logoUrl+'" class="radius absolute" style="width:36%;height:36%;margin: 1% 32%;"/>'+
				        '<img src="'+faceArr[1].logoUrl+'" class="radius absolute" style="width:36%;height:36%;margin: 23% 3%;"/>'+
				        '<img src="'+faceArr[2].logoUrl+'" class="radius absolute" style="width:36%;height:36%;margin: 23% 0 0 61%;"/>'+
				        '<img src="'+faceArr[3].logoUrl+'" class="radius absolute" style="width:36%;height:36%;margin: 57% 0 0 14%;"/>'+
				        '<img src="'+faceArr[4].logoUrl+'" class="radius absolute" style="width:36%;height:36%;margin: 57% 0 0 50%;"/>'+
				    '</div>';
			}
			return faceGroupHtml;
		} 
	}
	
	controller.init(obj);

	
}
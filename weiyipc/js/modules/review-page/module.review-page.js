module.reviewPage= function(options){ //对应module.list2-template
	var opts= {
		rsCount: 0, //总记录数
		pageSize: 20,
		$context: null,	//输出评论列表环境
		$pages: null, //分页位置
		customerId: $("#sesCustomerId").val(),
		refId: 0,
		refType: 0,
		sortType: 1, //1旧 3新
		scene: 'reviewMy' //reviewMy 评论我的  myReview我的评论 collectReview收藏评论
	};

	$.extend(opts,options);

	var url='',params= {};
	switch(opts.scene){
		case "collectReview":
			url= PC_CALL+'collection/json_list/';
			params= {
				collectionType: 8,//	类型1视频2文库4话题7病例8评论
				attUseFlag: 2,
				logoUseFlag: 3,
				customerId: opts.customerId,
				sessionCustomerId: opts.customerId,
				pageIndex: opts.pageIndex?opts.pageIndex:1,
				pageSize: opts.pageSize
			};
			break;
		case "myReview":
			url= PC_CALL+'review/json_list/';
			params= {
				pageIndex: 1,
				pageSize: opts.pageSize,
				sortType: 7,
				attUseFlag: 3,
				logoUseFlag: 3,
				customerId: opts.customerId,
				sessionCustomerId: opts.customerId,
				scene:2,
				reviewStatus: 1,
				isValid: 1,
				isTotalCount:1
			};
			break;
		case "terminal":
			url= PC_CALL+'review/json_list/';
			params= {
				pageIndex : 1,//opts.pageIndex?opts.pageIndex:1,
				pageSize : opts.pageSize,
				sortType : opts.sortType, //1旧 3新
				reviewStatus : 1,
				attUseFlag : 3,
				logoUseFlag : 3,
				dataFlag : 1,
				scene : 2,
				sessionCustomerId : opts.customerId,
				reviewType : opts.refType,
				refId : opts.refId,
				isTotalCount:1
			};
			break;
		default:
			url= PC_CALL+'customer/message/getMapList3/';
			params= {
				paramJson: $.toJSON({
					dataFlag:2,//修改
					//customerId: opts.customerId,
					visitSiteId: 1,
					messageType: 1,
					sortType: 7,
					attUseFlag: 3,
					scene: 3,//原来是2   修改
					logoUseFlag: 3,
					isShowRef: 1,
					refType: 8,
					isRemind: 0,
					isShowAtt: 1,
					isShowNoReadCount: 1,
					isRemindOrReply:1,//提醒我看2 评论我的1   修改
					pageIndex: 1,
					pageSize: opts.pageSize
				})
			}
	}

	Fns.ajax.async(url,params,{success:function(data){
		if(opts.rsCount===0){
			if(data && data.responseObject.responseStatus && data.responseObject.responseData){
				opts.rsCount= data.responseObject.responseData.totalCount;
			}
		}
		opts.rsCount= Math.ceil(opts.rsCount/opts.pageSize);
		/*唯医2.0中终端页左侧讨论数是用//www.allinmd.cn/call/video/getMapById3/接口下的cms_video.reviewNum,但是唯医3.0后该接口下的该字段不在维护，因此把scene.detail.commV3下的2525到2533注释掉，在这里使用评论接口的总数字段展示。201906121627张恒*/
			if (data&&data.responseObject&&data.responseObject.responseData&&data.responseObject.responseData.totalCount&&data.responseObject.responseData.totalCount>0) {
				var reviewNum = data.responseObject.responseData.totalCount;
				if (parseInt(reviewNum) > 9999) {
					$(".Ev-discussBtn span").text(reviewNum.toW());//讨论数
				} else {
					$(".Ev-discussBtn span").text(reviewNum);//讨论数
				}
			} else {
				$(".Ev-discussBtn span").text("0");//讨论数
			}
		//装载翻页
		if(opts.$pages){
			opts.$pages.pager({pagenumber: 1, pagecount:opts.rsCount, buttonClickCallback: pageAjax});
		}

		//终端页查看更多
		$('.ev-listMore').off('click').on('click', function(){
			params.pageIndex++;
			Fns.ajax.async(url,params,{success:function(d){
				controllerCenter(d);
			}});

			//Fns.ajax.async()
		});

		controllerCenter(data);
	}});



	function controllerCenter(data){ //控制中心
		var dataSelfInfo= {}; //当为我的时 存放自己的信息
		if(!data.responseObject.responseStatus){
			if( $("#resourceType").length>0){ //针对终端页评论处理
				if(params.pageIndex==1){//第一页没有数据时  TODO:2017.04.21 李春辉修改 终端页查看更多时查看到最后一页会清空内容
					opts.$context.html(module.list2Template.detailNullData(opts.name)); //opts.name是区分电子书来源页
				}else{//后面的页没有数据时
					opts.$context.append(module.list2Template.nullData('没有数据了'));
				}
				$(".ev-listMore").hide();
			}else{
				$(".ev-myReviewIndex").parent().hide();
				opts.$context.html(module.list2Template.nullData('暂无评论'));
				opts.callback&&opts.callback();
			}
			return false;
		}else{
			dataSelfInfo= data.responseObject.responseData;
			data= data.responseObject.responseData.data_list;
		}

		var tempHtml= '',html= [],personalCollectReviewHtml = [];
		for(var i=0;i<data.length;i++){
			tempHtml= module.list2Template.review(formatData(opts.scene,data[i],dataSelfInfo));
			tempHtml= $(tempHtml);

			var callback= {
				Delete: function(){
					module.reviewPage(opts);
				}
			};
			module.list2Template.socialSuite_bindEvents(tempHtml,formatData(opts.scene,data[i],dataSelfInfo),callback);
			module.list2Template.videoPicQuote_Sub(tempHtml, formatData(opts.scene,data[i],dataSelfInfo));
			//module.list2Template.reviewVideoAndPic(tempHtml);
			//提醒谁看点击跳转 TODO:由于加了sps故需要把？替换为&
			tempHtml.find('.ev-videoAfter-content a').css("color","#4c87d2");
			tempHtml.find('.ev-videoAfter-content a').on('click',function(){
				var href="/pages/personal/others_contribution.html?cid="+$(this).attr("href").replace("?","&");
                g_sps.jump(null,href,true);
				return false;
			});
			if(opts.personal&&opts.personal===1&&opts.scene==='collectReview'){//添加处理的原因：个人中心首页 我的收藏栏目（不是我的收藏左侧边栏），我的收藏评论数据不准确，渲染元素是赋值但未复制相应的时间，采用传值处理，对应scene.personal.indexV3.js 424行逻辑，这里直接把评论生成的html传给回调函数处理，见下文195行
                personalCollectReviewHtml.push(tempHtml);
			}else{
                html.push(tempHtml);
			}
		}
		if($("#refType").length>0 && $("#refId").length>0||(comm.getpara("#").navText||window.location.href.match(/\/activity\//g))){ //针对终端页回复处理
			if(html.length >19){
				opts.$context.append(html);
				opts.callback&&opts.callback();
				if(dataSelfInfo.totalCount>$('.al-contentComment').length){
					$('.ev-listMore').show();
				}else{
					$('.ev-listMore').hide();
				}
			}else{
				opts.$context.append(html);
				opts.callback&&opts.callback();
				$('.ev-listMore').hide();
			}
		}else{
			if( /[0-9].html/g.test(location.href)||/eBook_details.html/g.test(location.href)||/college_schedule.html/g.test(location.href) ){
				if(html.length >19){
					opts.$context.append(html);
					opts.callback&&opts.callback();
					if(dataSelfInfo.totalCount>$('.al-contentComment').length){
						$('.ev-listMore').show();
					}else{
						$('.ev-listMore').hide();
					}
				}else{
					opts.$context.append(html);
					$('.ev-listMore').hide();
					opts.callback&&opts.callback();
				}
			}else{
				opts.$context.html(html);
				opts.callback&&opts.callback(personalCollectReviewHtml);
			}
		}

	}

	function formatData(scene,data,data2){
		switch(scene){
			case "myReview":
				var reviewData= data.customer_review;
				if(!reviewData){
					reviewData= data.customer_review_insite;
				}
				return {
					scene: 'myReview',
					customerId: $("#sesCustomerId").val(),
					reviewStatus: reviewData.reviewStatus,
					refUsername: data.parentOwnerNameStr&&data.parentOwnerNameStr.length?comm.getStrLen(data.parentOwnerNameStr,30):'唯医小编',
					isSelf: $("#sesCustomerId").val()==reviewData.customerId,
					uid:$("#sesCustomerId").val(), //当前人id
					refCustomerId: reviewData.refCustomerId,//资源人id
					id: reviewData.id,//当前评论id
					refUrlPc: reviewData.parentId==0?reviewData.refUrlPc:reviewData.refUrlPc+"#reviewArea", //资源地址
					logoUrl: data2.customer_att.logoUrl, //评论人头像
					username: data2.customer_auth.lastName+data2.customer_auth.firstName, //评论人名字
					publishTime: comm.date.diffDay_one(reviewData.publishTime,comm.date.local_time()), //评论时间
					reviewContent: htmlToString(reviewData.reviewContent).replace(/&lt;br\/&gt;/g,'<br/>'), //评论的内容
					reviewNum: reviewData.reviewNum.toWK(), //评论数
					preferNum: reviewData.upNum.toWK(), //赞数
					collectNum: reviewData.collectionNum.toWK(), //收藏数
					preferState: data.customer_prefer.isValid, //赞状态
					collectState: data.customer_collection.isValid, //收藏状态
					reviewType: reviewData.reviewType,//被回复的资源类型
					refName: htmlToString((function(reviewData,data){
						if(reviewData.parentId!=0){
							return comm.getStrLen(data.parent_review_insite.reviewContent,78);
						}else{
							return reviewData.refName;
						}
					})(reviewData,data)),
					parentId: reviewData.parentId,//评论的父评论id 不存在为0
					ref: data.bo_attachment, //资源信息
					refId: reviewData.refId, //资源id
					//资源缩略图,分享使用
					refLogoUrl: data.customer_review_insite_attachment.length>0?data.customer_review_insite_attachment[0].attUrl:'//img10.allinmd.cn/default/loading/225_150.jpg',
					parentRefId: data.parent_review_insite.refId, //评论的父评论资源id,事实应该是和refId一样
					//附件区
					videoIsExist: data.customer_review_insite_attachment_video.length>0, //是否存在礼频
					videoSrcUrl: data.customer_review_insite_attachment_video[0]?data.customer_review_insite_attachment_video[0].attUrl:'', //视频源地址
					videoState: data.customer_review_insite_attachment_video[0]?data.customer_review_insite_attachment_video[0].qiniuStatus:'', //视频处理状态
					videoLogoUrl: data.customer_review_insite_attachment_video[0]?data.customer_review_insite_attachment_video[0].attLogoUrl:'', //视频缩略图地址
					imgIsExist: data.customer_review_insite_attachment.length>0, //是否存在图片
					imgsArr: data.customer_review_insite_attachment, //图片集 //子集数组
					quoteIsExist: data.customer_quote&&data.customer_quote.length>0, //是否存在引用
					refQuoteType: data.customer_quote&&data.customer_quote[0]?data.customer_quote[0].refQuoteType:'', //引用的资源类型
					refQuoteUrl: data.customer_quote&&data.customer_quote[0]?data.customer_quote[0].pageStoragePath: '', //引用的资源地址
					refQuoteName: data.customer_quote&&data.customer_quote[0]?htmlToString(data.customer_quote[0].refQuoteName):'',  //引用的资源标题
					resourceIsValid: parseInt(data.resource_valid),
					tpl_Path:data.bo_attachment?data.bo_attachment.tplPath:"",
					bId:data.bo_attachment?data.bo_attachment.docId:""
				}
				break;
			case "collectReview":
				var reviewData= data.customer_review_insite;
				return {
					scene: 'collectReview',
					customerId: reviewData.customerId,
					reviewStatus: reviewData.reviewStatus,
					refUsername: data.parent_customer_auth?data.parent_customer_auth.lastName+data.parent_customer_auth.firstName:'',
					isSelf: $("#sesCustomerId").val()==reviewData.customerId,
					uid:$("#sesCustomerId").val(), //当前人id
					refCustomerId: reviewData.refCustomerId,//资源人id
					id: reviewData.id,//当前评论id
					refUrlPc: (function(){
						if(data.resource_valid.tpl_Path==286){return '/pages/eBook/eBook_details.html?bId='+reviewData.refId;}
						return data.resource?data.resource.pageStoragePath:reviewData.refUrlPc+"#reviewArea";
					})(), //资源地址
					logoUrl: data.review_customer_logo.logoUrl, //评论人头像
					username: data.review_customer.lastName+data.review_customer.firstName, //评论人名字
					publishTime: comm.date.diffDay_one(reviewData.publishTime,comm.date.local_time()), //评论时间
					reviewContent: htmlToString(reviewData.reviewContent).replace(/&lt;br\/&gt;/g,'<br/>'), //评论的内容
					reviewNum: reviewData.reviewNum.toWK(), //评论数
					preferNum: reviewData.upNum.toWK(), //赞数
					collectNum: reviewData.collectionNum.toWK(), //收藏数
					preferState: data.preferRelationship, //赞状态
					collectState: data.collectionRelationship, //收藏状态
					reviewType: reviewData.reviewType,//被回复的资源类型
					refName: htmlToString((function(reviewData,data){
						if(reviewData.parentId==0){
							return comm.getStrLen(data.customer_collection.refContent,78);
						}else{
							return data.parent_customer_review.reviewContent !== undefined?comm.getStrLen(data.parent_customer_review.reviewContent,78):''; //被回复的资源内容
						}
					})(reviewData,data)),
					parentId: reviewData.parentId,//评论的父评论id 不存在为0
					refId: reviewData.refId, //资源id
					//资源缩略图,分享使用
					refLogoUrl: data.customer_review_attachment_list.length>0?data.customer_review_attachment_list[0].attUrl:'//img10.allinmd.cn/default/loading/225_150.jpg',
					parentRefId: data.customer_review_insite.parentId, //评论的父评论资源id,事实应该是和refId一样
					//附件区
					videoIsExist: data.customer_review_video_list.length>0, //是否存在礼频
					videoSrcUrl: data.customer_review_video_list[0]?data.customer_review_video_list[0].attUrl:'', //视频源地址
					videoState: data.customer_review_video_list[0]?data.customer_review_video_list[0].qiniuStatus:'', //视频处理状态
					videoLogoUrl: data.customer_review_video_list[0]?data.customer_review_video_list[0].attLogoUrl:'', //视频缩略图地址
					imgIsExist: data.customer_review_attachment_list.length>0, //是否存在图片
					imgsArr: data.customer_review_attachment_list, //图片集 //子集数组

					quoteIsExist: data.customer_quote&&data.customer_quote.length>0, //是否存在引用
					refQuoteType: data.customer_quote&&data.customer_quote[0]?data.customer_quote[0].refQuoteType:'', //引用的资源类型
					refQuoteUrl: data.customer_quote&&data.customer_quote[0]?data.customer_quote[0].pageStoragePath: '', //引用的资源地址
					refQuoteName: data.customer_quote&&data.customer_quote[0]?htmlToString(data.customer_quote[0].refQuoteName):'',  //引用的资源标题
					resourceIsValid: parseInt(data.resource_valid.resourceValid),
					tpl_Path:data.resource_valid.tpl_Path

				}
				break;
			case "terminal":
				var reviewData= data.customer_review;
				return {
					teacherInfo:data.college_course_info?data.college_course_info:{},
					isValid: 1,
					reviewStatus: reviewData.reviewStatus,
					refUsername: data.parent_customer_auth?data.parent_customer_auth.lastName+data.parent_customer_auth.firstName:'唯医小编',
					scene: 'terminal',
					isSelf: $("#sesCustomerId").val()==reviewData.customerId,//判断是不是自己reviewData.customerId评论人的id,张恒20180629修改
					uid:$("#sesCustomerId").val(), //当前人id
					customerId: reviewData.customerId,//评论人id
					refCustomerId: reviewData.refCustomerId,//资源人id，
					refCustomerIdStr: reviewData.refCustomerIdStr,//多资源人id，
					id: reviewData.id,//当前评论id
					refUrlPc: reviewData.refUrlPc, //资源地址
					logoUrl: data.customer_att.logoUrl, //评论人头像
					username: data.customer_auth.lastName+data.customer_auth.firstName, //评论人名字
					medicalTitle: data.customer_auth.medicalTitleShow, //职称
					company: htmlToString(data.customer_auth.company), //公司
					publishTime: comm.date.diffDay_one(reviewData.publishTime,comm.date.local_time()), //评论时间
					reviewContent: htmlToString(reviewData.reviewContent).replace(/&lt;br\/&gt;/g,'<br/>'), //评论的内容 .replace(/\<(\/?\S+)\s*?[^<]*?(\/?)>/g, "")
					preferNum: reviewData.upNum.toWK(), //赞数
					reviewNum: reviewData.reviewNum.toWK(), //评论数
					collectNum: reviewData.collectionNum.toWK(), //收藏数
					preferState: data.customer_prefer.isValid, //赞状态
					collectState: data.customer_collection.isValid, //收藏状态
					reviewType: reviewData.reviewType,//被回复的资源类型
					refName: htmlToString((function(reviewData,data){
						if(reviewData.parentId!=0){
							return comm.getStrLen(data.parent_review_insite.reviewContent.replace(/\<(\/?\S+)\s*?[^<]*?(\/?)>/g, ""),78);
						}else{
							return reviewData.refName;
						}
					})(reviewData,data)),
					parentId: reviewData.parentId,//评论的父评论id 不存在为0
					refId: reviewData.refId, //资源id
					//资源缩略图,分享使用
					refLogoUrl: data.customer_review_insite_attachment.length>0?data.customer_review_insite_attachment[0].attUrl:'//img10.allinmd.cn/default/loading/225_150.jpg',
					parentRefId: data.parent_review_insite.refId, //评论的父评论资源id,事实应该是和refId一样
					//附件区
					videoIsExist: data.customer_review_insite_attachment_video.length>0, //是否存在礼频
					videoSrcUrl: data.customer_review_insite_attachment_video[0]?data.customer_review_insite_attachment_video[0].attUrl:'', //视频源地址
					videoState: data.customer_review_insite_attachment_video[0]?data.customer_review_insite_attachment_video[0].qiniuStatus:'', //视频处理状态
					videoLogoUrl: data.customer_review_insite_attachment_video[0]?data.customer_review_insite_attachment_video[0].attLogoUrl:'', //视频缩略图地址
					imgIsExist: data.customer_review_insite_attachment.length>0, //是否存在图片
					imgsArr: data.customer_review_insite_attachment, //图片集 //子集数组
					quoteIsExist: data.customer_quote&&data.customer_quote.length>0, //是否存在引用
					refQuoteType: data.customer_quote&&data.customer_quote[0]?data.customer_quote[0].refQuoteType:'', //引用的资源类型
					refQuoteUrl: data.customer_quote&&data.customer_quote[0]?data.customer_quote[0].pageStoragePath: '', //引用的资源地址
					refQuoteName: data.customer_quote&&data.customer_quote[0]?htmlToString(data.customer_quote[0].refQuoteName):'',  //引用的资源标题
					resourceIsValid:1,
					onlyAllinCircle:1//只分享到唯医朋友圈
				}
				break;
			default:	//消息中的评论我的
				return {
					scene: 'reviewMy',
					reviewStatus: parseInt(data.srcReviewStatus),
					refUsername: data.parent_customer_auth?data.parent_customer_auth.lastName+data.parent_customer_auth.firstName:'唯医小编',
					isSelf: $("#sesCustomerId").val()==data.sendCustomerId,
					uid:$("#sesCustomerId").val(), //当前人id
					refCustomerId: data.attachment_resource.customer_review?data.attachment_resource.customer_review.refCustomerId:0,//资源人id
					customerId: data.sendCustomerId,//资源人id
					id: data.refReviewId,//当前评论id
					refUrlPc: data.refUrl, //资源地址
					logoUrl: data.logoUrl, //评论人头像
					username: data.sendCustomerName, //评论人名字
					publishTime: comm.date.diffDay_one(data.messageSrcTime,comm.date.local_time()), //评论时间
					reviewContent:htmlToString((function(data){
						if(data.attachment_resource.customer_review&&data.attachment_resource.customer_review.reviewStatus==1){
							return data.attachment_resource.customer_review.reviewContent.indexOf("[影像]")>-1?"":data.attachment_resource.customer_review.reviewContent; //当前的回复，带引用
						}else{
							return data.messageBody; //当前的回复
						}
					})(data)).replace(/&lt;br\/&gt;/g,'<br/>'),
					reviewNum: data.attachment_resource.customer_review?data.attachment_resource.customer_review.reviewNum.toWK():0, //评论数
					preferNum: data.attachment_resource.customer_review?data.attachment_resource.customer_review.upNum.toWK():0, //赞数
					collectNum: data.attachment_resource.customer_review?data.attachment_resource.customer_review.collectionNum.toWK():0, //收藏数
					preferState: data.attachment_resource.customer_review?data.attachment_resource.customer_prefer.isValid:0, //赞状态
					collectState: data.attachment_resource.customer_collection?data.attachment_resource.customer_collection.isValid:0, //收藏状态
					reviewType: data.resourceType,//被回复的资源类型
					refType:data.refType,
					refName:htmlToString((function(data){
						if(data.attachment_resource.customer_review&&data.attachment_resource.customer_review.parentId==0){
							return comm.getStrLen(data.messageName,78); //被回复的资源标题
						}else{
							return comm.getStrLen(data.messageName,78); //被回复的资源内容
						}
					})(data)),
					parentId: data.attachment_resource.customer_review?data.attachment_resource.customer_review.parentId:0,//评论的父评论id 不存在为0
					refId: data.refId, //资源id
					//资源缩略图,分享使用
					refLogoUrl: data.attachment_resource.customer_review_insite_attachment?data.attachment_resource.customer_review_insite_attachment.attUrl:'//img10.allinmd.cn/default/loading/225_150.jpg',
					parentRefId: data.refId, //评论的父评论资源id,事实应该是和refId一样
					//附件区  无附件时不返回对象
					videoIsExist: data.attachment_resource.customer_review_insite_attachment_video.length>0, //是否存在礼频
					videoSrcUrl: data.attachment_resource.customer_review_insite_attachment_video[0]?data.attachment_resource.customer_review_insite_attachment_video[0].attUrl:'', //视频源地址
					videoState: data.attachment_resource.customer_review_insite_attachment_video[0]?data.attachment_resource.customer_review_insite_attachment_video[0].qiniuStatus:'', //视频处理状态
					videoLogoUrl: data.attachment_resource.customer_review_insite_attachment_video[0]?data.attachment_resource.customer_review_insite_attachment_video[0].attLogoUrl:'', //视频缩略图地址
					imgIsExist: data.attachment_resource.customer_review_insite_attachment.length>0, //是否存在图片
					imgsArr: data.attachment_resource.customer_review_insite_attachment, //图片集 //子集数组 attUrl
					quoteIsExist:0,// data.attachment_resource.customer_quote&&data.attachment_resource.customer_quote.length>0, //是否存在引用
					refQuoteType: data.attachment_resource.customer_quote&&data.attachment_resource.customer_quote[0]?data.attachment_resource.customer_quote[0].refQuoteType:'', //引用的资源类型
					refQuoteUrl: data.attachment_resource.customer_quote&&data.attachment_resource.customer_quote[0]?data.attachment_resource.customer_quote[0].pageStoragePath: '', //引用的资源地址
					refQuoteName: data.attachment_resource.customer_quote&&data.attachment_resource.customer_quote[0]?htmlToString(data.attachment_resource.customer_quote[0].refQuoteName):'', //引用的资源标题
					refUrl:data.refUrl?data.refUrl+"#reviewArea":1,//终端页地址
					messageId:(data.messageId.lastIndexOf(",")>-1)?data.messageId:data.messageId+",",//消息ID
					isRead:data.isRead,//未读状态
					resourceIsValid: 1,
					onlyAllinCircle:1//只分享到唯医朋友圈
				}
		}
	}

	function pageAjax(pageclickednumber){ //翻页 取当前单击的数值 //消息中评论我的 、我的评论
		if(params.paramJson){
			var param=JSON.parse(params.paramJson);
			param.pageIndex = parseInt(pageclickednumber);
			params= {paramJson:$.toJSON(param)};
		}else{
			params.pageIndex = parseInt(pageclickednumber);
		}
		$(window).scrollTop(0);

		var data= Fns.ajax.sync(url,params);
		controllerCenter(data);
		opts.$pages.pager({pagenumber: pageclickednumber, pagecount: opts.rsCount, buttonClickCallback: pageAjax});
	}




};

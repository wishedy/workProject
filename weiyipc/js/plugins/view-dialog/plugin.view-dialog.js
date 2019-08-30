//查看对话
function templateSocialViewDialogUpStairs(kv){
	var url = "/pages/personal/others_contribution.html?cid="+kv.customer_auth.customerId;
	if(kv.customer_auth.customerId==$("#sesCustomerId").val()){//本人
		url = "/pages/personal/personal_contribution.html";
	}
	return '<section class="al-commentDetails asdfasdfasdf">'+
	   			'<figure class="al-commentDetailsImg">'+
	   				'<a href="'+url+'" target="_blank">'+
	   					'<img src="'+kv.customer_att.logoUrl+'" alt="">'+
	   				'</a>'+
	   			'</figure>'+
	   			'<article class="al-commentDetailsText">'+
		   			'<h2><span class="ev-reviewUsername"><a href="'+url+'" target="_blank">'+kv.customer_auth.lastName+kv.customer_auth.firstName+'</a></span><i class="al-vipUser"></i><span class="al-commentDetailsTime">'+comm.date.diffDay_one(kv.customer_review.publishTime,comm.date.local_time())+'</span></h2>'+
		   			'<p class="al-commentDetailsJobMsg">'+
		   				'<span>'+kv.customer_auth.medicalTitleShow+'</span>'+
		   				'<span>'+htmlToString(kv.customer_auth.company)+'</span>'+
		   			'</p>'+
		   			'<article class="al-commentReplyText">'+
		   				'<div class="ev-videoAfter-content">'+(kv.customer_review.parentId?'评论'+kv.parent_customer_auth.lastName+kv.parent_customer_auth.firstName+'：':'')+'<span>'+htmlToString(kv.customer_review.reviewContent).replace(/(&lt;br\/&gt;)+/g,'<br/>')+'</span></div>'+
		   			'</article>'+
	   			'</article>'+
	   		'</section>';
}

function templateSocialViewDialogDownStairs(kv){
    var url = "/pages/personal/others_contribution.html?cid="+kv.customer_auth.customerId;
    if(kv.customer_auth.customerId==$("#sesCustomerId").val()){//本人
        url = "/pages/personal/personal_contribution.html";
    }
	return '<section class="al-commentDetails">'+
			   '<figure class="al-commentDetailsImg">'+
				   '<a href="'+url+'" target="_blank">'+
			       		'<img src="'+kv.customer_att.logoUrl+'" alt="">'+
			       '</a>'+
		       '</figure>'+
			   '<article class="al-commentDetailsText">'+
				    '<h2><a href="'+url+'" target="_blank">'+kv.customer_auth.lastName+kv.customer_auth.firstName+'</a><i class="al-vipUser"></i><span class="al-commentDetailsTime">'+comm.date.diffDay_one(kv.customer_review.publishTime,comm.date.local_time())+'</span></h2>'+
				    '<p class="al-commentDetailsJobMsg">'+
				        '<span>'+kv.customer_auth.medicalTitleShow+'</span>'+
				        '<span>'+htmlToString(kv.customer_auth.company)+'</span>'+
				    '</p>'+
				    '<article class="al-commentReplyText">'+
				        '<div class="ev-videoAfter-content">'+(kv.customer_review.parentId?'评论'+kv.parent_customer_auth.lastName+kv.parent_customer_auth.firstName+'：':'')+'</span><span>'+htmlToString(kv.customer_review.reviewContent).replace(/(&lt;br\/&gt;)+/g,'<br/>')+'</span></div>'+
				    '</article>'+
			  '</article>'+
		   '</section>';
}

function viewDialogLine(height){
	return '<section class="al-commentTimeLine" style="height:'+height+'px;"></section>'
}

//先决条件：业务逻辑是如上层不存在数据，则不允许出现查看对话
function socialViewDialog(options){
	
	var opts= {
		reviewId: 0, //1397797437468
		refId: 0, //1468552494466
		$MouseEle: null, //鼠标处理元素 
		$dialogEle: null, //事件元素
		isMouseMove:false,  //鼠标移入 //当isMouseMove为false 则一直固定显示
		scene: null, //场景
		ajaxUpUrl: '/call/review/json_list/',
		ajaxDownUrl: '/call/review/json_list/'
	};
	
	$.extend(opts, options);
	
	opts.ajaxUpParams= {
		dataFlag:3,
		useFlag:1,
		attUseFlag:3,
		logoUseFlag:3,
		refId:opts.refId,
		scene:2,
		currentReviewId: opts.reviewId,
		pageIndex:1,
		pageSize:100
	};
	opts.ajaxDownParams= {
		dataFlag:3,
		useFlag:1,
		attUseFlag:3,
		logoUseFlag:3,
		refId:opts.refId,
		sortType:1,
		scene:2,
		parentId:opts.reviewId,
		isCurrentRow:0,
		pageIndex:1,
		pageSize:100
	};
	
	var a= {
		b: function(){
			var _this= this;
			if(opts.isMouseMove && opts.$MouseEle) { 
				opts.$dialogEle.hide(); 
				opts.$MouseEle.on('mouseenter',function(){
					opts.$dialogEle.show();
				}).on('mouseleave', function(){
					opts.$dialogEle.hide(); 
				});
			}
			
			opts.$dialogEle.on('click',function(){
				_this.c();	
			});
		},
		c: function(){ //直接各拿100条
			
			$("body").append('<section class="evInside-viewDialog"></section>').css({"overflow":"hidden"});
			opts.$ele= $('.evInside-viewDialog');
			if(opts.$ele.length===0) return false;
			opts.$ele.css({'position': 'absolute','z-index':'10'});
			comm.LightBox.show('70','#000');
			var wrapOutside= 
				'<section class="al-commentDetailsBox ev-BoxStyleHeight700px">'+
			    	'<header class="al-commentDetailsTitle ev-title">'+
			    	'讨论<i class="al-commentDetailsClose ev-close"></i>'+
			    	'</header>'+
                    '<section class="al-overflow">'+
                        '<section class="al-commentDetailsItem ev-upStairs"> </section>'+
                        '<section class="al-commentDetailsItem al-commentDownDetailsItem ev-downStairs"> </section>'+
                    '</section>'+
			    '</section>'
			
			var upData= Fns.ajax.sync(opts.ajaxUpUrl,opts.ajaxUpParams); 
			var downData= Fns.ajax.sync(opts.ajaxDownUrl,opts.ajaxDownParams); 
			var upHTML= this.dataSplitJoin('up',upData); 
			var downHTML= this.dataSplitJoin('down',downData);
			
			opts.$ele.append(wrapOutside).find('.ev-close').on('click', function(){
				opts.$ele.remove();
                $("body").css({"overflow":"auto"});
				$('#lightbox').remove();
				comm.LightBox.count= 0;
			});
			opts.$ele.find('.ev-upStairs').html(upHTML); //输出上层数据
			opts.$ele.find('.ev-downStairs').html(downHTML); //输出下层数据
			
			//统一追加@主页
			opts.$ele.find('.ev-videoAfter-content a').off('click').on('click', function(){
				var href="/pages/personal/others_contribution.html?cid="+$(this).attr('href');
                g_sps.jump(null,href,true);
				return false;
			});
			
//			if(downHTML.length === 1){//downHTML就目前看来，后台返回的下层第一条为当前点过去的数据,就意味着永远至少有一条 
//				opts.$ele.find('.ev-upStairs').append(downHTML);
//				opts.$ele.find('.ev-downStairs').hide();
//			}else if(downHTML.length > 1){
//				opts.$ele.find('.ev-upStairs').append(downHTML[0]);
//				downHTML.shift();
//				opts.$ele.find('.ev-downStairs').html(downHTML);
//			}
			
			
			//下层无数据，隐藏结构
			if(!downHTML){ $(".ev-downStairs").hide(); }
			
			var $upStairs= opts.$ele.find('.ev-upStairs');
			$upStairs.prepend(viewDialogLine( $upStairs.height()-$upStairs.children().eq($upStairs.children().length-1).outerHeight() - 54/2 ));
			//comm.setCenter(opts.$ele);
			if(comm.browser.isIe8()){//ie8不支持transform
				var boxHeight=opts.$ele.find('.ev-BoxStyleHeight700px');
				boxHeight.css({'margin-left':'-354px','margin-top':-boxHeight.height()/2+'px'})
			}
			var firstTop= $(".ev-upStairs>section").eq(0).offset().top;
			var lastTop= $(".ev-upStairs>section").eq($(".ev-upStairs>section").length-1).offset().top;
			var placeTop= lastTop- firstTop- $('.ev-title').height();
			$('.ev-BoxStyleHeight700px').scrollTop(placeTop);
		},
		dataSplitJoin: function(action,data){
			if(!data.responseObject.responseStatus) return false;
			data= data.responseObject.responseData.data_list;
			var HTML= [];
			
			if(action=== 'up'){
				
				for(var i=0,len=data.length;i<len;i++){
					tempHtml= $(templateSocialViewDialogUpStairs(data[i]));
					module.list2Template.videoPicQuote_Sub(tempHtml, formatData("myReview",data[i]), 'viewDialog');
					
					HTML.push(tempHtml);
				}
				
				//对最后一条加社交 此条为被点击的数据
				function socialStyle(kv){
					return '<article class="al-contentCommentOtherMsg ev-socialOper">'+
		            	//'<i class="ev-delete"><i class="al-commentDeleteBtn">删除</i></i>'+
		            	//'<a href="javascript:void(0)" class="al-coomentWatchBtn ev-viewDialog" style="display:none;">查看评论</a>'+
			            '<span class="ev-review"><i class="al-commentBtn"></i><b>评论</b><i style="width:11px;'+(kv.customer_review.reviewNum==0?'display:none;':'')+'">'+kv.customer_review.reviewNum+'</i></span>'+
			            '<span class="ev-prefer">'+
			            	'<span vns-social-toggle-default><i class="al-likeBtn"></i>'+
			            		'<i vns-social-toggle-total style="margin-left:5px;width: 0px;'+(kv.customer_review.upNum==0?'display:none;':'')+'">'+kv.customer_review.upNum+'</i></span>'+
			            	'<span vns-social-toggle-activation class="active"><i class="al-likeBtn"></i>'+
			            		'<i vns-social-toggle-total style="margin-left:5px;width: 0px;'+(kv.customer_review.upNum==0?'display:none;':'')+'">'+kv.customer_review.upNum+'</i></span>'+
			            '</span>'+
			            '<span class="ev-collection">'+
			            	'<span vns-social-toggle-default><i class="al-collectBtn"></i>'+
			            		'<i vns-social-toggle-total style="margin-left:5px;width: 0px;'+(kv.customer_review.collectionNum==0?'display:none;':'')+'">'+kv.customer_review.collectionNum+'</i></span>'+
			            	'<span vns-social-toggle-activation class="active"><i class="al-collectBtn"></i>'+
			            		'<i vns-social-toggle-total style="margin-left:5px;width: 0px;'+(kv.customer_review.collectionNum==0?'display:none;':'')+'">'+kv.customer_review.collectionNum+'</i></span>'+
			            '</span>'+
						'<span class="ev-share"><i class="al-shareBtn"></i><b>分享</b></span>'+
		            '</article>';
				};
				
				HTML[HTML.length-1].append(socialStyle(data[data.length-1]));
				
				var callback= {
					Delete: function(){
						$(".ev-socialOper").remove(); //移除社交
						$(".ev-upStairs").children().last().remove(); //移除对应数据
						$(".al-commentTimeLine").remove(); //移除对话线
						
						//重新画对话线
						var $upStairs= opts.$ele.find('.ev-upStairs');
						$upStairs.prepend(viewDialogLine( $upStairs.height()-$upStairs.children().eq($upStairs.children().length-1).outerHeight() - 54/2 ));
						
						//重新获取数据
						var $reviewList= $('.ev-reviewList'), $pagerPlace= $('pager'), pageSize= 20, scene= "myReview"; //表达我的回复等
						if($reviewList.length==0){ //只用于表达首页的四条我的回复
							$reviewList= $('.ev-myReviewIndex');  
							pageSize= 4;
							$pagerPlace= null;
						}
						
						module.reviewPage({$context:$reviewList,$pages:$pagerPlace,scene: scene, pageSize:pageSize}); 
					}
				};
				module.list2Template.socialSuite_bindEvents(HTML[HTML.length-1], formatData("myReview",data[data.length-1]), callback)
			}else{
				for(var i=0,len=data.length;i<len;i++){
					tempHtml= $(templateSocialViewDialogDownStairs(data[i]));
					
					module.list2Template.videoPicQuote_Sub(tempHtml, formatData("myReview",data[i]), 'viewDialog');
					HTML.push(tempHtml);
				}
			}
			return HTML;
		}
	}
	
	
	function formatData(scene,data,data2){
		if(scene=="myReview"){ //使用data2 场景包含终端页
			var reviewData= data.customer_review;
			if(!reviewData){
				reviewData= data.customer_review_insite;
			}
			return {
				isSelf: $("#sesCustomerId").val()==reviewData.refCustomerId,
				uid:$("#sesCustomerId").val(), //当前人id
				customerId: reviewData.customerId,//当前评论的作者;
				refCustomerId: reviewData.refCustomerId,//资源人id 
				id: reviewData.id,//当前评论id
				refUrlPc: reviewData.refUrlPc, //资源地址
				//logoUrl: data2.customer_att.logoUrl, //评论人头像
				//username: data2.customer_auth.lastName+data2.customer_auth.firstName, //评论人名字
				publishTime: comm.date.diffDay_one(reviewData.publishTime,comm.date.local_time()), //评论时间
				reviewContent: htmlToString(reviewData.reviewContent).replace(/(&lt;br\/&gt;)+/g,'<br/>'), //评论的内容
				reviewStatus: reviewData.reviewStatus, //评论状态
				reviewNum: reviewData.reviewNum.toWK(), //评论数
				preferNum: reviewData.upNum.toWK(), //赞数
				collectNum: reviewData.collectionNum.toWK(), //收藏数
				preferState: data.customer_prefer.isValid, //赞状态
				collectState: data.customer_collection.isValid, //收藏状态
				reviewType: reviewData.reviewType,//被回复的资源类型
				refName: htmlToString(comm.getStrLen(reviewData.reviewContent,78)), //被回复的资源内容
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
				quoteIsExist: data.customer_quote.length>0, //是否存在引用
				refQuoteType: data.customer_quote[0]?data.customer_quote[0].refQuoteType:'', //引用的资源类型
				refQuoteUrl: data.customer_quote[0]?data.customer_quote[0].pageStoragePath: '', //引用的资源地址
				refQuoteName: data.customer_quote[0]?htmlToString(data.customer_quote[0].refQuoteName):'' ,//引用的资源标题
				resourceIsValid: data.customer_review.reviewStatus, //资源状态		
				onlyAllinCircle:1//只分享到唯医朋友圈
			}
		}else{ //评论我的 消息里 暂未发现报告说需要resourceIsValid: data.customer_review.reviewStatus, //资源状态		
			return {
				isSelf: $("#sesCustomerId").val()==data.sendCustomerId,
				uid:$("#sesCustomerId").val(), //当前人id
				refCustomerId: data.sendCustomerId,//资源人id 
				id: data.refReviewId,//当前评论id
				refUrlPc: data.refUrl, //资源地址
				logoUrl: data.logoUrl, //评论人头像
				username: data.sendCustomerName, //评论人名字
				publishTime: comm.date.diffDay_one(data.messageSrcTime,comm.date.local_time()), //评论时间
				reviewContent: data.attachment_resource.customer_review.reviewContent, //评论的内容
				reviewNum: data.attachment_resource.customer_review.reviewNum.toWK(), //评论数
				preferNum: data.attachment_resource.customer_review.upNum.toWK(), //赞数
				collectNum: data.attachment_resource.customer_review.collectionNum.toWK(), //收藏数
				preferState: data.attachment_resource.customer_prefer.isValid, //赞状态
				collectState: data.attachment_resource.customer_collection.isValid, //收藏状态
				reviewType: data.refType,//被回复的资源类型
				refName: htmlToString(comm.getStrLen(data.messageName,78)), //被回复的资源内容
				parentId: data.attachment_resource.customer_review.parentId,//评论的父评论id 不存在为0
				refId: data.refId, //资源id
				//资源缩略图,分享使用 
				refLogoUrl: data.attachment_resource.customer_review_insite_attachment?data.attachment_resource.customer_review_insite_attachment.attUrl:'//img10.allinmd.cn/default/loading/225_150.jpg',
				parentRefId: data.refId, //评论的父评论资源id,事实应该是和refId一样
				//附件区  无附件时不返回对象
				videoIsExist: data.attachment_resource.customer_review_insite_attachment_video.length>0, //是否存在礼频
				videoSrcUrl: data.attachment_resource.customer_review_insite_attachment_video[0]?data.attachment_resource.customer_review_insite_attachment_video[0].attUrl:'', //视频源地址
				videoLogoUrl: data.attachment_resource.customer_review_insite_attachment_video[0]?data.attachment_resource.customer_review_insite_attachment_video[0].attLogoUrl:'', //视频缩略图地址
				imgIsExist: data.attachment_resource.customer_review_insite_attachment.length>0, //是否存在图片		
				imgsArr: data.attachment_resource.customer_review_insite_attachment, //图片集 //子集数组 attUrl
				quoteIsExist: data.attachment_resource.customer_quote.length>0, //是否存在引用
				refQuoteType: data.attachment_resource.customer_quote[0]?data.attachment_resource.customer_quote[0].refQuoteType:'', //引用的资源类型
				refQuoteUrl: data.attachment_resource.customer_quote[0]?data.attachment_resource.customer_quote[0].pageStoragePath: '', //引用的资源地址
				refQuoteName: data.attachment_resource.customer_quote[0]?htmlToString(data.attachment_resource.customer_quote[0].refQuoteName):'' //引用的资源标题
			}
		}
	}
	
	a.b();
}

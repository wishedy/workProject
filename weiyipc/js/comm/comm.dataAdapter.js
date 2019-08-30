/**
 * 功能描述： 数据适配中心 针对后端返回的JSON数据进入对应的处理 
 * 
 * 注意事件：
 * 引入来源：  作用：
 *
 * Created by QiaoLiang on 2015-4-9.
 */
comm.dataAdapter = {
	trends : function(kv){ //动态 场景个人主首页中动态
		var t = this;
		var pca = kv.parent_customer_auth;
		var cts = kv.customer_trends;
		var catt = kv.customer_att;
		var cbo = kv.customer_baseinfo;
		var cah = kv.customer_auth;
		var trendType = kv.customer_trends_type; //其它类型
		var reviewPrivateType = cts.resourceType; //回应私有类型
		
		var parserResult = {
			refType : trendType,  // 动态类型
			//两行other特指回应了转发了
			otherId : parseInt(cts.opId), //特指转发还是评论还是其它,0-发布、1-回应、2-转发、3-收藏、4-分享、5-赞
			otherName : pca.lastName+pca.firstName,	//转发人 回复给的名字 
			trendsId : cts.id, //动态表主键id
			nickname : cah.lastName+cah.firstName, //作者
			logoUrl : catt.logoUrl, //场景不同，图片不同，不在这儿在处理
			time : cts.opDate, //时间
			title : cts.resourceName===""?"邀你讨论":cts.resourceName, //资源显示名称 事实只允许话题存在无标题
			content : cts.trendContent, //资源内容
			reviewPrivateType : reviewPrivateType, //针对回复时采用的类型
			reviewId : cts.citeId, //针对回复时的回复主键id 0为非回复类
			parentReviewId : cts.parentCiteId, //针对回复时的父Id, 0为顶层
			refId : cts.resourceId, //资源id
			refUrl : cts.resourceUrl, //资源地址
			refCustomerId : cts.customerId, //动态作者id
			parentCustomerId : cts.parentCustomerId, //被转发资源的作者id
			praiseNum : cts.upNum, //赞数
			reprintNum : cts.reprintNum, //转发数
			collectionNum : cts.collectionNum, //收藏数
			reviewNum : cts.reviewNum, //评论数
			browseNum : kv.resource_valid.browseNum, //浏览数
			praiseValid : kv.customer_prefer.isValid, //赞状态
			reprintValid : kv.customer_reprint.isValid, //转发状态
			collectionValid : kv.customer_collection.isValid, //收藏状态
			resourceValid : kv.resource_valid.resourceValid, //资源是否有效 
			imgArr : [] //图片存放
		};
		
		switch(trendType){ 
		case 1: //视频
			parserResult.imgArr = t.fns.joinArr(kv.cms_video_attachment,"videoAttUrl");
			break;
		case 2: //文库
			parserResult.imgArr = t.fns.joinArr(kv.cms_doc_attachment,"docAttUrl");
			break;
		case 4: //话题
			parserResult.imgArr = t.fns.joinArr(kv.cms_topic_attachment,"topicAttUrl");
			var kcq= kv.customer_quote;
			parserResult.quote = (function(){
				if(kv.customer_quote === undefined || kv.customer_quote.length===0){ return ''; }
				
				var data= kv.customer_quote[0];
				var result = '引用',tempPrefix= '';
				switch(data.refQuoteType){
				case 1: tempPrefix = '视频'; break;
				case 2: tempPrefix = '文库'; break;
				case 4: tempPrefix = '话题'; break;
				case 7: tempPrefix = '病例'; break;
				}
				return result+tempPrefix+ '<a href="'+data.pageStoragePath+'" target="_blank" style="color:#3d84c6;">《'+data.refQuoteName+'》</a>';
			})();
			var kcr= kv.cms_topic_video;
			if(kcr !== undefined && kcr.length>0 && kcr[0].qiniuStatus == "2") //七牛转码定义  2为成功，4为失败
				parserResult.videoSrc = '<div class="evBgVideo" style="width:225px;position:relative;" data-videosrc="'+kcr[0].attUrl+'"><img src="//img00.allinmd.cn/meeting/player.png" style="position: absolute;top:0;left:0;z-index:2;cursor:pointer;"><img style="width:225px;height:150px;" src="'+kcr[0].logoUrl+'"/></div>';
				else if(kcr !== undefined && kcr.length>0 && kcr[0].qiniuStatus == "1")
					parserResult.videoSrc = '<div><img src="//img10.allinmd.cn/default/qiniu225_150.jpg"/></div>';
					else parserResult.videoSrc = '';	
			break;
		case 7: //病例
			parserResult.imgArr = t.fns.joinArr(kv.case_attachment_list,"attUrl");
			var kcq= kv.customer_quote;
			parserResult.quote = (function(){
				if(kv.customer_quote === undefined || kv.customer_quote.length===0){ return ''; }
				
				var data= kv.customer_quote[0];
				var result = '引用',tempPrefix= '';
				switch(data.refQuoteType){
				case 1: tempPrefix = '视频'; break;
				case 2: tempPrefix = '文库'; break;
				case 4: tempPrefix = '话题'; break;
				case 7: tempPrefix = '病例'; break;
				}
				return result+tempPrefix+ '<a href="'+data.pageStoragePath+'" target="_blank" style="color:#3d84c6;">《'+data.refQuoteName+'》</a>';
			})();
			var kcr= kv.case_video_list;
			if(kcr !== undefined && kcr.length>0 && kcr[0].qiniuStatus == "2") //七牛转码定义  2为成功，4为失败
				parserResult.videoSrc = '<div class="evBgVideo" style="width:225px;position:relative;" data-videosrc="'+kcr[0].attUrl+'"><img src="//img00.allinmd.cn/meeting/player.png" style="position: absolute;top:0;left:0;z-index:2;cursor:pointer;"><img style="width:225px;height:150px;" src="'+kcr[0].logoUrl+'"/></div>';
				else if(kcr !== undefined && kcr.length>0 && kcr[0].qiniuStatus == "1")
					parserResult.videoSrc = '<div><img src="//img10.allinmd.cn/default/qiniu225_150.jpg"/></div>';
					else parserResult.videoSrc = '';	
			break;
		case 8: //评论
			parserResult.imgArr = t.fns.joinArr(kv.customer_review_attachment_list,"attUrl");
			var kcq= kv.customer_quote;
			parserResult.quote = (function(){
				if(kv.customer_quote === undefined || kv.customer_quote.length===0){ return ''; }
				
				var data= kv.customer_quote[0];
				var result = '引用',tempPrefix= '';
				switch(data.refQuoteType){
				case 1: tempPrefix = '视频'; break;
				case 2: tempPrefix = '文库'; break;
				case 4: tempPrefix = '话题'; break;
				case 7: tempPrefix = '病例'; break;
				}
				return result+tempPrefix+ '<a href="'+data.pageStoragePath+'" target="_blank" style="color:#3d84c6;">《'+data.refQuoteName+'》</a>';
			})();
			var kcr= kv.customer_review_video_list;
			if(kcr !== undefined && kcr.length>0 && kcr[0].qiniuStatus == "2") //七牛转码定义  2为成功，4为失败
				parserResult.videoSrc = '<div class="evBgVideo" style="width:225px;position:relative;" data-videosrc="'+kcr[0].attUrl+'"><img src="//img00.allinmd.cn/meeting/player.png" style="position: absolute;top:0;left:0;z-index:2;cursor:pointer;"><img style="width:225px;height:150px;" src="'+kcr[0].attLogoUrl+'"/></div>';
				else if(kcr !== undefined && kcr.length>0 && kcr[0].qiniuStatus == "1")
					parserResult.videoSrc = '<div><img src="//img10.allinmd.cn/default/qiniu225_150.jpg"/></div>';
					else parserResult.videoSrc = '';	
			break;
		}
		
		return parserResult;
		
	},
	caze : function(kv){ //病例   1397640872703
		var t= this;
		var cbo = kv.case_baseinfo;
		var caul1 = kv.case_att_url_list_1;
		var caul2 = kv.case_att_url_list_2;
		var caul3 = kv.case_att_url_list_3;
		
		var parserResult = {  //
			refType : ResouceType.caze,  
			time : cbo.publishTime, //时间
			title : cbo.caseName,//标题
			content : t.fns.getCazeContent(cbo), //性别 年龄 主诉 资源内容 
			reviewId : 0, //针对回复时的回复主键id 0为非回复类
			parentReviewId : 0, //针对回复时的父Id, 0为顶层
			refId : cbo.caseId, //资源id
			refCustomerId : cbo.refCustomerId, //当前资源人id
			refUrl : cbo.pageStoragePath, //资源地址
			praiseNum : cbo.preferUpNum, //赞数
			reprintNum : cbo.reprintNum, //转发数
			collectionNum : cbo.collectionNum, //收藏数
			reviewNum : cbo.reviewNum, //评论数
			browseNum : cbo.browseNum, //浏览数
			reprintValid : kv.customer_reprint.isValid, //转发状态
			praiseValid : kv.customer_prefer.isValid,//赞状态
			collectionValid : kv.customer_collection.isValid, //收藏状态
			headerValid : cbo.isHeader, //置顶状态
			imgArr : [] //图片存放
		};
		
		if(caul1.length>0) parserResult.imgArr1 = t.fns.joinArr(caul1,"attUrl");  //术前
		if(caul2.length>0) parserResult.imgArr2 = t.fns.joinArr(caul2,"attUrl"); //术中
		if(caul3.length>0) parserResult.imgArr3 = t.fns.joinArr(caul3,"attUrl"); //术后
		
		var tempArr = [];
		if(caul1.length>0) tempArr = parserResult.imgArr1;
		if(caul1.length>0 && caul2.length>0) tempArr = parserResult.imgArr1.concat(parserResult.imgArr2);
		if(caul3.length>0) tempArr = tempArr.concat(parserResult.imgArr3);
		parserResult.imgArr = tempArr;
		
		//视频
		var cvul1 = kv.case_video_url_list_1;
		var cvul2 = kv.case_video_url_list_2;
		var cvul3 = kv.case_video_url_list_3;
		if(cvul1.length>0){ 
			parserResult.videoSrc= (function(){
				if(cvul1.length>0 && cvul1[0].qiniuStatus == "2")
					return '<div style="margin-top:12px;width:225px;position:relative;" class="evBgVideo" data-videosrc="'+cvul1[0].attUrl+'"><img src="//img00.allinmd.cn/meeting/player.png" style="position: absolute;top:0;left:0;z-index:2;cursor:pointer;"><img style="width:225px;height:150px;" src="'+cvul1[0].logoUrl+'"/></div>';
					else if(cvul1.length>0 && cvul1[0].qiniuStatus == "1")
						return '<div><img src="//img10.allinmd.cn/default/qiniu225_150.jpg"/></div>';
						else return '';
			})(); 
		}
		
		if(cvul2.length>0){ 
			parserResult.videoSrc= (function(){
				if(cvul2.length>0 && cvul2[0].qiniuStatus == "2")
					return '<div style="margin-top:12px;width:225px;position:relative;" class="evBgVideo" data-videosrc="'+cvul2[0].attUrl+'"><img src="//img00.allinmd.cn/meeting/player.png" style="position: absolute;top:0;left:0;z-index:2;cursor:pointer;"><img style="width:225px;height:150px;" src="'+cvul2[0].logoUrl+'"/></div>';
					else if(cvul2.length>0 && cvul2[0].qiniuStatus == "1")
						return '<div><img src="//img10.allinmd.cn/default/qiniu225_150.jpg"/></div>';
						else return '';
			})(); 
		}
		
		if(cvul3.length>0){ 
			parserResult.videoSrc= (function(){
				if(cvul3.length>0 && cvul3[0].qiniuStatus == "2")
					return '<div style="margin-top:12px;width:225px;position:relative;" class="evBgVideo" data-videosrc="'+cvul3[0].attUrl+'"><img src="//img00.allinmd.cn/meeting/player.png" style="position: absolute;top:0;left:0;z-index:2;cursor:pointer;"><img style="width:225px;height:150px;" src="'+cvul3[0].logoUrl+'"/></div>';
					else if(cvul3.length>0 && cvul3[0].qiniuStatus == "1")
						return '<div><img src="//img10.allinmd.cn/default/qiniu225_150.jpg"/></div>';
						else return '';
			})(); 
		}
		
		return parserResult;
	},
	video : function(kv){ //视频
		var t = this;
		var cvo = kv.cms_video;
		var cval = kv.cms_video_attachment_list;
		
		var parserResult = {
			refType : ResouceType.video,  
			time : cvo.publishTime===""?cvo. createTime:cvo.publishTime, //时间
			title : cvo.videoName,//标题
			content : cvo.videoAbstract, // 资源内容 ＋＋＋加入展开
			reviewId : 0, //针对回复时的回复主键id 0为非回复类
			parentReviewId : 0, //针对回复时的父Id, 0为顶层
			refId : cvo.videoId, //资源id
			refCustomerId : cvo.refCustomerId, //当前资源人id
			refUrl : cvo.pageStoragePath, //资源地址
			praiseNum : cvo.preferUpNum, //赞数
			reprintNum : cvo.reprintNum, //转发数
			collectionNum : cvo.collectionNum, //收藏数
			reviewNum : cvo.reviewNum, //评论数
			browseNum : cvo.browseNum, //浏览数
			reprintValid : kv.customer_reprint.isValid, //转发状态
			praiseValid : kv.customer_prefer.isValid,//赞状态
			collectionValid : kv.customer_collection.isValid, //收藏状态
			headerValid : cvo.isHeader, //置顶状态
			imgArr : cval.length===0?"":[cval[0].videoAttUrl]//图片存放 视频图只允许有一张
		};
		
		return parserResult;
	},
	doc : function(kv){ //文章
		var t = this;
		var cdo = kv.cms_doc;
		var cdal = kv.cms_doc_attachment_list;
		var parserResult = {
			refType : ResouceType.doc,  
			time : cdo.publishTime, //时间
			title : cdo.docName,//标题
			docStatus : cdo.docStatus, //文档状态
			content : cdo.docAbstract, // 资源内容
			reviewId : 0, //针对回复时的回复主键id 0为非回复类
			parentReviewId : 0, //针对回复时的父Id, 0为顶层
			refId : cdo.docId, //资源id
			refCustomerId : cdo.refCustomerId, //当前资源人id
			refUrl : cdo.pageStoragePath, //资源地址
			praiseNum : cdo.preferUpNum, //赞数
			reprintNum : cdo.reprintNum, //转发数
			collectionNum : cdo.collectionNum, //收藏数
			reviewNum : cdo.reviewNum, //评论数
			browseNum : cdo.browseNum, //浏览数
			reprintValid : kv.customer_reprint.isValid, //转发状态
			praiseValid : kv.customer_prefer.isValid,//赞状态
			collectionValid : kv.customer_collection.isValid, //收藏状态
			headerValid : cdo.isHeader,
			imgArr : [] //图片存放
		};
		
		if(!$.isEmptyObject(cdal)) parserResult.imgArr = t.fns.joinArr(cdal,"docAttUrl");
		return parserResult;
	},
	reviewMe : function(kv){ //回复我的
		var t = this;
		var crie = kv.customer_review_insite; 
		var cria = kv.customer_review_insite_attachment;
		var pri = kv.parent_review_insite;
		var cah = kv.customer_auth;
		var catt = kv.customer_att;
		var criav= kv.customer_review_insite_attachment_video;
		var parserResult = {
			refType : ResouceType.review,  
			reviewPrivateType : parseInt(crie.reviewType), //针对回复时采用的类型
			time : crie.publishTime, //时间
			nickname : cah.lastName+cah.firstName, //作者
			logoUrl : catt.logoUrl, //
			refCustomerId : crie.customerId, //动态作者id
			title : crie.refName,//标题
			content : crie.reviewContent, // 资源内容
			parentConent : pri.reviewContent, //父回复内容
			reviewId : crie.id, //针对回复时的回复主键id 0为非回复类
			parentReviewId : crie.parentId, //针对回复时的父Id, 0为顶层
			refId : crie.refId, //资源id
			refUrl : crie.refUrlPc, //资源地址
			praiseNum : crie.upNum, //赞数
			reprintNum : crie.reprintNum, //转发数
			collectionNum : crie.collectionNum, //收藏数
			reviewNum : crie.respondReviewNum, //评论数
			praiseValid : kv.customer_prefer.isValid, //赞状态
			reprintValid : kv.customer_reprint.isValid, //转发状态
			collectionValid : kv.customer_collection.isValid,//收藏状态
			imgArr : [], //图片存放
			quote : (function(){
				if(kv.customer_quote.length===0){ return ''; }
				
				var data= kv.customer_quote[0];
				var result = '引用',tempPrefix= '';
				switch(data.refQuoteType){
				case 1: tempPrefix = '视频'; break;
				case 2: tempPrefix = '文库'; break;
				case 4: tempPrefix = '话题'; break;
				case 7: tempPrefix = '病例'; break;
				}
				return result+tempPrefix+ '<a href="'+data.pageStoragePath+'" target="_blank" style="color:#3d84c6;">《'+data.refQuoteName+'》</a>';
			})(),
			videoSrc: (function(){
				if(criav.length>0 && criav[0].qiniuStatus == "2")
					return '<div style="margin-top:12px;width:225px;position:relative;" class="evBgVideo" data-videosrc="'+criav[0].attUrl+'"><img src="//img00.allinmd.cn/meeting/player.png" style="position: absolute;top:0;left:0;z-index:2;cursor:pointer;"><img style="width:225px;height:150px;" src="'+criav[0].attLogoUrl+'"/></div>';
					else if(criav.length>0 && criav[0].qiniuStatus == "1")
						return '<div><img src="//img10.allinmd.cn/default/qiniu225_150.jpg"/></div>';
						else return '';
			})()
		};
		
		if(!$.isEmptyObject(cria)) parserResult.imgArr = t.fns.joinArr(cria,"attUrl");
		return parserResult;
	},
	review : function(kv){ //回复的内容
		var t = this;
		var crie = kv.customer_review_insite; 
		var cria = kv.customer_review_insite_attachment;
		var cah = kv.customer_auth;
		var catt = kv.customer_att;
		var criav= kv.customer_review_insite_attachment_video;
		var parserResult = {
			refType : ResouceType.review,
			reviewType : parseInt(crie.reviewType), //回复的类型
			reviewPrivateType : parseInt(crie.reviewType), //针对回复时采用的类型
			time : crie.publishTime, //时间
			title : (function(kv){//标题
				var dataCRIE = kv.customer_review_insite;
				if(dataCRIE.reviewType == ResouceType.topic && dataCRIE.refName == ""){
					return "邀你讨论";
				}else{
					return dataCRIE.refName;
				}
			})(kv),
			content : crie.reviewContent, // 资源内容
			reviewId : crie.id, //针对回复时的回复主键id 0为非回复类
			parentReviewId : crie.parentId, //针对回复时的父Id, 0为顶层
			refId : crie.refId, //资源id
			refUrl : crie.refUrlPc, //资源地址
			praiseNum : crie.upNum, //赞数
			reprintNum : crie.reprintNum, //转发数
			collectionNum : crie.collectionNum, //收藏数
			reviewNum : crie.reviewNum, //评论数
			praiseValid : kv.customer_prefer.isValid, //赞状态
			reprintValid : kv.customer_reprint.isValid, //转发状态
			collectionValid : kv.customer_collection.isValid,//收藏状态
			imgArr : [], //图片存放
			quote : (function(){
				if(kv.customer_quote.length===0){ return ''; }
				
				var data= kv.customer_quote[0];
				var result = '引用',tempPrefix= '';
				switch(data.refQuoteType){
				case 1: tempPrefix = '视频'; break;
				case 2: tempPrefix = '文库'; break;
				case 4: tempPrefix = '话题'; break;
				case 7: tempPrefix = '病例'; break;
				}
				return result+tempPrefix+ '<a href="'+data.pageStoragePath+'" target="_blank" style="color:#3d84c6;">《'+data.refQuoteName+'》</a>';
			})(),
			videoSrc: (function(){
				if(criav.length>0 && criav[0].qiniuStatus == "2")
					return '<div style="margin-top:12px;width:225px;position:relative;" class="evBgVideo" data-videosrc="'+criav[0].attUrl+'"><img src="//img00.allinmd.cn/meeting/player.png" style="position: absolute;top:0;left:0;z-index:2;cursor:pointer;"><img style="width:225px;height:150px;" src="'+criav[0].attLogoUrl+'"/></div>';
					else if(criav.length>0 && criav[0].qiniuStatus == "1")
						return '<div><img src="//img10.allinmd.cn/default/qiniu225_150.jpg"/></div>';
						else return '';
			})() 
		};
		
		if(!$.isEmptyObject(cria)) parserResult.imgArr = t.fns.joinArr(cria,"attUrl");
		return parserResult;
	},
	topic : function(kv){ //话题
		var t = this;
		var ctc = kv.cms_topic;
		var ctal = kv.cms_topic_attachment_list;
		var ctvl = kv.cms_topic_video_list;
		var parserResult = {
			refType : ResouceType.topic,  
			time : ctc.publishTime, //时间
			title : ctc.topicName,//标题
			content : ctc.topicDiscuss, // 资源内容
			reviewId : 0, //针对回复时的回复主键id 0为非回复类
			parentReviewId : 0, //针对回复时的父Id, 0为顶层
			refId : ctc.topicId, //资源id
			refCustomerId : ctc.customerId, //当前资源人id
			refUrl : ctc.pageStoragePath, //资源地址
			praiseNum : ctc.preferUpNum, //赞数
			reprintNum : ctc.reprintNum, //转发数
			collectionNum : ctc.collectionNum, //收藏数
			reviewNum : ctc.reviewNum, //评论数
			browseNum : ctc.browseNum, //浏览数
			reprintValid : kv.customer_reprint.isValid, //转发状态
			praiseValid : kv.customer_prefer.isValid,//赞状态
			collectionValid : kv.customer_collection.isValid, //收藏状态
			headerValid : ctc.isHeader, //置顶状态
			imgArr : [], //图片存放
			videoSrc: (function(){
				if(ctvl.length>0 && ctvl[0].qiniuStatus == "2")
					return '<div style="margin-top:12px;width:225px;position:relative;" class="evBgVideo" data-videosrc="'+ctvl[0].attUrl+'"><img src="//img00.allinmd.cn/meeting/player.png" style="position: absolute;top:0;left:0;z-index:2;cursor:pointer;"><img style="width:225px;height:150px;" src="'+ctvl[0].logoUrl+'"/></div>';
					else if(ctvl.length>0 && ctvl[0].qiniuStatus == "1")
						return '<div><img src="//img10.allinmd.cn/default/qiniu225_150.jpg"/></div>';
						else return '';
			})() 
		};
		if(!$.isEmptyObject(ctal)) parserResult.imgArr = t.fns.joinArr(ctal,"topicAttUrl"); 
		return parserResult;
	},
	relation : function(kv){ //与他相关 暂时不存在图片，旧接口
		var t = this; 
		var parserResult = {
			refType : parseInt(kv.resourceType),  
			authorType : kv.authorType, //第几译者或其它
			refType :  parseInt(kv.resourceType), //资源类型
			nickname : kv.author,//作者
			logoUrl : t.fns.getRelationLogoUrl(parseInt(kv.resourceType)), //根据资源类型显示对应图
			time : kv.publishTime, //时间
			title : kv.title,//标题
			content : $.isEmptyObject(kv.summary)?"":kv.summary, // 资源内容 ＋＋＋加入展开
			reviewId : 0, //针对回复时的回复主键id 0为非回复类
			parentReviewId : 0, //针对回复时的父Id, 0为顶层
			refId : kv.id, //资源id
			refUrl : kv.toUrl, //资源地址
			refCustomerId : kv.customerId, //动态作者id
			praiseNum : kv.upNum, //赞数
			reprintNum : kv.reprintNum, //转发数
			collectionNum : kv.collNum, //收藏数
			reviewNum : kv.reviewNum, //评论数
			imgArr : [] //图片存放
		};
		
		//if(!$.isEmptyObject(cta)) parserResult.imgArr = t.fns.joinArr(cta,"topicAttUrl"); 
		return parserResult;
	},
	discuss : function(kv){ //关注提醒
		var t = this; 
		var parserResult = {
			refType : parseInt(kv.resourceType), //资源类型  
			nickname : kv.sendCustomerName,//作者
			logoUrl : kv.logo_url_list.length>1?kv.logo_url_list:kv.logo_url_list[0].logoUrl, //头像
			time : kv.messageTime, //时间messageName
			title : kv.messageName,//标题
			content : $.isEmptyObject(kv.messageBody)?"":kv.messageBody, // 资源内容 ＋＋＋加入展开
			reviewId : 0, //针对回复时的回复主键id 0为非回复类
			parentReviewId : 0, //针对回复时的父Id, 0为顶层
			refId : kv.resourceId, //资源id
			refUrl : kv.resourceUrl, //资源地址
			refCustomerId : kv.customerId, //动态作者id
			messageNum : kv.messageNum, //红点数
			nickname : kv.sendCustomerName, //姓名
			resourceValid : parseInt(kv.messageIsValid), //是否有效
			imgArr : [] //图片存放
		};
		
		//if(!$.isEmptyObject(cta)) parserResult.imgArr = t.fns.joinArr(cta,"topicAttUrl"); 
		return parserResult;
	},
	remind : function(kv){ //提醒
		var t = this; 
		var parserResult = {
			refType : parseInt(kv.resourceType),  
			authorType : kv.authorType, //第几译者或其它
			nickname : kv.author,//作者
			logoUrl : t.fns.getRelationLogoUrl(parseInt(kv.resourceType)), //根据资源类型显示对应图
			time : kv.publishTime, //时间
			title : kv.title,//标题
			content : $.isEmptyObject(kv.summary)?"":kv.summary, // 资源内容 ＋＋＋加入展开
			reviewId : 0, //针对回复时的回复主键id 0为非回复类
			parentReviewId : 0, //针对回复时的父Id, 0为顶层
			refId : kv.id, //资源id
			refUrl : kv.toUrl, //资源地址
			refCustomerId : kv.customerId, //动态作者id
			praiseNum : kv.upNum, //赞数
			reprintNum : kv.reprintNum, //转发数
			collectionNum : kv.collNum, //收藏数
			reviewNum : kv.reviewNum, //评论数
			imgArr : [] //图片存放
		};
		
		//if(!$.isEmptyObject(cta)) parserResult.imgArr = t.fns.joinArr(cta,"topicAttUrl"); 
		return parserResult;
	},
	fns : {
		 joinArr : function(arr,property){ //拼装成数组 第二个参数对应取的值
			var strArr = [];
			
			if(!$.isEmptyObject(arr)){
				$.each(arr,function(i,el){
					if(!$.isEmptyObject(el)){ strArr.push(el[property]);}
				});
				return strArr;
			}
			return strArr;
		},
		getCazeContent : function(kv){ //获取内容 动态的病例和病例加入
			var sex = "保密";
			if(kv.sexId===1) sex="男";
			if(kv.sexId===2) sex="女";
			return "患者信息："+sex+" "+kv.age+"岁 &nbsp;&nbsp;&nbsp;&nbsp;主诉："+kv.mainNarrate;
		},
		getRelationLogoUrl : function(type){ //获取头像 根据不同资源获取不同头像显示
			var logoUrl = "";
			if(type===ResouceType.doc){
				logoUrl = "";
			}else if(type ===ResouceType.video){
				logoUrl = "";
			}
			return logoUrl;
		}
		
	}
	
};
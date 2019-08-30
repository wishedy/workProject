/**
 * 功能描述：终端页回复列表 只起到列表瀑布流作用，主要依赖plugin.relation.js
 * 使用方法：module.replyList(obj); 
 * 				  必要参数：obj.target 为当前模块摆放到的位置
 * 										obj.type 资源类型
 * 										obj.refId  为当前资源的ID
 * 										obj.authId 作者Id
 * 										obj.cid 为当前人id
 * 				   可选参数 : obj.hint 提示
 * 								 obj.refresh 是否刷新
 * 								 obj.callback 在空数据时可以点击调用
 * 
 * 注意事件：
 * 引入来源：plugin.relation.js, module.background-video.js  第三方scrollpagination.js  作用：社交功能，瀑布流
 * 
 * Created by QiaoLiang on 2015-03-18.
 */

module.replyList = function(obj){
	var controller = {
		 config : {
			 pageSize : 5
		 },	
		 path : {
			 baseInfo : PC_CALL+"web/user/getWebUser/",
			 reply : PC_CALL+"review/json_list/"
		 },	
		 el : {expandOrShrink : ".expandOrShrink" ,bgVideo : ".evBgVideo", CA: ".evContent"},
		 init : function(obj){
			 var t = this;
			 if(!obj.target || !obj.refId || !obj.type){console.error("必填参数缺失！参考module.reply-list.js"); return false;}

			 var params = {
					pageIndex : 1,
					pageSize : t.config.pageSize,
					sortType : 1,
					reviewStatus : 1,
					attUseFlag : UseFlag.c,
					logoUseFlag : UseFlag.c,
					dataFlag : 1,
					scene : Scene.b,
					sessionCustomerId : 0,
			        reviewType : obj.type,
			        refId : obj.refId
			 };
			 
			 t.waterfallPage(params,obj);
		 },
		 waterfallPage : function(paramJson,obj){ //引入瀑布流
                if(obj.refresh){ $(obj.target).empty(); }

				var scrollpage=1;
				paramJson.pageSize = function(){
					if(scrollpage-1>1){return 20;}else{return 5;}
				};
				paramJson.pageIndex = function(){
					return scrollpage++;
				};
				$(obj.target).scrollPagination({
					'contentPage' : this.path.reply,
					'contentData' : paramJson,
					'scrollTarget' : $(window),
					'heightOffset' : 0,
					"srcThis" : this,
					"noParamJson":1,
					'beforeLoad' : function() {
					},
					'afterLoad' : function(elementsLoaded) {
					},
					'loader' : function(data) {
						if((!data.responseObject.responseStatus && scrollpage===2) || ($.isEmptyObject(data.responseObject.responseData) && scrollpage===2)) {
							$(obj.target).html(this.srcThis.template.tips());
							$(obj.hint).hide();
							$(obj.target).attr("scrollPagination", "disabled");
							$(".sayReply").on("click",function(){
									obj.callback(); //触发文本框
							});
							return false;
						}else if ($.isEmptyObject(data.responseObject.responseData) && scrollpage>2) { //当数据为空时
							$(obj.hint).children("div").html("最后一页了");
							$(obj.target).attr("scrollPagination", "disabled");
							return false;
						}else{
							if(data.responseObject.responseData.data_list.length<paramJson.pageSize()){//不为空但小于数据请求数
								$(obj.hint).children("div").html("最后一页了");
								$(obj.target).attr("scrollPagination", "disabled");
							}else{
								$(obj.hint).children("div").html("数据加载中<span></span>");
							}
						}

						this.srcThis.dataCtrl(data.responseObject.responseData.data_list,obj);
					}
				});
		 },
		 dataCtrl : function(data,obj){
			 var html = "",kv="",t=this;
			 $.each(data,function(i,el){
				 kv = t.adapter(el,obj);

				 html = t.template.list2(kv);
				 
				 var createElement = $(html);
				 //图片集处理
				 var imgLen = kv.imgArr.length;
				 html = "",tempPicHref = "";
				 if(imgLen>1 && imgLen <10){ //2-8张
					 for(var j=0;j<imgLen;j++){
						 tempPicHref = "<img style='width:150px;height:150px;' src='"+kv.imgArr[j]+"'/>";
						 html += t.template.picList(tempPicHref);
					 }
					 html += "<div class=\"clear\"></div>";
				 }else if(imgLen==1 || imgLen >9){
					 tempPicHref = "<img src='"+kv.imgArr[0]+"'/>";
					 html = t.template.picList(tempPicHref);
					 html += "<div class=\"clear\"></div>";
				 }
				 
				 createElement.find(".ev-picParentPlace").append(html);
				 if(imgLen===2 || imgLen===3 || (imgLen>4 && imgLen<10)){ //	三张
					 createElement.find(".ev-picParentPlace").addClass("p_three_img");
				 }else if(imgLen===4){ // 两张
					 createElement.find(".ev-picParentPlace").addClass("p_four_img");
				 }else if(imgLen>9){ // 大于九张时
					 createElement.find(".ev-picParentPlace ev-picPlace").addClass("case_more_img");
					 createElement.find(".ev-picParentPlace ev-picPlace").append(
							 "<div class=\"sh_float_bg\"></div>"+
							 "<div class=\"sh_float_text font_yahei\">图集共"+imgLen+"张图片</div>");
				 }
				 
				 $(obj.target).append(createElement);

				 //引入社交
				 $(".gqc_" + kv.id).relation({
						praiseNum : kv.praiseNum,
						reprintNum : kv.reprintNum,
						reviewNum : kv.reviewNum,
						collectionNum : kv.collectionNum,
						praiseValid : kv.praiseValid,
						reprintValid : kv.reprintValid,
						collectionValid : kv.collectionValid,
						isCollect : false,
						customerId : kv.customerId,
						refId: kv.refId,
						authId: obj.authId,
						type : obj.type,
						reviewId: kv.id,
						reviewStatus : 1,
						parentId : kv.parentId,
						userId : obj.cid,
						name : kv.name,
						logoUrl: kv.logoUrl
				});
				 
			 });
			 
			 $(t.el.bgVideo).on("click",function(){ //视频处理
				 module.backgroundVideo({videoSrc:$(this).attr("data-videoSrc")}); 
			 });
			 
			 $("a",t.el.CA).on("click",function(){ //文字中引用的A链接
				 if(/^\d+$/g.test($(this).attr("href"))){
					var href='/pages/personal/home.html?cid='+$(this).attr("href");
                     g_sps.jump(null,href,true);
				 }
				 return false;
			 });
			 
			 $(t.el.expandOrShrink).off("click").on("click",function(){ //展开收起
					if($(this).text()=="展开"){
						if($(this).parent().find("span:eq(0)").text().split("回复给")[0].length==""){
							$(this).parent().find("span:eq(1)").hide();
							$(this).parent().find("span:eq(2)").show();
							$(this).text("收起");
						}else{
							$(this).parent().find("span:eq(0)").hide();
							$(this).parent().find("span:eq(1)").show();
							$(this).text("收起");
						}
					}else{
						if($(this).parent().find("span:eq(0)").text().split("回复给")[0].length==""){
							$(this).parent().find("span:eq(1)").show();
							$(this).parent().find("span:eq(2)").hide();
							$(this).text("展开");
						}else{
							$(this).parent().find("span:eq(0)").show();
							$(this).parent().find("span:eq(1)").hide();
							$(this).text("展开");
						}
					}
			 });	
			
		 },
		 adapter : function(kv,obj){
			 //处理图片集
			var imgArr = [];
			var arrList = kv.customer_review_insite_attachment;
			
			if(arrList !== undefined){
				for(var i=0;i<arrList.length;i++){
					if(arrList[i].attUrl !==""){ imgArr.push(arrList[i].attUrl); }
				}
			}
			return {
				id : kv.customer_review.id,
				date : comm.date.diffDay_one(kv.customer_review.publishTime,comm.date.local_time()),
				name : kv.customer_auth.lastName+kv.customer_auth.firstName,
				intro : (function(that,obj){
					var result;
					var  beReplyLevel = kv.parent_customer_auth !== undefined ?kv.parent_customer_auth.customerId===obj.authId? '<div class="v_comm_lz">楼主</div>':'':''; //被回复人是否楼主
					var replyToSb = kv.parent_customer_auth !== undefined ?kv.parent_customer_auth.lastName+kv.parent_customer_auth.firstName:""; //被回复人
					if(replyToSb !== ""){
						result = '<span style="color:#73859e;">回复给'+replyToSb+'</span>'+beReplyLevel+' ：'+that.wordLen(kv.customer_review.reviewContent,276);
					}else{
						result = that.wordLen(kv.customer_review.reviewContent,276);
					}
					return result;
				})(this,obj),
				logoUrl : kv.customer_att.logoUrl===''?"//modules.allinmd.cn/reply-list/images/user_img.png":kv.customer_att.logoUrl,
				parentId : kv.customer_review.parentId,
				reviewNum : kv.customer_review.reviewNum,
				reprintNum : kv.customer_review.reprintNum,
				collectionNum : kv.customer_review.collectionNum,
				praiseNum : kv.customer_review.upNum,
				customerId : kv.customer_review.customerId,
				praiseValid : kv.customer_prefer.isValid,
				collectionValid : kv.customer_collection.isValid,
				reprintValid : kv.customer_reprint.isValid,
				refId : kv.customer_review.refId,
				reviewId:  kv.customer_review.id,
				imgArr : imgArr,
				levelOneReview: kv.customer_auth.customerId ===obj.authId?"楼主":"",
				medicalTitle: kv.customer_auth.medicalTitleShow,
				company: kv.customer_auth.company,
				videoSrc: (function(){
					var criav = kv.customer_review_insite_attachment_video;
					if(criav.length>0 && criav[0].qiniuStatus == "2")
						return '<div style="margin-top:12px;width:225px;position:relative;" class="evBgVideo" data-videosrc="'+criav[0].attUrl+'"><img src="//img00.allinmd.cn/meeting/player.png" style="position: absolute;top:0;left:0;z-index:2;cursor:pointer;"><img style="width:225px;height:150px;" src="'+criav[0].attLogoUrl+'"/></div>';
						else if(criav.length>0 && criav[0].qiniuStatus == "1")
							return '<div><img src="//img10.allinmd.cn/default/qiniu225_150.jpg"/></div>';
							else return '';
				})(),
				quote: (function(){
					if(kv.customer_quote.length===0){ return false; }
					
					var data= kv.customer_quote[0];
					var result = '引用',tempPrefix= '';
					switch(data.refQuoteType){
					case 1: tempPrefix = '视频'; break;
					case 2: tempPrefix = '文库'; break;
					case 4: tempPrefix = '话题'; break;
					case 7: tempPrefix = '病例'; break;
					}
					return result+tempPrefix+ '<a href="'+data.pageStoragePath+'" target="_blank" style="color:#73859e;">《'+comm.getStrLen(data.refQuoteName,110)+'》</a>';
				})()
			}; 
		 },
		 wordLen : function(str,len){
			var count = 0; 
			var strings = "";
			for(var i=0;i<str.length;i++){
				if(str.charCodeAt(i)>128) count+=2;
					else count+=1;
				if(count>len){
					strings += "<span>......</span><span style=\"display:none;\">"+str.substr(i)+"</span><span class=\"expandOrShrink cursor\">展开</span>";
					break;
				}else{
					strings += str.substr(i,1);
				}
			}
			return strings;
		 },
		 ajaxResult :  function(url,params){
				var result = {};
				$.ajax({
					url : url,
					type : "post",
					data : params,
					async : false,
					dataType : "json",
					success : function(data){
						result = data;
					}
				});
				return result;
		 },
		 template : {
			 tips : function(){
				 return "<div class=\"v_all_list\">"+
				 		"<div class=\"v_all_none font_yahei\">暂时还没有回应哦~<a class=\"sayReply\" href=\"javascript:;\">你来说几句吧！</a></div>"+
				 		"</div>";
			 },
			 list : function(kv){ //v1列表
				return  "<li class=\"children\">"+
			    "<div class=\"v_all_list_l font_yahei\">"+kv.date+"</div>"+
			    "<div class=\"v_all_list_r\">"+
			      "<div class=\"v_all_pointer\"></div>"+
			      "<div class=\"v_all_r_top\">"+
			        "<div class=\"v_all_user\"><a href=\"/pages/personal/home.html?cid="+kv.customerId+"\"><img src=\""+kv.logoUrl+"\"></a></div>"+
			        "<div class=\"v_all_cont\">"+
			          "<div class=\"v_all_name font_yahei\"><a href=\"/pages/personal/home.html?cid="+kv.customerId+"\">"+kv.name+"</a></div>"+
			          "<div class=\"evContent v_all_text font_yahei\">"+kv.intro+"</div>"+ 
			          "<ul class=\"case_img_list viewBigImg personal_home_img_ads ev-picParentPlace\" reviewId='"+ kv.reviewId +"'></ul>"+
			        "</div>"+
			        "<div class=\"clear\"></div>"+
			      "</div>"+
			      "<div class=\"v_all_height\">"+
			        "<div class=\"v_all_jh\">"+
			          "<div class=\"widget_v2 gqc_"+kv.id+"\">"+
//			            "<ul class=\"widget\" id=\"widget_"+kv.id+"\">"+
//			             	//四件套
//			              "<div class=\"clear\"></div>"+
//			            "</ul>"+
			          "</div>"+
			        "</div>"+
			        "<div class=\"clear\"></div>"+
			      "</div>"+
			    "</div>"+
			    "<div class=\"clear\"></div>"+
			  "</li>";
			},
			list2 : function(kv){ //现采用的是这个
				return '<li class="children">'+
	              '<div class="v_all_list_r_v2">'+
	                '<div class="v_all_r_top">'+
	                  '<div class="v_all_user"><a href="/pages/personal/home.html?cid='+kv.customerId+'"><img src="'+kv.logoUrl+'"></div>'+
	                  '<div class="v_all_cont_v2">'+
	                    '<div class="v_all_name font_yahei">'+
	                    '<div class="v_comm_name"><a href="/pages/personal/home.html?cid='+kv.customerId+'">'+kv.name+'</a></div>'+
	                    '<div class="v_comm_lz">'+kv.levelOneReview+'</div>'+
	                    '<div class="v_comm_hospital">'+kv.company+'</div>'+ //<span style="margin-right:10px;">'+kv.medicalTitle+'</span>
	                     '<div class="v_comm_time font_songti">'+kv.date+'</div>'+
	                    '<div class="clear"></div></div>'+
	                    '<div class="evContent v_all_text_v2 font_yahei">'+kv.intro+'</div>'+
	                    '<div class="clear"></div>'+
	                    '<ul class="case_img_list viewBigImg personal_home_img_ads ev-picParentPlace" reviewId='+ kv.reviewId +'></ul>'+
	                    kv.videoSrc +   //TODO:视频
	                    (kv.quote==false?'':'<div class="quote evQuote">'+kv.quote+'</div>')+   //引用
	                  '</div>'+
	                  '<div class="clear"></div>'+
	                '</div>'+
	                '<div class="v_all_height_v2">'+
	                  '<div class="v_all_jh">'+
	                		'<div class="widget_v2 gqc_'+kv.id+'"></div>'+
	                     '</div>'+
	                  '<div class="clear"></div>'+
	                '</div>'+
	              '</div>'+
	            '</li>';
			},
			picList : function(picHref){ //图片列表
		      return "<li class=\"personal_ads ev-picPlace\">"+picHref+"</li>";
			}
		 }
		 
	};	 
	
	controller.init(obj);
};

/**
 * 功能描述: 列表模版库 新建时要为统一li结构
 * 使用方法: module.listTemplate(obj) 
 * 				必需参数:obj.tempName //模版名称
 * 				其它参数：参照调用的对应模版
 *  
 *  
 * Created by QiaoLiang on 2015-4-1
 */

module.listTemplate = function(obj){
	var template = {
		use : function(obj){
			var str = obj.tempName,len = str.indexOf(">");
			if(len > -1) return this[str.substring(0,len)][str.substring(len+1)];
				else return this[str];
		},
		personal : {
			followRemind : function(obj){ //关注提醒
				return '<li class="'+(obj.resourceValid===1?"cursor":"")+'" data-href=\"'+obj.refUrl+'\" data-valid=\"'+(obj.resourceValid===1?"on":"off")+'\">'+
					        '<div class="inside-selector02">'+
						        '<div class="p_cont_list_l evBorder">'+
							        	'<img src="'+obj.logoUrl+'">'+
						        '</div>'+
						        '<div class="p_cont_list_r" style="width:580px;">'+
						            '<div class="gz_tx_title">'+
						                (obj.messageNum>0 ? '<div class="gz_tx_title_l">'+obj.messageNum+'</div>' : '')+
						                '<div class="gz_tx_title_c evFollowRemindTitle" data-refType="'+obj.refType+'" data-refid="'+obj.refId+'">'+comm.getStrLen(obj.title,60)+'</div>'+
						                '<div class="gz_tx_title_r">'+obj.time+'</div>'+
						                '<div class="clear"></div>'+
						            '</div>'+
						            '<div class="gz_tx_cont font_yahei">'+obj.nickname+"："+obj.content+'</div>'+
						        '</div><div class="clear"></div>'+
						        '</div>'+
				        '<div class="clear"></div>'+
				    '</li>';
			},
			list : function(obj){ //常规
				var kv = {liWidth : 715,contentWidth : 580};$.extend(kv,obj);
				var refIdStr = "";
				switch(kv.refType){
					case ResouceType.topic:
						refIdStr = 'topicId="'+ kv.refId +'"';
						break;
					case ResouceType.caze:
						refIdStr = 'caseId="'+ kv.refId +'" "';         //t.values.caseCategoryId
						break;
					case ResouceType.review:
						refIdStr = 'reviewId="'+ kv.reviewId +'"';
						break;
				}
				return '<li style="width:'+kv.liWidth+'px;">'+
				   '<div class ="inside-selector">'+ //调用replyfrom
				       '<div class="p_cont_list_l evBorder"><a href="/pages/personal/home.html?cid='+kv.cid+'">'+
				       		'<img src="'+kv.logoUrl+'">'+isVip(kv.vip)+
		               '</a></div>'+
		               '<div class="p_cont_list_r" style="width:'+kv.contentWidth+'px;">'+
			               '<div class="p_list_top ev-TitlePlaceDown">'+
			                 '<div class="p_l_t_l font_yahei ev-nickname">'+kv.name+'</div>'+ //名称
			                 '<div class="evIconTime" style="float:right;font-size: 12px;color: #969696;">'+kv.time+'</div>'+//时间
			                 '<div class="clear"></div>'+
			               '</div>'+
			               '<div class="evTitle list_title font_yahei">由遍历注入，防止各种类型</div>'+ //标题
			               '<div class="list_text font_yahei ev-content">'+kv.content+'</div>'+ //内容
			               isAllinAuth(kv.allinAuth)+
			               '<ul class="evPic '+ (refIdStr===""?"":" viewBigImg ") +' case_img_list personal_home_img_ads p_normal_img"  '+ refIdStr +'>'+ //图片存放区
		                    		//图片存放样式 '<div class="personal_ads"><img src="//modules.allinmd.cn/personal/ads01.png"></div>'+
		                    		'<div class="clear"></div>'+
		                  '</ul>'+
		                  isVideo(kv.videoSrc) + 
		                  isQuote(kv.quote) +
			               '<div class="faceList-warp"></div>'+ //调用faceList
			               '<div class="fenxiang_bg call-relation2">'+ // 调用relation2
			               '</div>'+
			               '<div class="clear"></div>'+
		              '</div>'+
		              '<div class="clear"></div>'+
		          '</div>'+  
	           '</li>';
			},
			downstairs : function(kv){ //下层回复
				return '<li class="downstairs" style="display:none">'+ //此处初始只显示一条
				'<div class ="inside-selector">'+
                '<div class="p_cont_list_l dfr-face ev-logoUrlPath">'+kv.logoUrl+isVip(kv.vip)+
                '</div>'+
                '<div class="p_cont_list_r">'+
                '<div class="p_list_top">'+
                  '<div class="p_l_t_l font_yahei ev-nickname">'+kv.name+'</div>'+
                  '<div class="v_comm_hospital"> <span style="margin-right:10px;">'+ kv.medicalTitle +'</span>'+ kv.company +'</div>'+
                  '<div class="dfr-time ev-time">'+ kv.time +'</div>'+
                  '<div class="clear"></div>'+
                '</div>' +
				'<div class="ev-title list_text font_yahei ">'+ kv.content +'</div>'+ //事实ev-title 是内容
                '<ul class="list_text font_yahei ev-content evPic viewBigImg case_img_list personal_home_img_ads p_normal_img" reviewId="'+ kv.reviewId +'"></ul>'+
                '<div class="clear"></div>'+
                isVideo(kv.videoSrc) + 
                isQuote(kv.quote) +
                '<div class="faceList-warp"></div>'+ //调用faceList
                '<div class="fenxiang_bg call-relation2">'+//kv.callback()
                '</div>'+
              '</div>'+
              '<div class="clear"></div>'+
              '</div>'+
            '</li>';
			},
			upstairs : function(kv){ //上层回复
				return '<li class="upstairs" style="display:none">'+ //此处初始只显示三条
				'<div class ="inside-selector">'+
                '<div class="p_cont_list_l dfr-face ev-logoUrlPath">'+kv.logoUrl+isVip(kv.vip)+
                '</div>'+
                '<div class="p_cont_list_r">'+
                '<div class="p_list_top ev-loadTitlePlaceDown">'+
                  '<div class="p_l_t_l font_yahei ev-nickname">'+kv.name+'</div>'+
                  '<div class="v_comm_hospital"> <span style="margin-right:10px;">'+ kv.medicalTitle +'</span>'+ kv.company +'</div>'+
                  '<div class="dfr-time ev-time">'+kv.time+'</div>'+
                  '<div class="clear"></div>'+
                '</div>'+
                '<div class="list_text font_yahei ev-title">'+kv.content+'</div>'+
                isVideo(kv.videoSrc) +
                isQuote(kv.quote) +
                '<div class="faceList-warp"></div>'+ //调用faceList
                '<div class="fenxiang_bg call-relation2">'+//kv.callback()
                '</div>'+
              '</div>'+
              '<div class="clear"></div>'+
              '</div>'+
            '</li>';
			}
		}
	};
	
	function isVip(vip){ //是否VIP
		if(vip) return '<div class="vip_cont"><img src="//modules.allinmd.cn/list-template/images/vip.png"></div>';
		return '';
	}
	
	function isAllinAuth(auth){ //是否显示唯医小助手
			if(auth) return '<div class="you_tg font_yahei">由唯医小助手提供</div>';
			return '';
	}
	
	function isQuote(quote){ //是否有引用
		if(quote) return '<div style="font-size: 14px;color: #333;margin-top:12px;">'+quote+'</div>';
		return '';
	}
	
	function isVideo(videoSrc){ //是否有视频
		if(videoSrc) return '<div style="margin-top:12px;">'+videoSrc+'</div>';
		return '';
	} 
	
	return template.use(obj);
};
/** 
 * 功能描述：videoPK-全部作品列表
 * 使用方法:
 * 注意事件：
 * 引入来源：  作用：
 * created by Sunhaibin on 2015-11-20
 * */

$(function(){
	comm.scrollFloating({float:$('.elec_list'),maxObj:$('.elec_main'),top:70});
	module.videoPKShare({});
	var videoPK_allwork={
		config:{
			url:PC_CALL+"resources/search/search_list_activty/",
			getMapList:PC_CALL+"activity/property/getMapList/",
			title_url:"",
			activityId:$("#activityId").val()
		},
		el:{
			
		},
		path:{
			
		},
		init:function(){
			var t = this;
			t.mediaType="video";
			t.order="browse";
			t.activityType=1;
			t.getTags();
			t.commonSearch();
			t.leftBtn();
			t.topBtn();
			t.video_case_switch();
		},
		commonSearch:function(tagid){
			var t = this;
			t.ajaxFn({
				url:t.config.url,
				param:{mediaType:t.mediaType,order:t.order,pageIndex:1,activityIds:t.config.activityId,propertyIds
:tagid},
				fn:function(data){
					t.addHtml(data)
					$(".pager").pager({ pagenumber: 1, pagecount: data.dataJson.rows.pageCount, buttonClickCallback: PageClick });
				}
			})
			PageClick = function(pageclickednumber){
                t.ajaxFn({
                    url: t.config.url,
                    param:{mediaType:t.mediaType,order:t.order,pageIndex:pageclickednumber,activityIds:t.config.activityId,propertyIds
:tagid},
                    fn:function(data){
                        $(".pager").pager({ pagenumber: pageclickednumber, pagecount: data.dataJson.rows.pageCount, buttonClickCallback: PageClick });
                        t.addHtml(data);
                    }
                });
            };
		},
		ajaxFn:function(opt){
     		comm.LightBox.showloading();
        	var o=opt;
        	$.ajax({
        		url:o.url,
        		type:'post',
//      		data:{paramJson:$.toJSON(o.param)},
				data:o.param,
        		dataType:'json',
        		success:function(data){
      				comm.LightBox.hideloading();
        			if(data){
	      				o.fn(data)
					}
        		},
        		error:function(XMLHttpRequest,textStatus,errorThrown){
//      			alert(textStatus+" "+errorThrown);
        		}
        	})
       },
       getTags:function(){
       		var t=this;
       		t.ajaxFn({		//
       			url:t.config.getMapList,
				param:{paramJson:$.toJSON({activityId:t.config.activityId,activityType:t.activityType,parentId:0})},
				fn:function(data){
					var vPktags='<dd><a href="javascript:;" class="zhuanye_cur">全部</a></dd>';
					if(data&&data.responseObject.responseData){
						var data=data.responseObject.responseData;
						
						if(data.list&&data.list.length>0){
							for(var vt=0,vtl=data.list.length;vt<vtl;vt++){
								var item=data.list[vt];
								if(item.cms_activity_property.parentId===0){
									vPktags+='<dd tagId="'+item.cms_activity_property.propertyId+'"><a href="javascript:;">'+item.cms_activity_property.propertyName +'</a></dd>';
									
								}
							}
						}
						$('.elec_l_d dd').remove();
						$('.elec_l_d dl').append(vPktags);
						$('.elec_main').css({minHeight:$('.elec_list')[0].offsetHeight+100});
					}	
				}
       		})
       },
       video_case_switch:function(){
       		var t=this;
        	$(".elec_l_t dd").click(function(){
				var n = $(this).index('dd');
				t.mediaType;
				switch(n){
					case 0:
						t.mediaType = "video";
						t.activityType=1;
					break;
					case 1:
						t.mediaType ="case";
						t.activityType=7;
					break;
				}
				$(this).addClass('l_t_cur').siblings('dd').removeClass('l_t_cur');
				$('.elec_l_d dd').eq(0).trigger('click');
				$('.elec_main_nav li').eq(0).trigger('click');
				t.getTags(t.activityType);
				t.commonSearch();
			
			return false;
			})
        },
       leftBtn:function(){
        	var t= this;
        	$('.elec_l_d').on('click','dd', function(){
        		
				$(this).children('a').addClass('zhuanye_cur').end().siblings('dd').children('a').removeClass('zhuanye_cur');
				var tagid = $(this).attr("tagid");
        		t.commonSearch(tagid);
	       		return false;
        	})
        },
        topBtn:function(){
        	var t= this;
        	$(".elec_main_nav li:not(.li_last)").each(function(){
        		$(this).on("click",function(e){
        			$(this).children('a').addClass("ele_main_nav_cur").end().siblings('li').find('a').removeClass('ele_main_nav_cur');
        			var index = $(this).index();
        			var tgs =$('.elec_l_d').find('a.zhuanye_cur').parent().attr('tagid');
        			switch(index){
        				case 1:
        				t.order = "preferUpNum";
        				break;
        				case 0:
        				t.order="browse";
        				break;
        				case 2:
        				t.order ="publishTime";
        			};
        			t.commonSearch(tgs);
					e.preventDefault();
        		})
        	})
		 },
       addHtml:function(data){
       	var t=this;
        	var content='';
        	if(data&&data.dataJson.rows&&data.dataJson.rows.total>0){
        		for(var i=0,l=data.dataJson.rows.items.length;i<l;i++){
        			var imgUrl='//img10.allinmd.cn/default/225_150.jpg',
        				playTime = "";
        			var item = data.dataJson.rows.items[i];
        			if(t.mediaType=="case"){
        				if(data.dataJson.caseAttList){
        					for(var j=0,len=data.dataJson.caseAttList.length;j<len;j++){
	        					var cL = data.dataJson.caseAttList[j];
	        					if(item.id==cL.caseId){
	        						imgUrl=cL.caseAttUrl;
	        						
	        					}
	        				}
        				}
        				
        			}else if(t.mediaType=="video"){
        				playTime = "<div class='hm'></div>"+"<p class='tu_time'>"+item.playTime+"</p>";
        				if(data.dataJson.videoAttList){
	        				for(var j1=0,len1=data.dataJson.videoAttList.length;j1<len1;j1++){
	        					var vL = data.dataJson.videoAttList[j1];
	        					if(item.id==vL.videoId){
	        						imgUrl=vL.videoAttUrl;
	        					}
	        				}
        				}
        			}
        			
        		content  += "<div class='elec_main_box'>"+
								"<div class='gr_down_list'>"+
									"<div class='gr_list'>"+
										"<div class='gr_list_l'>"+
											"<a target='_blank' href='"+item.toUrl+"'>"+
//												"<img class='tu' src='//img10.allinmd.cn/default/225_150.jpg' data-original='" +imgUrl+ "'>"+
												"<img class='tu' src='" +imgUrl+ "'>"+	
											"</a>"+
											playTime+
										"</div>"+
										"<div class='gr_list_r'>"+
											"<h3>"+
												"<a target='_blank' href='"+item.toUrl+"'>"+comm.getStrLen(item.title,56)+"</a>"+
											"</h3>"+
											"<div class='gr_fb'>"+
												"<ul>"+
													"<li>"+comm.getStrLen(item.author,8)+"</li>"+
								                    "<li class='gr_pointer'></li>"+
								                    "<li>"+($.isEmptyObject(item.company)?"":item.company)+"</li>"+
								                    "<li class='gr_time'>"+item.publishTime.substring(0,10)+"</li>"+
								                "</ul>"+
								                "<ul style='position:relative;top:8px;'>"+
								                    "<li>浏览："+item.browse+"</li>"+
								                    "<li class='gr_pointer'></li>"+
								                    "<li>评论："+item.reviewNum+"</li>"+
								                    "<li class='gr_pointer'></li>"+
								                    "<li>赞："+(item.preferUpNum==""||item.preferUpNum==undefined?"0":item.preferUpNum)+"</li>"+								                    
							                    "</ul>"+
							                "</div>"+
							                "<p class='gr_con_p' style='height:72px'>"+comm.getStrLen(item.summay,210)+"</p>"+
							            "</div>"+
							        "</div>"+
						        "</div>"+
					        "</div>";
				}
	        	$('.elec_main_con').empty().append(content);

				$('.elec_main').css({minHeight:$('.elec_list')[0].offsetHeight+100});
				$(".elec_main_con img").lazyload({
		                effect:"fadeIn",
		                event:"scrollstop"
		            });

        	}else{
        		$('.elec_main_con').empty().append('<p style="height:30px;line-height:30px;padding-left:30px;font-size:14px;color:#B5B5B5;">该页没有内容</p>');
        		$('.elec_main').css({minHeight:$('.elec_list')[0].offsetHeight+100});
        	}
        }
	}
	videoPK_allwork.init();
	
	
})

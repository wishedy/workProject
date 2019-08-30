$(function(){
	
	var winHref = window.location.href;
	if(/index/.test(winHref)){						//index
		module.videoPKShare({
			title:"骨科人必看的2015年＃骨林琅琊榜＃，你上榜了吗？",
			sina:"骨科人必看的2015年＃骨林琅琊榜＃，你上榜了吗？",
	        qqFriend:"骨科人必看的2015年＃骨林琅琊榜＃，你上榜了吗？",
	        qqZone:"骨科人必看的2015年＃骨林琅琊榜＃，你上榜了吗？",
	        url:window.location.href,
	        pic:"//img00.allinmd.cn/column/YE_check/YE_index_banner.jpg"
		});
	}else if(/case/.test(winHref)){					//病例专题页
		module.videoPKShare({
			title:"＃骨林琅琊榜＃之十大观点PK病例，群雄争辩，谁主沉浮？由你定夺！",
			sina:"＃骨林琅琊榜＃之十大观点PK病例，群雄争辩，谁主沉浮？由你定夺！",
	        qqFriend:"＃骨林琅琊榜＃之十大观点PK病例，群雄争辩，谁主沉浮？由你定夺！",
	        qqZone:"＃骨林琅琊榜＃之十大观点PK病例，群雄争辩，谁主沉浮？由你定夺！",
	        url:window.location.href,
	        pic:"//img00.allinmd.cn/column/YE_check/YE_case_banner.jpg"
		});
	}else if(/doc/.test(winHref)){					//文库专题页
		module.videoPKShare({
			title:"骨医修炼秘笈隆重出榜＃骨林琅琊榜＃，看榜修炼！",
			sina:"骨医修炼秘笈隆重出榜＃骨林琅琊榜＃，看榜修炼！",
	        qqFriend:"骨医修炼秘笈隆重出榜＃骨林琅琊榜＃，看榜修炼！",
	        qqZone:"骨医修炼秘笈隆重出榜＃骨林琅琊榜＃，看榜修炼！",
	        url:window.location.href,
	        pic:"//img00.allinmd.cn/column/YE_check/YE_doc_banner.jpg"
		});	
	}else if(/video/.test(winHref)){				//视频专题页
		module.videoPKShare({
			title:"＃骨林琅琊榜＃之十大手术视频，2015骨医不能错过的年度经典！",
			sina:"＃骨林琅琊榜＃之十大手术视频，2015骨医不能错过的年度经典！",
	        qqFriend:"＃骨林琅琊榜＃之十大手术视频，2015骨医不能错过的年度经典！",
	        qqZone:"＃骨林琅琊榜＃之十大手术视频，2015骨医不能错过的年度经典！",
	        url:window.location.href,
	        pic:"//img00.allinmd.cn/column/YE_check/YE_video_banner.jpg"
		});
	}else if(/hotWords/.test(winHref)){
		module.videoPKShare({
			title:"＃骨林琅琊榜＃之年度骨科热词，骨林绝学造就2015江湖霸主！",
			sina:"＃骨林琅琊榜＃之年度骨科热词，骨林绝学造就2015江湖霸主！",
	        qqFriend:"＃骨林琅琊榜＃之年度骨科热词，骨林绝学造就2015江湖霸主！",
	        qqZone:"＃骨林琅琊榜＃之年度骨科热词，骨林绝学造就2015江湖霸主！",
	        url:window.location.href,
	        pic:"//img00.allinmd.cn/column/YE_check/YE_hotWords_banner.jpg"
		});
	}
	
	
})

// JavaScript Document
zhiliaotishi=function(){
	var html="";
	html+='<div class="tanceng_fellow">'+
	  '<div class="tanceng_fellow_t">'+
		'<div class="tishi_xx">提示信息</div>'+
		'<a href="javascript:;" class="close">'+
		'<div class="tc_close"></div>'+
		'</a></div>'+
	  '<div class="tanceng_fellow_c">'+
		'<div class="tc_padding">'+
		  '<div class="tc_title">申请该进修项目需完整填写以下各项资料哦！</div>'+
		  '<ul class="tc_cont_list">'+
			'<li>个人简介</li>'+
			'<li>基本信息</li>'+
			'<li>绑定CAOS帐号</li>'+
			'<li>关注的学组</li>'+
			'<li>工作经历</li>'+
			'<li>教育背景</li>'+
			'<div class="clear"></div>'+
		  '</ul>'+
		'</div>'+
		'<div class="tc_but"><a href="/call/customer/unite/customer_info/" target="_blank"><img src="//img00.allinmd.cn/fellow/liji_tx.png" /></a></div>'+
	  '</div>'+
	  '<div class="tanceng_fellow_b"></div>'+
	'</div>';
	return html;	
};
hasApply=function(){
	var html="";
	html+='<div class="tanceng_fellow">'+
	  '<div class="tanceng_fellow_t">'+
		'<div class="tishi_xx">提示信息</div>'+
		'<a href="javascript:;" class="close">'+
		'<div class="tc_close"></div>'+
		'</a></div>'+
	  '<div class="tanceng_fellow_c">'+
		'<div class="tc_cont">'+
			'<div class="tc_title">您已提交过该申请！</div>'+
			'<div class="tc_title_ci"><span class="second">3</span>秒后将自动跳转至我的报名页，如未跳转请点击下面的按钮。</div>'+
		'</div>'+
		'<div class="tc_but"><a id="page_href" href="/call/customer/fellowship/base/page_list/"><img src="//img00.allinmd.cn/fellow/chakan_bm.png" /></a></div>'+
	  '</div>'+
	  '<div class="tanceng_fellow_b"></div>'+
	'</div>';
	return html;		
};
saveSuccess=function(){
	var html="";
	html+='<div class="xx_ybc"><div class="bc_after">信息已保存！</div></div>';
	return html;	
};
fellowBase=function(has){
	var html="";
	html+='<div class="tanceng_fellow">'+
		  '<div class="tanceng_fellow_t">'+
			'<div class="tishi_xx">报名信息表</div>'+
			'<a href="javascript:;" class="close">'+
			'<div class="tc_close"></div>'+
			'</a></div>'+
		  '<form id="base">' +
	      (has?'<div class="tanceng_fellow_c">' +
			'<div class="tc_shuru_xx">'+
				'<div class="shuru01"><div class="shuru_text">所选院校</div><div class="shuru_text_01" id="company"></div><div class="clear"></div></div>'+
				'<div class="shuru01"><div class="shuru_text">意向开始时间</div><div class="shuru_input">' +
					'<div class="p_c_baseinfo_time01">' +
					'<div class="p_c_baseinfo_div01">' +
					'<select id="syear"></select>' +
					'<span>年</span>' +
					'<div class="clear"></div>' +
					'</div>' +
					'</div>' +
					'<div class="p_c_baseinfo_time02">' +
					'<div class="p_c_baseinfo_div02">' +
					'<select id="smonth"></select>' +
					'<span>月</span>' +
					'<div class="clear"></div>' +
					'</div>' +
					'</div>' +
					'<div class="p_c_baseinfo_time02">' +
					'<div class="p_c_baseinfo_div02">' +
					'<select id="sday"></select>' +
					'<span>日</span>' +
					'<div class="clear"></div>' +
					'</div>' +
					'</div>' +
				'</div><div class="clear"></div></div>'+
				'<div class="shuru01"><div class="shuru_text">意向结束时间</div><div class="shuru_input">' +
					'<div class="p_c_baseinfo_time01">' +
					'<div class="p_c_baseinfo_div01">' +
					'<select id="eyear"></select>' +
					'<span>年</span>' +
					'<div class="clear"></div>' +
					'</div>' +
					'</div>' +
					'<div class="p_c_baseinfo_time02">' +
					'<div class="p_c_baseinfo_div02">' +
					'<select id="emonth"></select>' +
					'<span>月</span>' +
					'<div class="clear"></div>' +
					'</div>' +
					'</div>' +
					'<div class="p_c_baseinfo_time02">' +
					'<div class="p_c_baseinfo_div02">' +
					'<select id="eday"></select>' +
					'<span>日</span>' +
					'<div class="clear"></div>' +
					'</div>' +
					'</div>' +
				'</div><div class="clear"></div></div>'+
				'<div class="shuru01"><div class="shuru_text_00"></div><div class="shuru_text_02">项目有效时间为2015年5月20日至10月30日</div><div class="clear"></div>'+
		    '</div>'+
	      '</div>'+
	      '<div class="tanceng_fellow_t02"></div>':'')+
	      '<div class="tanceng_fellow_c">'+
			'<div class="tc_shuru_xx">'+
				'<div class="shuru01"><div class="shuru_text">手机号码</div><div class="shuru_input"><input type="text" name="mobile" id="mobile"/></div><div class="clear"></div></div>'+
				'<div class="shuru01"><div class="shuru_text">电子邮箱</div><div class="shuru_input"><input type="text" id="email" name="email" /></div><div class="clear"></div></div>'+
				'<div class="shuru01"><div class="shuru_text">微信号</div><div class="shuru_input"><input type="text" placeholder="选填" name="weixinCode" id="weixinCode"/></div><div class="clear"></div></div>'+
				'<div class="shuru01"><div class="shuru_text">通信地址</div>'+
				'<input type="hidden" id="provinceId"/>'+
				'<input type="hidden" id="cityId"/>'+
				'<input type="hidden" id="districtId"/>'+
				'<div class="select_cont"></div>'+
				'<div class="clear"></div></div>'+
				'<div class="shuru01"><div class="shuru_text"></div><div class="shuru_input"><input type="text" placeholder="详细信息" name="detailAddress" id="detailAddress"/></div><div class="clear"></div></div>'+
				'<div class="shuru01"><div class="shuru_text">邮政编码</div><div class="shuru_input"><input type="text" name="zipCode" id="zipCode"/></div><div class="clear"></div></div>'+
			'</div>'+
		  '</div>'+
		 '<div class="tanceng_fellow_t02"></div>'+
		  '<div class="tanceng_fellow_c02">'+
			  '<div class="tc_cont_02">'+
				  '<!--<div class="shuru01"><div class="shuru_text">希望学校</div><div class="shuru_input"><select class="select01"><option>Nass</option></select></div><div class="clear"></div></div>'+
				 '<div class="shuru01"><div class="check"><input type="checkbox" checked/><span>同意调剂：如正式入选，此接收院校将作为申请人的首选院校，届时根据实际情况，申请人服从调剂。</span></div></div>-->'+
				 ' <div class="tc_but_bottom"><div class="tc_but01"><img id="save" src="//img00.allinmd.cn/fellow/tc_baocun.png" /></div><div class="tc_but02"><img id="cancel" src="//img00.allinmd.cn/fellow/tc_fq.png" /></div><div class="clear"></div></div>'+
			  '</div>'+
		  '</div></form>'+
		  '<div class="tanceng_fellow_b02"></div>'+
		'</div>'+
		'<div class="cancel_mask"></div>'+
		'<div class="jxl_after">'+
			'<div class="jxl_after_but">'+
			   '<div class="jxl_but01"><img id="continue_write" src="//img00.allinmd.cn/fellow/jxtx.png" /></div>'+
			   '<div class="jxl_but02"><img id="cancel_write" src="//img00.allinmd.cn/fellow/zbtx.png" /></div>'+
			   '<div class="clear"></div>'+
			'</div>'+
		'</div>';
	return html;		
};
//简历的弹层
resumeShade=function(){
	var html="";
	html+='<div class="tanceng_fellow">'+
		  '<div class="tanceng_fellow_t">'+
			'<div class="tishi_xx">已上传的英文简历</div>'+
			'<a href="javascript:;" class="close">'+
			'<div class="tc_close"></div>'+
			'</a></div>'+
		  '<div class="tanceng_fellow_c">'+
			'<div class="tc_upload">'+
				'<div class="resume_list">'+
				'</div>'+
				'<div class="tc_th">重新上传的简历将替代原有简历</div>'+
				'<div class="tc_upload_but">'+
				'<div class="tc_but01">'+
					'<input type="file" name="uploadify" id="newResume">'+
					'<img class="uploadIng" src="//img00.allinmd.cn/fellow/upload.gif"/>'+
				'</div>'+
				'<div class="tc_but02"><a href=""><img src="//img00.allinmd.cn/fellow/tc_xz_mb.png" /></a></div><div class="clear"></div></div>'+
			'</div>'+
		  '</div>'+
		  '<div class="tanceng_fellow_b"></div>'+
		'</div>';	
		
	return html;
}
//推荐信的弹层
recommendShade=function(){
	var html="";
	html+='<div class="tanceng_fellow">'+
		  '<div class="tanceng_fellow_t">'+
			'<div class="tishi_xx">已上传的专家推荐</div>'+
			'<a href="javascript:;" class="close">'+
			'<div class="tc_close"></div>'+
			'</a></div>'+
		  '<div class="tanceng_fellow_c">'+
			'<div class="tc_upload">'+
				'<div class="recom_list">'+
				'</div>'+
				'<div class="tc_upload_but">'+
				'<div class="tc_but01">'+
					'<input type="file" name="uploadify" id="conRecommend">'+
					'<img class="uploadIng" src="//img00.allinmd.cn/fellow/upload.gif"/>'+
					'<img class="jx_sc" src="//img00.allinmd.cn/fellow/jx_sc.png"/>'+
				'</div>'+
				'<div class="tc_but02"><a href=""><img src="//img00.allinmd.cn/fellow/tc_xz_mb.png" /></a></div><div class="clear"></div></div>'+
			'</div>'+
		  '</div>'+
		  '<div class="tanceng_fellow_b"></div>'+
		'</div>'+
		'<div class="cancel_mask"></div>'+
		'<div class="jxl_after">'+
			'<div class="jxl_after_but">'+
			   '<div class="jxl_but01"><img id="delete" src="//img00.allinmd.cn/fellow/sctjx.png" /></div>'+
			   '<div class="jxl_but02"><img id="cancel_del" src="//img00.allinmd.cn/fellow/zbsc.png" /></div>'+
			   '<div class="clear"></div>'+
			'</div>'+
		'</div>';	
		
	return html;
}
//no推荐信
noRecommend=function(){
	var html="";
	html+='<div class="tanceng_fellow">'+
	  '<div class="tanceng_fellow_t">'+
		'<div class="tishi_xx">提示信息</div>'+
		'<a href="javascript:;" class="close">'+
		'<div class="tc_close"></div>'+
		'</a></div>'+
	  '<div class="tanceng_fellow_c">'+
		  '<div class="tc_ts">'+
			  '<div class="tc_ts_text">您还没有上传专家推荐信哦！</div>'+
			  '<div class="tc_ts_but">'+
			  '<div class="tc_but01">'+
			  	'<input type="file" name="uploadify" id="newRecommend">'+
				'<img class="uploadIng" src="//img00.allinmd.cn/fellow/upload.gif"/>'+
			  '</div>'+
			  '<div class="tc_but02">'+
			  '<a href=""><img src="//img00.allinmd.cn/fellow/tc_xz_mb.png" /></a></div><div class="clear"></div></div>'+
		  '</div>'+
	  '</div>'+
	  '<div class="tanceng_fellow_b"></div>'+
	'</div>';
	return html;	
}
//申请提交提示
apply=function(){
	var html="";
	html+='<div class="tanceng_fellow">'+
	  '<div class="tanceng_fellow_t">'+
		'<div class="tishi_xx">友情提示</div>'+
		'<a href="javascript:;" class="close">'+
		'<div class="tc_close"></div>'+
		'</a></div>'+
	  '<div class="tanceng_fellow_c">'+
		  '<div class="tc_ts">'+
			  '<div class="apply_text">申请提交后，将不能修改，请确保资料完整无误。</div>'+
			  '<div class="tc_ts_but">'+
			  '<div class="tc_but01">'+
				'<img class="apply_con" src="//img00.allinmd.cn/fellow/qr_tj.png"/>'+
			  '</div>'+
			  '<div class="tc_but02">'+
			  '<img class="no_apply" src="//img00.allinmd.cn/fellow/zb_tj.png" /></div><div class="clear"></div></div>'+
		  '</div>'+
	  '</div>'+
	  '<div class="tanceng_fellow_b"></div>'+
	'</div>';
	return html;	
}
faile=function(){
	var html="";
	html+='<div class="tanceng_fellow">'+
	  '<div class="tanceng_fellow_t">'+
		'<div class="tishi_xx">提示信息</div>'+
		'<a href="javascript:;" class="close">'+
		'<div class="tc_close"></div>'+
		'</a></div>'+
	  '<div class="tanceng_fellow_c">'+
		  '<div class="tc_ts">'+
			  '<div class="tc_ts_text"></div>'+
		  '</div>'+
	  '</div>'+
	  '<div class="tanceng_fellow_b"></div>'+
	'</div>';
	return html;		
};
//拜耳确认报名
applySure=function(){
	var html="";
	html+='<div class="fellowship_popup" style="background:#efeff4;">'+
	'<div class="fs_popup_main">'+
	'<div class="fs_popup_cont">'+
	'<div class="fs_popup_title">'+
	'<div class="fs_popup_title_l">我的报名</div>'+
	'<div class="fs_popup_title_r"><a href="javascript:;" class="close"><img src="//img00.allinmd.cn/channel/fellowship/popup_close.png"/></a></div>'+
	'<div class="clear"></div>'+
	'</div>'+
	'<div class="fs_popup_content">'+
	'<div class="fs_popup_bmzt">报名确认</div>'+
	'<div class="fs_popup_border">您要选择<span class="company"></span>作为此次的进修学校吗？每位用户仅可选择一家医院，报名后不可修改，请慎重选择。</div>'+
	'<div class="fs_popup_but">'+
	'<div class="fs_popup_but_div fs_popup_but_yes" id="yes">是的</div>'+
	'<div class="fs_popup_but_div fs_popup_but_no close" id="no">暂不</div>'+
	'<div class="clear"></div>'+
	'</div>'+
	'</div>'+
	'</div>'+
	'</div>'+
	'</div>';
	return html;
};
//拜耳已报名
baierApply=function(n){
	var html="";
	html+='<div class="fellowship_popup" style="background:#efeff4;">'+
	'<div class="fs_popup_main">'+
	'<div class="fs_popup_cont">'+
	'<div class="fs_popup_title">'+
	'<div class="fs_popup_title_l">我的报名</div>'+
	'<div class="fs_popup_title_r"><img src="//img00.allinmd.cn/channel/fellowship/popup_close.png"/></div>'+
	'<div class="clear"></div>'+
	'</div>'+
	'<div class="fs_popup_content">'+
	'<div class="fs_popup_bmzt fs_popup_true">'+(n?"您已提交过申请！":"报名成功！")+'</div>'+
	'<div class="fs_popup_border"><span class="second">3</span>秒后将自动跳转至我的报名页，如未跳转请点击下面的按钮。</div>'+
	'<div class="fs_popup_but fs_popup_but02">'+
	'<div class="fs_popup_but_div"><a href="" id="page_href">查看我的报名</a></div>'+
	'<div class="clear"></div>'+
	'</div>'+
	'</div>'+
	'</div>'+
	'</div>'+
	'</div>';
	return html;
};

addHtml=function(html){
	comm.LightBox.show();
	comm.LightBox.show(50,"#000");
	$(".lightbox-container").remove();
	$("body").append("<div class='lightbox-container'></div>");
	$(".lightbox-container").css({
		zIndex:10,
		position:"absolute"
	});
	$(".lightbox-container").html(html);
	comm.setCenter($(".lightbox-container"));
	$(window).bind("scroll",function(){
		comm.setCenter($(".lightbox-container"));
		$(".tip-yellow").remove();
	});
	$(".close").on("click",function(){
		closeShade();
	});
};
closeShade=function(){
	comm.LightBox.hide();
	$(".tip-yellow").remove();
	$(".lightbox-container").remove();
}
/**
 * 功能描述： 首页
 * 使用方法:
 * 注意事件：
 * 引入来源：  作用：
 *
 * Created by LiuYuTao on 2015/4/17.
 */
setTimeout(function () {
	var data = comm.customer.execute("checkSession");

	if (data.responseMessage.status) {
		var param = comm.getpara(); // 邮件引导认证-中的 快速认证按钮点过来的接收处理。
		if (param.account != undefined && param.account != "" && param.action != undefined && param.action == 'quickAuth') {
			// 先退出， 需重新登录
			user.logout();
			$("body").show();
		}else{
            g_sps.jump(null,"/pages/personal/index.html");
			return;
		}
	} else {
		$("body").show();
		$("#allinLogin").find("input[placeholder]").placeholder();	// 表单默认值 插件
	}
}, 500);


$(function () {

	var param = comm.getpara();
	if (param.account != undefined && param.account != "" && param.action != undefined && param.action == 'quickAuth') {
		module.indexLogin_v2({account: param.account, action: "quickAuth"});
	} else {
		module.indexLogin_v2();
	}


	module.bannerChannel({
		containerImg: '.Ev-ul-AppendBannerImg',//图片容器
		channelId: 68 ,//channelId:''//113-病例 78-视频 81-文库 114-话题  68-首页
		isIndex:1
	});

	//module.indexBanner();

	//是否PC端
	if (!comm.equipment.IsPC()) {
        g_sps.jump(null,"/");
		return false;
	}
});

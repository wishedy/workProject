/**
 * 功能描述：获取URL地址参数值
 * 使用方法: 
 * 注意事件：
 * 引入来源：  作用：
 *
 * Created by QiaoLiang on 2015-4-15.
 */

;(function($) {
	$.getUrlParam = function(name) {
		var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
		var r = window.location.search.substr(1).match(reg);
		if (r !== null)
			return unescape(r[2]);
		return null;
	};
})(jQuery);

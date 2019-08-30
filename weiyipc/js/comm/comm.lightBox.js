/**
 * 功能描述：遮罩
 * 使用方法:
 * 注意事件：
 * 引入来源：  作用：
 *
 * Created by LiuYuTao on 2015/3/5.
 *
 * 弹层之上元素z-index:9起步
 *
 */

comm.LightBox = {
	element: null,
	init: function () {
		var a = "100%",
			b = "fixed";
		comm.browser.msie && "6.0" === comm.browser.version && !$.support.style && (a = document.documentElement.clientHeight + "px", b = "absolute");
		var c;
		$("#lightbox").remove();
		c = comm.browser.msie ? '<div id="lightbox" style="left:0;  background:' + this.color + '; top:0; width:100%; height:' + a + ";filter: progid:DXImageTransform.Microsoft.Alpha(opacity=100); filter:alpha(opacity=" + this.opacity + "); -moz-opacity:" + this.opacity / 100 + "; opacity:" + this.opacity / 100 + ";zoom:1; position:" + b + '; z-index:9; " ><iframe src="" marginwidth="0" framespacing="0" marginheight="0" frameborder="0" width="100%" height="100%" style="left:0; background:' + this.color + '; top:0; width:100%; filter:alpha(opacity=0); -moz-opacity: 0; opacity: 0;zoom:1; position:absolute; z-index: 9"></iframe></div>' : '<div id="lightbox" style="left:0; background:' + this.color + '; top:0; width:100%; height:' + a + "; filter:alpha(opacity=" + this.opacity + "); -moz-opacity: " + this.opacity / 100 + "; opacity: " + this.opacity / 100 + ";zoom:1; position:" + b + '; z-index:9; " ></div>',
			this.element = $(c).appendTo(document.body),
			$("#_lightbox").remove(),
			this.count = 0
	},
	getZIndex: function () {
		return parseInt(this.element.css("zIndex")) || -1
	},
	hide: function () {
		var a = this;
		a.element && (comm.browser.msie && Number(comm.browser.version) < 9 ? setTimeout(function () {
			a.count--,
			(a.count <= 0 || a.element.css("zIndex") <= 9) && a.element.hide()
		}, 200) : (a.count--, (a.count <= 0 || a.element.css("zIndex") <= 9) && (a.element.hide(), comm.browser.msie || $("div.SecEditCtrl").css("visibility", "visible"))))
	},
	resetZIndex: function () {
		return this.setZIndex("9")
	},
	setZIndex: function (a) {
		return this.element || this.init(),
			this.element.css("zIndex", a || this.element.css("zIndex"))
	},
	show: function (opacity, color) {
		if (opacity !== undefined) {
			this.opacity = opacity
		} else {
			this.opacity = 100;
		}
		if (color !== undefined) {
			this.color = color
		} else {
			this.color = "#000";
		}
		return this.init(),       //this.element ||
		comm.browser.msie && "6.0" === comm.browser.version && !$.support.style && this.element.css("height", CU.getDocumentPracticalHeight() + "px"),
			this.element.show(),
			this.setZIndex("9"),
		this.count < 0 && (this.count = 0),
			this.count++,
			this
	},
	zIndexUp: function () {
		this.element.css("zIndex", "+=2");
		this.element.css("display", "block");
	},
	zIndexDown: function () {
		this.element.css("zIndex", "-=2")
	},
	showloading: function () {
		this.loading = (this.loading || $('<div style="position:absolute; top:45%; left:36%;z-index:18; display:none" id="ctrollerLoading"><img src="//img10.allinmd.cn/loading/Loading.png" alt="loading" /></div>').appendTo(document.body)).show();
		comm.setCenter($("#ctrollerLoading"));
		/*if($("#lightbox").is(":visible")){
		 comm.LightBox.zIndexUp();
		 }else{
		 comm.LightBox.show();
		 }*/

	},
	hideloading: function () {
		if (this.loading) {
			this.loading.hide();
		}
		/*  if(comm.LightBox.getZIndex()==10001){
		 comm.LightBox.hide();
		 }else{
		 comm.LightBox.zIndexDown();
		 //comm.LightBox.element.hide();
		 }*/
	}
};

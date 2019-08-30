/**
 * 功能描述：
 * 使用方法:
 * 注意事件：
 * 引入来源：  作用：
 *
 * Created by LiuYuTao on 2015/3/18.
 * add by QiaoLiang on 2015-3-29.
 * 功能：加入回调方法
 * 用于作恢复或其它后续操作的方法
 * showTime : 用于显示多久
 * content : 提示信息
 * callback 
 * mark : 显示提示图标 "success"：成功  "warn"：失败
 */
$.topTip = function (Obj) {
    var defaults = {
    		mark:"",
        showTime:5,
        content:""//顶部提示框，请传入content属性参数
    };


    var options = $.extend(defaults,Obj);
    var controller = {
        timeout:null,
        el:{},
        template:{
            main: function () {
            	var t = controller;
                return '<div class="popup_tishi_wrap"><div class="popup_tishi">' +
                    '        <div class="popup_tishi_bg">' +
                    '        <div class="popup_tishi_content">' +
                    t.mark(options.mark)+
                    '            <div class="popup_ts_text">'+ options.content +'</div>' +
                    '            <div class="clear"></div>' +
                    '        </div>' +
                    '    </div></div></div>';
            }
        },
        init: function () {
            var t = this;

            if($(".popup_tishi_wrap").size()===0){
            	if($("body").find("#header_main").length > 0){ 
            		$("body").find("#header_main").append(t.template.main());
            	}else{
            		$("body").append(t.template.main());
            	}
            }
            t.el.con = $(".popup_tishi_wrap");
            t.el.con.find(".popup_ts_text").html(options.content);
            t.show();
            /*if($.topTip.timeout){
                clearTimeout($.topTip.timeout);
                $.topTip.timeout = null;
                //t.setTimeoutHide();
            }else{
               t.show();
            }*/
        },

        setTimeoutHide: function () {
            var t = this;
            t.el.con.animate({top:"0px"});
            $.topTip.timeout = setTimeout(function () {
                t.el.con.animate({top:"-49px"},function(){
                    t.el.con.remove();
                    options.callback && options.callback();
                });
                $.topTip.timeout = null;
            },options.showTime * 1000);
        },
        show: function () {
            var t = this;
            t.el.con.animate({  top:0  });
            t.setTimeoutHide();
             /*   .delay(options.showTime * 1000);
                .animate({top:"-49px"}).delay(1000);*/

        },
        mark : function(type){
        		var html = "";
        		switch(type){
        			case "success" : html = '<div class="popup_success_icon"></div><div class="popup_success_text"></div>'; break;
        			case "warn" : html = '<div class="popup_warn_icon op"></div>'; break;
        		}
        		return html;
        }
    };
    controller.init();

};
/*错误的popup提示,
* options：{
* "text":"错误提示内容",
* "callBack":function(){回调函数}
* }
* */
$.errorPopup = function(options){
    var defaults = {
        "fadeIn":options.fadeIn?options.fadeIn:300,
        "delay":options.delay?options.delay:1000,
        "fadeOut":options.fadeOut?options.fadeOut:300
    };
    $.extend(defaults,options);
    var errorMethod = {
        init:function(){
            var bodyContainer = $("body");
            bodyContainer.find(".uploadCaseError").remove();
            bodyContainer.append('<section class="uploadCaseError">'+
                '        <i></i><span>'+options.text+'</span>'+
                '</section>');
            if(options.callback){
                $(".uploadCaseError").fadeIn(300).delay(1000).fadeOut(300,options.callback);
            }else{
                $(".uploadCaseError").fadeIn(300).delay(1000).fadeOut(300);
            }
        }
    }
    errorMethod.init();

};
//弹窗

var dialog=function(opt){
	var o={
		message:opt.message,
        pic:(opt.pic!=null?opt.pic:true)
	};
	
	var html="";
	html+='<div id="dialog">'+
    	'<div class="op"></div>'+
    	'<div class="diaContent">'+
    		'<div class="ico">'+ (o.pic?'<img src="//img50.allinmd.cn/personal/ture.png"/>':'') +'</div>'+
    		'<div class="message">'+o.message+'</div>'+
    	'</div>'+
    '</div>';
	
	$(".content-page").append(html);
	
	var positionFromTop = ($(document).height()-$("#dialog").height())/2;
    var positionFromLeft = ($(document).width()-$("#dialog").width())/2;
    var top  = $(window).scrollTop() + positionFromTop;
    var left = $(window).scrollLeft() + positionFromLeft;
    $("#dialog").css({
        top: top + 'px',
        left: left + 'px'
    });
	
};

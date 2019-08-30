$(function(){
	
	$(window).scroll(function(){
		var scr_top = $('.header_pk').height();
		if($('body').scrollTop()>=scr_top){
			$('.nav_pk').css({
				position:'fixed',
				top:"0",
				left:'0',
				background:"#fff",
				zIndex:"10"
			})
		}else{
			$('.nav_pk').css({
				position:'static'
			})
		}
			
	})
	function hideBottom(){
		$('.share_popup').hide();
	}
	
})

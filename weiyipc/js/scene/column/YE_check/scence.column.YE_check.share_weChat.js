$(function(){
	comm.setCenter($('#qrcodeArea'));
	var wechat={
		init:function(){
			var render = 'canvas';
			if(navigator.appName.indexOf("Microsoft")!=-1){
				render='table';
			}
			$('#qrcodeContent').qrcode({width:140,height:140,text:window.location.href,render:render});
			
			$('.share_ico_weChat').on('click',function(){
				if($('#qrcodeArea').is(":visible")){
					$('#qrcodeArea').hide();
				}else{
					$('#qrcodeArea').show();
					setTimeout(function(){$('#qrcodeArea').hide();},20000)
				}				
			})			
		}
	};
	wechat.init();
	
})	

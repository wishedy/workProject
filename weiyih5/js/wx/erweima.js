var wx_erweima={
		urlList:{
			scan_erweima:"/mcall/wx/allin/interact/generateTicket/"
				},
		init:function(){
			this.san_erweima();
		},
		san_erweima:function(){
			var thisURL = document.URL;	
			var customerID= thisURL.substring(thisURL.indexOf("cid")+4);
			var param={customerId:customerID};
			CommService.asyncExecute(this.urlList.scan_erweima,param,function(data){
				var status=data.responseStatus;
				if(status){
					return;
				}else{
				var thisURL = document.URL; 
				var ticket=data.responseData.ticket;
				strwrite = "<img src='https://mp.weixin.qq.com/cgi-bin/showqrcode?ticket="+ticket+"&cht=qr&chs=150x150&choe=UTF-8&chld=L|4&chl=" + thisURL + "' width='150' height='150' alt='La_Clover提示您：用手机扫一扫二维码，轻松分享' />";
				$(".wx_bd_success_img_er").html(strwrite);
				}
		});	
		}
};
$(function(){
	wx_erweima.init();
	
});

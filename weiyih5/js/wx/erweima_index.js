 var wx_erweima_index={
		 urlList:{
			 scanTicketIndex:"/mcall/web/user/getWebUser/",
			 generateTicket:"/mcall/wx/allin/interact/generateTicket/"
			 
		 },
		 init: function(){
			 this.generateWxTicket();
		 },
		 generateWxTicket:function(){
			     CommService.asyncExecute(this.urlList.scanTicketIndex,"",function(data){
				 var responseMsg=data.responseMessage;
				 var customerID=responseMsg.userId;
			     var param={customerId:customerID};
				 CommService.asyncExecute(wx_erweima_index.urlList.generateTicket,param,function(data){
				 var thisURL = document.URL; 
				 var ticket=data.responseData.ticket;
				 var nickName=data.responseData.nickName;
				 strwrite = "<img src='https://mp.weixin.qq.com/cgi-bin/showqrcode?ticket="+ticket+"&cht=qr&chs=150x150&choe=UTF-8&chld=L|4&chl=" + thisURL + "' width='139' height='202' alt='La_Clover提示您：用手机扫一扫二维码，轻松分享' />";
		           $(".wx_bd_success_img").html(strwrite);
						}); 
					});	       	  
		 }	 
 }; 
 $(function(){
     var name=comm.getpara().name;
	 $("#name").html(name);
	 wx_erweima_index.init();
	 $(".wx_close").on("click",function(){
		 var fromPage = localStorage.getItem('fromPage') && localStorage.getItem('fromPage');
		 if(fromPage == "http://m.allinmd.cn/pages/column/data_magic/dataMagic_jump.html"){
       g_sps.jump(null,'/pages/column/data_magic/dataMagic_jump.html');
		 }else{
       g_sps.jump(null,'/');
		 }
	});	 
 });
 


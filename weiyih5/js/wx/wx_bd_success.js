var wx_bd_success={
	   urlList:{
		 bindSuccess:""  
	   },
	   init:function(){
		   this.bindSuccess();
	   },
	   bindSuccess:function(){
		   var name = Common.getpara().name;
		   var state= Common.getpara().state;
		   var customerID = Common.getpara().customerId;
		    $("#name").text(name);
		    $("#contineScan").on("vclick",function(){
		    	if("subscribe"==state){
            g_sps.jump(null,"/pages/personal/personal_myFollow.html");
		    	}else if("message"==state){
            g_sps.jump(null,"/pages/message/message_main.html");
		    	}
		    });
	   }	
};
$(function(){
	wx_bd_success.init();
});


$(function(){
    var account = comm.getpara().account;
    var mobile = comm.getpara().mobile;
    var flag=comm.getpara().flag;


    $("#account").text("邮箱："+twoStar(account));
    //$("#email").attr("placeholder","邮箱："+twoStar(account));

    comm.bindReturnBtn("loginPage");

    $("#loginBtn").on("vclick",function(){
        var rep=customer.execute("sendPasswordEmail",{"resetSite":2,email:account,applySource:2});
        if(rep && rep.responseStatus){
            comm.redirect("/pages/passport/findPassword/findPassword-step3-email.html?account="+account+"&flag="+flag); // 已发送
        }else{
            popup("超出邮件可发送数量");
        }
    });
    
	if(mobile && mobile!=""){
		$("#toMobileBtn").on("vclick",function(){
      g_sps.jump(null,"/pages/passport/findPassword/findPassword-step2-phone.html?_="+Math.random()+"&account="+mobile+"&email="+account+"&flag="+flag);
		});
	}else{
		$("#toMobileBtn").css({"display":"none"});
	}
    
});



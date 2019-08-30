function loginPageInit(){
	$("#loginBtn").on("vclick",function(){
		var t = TempCache.getItem("fromPage_passwd");
		if(!t || t=="" || t=="undefined"){
			t="/pages/passport/login_allin.html";
		}
		TempCache.removeItem("fromPage_passwd");
		comm.redirect(t,0);
	});
}
$(function(){
  loginPageInit();    
});
	



 var passport_login_select={
	    init:function(){
	    	var redirect=comm.getpara() && comm.getpara().redirect;
	    	if(!redirect || redirect!="1"){
	    		TempCache.removeItem("fromPage");
	    	}
	    }
  };
$(function () {	
	passport_login_select.init();
	//Log.createBrowse(72, '登录选择');

});
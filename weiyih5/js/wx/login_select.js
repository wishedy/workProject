 var passport_login_select={
	    init:function(){
	    	var redirect=comm.getpara() && comm.getpara().redirect;
	    	if(!redirect || redirect!="1"){
	    		TempCache.removeItem("fromPage");
	    	}
	    }
  };
$(function () {
	var from=comm.getpara().from;
	passport_login_select.init(); 
});
function caosLogin(){
	var from=comm.getpara().from;
	window.location.href="/pages/wx/login_caos.html?from="+from;
}
function allinLogin(){
	var from=comm.getpara().from;
	var flag=comm.getpara().flag;
	window.location.href="/pages/wx/login_allin.html?from="+from+"&flag="+flag;
}
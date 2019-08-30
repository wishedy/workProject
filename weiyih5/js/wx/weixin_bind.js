var wx_weixin_bind={
		urlList:{},
		init:function(){
			this.loginSubmit();
		},
		loginSubmit:function loginSubmit(){
			$.mobile.loading("show");
	        var type;
	    	var password=$("#allinLoginForm").find("[name=password]").val();
	        var email = $.trim($("#allinLoginForm").find("[name=email]").val());
	        type = checkAccountType(email);
	        var param = {
	        		j_username:"website;"+email+";"+password+";"+type,
	        		j_password:password
	            };
	        param.rememberMe=1;
	        var url=customer.urlList.userLogin.url;
	        //var data = { "paramJson": $.toJSON(param)};
	        $.ajax({
	              url: url,
	              cache: false,
	              data:param,
	              dataType:'json',
	              type:"POST",
	              success: function(data){
	                  // 不正确的邮箱或密码,请重新输入！
	                  var result = data.responseObject;
	                  if(!result.responseStatus){         // 登录失败
	                    //comm.showPageError(result.responseMessage);
	                    popup(result.responseMessage);
	                  }else{
	                	  user.getSessionInfo();
	                	  var eventKey=comm.getpara() && comm.getpara().key;
	                	  if(eventKey && eventKey!=undefined && eventKey=="bind_unite"){
	                		bingUnite();
	                	  }else{
	                		  user.success("登录成功，即将返回来源页"); 
	                	  }
	                  }
	              },
	              error:function (XMLHttpRequest, textStatus, errorThrown) {
	                  popup(textStatus + "   " +errorThrown);
	              }
	        });
		}	
};
$(function(){
	var weixinOpenId=comm.getpara().uniteNameWeixin;
	var state=comm.getpara().state;
  });
function  loginBtn(){
    //$(".errorInfo").hide();
	     wx_weixin_bind.init();
}
function toRegist(){
    //$(".errorInfo").hide();
	var weixinOpenId=comm.getpara().uniteNameWeixin;
	var state=comm.getpara().state;
  g_sps.jump(null,"/pages/passport/regist_allin.html?flag=1&weixinOpenId="+weixinOpenId+"&state="+state);
}
/**
 * 绑定微信帐号
 */
function bingUnite(){
	var param=comm.getpara();
	var state=comm.getpara().state;
	var data={};
	data.weixinOpenId=param && param.uniteNameWeixin;
	data.signature=param && param.signature;
	data.password=$("#allinLoginForm").find("[name=password]").val();
    data.account= $.trim($("#allinLoginForm").find("[name=email]").val());
	var rep=customer.execute("createWeixinUniteBind", data);
	//  comm.bindWeixin();
	if(rep && rep.responseStatus){
		comm.redirect("/pages/wx/wx_bd_success.html?name="+data.account+"&customerId="+rep.responseData.customerId+"&state="+state);
	}else{
		comm.redirect("/pages/wx/yibangding.html");
	}
}


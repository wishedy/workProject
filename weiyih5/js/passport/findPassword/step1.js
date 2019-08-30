$(function(){
    comm.initInputFocusEvent();
    comm.bindReturnBtn("loginPage");
    var resetAccount=$("#resetAccount").val();
    //flag表示微信服务号打开的
    var flag=$("#flag").val();
    var flagWeixin=comm.getpara().flag;
    if(resetAccount && resetAccount!="null"){
    	$("#account").val(resetAccount);
    }
    $("#loginForm").validate({
        submitHandler : function() {
            comm.loading.show();
            var account = $("#account").val(),type;
            if(/^1\d{10}$/.test(account)){
                type="mobile"
            }else{
                type="email"
            }
            var result = customer.execute("validateAccount",{account:account, type:type});
            if(!result.responseStatus){  // 不存在
                comm.loading.hide();
                $(".l_warning").html('<label for="account" generated="true" class="error">无此账户。想要 <a href="/pages/passport/regist_allin.html" data-role="non' +
                    '" data-ajax="false">注册</a> 吗？</label>');
            }else{// 存在
                if(type=="email"){
                	var obj=customer.getData("getCustomerUnite",{email:account});
                	if(obj && obj!=null && obj.mobile && obj.mobile!=""){
                		//customer.execute("sendPasswordMobile",{typeId:'2',siteId:'2',account:obj.mobile});
                    g_sps.jump(null,"/pages/passport/findPassword/findPassword-step2-phone.html?_="+Math.random()+"&account="+obj.mobile+"&email="+account+"&flag="+flag);
                	}else{
                		//g_sps.jump(null,"/pages/passport/findPassword/findPassword-step2-email.html?_="+Math.random()+"&account="+account);
                        var rep=customer.execute("sendPasswordEmail",{"resetSite":2,email:account,applySource:2,emailFlag:flag});
                		if(flagWeixin!=""){
                			flag=flagWeixin;
                		}
                        comm.loading.hide();
                        if(rep && rep.responseStatus){
                            comm.redirect("/pages/passport/findPassword/findPassword-step3-email.html?account="+account+"&flag="+flag); // 已发送
                        }else{
                            popup("超出邮件可发送数量");
                        }
                	}
                }else{
                //customer.execute("sendPasswordMobile",{typeId:'2',siteId:'2',account:obj.mobile});
                	var obj=customer.getData("getCustomerUnite",{mobile:account});
                    comm.loading.hide();
                	if(obj==null || obj.isCheckMobile!=1){
                		$(".l_warning").html('<label for="account" generated="true" class="error">无此帐号。</label>');
                	
                	}                	
                	else if(obj && obj!=null && obj.email && obj.email!=""){
                    g_sps.jump(null,"/pages/passport/findPassword/findPassword-step2-phone.html?_="+Math.random()+"&account="+account+"&email="+obj.email+"&flag="+flag);
                	}else{
                    g_sps.jump(null, "/pages/passport/findPassword/findPassword-step2-phone.html?_="+Math.random()+"&account="+account+"&flag="+flag);
                	}
                    
                }
            }
        },
        rules : {
            "account" : {
                "required" : true,
                "emailOrPhone" : true,
                "rangelength" : [ 1, 50 ]
            }
        },
        messages : {
            "account" : {
                "required" : "请填写手机号或邮箱。",
                "emailOrPhone" : "请输入正确的手机号或邮箱。",
                "rangelength":"最多可输入50个字符。"
            }
        },
        errorPlacement:function(error,element){
            var con = $(element).parent().parent().find(".l_warning");
            con.html(error);
            $(element).parent().parent().addClass("input_error");
        },
        success:function(element){
            $(element).parents(".input_error").removeClass("input_error");
            $(element).parent().empty();
        },
        onkeyup:false

    });

    $("#loginBtn").on("vclick",function(){
        $("#loginForm").submit();
    });
    $("#remind").on("vclick",function(){
    	var flag=comm.getpara().flag;
    	var from=comm.getpara().from;
    	if(flag=="1"){
        g_sps.jump(null,"/pages/wx/login_allin.html?from="+from+"&flag="+flag);
    	}else{
    	//g_sps.jump(null,"/pages/passport/login_allin.html");
            history.back();
    	}
      	
    });

    //window.onload = Log.createBrowse(29, '找回密码');
});



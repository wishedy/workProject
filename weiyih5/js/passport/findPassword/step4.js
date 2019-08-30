
$(function(){
    //Log.createBrowse(75,"找回密码-重设置密码");
    comm.bindReturnBtn("","");
    comm.initInputFocusEvent();

   var flag=comm.getpara().flag;
   var from=comm.getpara().from;
   /* var emailName=$(".email_name").text();
    var email1=emailName.split("@")[0];
    var email1_replace=email1.replace(email1.substring(1,email1.length-1),"***");
    var newEmail=email1_replace+"@"+emailName.split("@")[1];
    $(".email_name").text(newEmail);*/
    
    
    $("#loginForm").validate({
        submitHandler : function() {
            Register.submit();
        },
        rules : {
            "passwd" : {
                "required" : true,
                "rangelength":[6,20],
                "chrnum":true
            }
        },
        messages : {
            "passwd" : {
                "required" : "请填写密码。",
                "rangelength":"密码长度请保持在{0}-{1}位！"
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

    var Register = {
        form: '',
        submit: function () {

            var params = {};
            var data = {};
            var password=$("[name=passwd]:eq(0)").val();
            password=(!password || password=="")?$("[name=passwd]:eq(1)").val():password;
            data.password = password;
            data.customerId = $("#customerId").val();
            data.resetSite = $("#resetSite").val();
            data.itemId = $("#itemId").val();
            params.paramJson = $.toJSON(data);
            var itemId=$("#itemId").val();
			if(itemId==-1){
				alert("密码修改失败,请确保帐号正确！");
			}else{
	            var rep=customer.execute("updatePassword",{itemId:data.itemId,"resetSite":2,password:data.password,customerId:data.customerId});
	            if (rep) {
	                if (rep.responseStatus  && flag=="1" ) {
	                    window.location = "/pages/wx/findPassword/findPassword-step5.html";
	                }else if(rep.responseStatus) {
	                	window.location = "/pages/passport/findPassword/findPassword-step5.html";
	                }
	                else {
	                    popup("密码修改失败");
	                }
	            } else {
	                popup("密码修改失败");
	            }
			}
            return false;
        }
    }

    $("#loginBtn").on("vclick",function(){
        $("#loginForm").submit();
    });
    $("form input").on("change",function(){
        $("form input").val($(this).val());
    });

    // 开关
    $(".switch").on("vclick",function(){
        var circ = $(this).find(".circ");
        if(circ.css("marginLeft")=="0px"){
            circ.animate({"marginLeft":$(this).width()*0.38+"px"},"fast");
            $("#password-show").show();
            $("#password-hide").hide();
            $(this).css("background",'url("//img50.allinmd.cn/v3/images/images/switch-bg_03.jpg") no-repeat top');
            $(this).css("backgroundSize",'100%');
        }else{
            circ.animate({"marginLeft":"0em"},"fast");
            $("#password-show").hide();
            $("#password-hide").show();
            $(this).css("background",'url("//img50.allinmd.cn/v3/images/images/switch-bg-04.png") no-repeat top');
            $(this).css("backgroundSize",'100%');
        }
    });
});
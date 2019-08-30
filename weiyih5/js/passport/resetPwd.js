var clicked = false;
$("#setNewPwd").on("pagecreate",function(){

      $("#sendEmail").on("vclick",submitResetPwd);

});

function submitResetPwd(){
    var email =  $("#setNewPwd input[name=email]").val();
    if(email!="" && email!=null && (email.match(/^(\w)+(\.\w+)*@(\w)+((\.\w+)+)$/)!=null)){
        if(!clicked) {
            var rep=customer.execute("sendPasswordEmail",{"resetSite":2,email:email,applySource:2});
            var message = rep.responseMessage;
            if (rep && !rep.responseStatus && rep.responseCode == "0C0001") {
                popup("发送失败：" + message);

            } else {
              g_sps.jump(null,"/mcall/customer/reset/password/send_email_success/?email=" + message);
            }
            clicked = true;
        }else {
            popup("您已经点击过了");
        }
    }else{
        popup("请输入合法的邮箱");
    }

    return false;
}

$(function(){
    $("#loginForm1").validate({
        submitHandler : function() {
            submitResetPwd();
        },
        rules : {
            "email" : {
                "required" : true,
                "rangelength":[6,50],
                "email":true
            }
        },
        messages : {
            "email" : {
                "required" : "请填写手机号或邮箱。",
                "rangelength":"邮箱长度请保持在{0}-{1}位！",
                "email":"不像是有效的电子邮箱。"
            }
        },
        errorPlacement:function(error,element){
            var con = $(element).parent().parent().find(".l_warning");
            con.append("<span></span>");
            con.find("span").html(error);

            $(element).parent().parent().addClass("input_error");

        },
        success:function(element){
            $(element).parents(".input_error").removeClass("input_error");
            $(element).parent().parent().empty();
        },
        onkeyup:false
    });


	var emailName=$(".email_name").text();
	var email1=emailName.split("@")[0];
	var email1_replace=email1.replace(email1.substring(1,email1.length-1),"***");
	var newEmail=email1_replace+"@"+emailName.split("@")[1];
	$(".email_name").text(newEmail);

    $("#loginForm").validate({
        submitHandler : function() {
            Register.submit();
        },
        rules : {
            "passwd" : {
                "required" : true,
                "rangelength":[6,20],
                "chrnum":true
            },
            "passwordRepeat" : {
                "required" : true,
                "equalTo" : "#customerPassword"
            }
        },
        messages : {
            "passwd" : {
                "required" : "请填写密码。",
                "rangelength":"密码长度请保持在{0}-{1}位！"
            },
            "passwordRepeat" : {
                "required":"请再次填写密码。",
                "equalTo":"两次输入密码不一致！"
            }
        },
        errorPlacement:function(error,element){
            var o = $(".errorInfo").show();
            error.appendTo(o);
        },
        onkeyup:false
    });

    var Register = {
        form: '',
        submit: function () {
            var params = {};
            var data = {};
            data.password = $.trim($("#customerPassword").val());
            data.customerId = $("#customerId").val();
            data.resetSite = $("#resetSite").val();
            data.itemId = $("#itemId").val();
            params.paramJson = $.toJSON(data);

            var rep=customer.execute("updatePassword",{itemId:data.itemId,"resetSite":2,password:data.password,customerId:data.customerId});
            if (rep) {
                if (rep.responseStatus) {
                    window.location = "/pages/passport/modifySuccess.html";
                } else {
                    popup("密码修改失败");
                }
            } else {
                popup("密码修改失败");
            }

            return false;
        }
    }
});
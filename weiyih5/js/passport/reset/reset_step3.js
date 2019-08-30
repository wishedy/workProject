/*
* 找回密码-重设密码
* */
$(function(){
    //Log.createBrowse(75,"找回密码-重设置密码");
    var flag=comm.getpara().flag;
    var from=comm.getpara().from;
    var psw = /^[A-Za-z0-9`~!@#$%^&*()-_=+{};:,.<>/?\|'"]+$/;
    var psw1 = /^[A-Za-z0-9`~!@#$%^&*()-_=+{};:,.<>/?\|'"]{6,20}$/;
    var val1 ="",val2="";
    $.ajax({
        url:M_CALL+"customer/unite/getMapById/",
        type:"post",
        dataType:'json',
        data:{paramJson:$.toJSON({customerId:comm.getpara().cid,logoUseFlag:4})},
        success:function(rep){
            if(rep&&rep.responseObject&&rep.responseObject.responseData&&rep.responseObject.responseData.data_list.length){
                var unite = rep.responseObject.responseData.data_list[0].customer_unite;
                if(comm.getpara().validCode.length==4){
                    $('#account').text(unite.mobile);
                }else{
                    $('#account').text(unite.email);
                }
            }
        }
    });
    $('input[name=password]').on('blur',function(){
         val1 = $(this).val();
        if(psw1.test(val1)){
            if(psw1.test(val2)){
                $(".alLoginBtn").removeClass('disabled');
                $('.topShowError').remove();
            }else{
                $(".alLoginBtn").addClass('disabled');
            }

        }else if(!(val1.length>=6&&val1.length<=20)){
            comm.topShowPageError('密码长度请保持在6-20位！');
            $(".alLoginBtn").addClass('disabled');
        }else if(!psw.test(val1)){
            comm.topShowPageError('字母、数字或符号的组合');
            $(".alLoginBtn").addClass('disabled');
        }else{
            $(".alLoginBtn").addClass('disabled');
        }
    }).on('input propertychange',function(){
        val1 = $(this).val();

        val2 = $('[name=repassword]').val();
        if(psw1.test(val1)&&psw1.test(val2)){
            $(".alLoginBtn").removeClass('disabled');
            $('.topShowError').remove();
        }else{
            $(".alLoginBtn").addClass('disabled');
        }

    });
    $('#loginForm i.close').click(function(){
        $(this).siblings('input').val("");
        $(this).hide();
    });
    //
    //密码明文暗文切换
    $('.ev_toggleEye').click(function(){
        if($(this).hasClass('eyeOpen')){
            $(this).addClass('eyeClose').removeClass('eyeOpen');
            $(this).siblings('input').attr('type','password');
        }else{
            $(this).addClass('eyeOpen').removeClass('eyeClose');
            $(this).siblings('input').attr('type','text');
        }
    });
    $('input[name=repassword]').on('blur',function(){
        val2 = $(this).val();
        if(psw1.test(val2)){
            if(psw1.test(val1)){
                $(".alLoginBtn").removeClass('disabled');
                $('.topShowError').remove();
            }else{
                $(".alLoginBtn").addClass('disabled');
            }
        }else if(!(val2.length>=6&&val2.length<=20)){
            comm.topShowPageError('密码长度请保持在6-20位！');
            $(".alLoginBtn").addClass('disabled');
        }else if(!psw.test(val2)){
            comm.topShowPageError('字母、数字或符号的组合');
            $(".alLoginBtn").addClass('disabled');
        }else{
            $(".alLoginBtn").addClass('disabled');
        }
    }).on('input propertychange',function(){
        val2 = $(this).val();
        val1 = $('[name=password]').val();
        if(psw1.test(val1)&&psw1.test(val2)){
            $(".alLoginBtn").removeClass('disabled');
            $('.topShowError').remove();
        }else{
            $(".alLoginBtn").addClass('disabled');
        }
        if(val2){
            $('#loginForm i.close').show();
        }
    });

    var Register = {
        form: '',
        submit: function () {

            var params = {};
            var data = {};
            var password=$("input[name=password]").val();
            data.password = password;
            data.customerId = comm.getpara().cid;
            data.resetSite = 2;
            data.itemId = comm.getpara().itemId;
            data.validCode = comm.getpara().validCode;
            data.validCodeId = comm.getpara().itemId;
            data.flag = 1;
            if(data.itemId==-1){
                alert("密码修改失败,请确保帐号正确！");
            }else{
                var rep=customer.execute("updatePassword",{flag:data.flag,itemId:data.itemId,"resetSite":2,password:data.password,customerId:data.customerId,validCode:comm.getpara().validCode,validCodeId:comm.getpara().itemId});
                if (rep) {
                    if (rep.responseStatus) {
                        popupFn('密码修改成功',3000, function(){
                            customer.execute("logout",null);

                            if(comm.isApp()){
                                comm.callAppLogin();
                            }else{
                                if(g_sps){
                                    g_sps.jump(null,"/pages/passport/loginV2/login.html");
                                }else{
                                    window.location.href = "/pages/passport/loginV2/login.html";
                                }

                            }
                        });
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
    };

    $(".alLoginBtn").on("click",function(){
        if(!$(this).hasClass('disabled')){
            if($('[name=password]').val()==$('[name=repassword]').val()){
                Register.submit();
            }else{
                comm.topShowPageError('密码不一致');
                $(".alLoginBtn").addClass('disabled');
            }
        }
    });

});

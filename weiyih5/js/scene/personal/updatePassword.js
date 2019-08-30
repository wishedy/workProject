/**
 * 功能描述：   修改密码
 * 使用方法:
 * 注意事件：
 * 引入来源：  作用：
 *
 * Created by LiChunHui on 2016/8/19.
 */
$(function(){
    //6-20位字母，数字，字符
    var chrnum = /^([\@A-Za-z0-9\!\#\$\%\^\&\*\.\~\,\.\/\?\>\<\:\;\+\-\_\|\'\"\\\=\`\(\)\{\}\[\]]+)$/;
    var url=M_CALL+'customer/unite/updatePasspord/';
    $(".icon-searchCancel").on("click",function(){
        $(this).prev().val("");
    });
    //返回埋点
    $('.ev_digHole').click(function(){
        comm.creatEvent({
            triggerType:'全站功能按钮点击',
            keyword:"返回",
            actionId:41,
            async:false
        });
    });
    $(".al-personalContent input").on("keyup",function(){
        var hasEmpty=false;
        $.each($(".al-personalContent input"),function(i,em){
            if(!$(em).val()){
                hasEmpty=true;
                return;
            }
        });
        if (hasEmpty) {
            $("#save").attr("on","false");
            $(".btn-primary-lg").addClass('al-msgWriting');
        }else{
            $("#save").attr("on","true");
            $(".btn-primary-lg").removeClass('al-msgWriting');
        }
    });
    $("#newPasswd").on("focus",function(){
        if(!$("#password").val()){
            popup("请输入当前密码");
            return;
        }
    });
    $("#rePassword").on("focus",function(){
        if(!$("#password").val()){
            popup("请输入当前密码");
        }
        if(!$("#newPasswd").val()){
            popup("请输入新密码");
        }
    });
    $('.ev_toggleEye').click(function(){
        if($(this).hasClass('eyeOpen')){
            $(this).addClass('eyeClose').removeClass('eyeOpen');
            $(this).siblings('input').attr('type','password');
        }else{
            $(this).addClass('eyeOpen').removeClass('eyeClose');
            $(this).siblings('input').attr('type','text');
        }
    });
    $("#save").on("click",function(){
        if($(this).attr("on")=="true"){
            var data={};
            data.password=$("#password").val();
            data.newPasswd=$("#newPasswd").val();
            data.oldPassword = $("#password").val();
            var rePassword=$("#rePassword").val();
            if(!data.password){
                popup("请输入当前密码");
            }else if(!chrnum.test(data.password)){
                popup("请输入正确的当前密码");
            }else if(!data.newPasswd){
                popup("请输入新的密码");
            }else if(!chrnum.test(data.newPasswd)){
                popup("请输入正确的新密码");
            }else if(data.newPasswd.length<6){
                popup("新密码长度应大于6位");
            }else if(data.newPasswd!=rePassword){
                popup("两次输入密码不一致");
            }else{
                $("#save").attr("on","false");
                comm.loading.show();
                var param={};
                param.paramJson= $.toJSON(data);
                $.ajax({
                    type : "post",
                    url : url,
                    data : param,
                    dataType : "json",
                    success : function(rep){
                        comm.loading.hide();
                        $("#save").attr("on","true");
                        if(rep && rep.responseObject.responseStatus){

                            popup("修改密码成功,请重新登录");
                            setTimeout(function(){
                                $.ajax({
                                    type: 'POST',
                                    url: M_CALL+"web/user/logout/",
                                    cache: false,
                                    dataType: 'json',
                                    success: function (rep) {
                                        if (rep && rep.responseObject && rep.responseObject.responseStatus) {
                                            TempCache.clear();
                                            comm.redirect("/pages/passport/loginV2/login.html");
                                        }
                                    },
                                    error: function (XMLHttpRequest, textStatus, errorThrown) {
                                    }
                                });
                            },1000)
                        }else{
                            popup(rep.responseObject.responseMessage);
                        }
                    },
                    error:function(){}
                });
            }
        }

    })
})


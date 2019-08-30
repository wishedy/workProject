/**
 * 功能描述：  帐号安全
 * 使用方法:
 * 注意事件：
 * 引入来源：  作用：
 *
 * Created by LiChunHui on 2016/8/18.
 */
$(function(){
    $.ajax({
        type : "post",
        url : "/mcall/customer/unite/getCustomerUnite/",
        data : {},
        dataType : "json",
        success : function(rep){
            if(rep&&rep.responseObject&&rep.responseObject.responseMessage){
                var unit=rep.responseObject.responseMessage;
                if(unit.uniteFlagWeixin>0){//微信绑定状态
                    $(".weixin_status").text("已绑定");
                }else{
                    $(".weixin_status").text("未绑定");
                }
                var mobile=unit.mobile;
                if(mobile){
                    $(".mobile").html(mobile.substr(0,3)+'****'+mobile.substr(7)+'<button class="btn-done mobile_btn">更换</button>');
                }else{
                    $(".mobile").html('<button class="btn-done mobile_btn">绑定</button>');
                }
                $(".mobile_btn").on("click",function(){
                    comm.redirect("/pages/personal/bindMobile.html");
                });
                var email=unit.email;
                if(email){
                    $(".email").html(email.substr(0,2)+"****@***"+email.substring(email.length-3)+'<button class="btn-done email_btn">更换</button>');
                    $(".email_btn").on("click",function(){
                        comm.redirect("/pages/personal/updateEmail.html?email="+email);
                    })
                }else{
                    $(".email").html('<button class="btn-done email_btn">绑定</button>');
                    $(".email_btn").on("click",function(){
                        comm.redirect("/pages/personal/bindEmail.html");
                    })
                }

                var caos=unit.uniteNameCaos;
                if(caos){
                    $(".caos_status").text("已绑定");
                }else{
                    $(".caos_status").text("去绑定");
                    $(".ev-bindCAOS").on("click",function(){
                        comm.redirect("/pages/personal/bindCAOS.html");
                    })
                }
            }
        },
        error:function(){}
    });

    $(".ev-updatePassword").on("click",function(){
        comm.redirect("/pages/personal/updatePassword.html");
    });
    $('.ev_digHole').click(function(){
        comm.creatEvent({
            triggerType:'全站功能按钮点击',
            keyword:"返回",
            actionId:41,
            async:false
        });
    });
});

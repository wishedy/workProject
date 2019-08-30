/**
 * 功能描述：  绑定caos
 * 使用方法:
 * 注意事件：
 * 引入来源：  作用：
 *
 * Created by LiChunHui on 2016/8/19.
 */
$(function() {
    $(".EV-userNameInput").on("focus", function() {
        $(".al-user").removeClass('icon-userNameNoInput').addClass('icon-userNameHasInput');
        $(".al-user").siblings('.icon-searchCancel').show();
    });
    $(".EV-userNameInput").on("blur", function() {
        if (!$(this).val()) {
            $(".al-user").addClass('icon-userNameNoInput').removeClass('icon-userNameHasInput');
            $(".al-user").siblings('.icon-searchCancel').hide();
        }
        $(".icon-searchCancel").hide();
    });
    $(".EV-pwInput").on("focus", function() {
        $(".al-pw").removeClass('icon-pwNoInput').addClass('icon-pwHasInput');
        $(".al-pw").siblings('.icon-searchCancel').show();
    });
    $(".EV-pwInput").on("blur", function() {
        if (!$(this).val()) {
            $(".al-pw").addClass('icon-pwNoInput').removeClass('icon-pwHasInput');
            $(".al-pw").siblings('.icon-searchCancel').hide();
        }
        $(".icon-searchCancel").hide();
    });

    $(".EV-changePwPattern").on("click", function() {
        if ($(this).hasClass('icon-pwCanWatch')) {
            $(this).removeClass('icon-pwCanWatch').addClass('icon-pwCanotWatch');
            $(".EV-pwInput").attr('type', 'password');
        } else {
            $(this).removeClass('icon-pwCanotWatch').addClass('icon-pwCanWatch');
            $(".EV-pwInput").attr('type', 'text');
        }
    });

    $("#password").on("keyup", function() {
        if ($(this).val().length===0) {
            $(".EV-changePwPattern").hide();
            $("#save").addClass('al-msgWriting');
        }else{
            $(".EV-changePwPattern").show();
            if($("#email").val().length===0){
                $("#save").addClass('al-msgWriting');
            }else{
                $("#save").removeClass('al-msgWriting');
            }
        }
    });
    $("#email").on("keyup", function() {
        if ($(this).val().length===0) {
            $("#save").addClass('al-msgWriting');
        }else{
            if($("#password").val().length===0){
                $("#save").addClass('al-msgWriting');
            }else{
                $("#save").removeClass('al-msgWriting');
            }
        }
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
    $(".icon-searchCancel").on("click", function() {
        $(this).siblings("input").val("");
        $(this).siblings("input").blur();
        $(".EV-changePwPattern").hide();
    });
    var phone = /^1\d{10}$/;
    var email = /^[\w-]+(\.[\w-]+)*@[\w-]+(\.[\w-]+)+$/;
    //6-20位字母，数字，字符
    var chrnum = /^([\@A-Za-z0-9\!\#\$\%\^\&\*\.\~\,\.\/\?\>\<\:\;\+\-\_\|\'\"\\\=\`\(\)\{\}\[\]]+)$/;
    var validCaosUserLogin = M_CALL + "customer/infocaos/validCaosUserLogin/";
    var createUserCaosBind = M_CALL + "customer/unite/createUserCaosBind/";
    $("#save").attr("on", "true");
    $("#save").on("click", function() {
        if ($(this).attr("on") == "true") {
            var data = {};
            data.email = $("#email").val();
            data.password = $("#password").val();
            if (!data.email) {
                popup("请输入CAOS用户名");
            } else if (!phone.test(data.email) && !email.test(data.email)) {
                popup("请输入正确的CAOS用户名");
            } else if (!data.password) {
                popup("请输入密码");
            } else if (!chrnum.test(data.password)) {
                popup("请输入正确的密码");
            } else {
                $("#save").attr("on", "false");
                var param = {};
                param.paramJson = $.toJSON(data);
                comm.loading.show();
                $.ajax({
                    type: "post",
                    url: validCaosUserLogin,
                    data: param,
                    dataType: "json",
                    success: function(rep) {
                        $("#save").attr("on", "true");
                        comm.loading.hide();
                        if (rep && rep.responseObject) {
                            var validCaos = rep.responseObject;
                            if (validCaos && validCaos.responseStatus) {
                                var caosId = validCaos.responseMessage.customerId;
                                createCaosBind = CommService.execute(createUserCaosBind, { "caosCustomerId": caosId });
                                if (createCaosBind && createCaosBind.responseStatus == true) {
                                    popup("绑定成功");
                                    setTimeout(function() {
                                        history.back(-1);
                                    }, 1000)
                                } else {
                                    popup(createCaosBind.responseMessage);
                                }
                            } else {
                                popup("用户名或密码错误");
                            }
                        }
                    },
                    error: function() {}
                });
            }
        }
    });
})

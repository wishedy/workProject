/**
 * 功能描述：  更换邮箱
 * 使用方法:
 * 注意事件：
 * 引入来源：  作用：
 *
 * Created by LiChunHui on 2016/9/1.
 */
$(function() {
    //返回埋点
    $('.ev_digHole').click(function(){
        comm.creatEvent({
            triggerType:'全站功能按钮点击',
            keyword:"返回",
            actionId:41,
            async:false
        });
    });
    var para = comm.getpara();
    var customerId = TempCache.getItem("userId");
    var email = para.email.substr(0,2)+"****"+para.email.substring(para.email.lastIndexOf("@"))
    $(".al-nowMailBox").text(email);
    var validatePassword = M_CALL + "customer/unite/validPasspord/"; //验证帐号
    var updateEmailUrl = M_CALL + "customer/unite/update_email/"; //修改邮箱
    var sendPasswordEmail = M_CALL + "customer/reset/password/sendPasswordEmail3/"; //发送邮件
    var email = /^[\w-]+(\.[\w-]+)*@[\w-]+(\.[\w-]+)+$/;
    //6-20位字母，数字，字符
    var chrnum = /^([\@A-Za-z0-9\!\#\$\%\^\&\*\.\~\,\.\/\?\>\<\:\;\+\-\_\|\'\"\\\=\`\(\)\{\}\[\]]+)$/;
    $("#save").attr("on", "true");
    $("#save").on("click", function() {
        if ($(this).attr("on") == "true") {
            var data = {};
            data.password = $("#password").val();
            var emailVal = $("#email").val();
            if (!data.password) {
                popup("请输入登录密码");
            } else if (!chrnum.test(data.password)) {
                popup("请输入正确的密码");
            } else if (!emailVal) {
                popup("请输入新邮箱地址");
            } else if (!email.test(emailVal)) {
                popup("请输入正确邮箱地址");
            } else {
                $("#save").attr("on", "false");
                var param = {};
                param.paramJson = $.toJSON(data);
                comm.loading.show();
                $.ajax({
                    type: "post",
                    url: validatePassword, //验证密码
                    data: param,
                    dataType: "json",
                    success: function(rep) {
                        $("#save").attr("on", "true");
                        comm.loading.hide();
                        if (rep && rep.responseObject) {
                            var validate = rep.responseObject;
                            if (validate && validate.responseStatus) {
                                $.ajax({
                                    type: "post",
                                    url: updateEmailUrl, //绑定邮箱
                                    data: { email: emailVal,isCheckEmail:0 },
                                    dataType: "json",
                                    success: function(rep) {
                                        if (rep && rep.responseObject) {
                                            var update = rep.responseObject;
                                            if (update && update.responseStatus) {
                                                //发送邮件
                                                CommService.asyncExecute(sendPasswordEmail, { customerId: customerId, resetSite: 7, email: emailVal, applySource: 2 }, function() {});
                                                comm.alertBox({
                                                    mTitle: "绑定成功!",
                                                    title: "验证链接已发至邮箱，验证后能帮助你快速找回密码",
                                                    ensure: "知道了",
                                                    ensureCallback: function() {
                                                        history.back(-1);
                                                    }
                                                });
                                            } else {
                                                if (rep && rep.responseObject.responseMessage) {
                                                    popup(rep.responseObject.responseMessage);
                                                } else {
                                                    popup("绑定失败！");
                                                }
                                            }
                                        }
                                    },
                                    error: function() {}
                                });
                            } else {
                                popup("密码错误");
                            }
                        }

                    },
                    error: function() {}
                });

            }
        }
    });
});

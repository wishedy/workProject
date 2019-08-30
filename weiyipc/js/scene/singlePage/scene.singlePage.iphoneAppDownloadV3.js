/**
 * 功能描述：
 * 使用方法:
 * 注意事件：
 * 引入来源：  作用：
 *
 * Created by LiChunHui on 2016/9/3.
 */
$(function() {
    $(".al-spreadContentInner").eq(0).addClass('animateOn');
    $(".al-spreadContentInner").each(function(index, el) {
        $(window).bind("scroll", function(e) {

            if ($(window).scrollTop() - $(el).offset().top > -500) {
                $(el).addClass('animateOn');
            }
        });
    });


    //倒计时
    function countdownGetMsg() {
        counting = true;
        var t = 60;
        $("#getmesg,#getmesg2").addClass("downland_but_disable");
        $("#getmesg,#getmesg2").addClass("downland_but_long");
        $("#getmesg,#getmesg2").text(t-- + "秒后重新获取");
        var a = setInterval(function () {
            if (t > 0) {
                $("#getmesg,#getmesg2").text(--t + "秒后重新获取");
            } else {
                clearInterval(a);
                $("#getmesg,#getmesg2").removeClass("downland_but_disable");
                $("#getmesg,#getmesg2").removeClass("downland_but_long");
                $("#getmesg,#getmesg2").text("重新发送");
                $("#getmesg,#getmesg2").on("click", getmsgHandle);
                counting = false;
            }
        }, 1000);
    }

     //发送短信
    function sendSms(val){
        $(".evInputPhone").removeClass("app_downland_err").html('');
        $(".evInputPhone").removeClass("app_error_red_icon_xc").html('');
        var timestamp = new Date().getTime();
        $.ajax({
            url:PC_CALL+"customer/verification/sendSms/",
            type:"POST",
            dataType:"json",
            data:{paramJson: $.toJSON({
                account:val,
                siteId:7,
                timestamp:timestamp,
                ALLINACCESSTOKEN: comm.allinaccesstoken(timestamp,val)
            })},
            success: function (data) {
                if(data && data.responseObject && data.responseObject.responseStatus){
                    //$(".downland_a").removeClass("downland_a_error");
                    $(".evInputPhone").removeClass("app_error_red_icon_xc").addClass("app_error_red_icon_succ");
                    $(".evInputPhone").html("已成功发送。请查看您的手机短信");
                    countdownGetMsg();
                }else{
                    if(data.responseObject.responseCode=="ERR_001"){
                        //alert('同一手机号，一天只能发送3次');
                        //$(".downland_a").addClass("downland_a_error");
                        $(".evInputPhone").removeClass("app_error_red_icon_succ").addClass("app_error_red_icon_xc");
                        $(".evInputPhone").html("<i class='icon-spreadErrorTips'></i>同一手机号，一天只能发送3次");
                        $("#getmesg,#getmesg2").text("重新发送");
                        $("#getmesg,#getmesg2").on("click", getmsgHandle);
                    }else{
                        //alert('发送失败，请稍后重试');
                        //$(".downland_a").addClass("downland_a_error");
                        $(".evInputPhone").removeClass("app_error_red_icon_succ").addClass("app_error_red_icon_xc");
                        $(".evInputPhone").html("<i class='icon-spreadErrorTips'></i>发送失败，请稍后重试");
                        $("#getmesg,#getmesg2").text("重新发送");
                        $("#getmesg,#getmesg2").on("click", getmsgHandle);
                    }

                }
            }
        });
    }


    $(".downland_but").on("click", getmsgHandle);

    //获取短信按钮点击事件处理方法
    function getmsgHandle() {
        $(".evInputPhone").removeAttr("style");

        $("#getmesg,#getmesg2").off("click");
        $("#getmesg,#getmesg2").addClass("downland_but_disable");

        var value = getValue();
        if(validateInput(value)){
            sendSms(value);
        }
        //事件埋点
        comm.creatEvent({
            triggerType:"产品引流",
            triggerName:"APP下载验证码获取",
            actionId:11028
        });
    }

    function getValue(){
        var input = $(".ev-inputVal");
        var value = "";
        input.each(function (index,obj) {
            if($(obj).val()!=""){
                value = $(obj).val();
            }
        });
        return value;
    }


    $(".downland_a input").on("change",function(){
        validateBtn(getValue());
    });

    function validateInput(value){
        if(value.match(/^1\d{10}$/)){
            $(".evInputPhone").html("");
            //$(".downland_a").removeClass("downland_a_error");
            return true;
        }else{
            $(".downland_but").on("click", getmsgHandle);
            //$(".downland_a").addClass("downland_a_error");
            $(".evInputPhone").removeClass("app_error_red_icon_succ").addClass("app_error_red_icon_xc");
            $(".evInputPhone").html("<i class='icon-spreadErrorTips'></i>请输入正确手机号码");
            return false;
        }
    }


    function validateBtn(value){
        if(value.match(/^1\d{10}$/)){
            $(".downland_but").removeClass("downland_but_disable");
            //$(".downland_a").removeClass("downland_a_error");
            return true;
        }else{
            //$(".downland_a").addClass("downland_a_error");
            $(".downland_but").on("click", getmsgHandle);
            $(".evInputPhone").removeClass("app_error_red_icon_succ").addClass("app_error_red_icon_xc");
            $(".evInputPhone").html("<i class='icon-spreadErrorTips'></i>请输入正确手机号码");
            $(".downland_but").addClass("downland_but_disable");
            return false;
        }
    }
});




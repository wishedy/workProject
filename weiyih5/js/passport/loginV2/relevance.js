/**
 * @name:
 * @desc: 快捷登录，输入手机号
 * @example:
 * @depend:
 * @date: 2017/12/11
 * @author: ALLIN
 */

$(function(){
    var relevance={
        path:{
              sendSms: M_CALL+"customer/verification/sendSms/",//发送验证码
              updateMobileUrl: M_CALL+"customer/unite/updateMobile/",//关联手机
              validateAccount: M_CALL+"customer/unite/validateCustomerAccount/"//验证帐号
        },
        init:function(){
            this.keyboard();
            this.clickRequest();
        },
        //键盘事件
        keyboard:function(){
            var t=this;
            //手机输入
            $(".ev-mobile").on("keyup",function(){
                $(this).val($(this).val().replace(/[^0-9]/g,''));
                if(($(this).val()).length>=11){
                    $(this).val($(this).val().substr(0,11));
                    $(this).blur();
                }
            })
                .on('blur',function(){
                    if(($(this).val()&&($(this).val()).length<11)||($(this).val()&&!/^1\d{10}$/.test($(this).val()))){
                        t.popup("请输入正确的手机号码");
                        $(".ev-mobileSumit,.ev-loginBtn")
                            .attr('isSubmit',false);

                    }else {
                        $(".ev-mobileSumit,.ev-loginBtn")
                            .attr('isSubmit',true);
                    }
                });
            //验证码输入
            $(".ev-validCode").on("keyup",function(){
                $(this).val($(this).val().replace(/[^0-9]/g,''));
                if ($(this).val().length>=4) {
                    $(this).val($(this).val().substring(0,4));
                    $(this).blur();
                }
            });
        },
        //点击事件
        clickRequest:function(){
            var t=this;
            //输入框点击x
            $(".inputBox i").off('click').on("click",function(){
                $(this).prev().val("");
            });
            //返回按钮
            $('.ev-back').off('clcik').on('click',function(e){
                e.preventDefault();
               history.back(-1);
            });
            //发送手机验证码
            $('.ev-mobileSumit').off('click').on('click',function(){
                if($(this).attr('isSubmit')=='true'){
                    $(this).attr('isSubmit',false);
                    if( $(this).data('num')!="0"){
                        // t.sendCode();
                        t.validateAccount();
                    }else{
                        t.popup("一天只能发送三次");
                    }
                }

            });
            //关联手机
            $('.ev-loginBtn').off('click').on('click',function(){
                if($(this).attr('isSubmit')=='true'){
                    $(this).attr('isSubmit',false);
                    // t.validateAccount();
                    t.submit()
                }
            });
        },
        //发送手机验证码
        sendCode:function(ele){
            var t=this;
            var mobile=$(".ev-mobile").val();
            if(!mobile){
                $(".ev-mobileSumit")
                    .attr('isSubmit',true);
                return false;
            }
            comm.loading.show();
            var param={};
			var timestamp = new Date().getTime();
            function allinaccesstoken(timestamp,phoneVal){
                return $.md5('dynamic.allinmd.cn/'+timestamp+'/'+phoneVal);
            }
            param.paramJson= $.toJSON({"siteId":2,typeId:2,"account":mobile,codeLength:4,timestamp:timestamp,ALLINACCESSTOKEN:allinaccesstoken(timestamp,mobile)});
            $.ajax({
                type : "post",
                url : t.path.sendSms,
                data : param,
                dataType : "json",
                success : function(rep){
                    if(rep && rep.responseObject.responseStatus){
                        $('.ev-mobileSumit').data('num',rep.responseObject.responseData.codeNum)
                        $(".ev-validCode").val("");
                        t.countdown();
                    }else{
                        $(".ev-mobileSumit")
                            .attr('isSubmit',true);
                        if( rep && rep.responseObject.responseMessage){
                            t.popup(rep.responseObject.responseMessage);
                        }else{
                            t.popup("发送失败！");
                        }
                    }
                    comm.loading.hide();
                },
                error:function(){}
            });
        },
        //倒计时
        countdown:function () {
            var timer = null;
            var num = 60;
            timer = setInterval(function () {
                num--;
                if (num == 0) {
                    clearInterval(timer);
                    $(".ev-mobileSumit").removeClass('timeYZM')
                        .text('重新获取')
                        .attr('isSubmit',true);
                }else {
                    $(".ev-mobileSumit").addClass('timeYZM').show()
                        .text(num+"s")
                        .attr('isSubmit',false);
                }
            }, 1000);
        },
        //提示弹窗
        popup:function (s) {
            if ($(".ev-commTips").length == 0) {

                $("body").append('<section class="al-middleTipsBox"><section class="al-middleTipsModal ev-commTips"><figure class="al-middleTipsModalText"><p class="tipText">' + s + '</p> </figure></section></section>');

                setTimeout(function() {
                    $(".ev-commTips").addClass('show')
                }, 100);
            } else {
                $(".ev-commTips").addClass('show');
                $(".tipText").text(s);
            }
            setTimeout(function() {
                $(".ev-commTips").removeClass('show');
                $('.ev-loginBtn').attr('isSubmit',true);
            }, 3000)
        },
        //验证帐号
        validateAccount:function () {
            var t=this;
            var mobile = $(".ev-mobile").val();
            var validCode=$(".ev-validCode").val();
            if(!mobile){
                $('.ev-loginBtn').attr('isSubmit',true);
                return false;
            }
            comm.loading.show();
            var param={"account":mobile,type:"mobile"};
            //param.paramJson= $.toJSON({"account":mobile,type:"mobile",customerId:localStorage.getItem('userId')});
            $.ajax({
                type : "GET",
                url : t.path.validateAccount,
                data : param,
                dataType : "json",
                success : function(rep){
                    if(!rep.responseObject){t.popup("绑定失败!");}
                    if(rep.responseObject.responseStatus){
                        t.sendCode();
                        // t.submit();
                    }else {
                        t.popup(rep.responseObject.responseMessage)
                    }
                    comm.loading.hide();
                },
                error:function(){}
            });
        },
        //关联手机
        submit:function () {
            var t=this;
            var mobile = $(".ev-mobile").val();
            var validCode=$(".ev-validCode").val();
            if(!(mobile&&validCode)){
                $('.ev-loginBtn').attr('isSubmit',true);
                return false;
            }
            comm.loading.show();
            var param={};
            param.paramJson= $.toJSON({"mobile":mobile,siteId:2,validCode:validCode});
            $.ajax({
                type : "post",
                url : t.path.updateMobileUrl,
                data : param,
                dataType : "json",
                success : function(rep){
                    var res=rep.responseObject;
                    if(!res){t.popup("绑定失败!");}
                    if(res.responseStatus){
                        t.popup("绑定成功!");
                       setTimeout(function () {
                           history.back(-1);
                       },1000)
                    }else{
                        if(res.responseMessage){
                            t.popup(res.responseMessage);
                        }else{
                            t.popup("绑定失败！");
                        }
                    }
                    comm.loading.hide();
                },
                error:function(){}
            });

            return false;
        }
    };
    relevance.init();
});
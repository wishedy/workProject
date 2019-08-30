/**
 * app 手机下载介绍页
 * Created by ZhangHongda on 2018/11/26.
 */
$(function () {
    var downLoadApp={
        init:function(){
            downLoadApp.sendLinkFn();
            downLoadApp.scroll();
            $('html,body').scrollTop(0);
        },
        sendLinkFn:function () {
            //填写非手机号进行替换
            $('.phoneNum').on('input',function () {
                $(this).val($(this).val().replace(/[^\d]/g,''));
            });
            //点击按钮发送下载链接
            $('.sendLinkBtn').off('click').on('click',function () {
                var timestamp = new Date().getTime();
                var _this = $(this);
                var phoneReg = /^1\d{10}$/;
                var TipDom = $(".phoneTip");
                if($(this).attr('data-isClick')==0){
                    if(!phoneReg.test($(this).parents('p').find('.phoneNum').val())){
                        TipDom.css('display','block');
                        TipDom.html("请输入正确手机号码");
                    }else{//防止重复点击，在接口请求成功之后可以再次点击
                        _this.attr('data-isClick',1);
                        $.ajax({
                            url:PC_CALL+"customer/verification/sendSms/",
                            type:"POST",
                            dataType:"json",
                            data:{paramJson: $.toJSON({
                                    account:_this.parents('p').find('.phoneNum').val(),
                                    siteId:7,
                                    timestamp:timestamp,
                                    ALLINACCESSTOKEN: comm.allinaccesstoken(timestamp,_this.parents('p').find('.phoneNum').val())
                                })},
                            success: function (data) {
                                if(data && data.responseObject && data.responseObject.responseStatus){
                                    TipDom.css('display','block');
                                    TipDom.css('display','block').html("已成功发送。请查看您的手机短信");
                                    var time = 60;
                                    var timer = setInterval(function () {
                                        if(time>0){
                                            time--;
                                            $('.sendLinkBtn').css('fontSize','13px');
                                            $('.sendLinkBtn').text(time+'s后重新发送');
                                        }else{
                                            $('.sendLinkBtn').css('fontSize','16px');
                                            $('.sendLinkBtn').text('发送链接');
                                            clearInterval(timer);
                                            _this.attr('data-isClick',0);
                                        }
                                    },1000);
                                }else{
                                    if(data.responseObject.responseCode=="ERR_001"){
                                        TipDom.css('display','block');
                                        TipDom.css('display','block').html("同一手机号，一天只能发送3次");
                                        _this.attr('data-isClick',0);
                                    }else{
                                        TipDom.css('display','block');
                                        TipDom.html("发送失败，请稍后重试");
                                        _this.attr('data-isClick',0);
                                    }
                                }
                            },
                            error:function () {
                                TipDom.css('display','block');
                                TipDom.html("发送失败，请稍后重试");
                                _this.attr('data-isClick',0);
                            }
                        });
                    }
                }
            });
        },
        scroll:function () {
            $(".al-spreadContentInner").eq(0).addClass('animateOn');
            $(".al-spreadContentInner").each(function(index, el) {
                $(window).bind("scroll", function(e) {
                    if ($(window).scrollTop() - $(el).offset().top > -500) {
                        $(el).addClass('animateOn');
                    }
                });
            });
            $('html,body').scrollTop(0);
        }
    };
    downLoadApp.init();
});
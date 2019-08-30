/**
 * 功能描述：  发现——反馈专题意见
 * 使用方法:
 * 注意事件：	
 * 引入来源：  作用：
 *
 * Created by QiangKaiLiang on 2016/09/01.
 */

$(function() {
    var DiscoverSendMsg = function() {
        var that = this;

        this.XHRList = {
            send: '/mcall/customer/suggestion/create/'
        };
    };
    DiscoverSendMsg.prototype = {
        init: function() {
            var that = this;
            this.inputGiveUp();
            this.messageCheck();
            $("#EV-sendMessageBtn").on("click", function(e) {

                if ($(this).hasClass('al-msgWriting')) {
                    return false;
                } else {
                    $("#EV-sendMessageBtn").unbind("click");
                    that.sendMessage($("#EV-userNeedSeminar").val());
                }
            });
        },
        sendMessage: function(text) {
            var data = {
                // customerId: localStorage.getItem('userId'),
                suggestion: text,
                siteId: 2,
                // customerName: localStorage.getItem('trueName'),
                suggestionType: 2
            };
            if (localStorage.getItem('userId')!==null) {
                data.customerId=localStorage.getItem('userId');
            }
            if (localStorage.getItem('trueName')!==null) {
                data.customerName=localStorage.getItem('trueName');
            }

            $.ajax({
                    url: this.XHRList.send,
                    type: 'POST',
                    dataType: 'json',
                    data: {
                        paramJson: $.toJSON(data)
                    },
                })
                .done(function(data) {
                    console.log(data);
                    if (data.responseObject.responseStatus) {

                        comm.alertBox({
                            title: "感谢您的反馈<br />我们会尽快处理",
                            ensure: "继续浏览",
                            ensureCallback: function() {
                                history.back();
                            }
                        });


                    } else {
                        sendError();
                    }
                })
                .fail(function() {
                    sendError();
                    console.log("error");
                });

        },
        inputGiveUp: function() {
            $("#EV-backToLast").on("click", function(e) {
                comm.creatEvent({
                    triggerType:'全站功能按钮点击',
                    keyword:"返回",
                    actionId:41,
                    async:false
                });
                e.preventDefault();
                if ($(".al-bottomSelectorListMask").hasClass('on')) {
                    return;
                }
                $(".al-bottomSelectorListMask").addClass('on');
            });

            $(".al-bottomSelectorListBox").on("click", function(e) {
                e.stopPropagation();
                if ($(e.target).hasClass('EV-continue') || $(e.target).hasClass('EV-cancel')) {
                    $(".al-bottomSelectorListMask").removeClass('on');
                    return false;
                } else if ($(e.target).hasClass('EV-giveUp')) {
                    $(".al-bottomSelectorListMask").removeClass('on');
                    history.back();
                }
            });
        },
        messageCheck: function() {
            $("#EV-userNeedSeminar").on("keyup", function() {
                if ($(this).val().length !== 0) {
                    $("#EV-sendMessageBtn").removeClass('al-msgWriting');
                    $(".EV-inputLengthTips").text(500 - parseInt($("#EV-userNeedSeminar").val().length));
                    if (parseInt($(this).val().length) > 450) {
                        $('.EV-inputLengthTips').show();
                        if (parseInt($(".EV-inputLengthTips").text()) < 0) {
                            $("#EV-sendMessageBtn").addClass('al-msgWriting');
                            $(this).val($(this).val().substring(0, 501));
                            $(".EV-inputLengthTips").text(0);
                            popup('不能超过500个字');
                            return false;
                        }
                    } else {
                        $('.EV-inputLengthTips').hide();
                    }
                } else {
                    $("#EV-sendMessageBtn").addClass('al-msgWriting');
                }

            });
        },
    };

    var discoverSendMsg = new DiscoverSendMsg();
    discoverSendMsg.init();
});

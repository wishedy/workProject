/**
 * 功能描述：评论（回复）提醒谁看功能
 * 使用方法: $("XXX").replyRemind({
 *              width:"865",//容器宽度
 *              customerId:"123",     //当前登录人customerId;
 *              callback:function(){}  //回调函数
 *           });
 * 注意事件：
 * 引入来源：  作用：
 *
 * Created by LiChunHui on 2015/2/28.
 */
;
(function($) {
    $.fn.extend({
        "replyRemind": function(options) {
            var $this = $(this);
            var controller = {
                config: {
                    myFellowSize: 100, //我的关注人列表
                    pageSize: 30, //默认列出10个搜索人的结果
                    maxNum: 10 //最大可以添加的提醒人数
                },
                path: {
                    myFellowUrl: PC_CALL + "customer/follow_people/json_list/",
                    remindUrl: PC_CALL + "customer/unite/json_list/"
                },
                el: {
                    remind: $this.find(".btn_place"), //存放提醒谁看button位置
                    remindText: $this.find(".remind_text") //存放提醒谁看显示位置
                },
                init: function(options) {
                    var t = this;
                    this.options = {};
                    var o = {
                        customerId: "",
                        callback: function() {}
                    }; //width:"864",
                    this.options = $.extend(o, options);
                    if (this.options.upload) {
                        var remindInput = $this.find(".remind_input");
                        t.inputChange(remindInput);
                        t.remove(remindInput);
                        t.docClick();
                    } else {
                        this.el.remind.append(t.template.remindHtml);
                        this.el.remindText.append(t.template.remindTextHtml);
                        this.el.remindText.css({
                            width: this.el.remindText.parent().width()
                        });
                        this.bindRemindBtn();
                        this.mouse();
                        $this.parents("form").on("submit", function() {
                            return false;
                        });
                    }
                },
                template: {
                    remindHtml: '<li class="remindBtn al-commentBtnItem">' +
                        '<i class="al-commentBtnImg al-commentAt"></i> 提醒' +
                        '</li>',
                    // remindTextHtml: '<article class="tx_who_look al-commentQuoteContent">' +
                    //     '<span class="tx_title">提醒谁看</span>' +
                    //     '<div class="tx_text remind_name">' +

                    //     '</div>' +
                    //     '<input type="text" class="remind_input" style="border: none;"/>' +
                    //     '<span class="tx_num" style="float: right;">（<span class="remind_num">0</span>/10）</span>' +
                    //     '<span class="clear"></span>' +
                    //     '<aside class="at_personal_name Ev_reCon">' +
                    //     '<ul class="remind_list">' +
                    //     /*'<li>'+
                    //         '<div class="at_search font_yahei">未找到相关用户</div>'+
                    //     '</li>'+*/
                    //     '</ul>' +
                    //     '</aside>' +
                    //     '</article>'
                    /*
                     *样式结构更新
                     *Fixed by qiangkailiang on 2016/08/17
                     */
                    remindTextHtml: '<article class="tx_who_look al-commentQuoteContent">' +
                        '<span class="tx_title al-replyTitle">提醒谁看</span>' +
                        '<div class="tx_text remind_name">' +

                        '</div>' +
                        '<input type="text" class="remind_input" style="border: none;"/>' +
                        '<span class="tx_num" style="float: right;">（<span class="remind_num">0</span>/10）</span>' +
                        '<span class="clear"></span>' +
                        '<section class="al-commentAtList Ev_reCon remind_list">' +
                        // Here's Content!
                        '</section>' +
                        '</article>'
                },
                getUser: function(data) {
                    var html = "";
                    var t=this;
                    $.each(data, function(i, val) {
                        userAuth = val.customer_auth;
                        if(val.customer_baseinfo.customerId!=$("#sesCustomerId").val()){
                            if(t.options.upload){
                                html += '<li customerid="' + val.customer_baseinfo.customerId + '">' +
                                '<div class="at_user_img"><img src="' + val.customer_att.logoUrl + '"></div>' +
                                '<div class="at_user_name font_yahei"><span>' + (userAuth.state >= 1 ? userAuth.lastName + userAuth.firstName : val.customer_baseinfo.nickname) + '</span>' + userAuth.company + '</div>' +
                                '<div class="clear"></div>' +
                                '</li>';
                            }else{
                                /*
                                 *样式结构更新
                                 *Fixed by qiangkailiang on 2016/08/17
                                 */
                                html += '<article class="al-commentAtUserItem" customerid="' + val.customer_baseinfo.customerId + '">' +
                                '<figure class="al-commentAtUserItemPic">' +
                                '<img src="' + val.customer_att.logoUrl + '" alt="">' +
                                '</figure>' +
                                '<figcaption class="al-commentAtUserMsg">' +
                                '<h2>' + (userAuth.state >= 1 ? userAuth.lastName + userAuth.firstName : val.customer_baseinfo.nickname) + '</h2>' +
                                '<span>' + userAuth.company + '</span>' +
                                '</figcaption>' +
                                '</article>';
                            }
                        }

                    });
                    return html;
                },
                //提醒的按钮
                bindRemindBtn: function() {
                    var t = this;
                    var remindInput = $this.find(".remind_input");
                    $(".remindBtn").on("mouseover", function() {
                        $(this).addClass("at_bg_hover");
                    });
                    $(".remindBtn").on("mouseout", function() {
                        $(this).removeClass("at_bg_hover");
                    });
                    $(".remindBtn").off("click").on("click", function() {
                        $(this).addClass("at_bg_hover");
                        t.el.remindText.show();
                        //remindInput.focus();
                        t.getInitUser();
                        return false;
                    });
                    t.inputChange(remindInput);
                    t.remove(remindInput);
                    t.docClick();
                },
                getInitUser: function() {
                    var t = this;
                    var data = {
                        pageIndex: 1,
                        pageSize: t.config.myFellowSize,
                        logoUseFlag: AttUseFlag.c
                    };
                    var param = {};
                    param.paramJson = $.toJSON(data);
                    $.ajax({
                        type: "post",
                        url: t.path.myFellowUrl,
                        data: param,
                        dataType: "json",
                        success: function(rep) {
                            if (rep && rep.responseObject.responseData.data_list && rep.responseObject.responseData.data_list.length > 0) {
                                $this.find(".Ev_reCon").show();
                                $this.find(".remind_list").html(t.getUser(rep.responseObject.responseData.data_list));
                                console.log(options);
                                t.hover();
                                t.userBindclick();
                            }
                        },
                        error: function() {

                        }
                    });
                },
                inputChange: function(obj) {
                    var t = this;

                    var flag = true;
                    var timer = null;
                    obj.on('compositionstart',function(){
                        flag = false;
                    });
                    obj.on('compositionend',function(){
                        flag = true;
                    });
                    obj.on("input propertychange",function(){
                        clearTimeout(timer);
                        timer=setTimeout(function(){
                            if(flag){
                                changeHandler();
                            }
                        },500);
                    });
                    function changeHandler() {
                        if (obj.val() !== "") {
                            if (t.options.upload) {
                                obj.attr("placeholder", "");
                                $this.find(".default_name").show().css("color", "#93badf");
                                $this.find(".remind_par").css("paddingTop", 23);
                            }
                            var data = {
                                useFlag: UseFlag.c,
                                //sessionCustomerId:t.options.customerId,
                                searchParam: obj.val(),
                                isCUnite: 0,
                                isCStatistics: 0,
                                isCFPeople: 0,
                                pageIndex: 1,
                                pageSize: t.config.pageSize,
                                isAuthState: 1
                            };
                            var param = {};
                            param.paramJson = $.toJSON(data);
                            $.ajax({
                                type: "post",
                                url: t.path.remindUrl,
                                data: param,
                                dataType: "json",
                                success: function(rep) {
                                    if (rep && rep.responseObject.responseData.data_list && rep.responseObject.responseData.data_list.length > 0) {
                                        $this.find(".Ev_reCon").show();
                                        $this.find(".remind_list").html(t.getUser(rep.responseObject.responseData.data_list));
                                        t.options.addDomCallback&&t.options.addDomCallback();
                                        t.hover();
                                        t.userBindclick();
                                    }

                                },
                                error: function() {

                                }
                            });
                        } else {
                            if (t.options.upload && $this.find(".remind_name span").length === 0) {
                                obj.attr("placeholder", "提醒谁看");
                                $this.find(".default_name").hide();
                                $this.find(".input_write01").css("top", 24);
                                $this.find(".remind_par").css("paddingTop", 13);
                            }
                        }
                    }

                },
                userBindclick: function() {
                    var t = this;
                    if(t.options.upload){
                        $this.find(".Ev_reCon li").each(function(i,em){
                            $(em).on("click",function(){
                                var has=false;
                                var len=$this.find(".remind_name span").length;
                                $this.find(".remind_name span").each(function(j,e){
                                    if($(this).attr("customerid")==$(em).attr("customerid")){
                                        $this.find(".remind_name em").eq(j).remove();
                                        $(this).remove();
                                        has=true;
                                        len--;

                                    }
                                });
                                if(!has&&len<10){
                                    /*if(len===0){
                                     $this.find(".remind_name").append('<span customerid="'+$(em).attr("customerid")+'">'+$(em).find("span").text()+'</span>');
                                     }else{*/
                                    $this.find(".remind_name").append('<span customerid="'+$(em).attr("customerid")+'">@'+$(em).find("span").text()+'</span><em></em>');
                                    //}
                                    len+=1;
                                }
                                $this.find(".remind_num").text(len);
                                $this.find(".remind_input").val("");
                                $this.find(".Ev_reCon").hide();
                                $this.find(".remind_list").empty();
                                t.options.callback()&&t.options.callback();
                                return false;
                                //$(this).addClass("hover");
                            });
                        });
                    }else{
                        $this.find(".Ev_reCon .al-commentAtUserItem").each(function(i, em) {
                            $(em).on("click", function() {
                                var has = false;
                                var len = $this.find(".remind_name span").length;
                                $this.find(".remind_name span").each(function(j, e) {
                                    if ($(this).attr("customerid") == $(em).attr("customerid")) {
                                        $this.find(".remind_name em").eq(j).remove();
                                        $(this).remove();
                                        has = true;
                                        len--;

                                    }
                                });
                                if (!has && len < 10) {
                                    /*if(len===0){
                                     $this.find(".remind_name").append('<span customerid="'+$(em).attr("customerid")+'">'+$(em).find("span").text()+'</span>');
                                     }else{*/
                                    $this.find(".remind_name").append('<span customerid="' + $(em).attr("customerid") + '">@' + $(em).find("h2").text() + '</span><em></em>');
                                    //}
                                    len += 1;
                                }
                                $this.find(".remind_num").text(len);
                                $this.find(".remind_input").val("");
                                $this.find(".Ev_reCon").hide();
                                $this.find(".remind_list").empty();
                                t.options.callback() && t.options.callback();
                                return false;
                                //$(this).addClass("hover");
                            });
                        });
                    }

                },
                hover: function() {
                    $this.find(".at_personal_name li").each(function(i, em) {
                        $(em).on("mouseover", function() {
                            $this.find(".Ev_reCon li").removeClass("hover");
                            $(this).addClass("hover");
                        });

                    });
                },
                docClick: function() {
                    var t=this;
                    $(document).bind("click", function() {
                        $this.find(".Ev_reCon").hide();
                        $this.find(".remind_list").empty();
                        if($('#case').length){
                            t.options.closeDomCallback&& t.options.closeDomCallback();
                        }

                    });
                },
                remove: function(obj) {
                    var t = this;
                    obj.keydown(function(ev) {
                        //alert(ev.keyCode);   //13:enter键,188:逗号
                        if (ev.keyCode == "13") {
                            ev.preventDefault();
                            return false;
                        } else if (ev.keyCode == "8") { //删除
                            if (obj.val() === "") {
                                var userList = $this.find(".remind_name span");
                                last = userList.eq(userList.length - 1);
                                if (userList.length > 0) {
                                    last.remove();
                                    $this.find(".remind_name em").eq(userList.length - 2).remove();
                                    $this.find(".remind_num").text(userList.length - 1);
                                    t.options.callback && t.options.callback();
                                }
                            }
                        }

                    });
                },
                mouse: function() {
                    $this.find(".tx_who_look").on("mouseover", function() {
                        $(this).addClass("tx_who_look_hover");
                    }).on("mouseout", function() {
                        $(this).removeClass("tx_who_look_hover");
                    });
                }
            };
            controller.init(options);
        }
    });
})(jQuery);
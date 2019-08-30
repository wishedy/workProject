/**
 * 功能描述：消息页面的列表
 * 使用方法:
 * 注意事件：
 * 引入来源：  作用：
 *
 * Created by HeJing on 2016/08/13.
 */

//选中删除样式
function mesSelectDelete() {
    var t = this,
        mesListStatus, mesSelDelBtn, mesListBox, mesDeleteBtn, mesDelNum, mesSelAll;
    mesListStatus = $(".Ev-mesListEditStatus"); //整个列表里有没有选中项
    mesSelDelBtn = $(".Ev-mesBottomSelectAllBtn"); //底部的全选删除按钮
    mesListBox = $(".Ev-mesListBox"); //单独每条的选中状态
    mesDeleteBtn = $(".Ev-mesDeleteBtn"); //删除按钮的样式
    mesDelNum = $(".Ev-mesDelNum"); //删除数
    mesSelAll = $(".Ev-mesSelectAllBtn"); //全选按钮
    //编辑按钮
    $("#EV-selectToDelete").off("click").on("click", function() {
        if ($(this).attr("data-flag") == 1) {
            $(this).text("取消").attr("data-flag", "0");
            $(".Ev-mesListEditStatus").attr("scrollPagination", "disabled");
            if (mesListStatus.hasClass('al-msgListConfigType')) { //整个列表里有没有选中项
                mesListStatus.removeClass('al-msgListConfigType'); //编辑小圆圈的不显示
                mesSelDelBtn.removeClass('show');
            } else {
                mesListStatus.addClass('al-msgListConfigType'); //小圆圈显示
                mesSelDelBtn.addClass('show');
            }
        } else { //取消后所有样式，都清除
            comm.creatEvent({
                triggerType:'全站功能按钮点击',
                keyword:"取消",
                actionId:45
            });
            $(".Ev-mesListEditStatus").attr("scrollPagination", "enabled");
            mesListStatus.removeClass('al-msgListConfigType');
            mesSelDelBtn.removeClass('show');
            $(this).text("编辑").attr("data-flag", "1");
            mesSelAll.attr("data-flag", "1").text("全选");
            mesDeleteBtn.removeClass('al-msgListDeleteHasItem'); //删除按钮的样式
            mesDelNum.text(""); //删除数
            mesListBox.removeClass("al-msgListItemDeleteSelected").attr("data-flag", "1"); //单条的点击可以选中
        }
    });

    //全选按钮
    mesSelAll.off("click").on("click", function() {
        if ($(this).attr("data-flag") == 1) { //全部选中
            $(this).attr("data-flag", "0").text("取消全选");
            mesListBox.addClass("al-msgListItemDeleteSelected").attr("data-flag", "0"); //单条加选中红色，单条的点击进行取消
            mesDeleteBtn.addClass('al-msgListDeleteHasItem'); //删除按钮的样式
            mesDelNum.text("(" + mesListBox.length + ")"); //删除数

        } else { //全不选
            comm.creatEvent({
                triggerType:'全站功能按钮点击',
                keyword:"取消全选",
                actionId:45
            });
            $(this).attr("data-flag", "1").text("全选");
            mesListBox.removeClass("al-msgListItemDeleteSelected").attr("data-flag", "1"); //单条的点击可以选中
            mesDeleteBtn.removeClass('al-msgListDeleteHasItem'); //删除按钮的样式
            mesDelNum.text(""); //删除数
        }
    });

    //单条选中
    var j, mesHoverListNum;
    $.each(mesListBox, function(i, e) {
        $(e).off("click").on("click", function(ev) {
            if ($("#EV-selectToDelete").attr("data-flag") == 0) {
                if ($(this).attr("data-flag") == 1) { //点击选中
                    $(this).addClass('al-msgListItemDeleteSelected').attr("data-flag", "0");
                    $(".Ev-mesDeleteBtn").addClass('al-msgListDeleteHasItem'); //删除按钮的样式
                    j = 0;
                    mesHoverListNum = parseInt(mesDelNum.text().match(/\d+/));
                    if (mesHoverListNum) { //选中的数字和当前的长度进行比较
                        mesHoverListNum++;
                        j = mesListBox.length;
                        if (mesHoverListNum == j) { //全选按钮
                            mesSelAll.attr("data-flag", "0").text("取消全选");
                        }
                        $(".Ev-mesDelNum").text("(" + mesHoverListNum + ")"); //删除数
                    } else {
                        j++;
                        if (j == mesListBox.length) {
                            mesSelAll.attr("data-flag", "0").text("取消全选");
                        }
                        $(".Ev-mesDelNum").text("(" + j + ")"); //删除数
                    }

                } else { //点击取消选中
                    $(this).removeClass('al-msgListItemDeleteSelected').attr("data-flag", "1");
                    if (mesSelAll.attr("data-flag") == 0) { //全部选中情况下取消
                        mesSelAll.attr("data-flag", "1").text("全选");
                        mesHoverListNum = mesListBox.length - 1;
                        if (mesHoverListNum == 0) {
                            $(".Ev-mesDeleteBtn").removeClass('al-msgListDeleteHasItem');
                            $(".Ev-mesDelNum").text("");
                        } else {
                            $(".Ev-mesDelNum").text("(" + mesHoverListNum + ")"); //删除数
                        }
                    } else { //不在全部选中的情况下
                        mesHoverListNum = parseInt(mesDelNum.text().match(/\d+/));
                        if (mesHoverListNum) { //之前有选中项
                            mesHoverListNum--;
                            if (mesHoverListNum == 0) {
                                $(".Ev-mesDeleteBtn").removeClass('al-msgListDeleteHasItem');
                                $(".Ev-mesDelNum").text("");
                            } else {
                                $(".Ev-mesDelNum").text("(" + mesHoverListNum + ")"); //删除数
                            }
                        }
                    }
                }
            } else {
                var messageIdListParam = $(this).attr("data-mesId");
                var oIndexUrl = $(this).find("a.Ev-mesPersonalCenter").attr("data-perCenter");
                if ($(this).attr("data-onePer")) { //一个人的时候
                    if (ev.target.nodeName === "A" || ev.target.nodeName === "IMG") {
                        //跳转个人首页
                        g_sps.jump($(this),oIndexUrl);
                    } else { //一个人的时候的终端页跳转，有未读做未读请求
                        if ($(this).attr("data-resUrl") != 1) {
                            //window.location = $(this).attr("data-resUrl");
                            g_sps.jump($(this),$(this).attr("data-resUrl"));
                        }
                        if ($(this).find(".icon-newTips").length) {
                            $.ajax({
                                url: "/mcall/customer/message/update3/",
                                data: {
                                    paramJson: $.toJSON({
                                        opTypeRules: 2,
                                        messageIdList: messageIdListParam,
                                        isRead: 1
                                    })
                                },
                                type: "POST",
                                dataType: "json",
                                success: function() {
                                    if (data && data.responseObject && data.responseObject.responseStatus) {
                                        //$(this).find(".icon-newTips").remove();
                                    }
                                }
                            });
                        } else {
                            if ($(this).attr("data-resUrl") != 1) {
                                g_sps.jump($(this),$(this).attr("data-resUrl"));
                            }
                        }

                    }
                } else if (ev.target.nodeName === "A") { //多个人的时候,请求医师列表
                    var data = {};
                    if(location.href.indexOf("message_follow.html") > 0){//关注提醒
                        data.reT = $(this).attr("data-resType");
                        data.rId = $(this).attr("data-resId");
                    }else{
                        data.opT = $(this).attr("data-opType");
                        data.reT = $(this).attr("data-resType");
                        data.rId = $(this).attr("data-resId");
                        data.cST = $(this).attr("data-cST");
                    }
                    data.count=$(this).attr("data-count");
                    mesDocListAjax(data);
                } else { //点击整条的时候，多人的时候
                    if ($(this).attr("data-resUrl") != 1) {
                        g_sps.jump($(this),$(this).attr("data-resUrl"));
                    }
                    if ($(this).find(".al-msgListTitleContent.al-msgListManyUserNews").length) {
                        $.ajax({
                            url: "/mcall/customer/message/update3/",
                            data: {
                                paramJson: $.toJSON({
                                    opTypeRules: 2,
                                    messageIdList: messageIdListParam,
                                    isRead: 1
                                })
                            },
                            type: "POST",
                            dataType: "json",
                            success: function() {
                                if (data && data.responseObject && data.responseObject.responseStatus) {
                                    $(this).find(".al-msgListTitleContent.al-msgListManyUserNews").removeClass("al-msgListManyUserNews");
                                }
                            }
                        });
                    } else {
                        if ($(this).attr("data-resUrl") != 1) {
                            g_sps.jump($(this),$(this).attr("data-resUrl"));
                        }
                    }
                }
            }

        });
    });


}
//确认删除弹层
function mesDeletePop(fn) {
    //底部删除按钮
    $(".Ev-mesDeleteBtn").off("click").on("click", function() {
        if ($(this).hasClass("al-msgListDeleteHasItem")) {
            $(".Ev-mesDeletePop").addClass('show').find("span.Ev-mesDelPopNum").text(parseInt($(".Ev-mesDelNum").text().match(/\d+/)));

        }
    });
    //删除取消
    $(".Ev-mesDelPopCancel").off("click").on("click", function() {
        $(".Ev-mesDeletePop").removeClass('show');
    });

    //确认删除
    var messageIdListArr = [];
    $(".Ev-mesConfirmDel").off("click").on("click", function() {
        $.each($(".Ev-mesListBox"), function(i, e) {
            if ($(e).attr("data-flag") == 0) {
                messageIdListArr.push($(e).attr("data-mesId"));
            }
        });
        var messageIdListParam = messageIdListArr.join("").substring(0,messageIdListArr.join("").lastIndexOf(","));
        var param = {};
        param.opTypeRules = 1;
        param.messageIdList = messageIdListParam;
        param.isValid = 0;
        var paramJson = $.toJSON(param);
        $.ajax({
            url: "/mcall/customer/message/update3/",
            type: "POST",
            data: { paramJson: paramJson },
            dataType: "json",
            success: function(data) {
                if (data && data.responseObject && data.responseObject.responseStatus) {
                    $(".Ev-mesDeletePop").removeClass('show');
                    $(".Ev-mesListBox.al-msgListItemDeleteSelected").addClass('delete');
                    setTimeout(function() {
                        $(".Ev-mesListBox.al-msgListItemDeleteSelected").remove();
                    }, 200);
                    $(".Ev-mesDeleteBtn").removeClass('al-msgListDeleteHasItem'); //删除样式
                    $(".Ev-mesDelNum").text(""); //删除样式
                    mesSelectDelete();
                    ////删除之后
                    var deNum=$(".al-msgListItemDeleteSelected").length;
                    var num=$(".Ev-mesListBox").length;
                    if (deNum==num) {
                        fn && fn();
                        $(".Ev-mesListEditStatus").removeClass('al-msgListConfigType');
                        $(".Ev-mesBottomSelectAllBtn").removeClass('show');
                        $("#EV-selectToDelete").text("编辑").attr("data-flag", "1");
                        $(".Ev-mesSelectAllBtn").attr("data-flag", "1").text("全选");
                        $(".Ev-mesListBox").removeClass("al-msgListItemDeleteSelected").attr("data-flag", "1"); //单条的点击可以选中
                    }

                }
            }
        });
    });

}

function mesDocListAjax(kv) {
    var mesDocPaBox = $(".Ev-mesDoctorListCon"), //医师列表展示的最外层
        mesContent = $(".Ev-mesContent").hide(); //消息列表的最外层
    var location = window.location;
    var pageIndex = 1,
        pageSize = 10;
    var param = {};
    param.logoUseFlag = 3;
    param.pageIndex = pageIndex;
    param.pageSize = pageSize;
    param.resourceType = kv.reT;
    param.refId = kv.rId;
    param.dataFlag = 2;
    param.messageType = 1;
    if(kv.opT){//赞了我的
        param.opType = kv.opT;
        param.opTypeRules = 2;
        param.comparMessageSrcTime=kv.cST;
    }else{  //提醒我看
        param.opTypeRules = 1;
        param.comparMessageSrcTime="";
    }
    var paramJson = $.toJSON(param);
    $.ajax({
        url: "/mcall/customer/message/getPeopleList/", //请求医师列表
        type: "POST",
        data: { paramJson: paramJson },
        dataType: "json",
        success: function(data) {
            if (data && data.responseObject && data.responseObject.responseData) {
                var items = data.responseObject.responseData.data_list;
                if(kv.opT){               //赞了我的
                    if(window.g_sps){
						g_sps.jump(null,"#&tab=doctorList&opT=" + kv.opT + "&reT=" + kv.reT + "&rId=" + kv.rId+"&cST="+kv.cST+"&cNum="+kv.count);
                    }else{
                        setTimeout(function(){
							g_sps.jump(null,"#&tab=doctorList&opT=" + kv.opT + "&reT=" + kv.reT + "&rId=" + kv.rId+"&cST="+kv.cST+"&cNum="+kv.count);
                        },200)
                    }
                 
                    optext=getOpConText(kv.opT);
                }else{                      //提醒我看
                    if(window.g_sps){
						g_sps.jump(null,"#&tab=doctorList&reT=" + kv.reT + "&rId=" + kv.rId+"&cNum="+kv.count);
                    }else{
                        setTimeout(function(){
							g_sps.jump(null,"#&tab=doctorList&reT=" + kv.reT + "&rId=" + kv.rId+"&cNum="+kv.count);
                        },200)
                    }
                    optext="评论了";
                }
                mesDocPaBox.show(); //医师列表展示
                $(".Ev-mesPerNum").text(kv.count + "人"); //几人
                $(".Ev-mesPerOpText").text(optext); //做了什么操作
                $(".Ev-mesDocContainer").css("margin-top", $(".Ev-indexHeader").outerHeight()); //列表加上margin-top
                mesContent.hide(); //消息列表隐藏
                mesDocListAddHtml(items);
                if (items.length < pageSize) { //医师列表的父元素
                    $(".Ev-mesAppDocListBox").attr("scrollPagination", "disabled");
                } else {
                    scrollPage(kv);
                }
            }
        }
    });
    //医师列表的返回
    $(".Ev-mesBackBtn").off("click").on("click", function() {
        window.location = location.pathname;
        mesDocPaBox.hide(); //医师列表隐藏
        mesContent.show(); //消息列表展示
    });

}

function mesDocListAddHtml(items, kv) {
    var html = "",
        medicalTitleParam;
    var arrHT = [];
    $.each(items, function(i, e) {
        var att = e.customer_att;
        var cAuth= e.customer_auth;
        arrHT.push(module.listTemplate({ tempName: "userList" })({
            cid: cAuth.customerId,
            customerId: TempCache.getItem("userId"),
            userName: cAuth.customerName,
            logoUrl: att.logoUrl,
            state: 2,
            medicalTitle: (/医师/.test(cAuth.medicalTitle)) ? comm.cutDoctorTitle(comm.cutLine(cAuth.medicalTitle, "_", ",")) : cAuth.medicalTitle,
            company: cAuth.company,
            relationship: cAuth.relation
        }));
    });
    if (kv) {
        $(".Ev-mesAppDocListBox").append(arrHT);
    } else {
        $(".Ev-mesAppDocListBox").html(arrHT);
    }
}

//瀑布流滚动
function scrollPage(kv) {
    var t = this;
    var pageIndex = 2,
        pageSize = 10;
    var param = {};
    param.logoUseFlag = 3;
    param.pageIndex = pageIndex;
    param.pageSize = pageSize;
    param.resourceType = kv.reT;
    param.refId = kv.rId;
    param.dataFlag = 2;
    param.messageType = 1;
    if(kv.opT){//赞了我的
        param.opType = kv.opT;
        param.opTypeRules = 2;
        param.comparMessageSrcTime=kv.cST;
    }else{  //提醒我看
        param.opTypeRules = 1;
        param.comparMessageSrcTime="";
    }
    $(".Ev-mesAppDocListBox").off("scroll").scrollPagination({
        'contentPage': "/mcall/customer/message/getPeopleList/",
        'contentData': $.extend(param, {
            pageIndex: function() {
                return pageIndex++;
            }
        }),
        'scrollTarget': $(window),
        'heightOffset': 0,
        'delaytime': 0,
        'type': "post",
        'beforeLoad': function() {
            comm.loading.show();
        },
        'afterLoad': function(elementsLoaded) {
            comm.loading.hide();
        },
        'loader': function(data) {
            if ($.isEmptyObject(data)) {
                $(".Ev-mesListEditStatus").attr("scrollPagination", "disabled");
                //alert("没有内容了");
                return false;
            } else {
                if ($.isEmptyObject(data.responseObject.responseData) || (data.responseObject.responseData.data_list && data.responseObject.responseData.data_list.length == 0)) {
                    $(".Ev-mesAppDocListBox").attr("scrollPagination", "disabled");
                    //alert("没有内容了");
                    return false;
                } else {
                    var items = data.responseObject.responseData.data_list;
                    mesDocListAddHtml(items, 1);
                }
            }
        }
    });
}

//资源类型，视频文库等
function getResourceCon(e) {
    var conText;
    switch (parseInt(e)) {
        case 1:
            conText = "视频";
            break;
        case 2:
            conText = "文库";
            break;
        case 4:
            conText = "话题";
            break;
        case 7:
            conText = "病例";
            break;
        case 8:
            conText = "评论";
            break;
    }
    return conText;
}
//操作类型文本，点赞了，评论了
function getOpConText(e) {
    var conText = "";
    switch (parseInt(e)) {
        case 0:
            conText = "发布了";
            break;
        case 1:
            conText = "评论了";
            break;
        case 2:
            conText = "转发了";
            break;
        case 3:
            conText = "收藏了";
            break;
        case 4:
            conText = "分享了";
            break;
        case 5:
            conText = "赞了";
            break;
        case 6:
            conText = "更新了";
            break;
    }
    return conText;
}
(function(){
    $('.ev_digHole').click(function(){
        comm.creatEvent({
            triggerType:'全站功能按钮点击',
            keyword:"返回",
            actionId:41,
            async:false
        });
    });
}());

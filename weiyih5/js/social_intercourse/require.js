/***
 * 固定格式：
 * 最热id:EQ_hotReplyList
 * 最新id:EQ_newReplyList
 * 提示:EQ_Flag
 * 类型(隐藏域中id):relationType  1-视频、2-文库 3-会议
 * 资源ID(隐藏域中id):resourceId
 */

$(function () {

    //*****实现
    var refId = $("#resourceId").val();
    var relationType = $("#relationType").val();

    //用于全部评论
    if (refId == undefined || relationType == undefined) {
        refId = $.getUrlParam("refId");
        relationType = $.getUrlParam("relationType");
        if (refId == null || relationType == null) location.href = "/index.html";
    }
    var praiseReviewType = parseInt($("#preferReviewType").val()); //赞回复类型
    var webParams = {refId: refId, relationType: relationType, praiseReviewType: praiseReviewType};
    //全部评论页Tab
    $("#EQ_replyTab li").on("tap", function () {
        $(this).addClass("comment_hover").siblings().removeClass("comment_hover");
        if ($(this).index() == 1) {
            hotReply($("#EQ_hotReplyList"), webParams, "waterfall");
            $("#EQ_hotReplyList").show();
            $("#EQ_newReplyList").hide();
        } else {
            newReply($("#EQ_newReplyList"), webParams, "waterfall");
            $("#EQ_newReplyList").show();
            $("#EQ_hotReplyList").hide();
        }
    })

    //作分支处理，用于区分初始化采用的方式
    if (window.location.pathname == "/pages/comm/all_reply.html") {
        $("#EQ_replyTab li:eq(0)").trigger("tap");
    } else {
        hotReply($("#EQ_hotReplyList"), webParams);//最热评论 EQ_hotReplyList
        newReply($("#EQ_newReplyList"), webParams);//最新评论 $("#EQ_newReplyList");
    }
})

var comm = {
    ajax: function (url, params) {
        var dataJson = {};
        var _this = this;
        $.ajax({
            url: url,
            type: "post",
            data: params,
            async: false,
            success: function (data) {
                if (!data.responseObject.responseStatus) return false;
                if (!_this.isEmptyObject(data.responseObject.responseData))
                    dataJson = data.responseObject.responseData;
            }
        });
        return dataJson;
    },
    isEmptyObject: function (obj) {
        for (var i in obj) {
            return false;
        }
        return true;
    },
    TITLE_TEXT: {
        END: "没有内容了",
        LOAD: "正在加载..."
    },
    isValExist: function (obj) {
        if (this.isEmptyObject(obj) || obj.length == 0) {
            return false;
        }
        return true;
    }
}

//模版
function template(el, replySrc) { //标识防冲突
    var authedHtml = "";
    var imgList = "";
    var imgListHtml = "";
    if (el.attatchmentList.length > 0) {
        var className = "";
        switch (el.attatchmentList.length){
            case 1:
                className = "li-one";
                break;
            case 4:
                className = "li-four";
                break;
            default:
                className = "li-nine";
                break;
        }
        $.each(el.attatchmentList, function (obj, index) {

            imgList += '<li class="' + className + '"><img src="' + obj.attUrl + '" /></li>';
        })
        imgListHtml = '  <div class="comm_detail">' +
            '            <ul class="commentImgs">' + imgList + '</ul></div>';

    }
    if (el.isVerify) authedHtml = "<div class=\"vip_img_who\"><img src=\"//img50.allinmd.cn/personal_v2/vip@2x.png\"></div>";//"<div class=\"authed\"><img src=\"//img50.allinmd.cn/v3/video-detail/authed.png\" alt=\"\"/></div>";
    return "<li>" +
        "<div class=\"hot_c_l\"><a href=\"/allin/personal/app/#/index?cid=" + el.customerId + "\" data-ajax=\"false\"><img src=\"" + el.logoUrl + "\" /></a>" +
        authedHtml +
        "</div>" +
        "<div class=\"hot_c_r EQ_listCurrParent_" + replySrc + "_" + el.identity + "\" >" +
        "<div class=\"hot_c_name\"><a href=\"/allin/personal/app/#/index?cid=" + el.customerId + "\" data-ajax=\"false\">" + el.nickname + "</a></div>" +
        "<div class=\"hot_c_time\">" + el.publishTime + "</div><div class=\"clear\"></div>" +
        "<div class=\"hot_c_text\">" + el.reviewContent + "</div>" +
        "<div class=\"hot_c_look EQ_" + replySrc + "_" + el.identity + "\" data-cid='" + el.customerId + "'></div>" +

        "</div>" + imgListHtml +
        "<div class=\"clear\"></div>" +
        "</li>";

}

//适配
function adapter(kv) {
    var nickname = kv.customer_auth.lastName + kv.customer_auth.firstName;
    var attatchmentList = [];

    if (typeof kv.customer_review_insite_attachment != "undefined") {
        attatchmentList = kv.customer_review_insite_attachment;
    }
    return {
        logoUrl: comm.isValExist(kv.customer_att.logoUrl) ? kv.customer_att.logoUrl : "//img00.allinmd.cn/default/customer/35_35.jpg",//默认头像地址
        isVerify: kv.customer_auth.state != -1 ? true : false,
        nickname: comm.isValExist(nickname) ? nickname : "匿名用户",
        upNum: comm.isValExist(kv.customer_review.upNum) ? kv.customer_review.upNum : 0,
        refId: kv.customer_review.refId, //当前页的资源ID
        reviewId: kv.customer_review.id,
        parentId: kv.customer_review.id,
        customerId: kv.customer_review.customerId,
        publishTime: diffDay_one(kv.customer_review.publishTime, local_time()),
        reviewContent: kv.customer_review.reviewContent,
        isChildrenReply: kv.customer_review.parentId > 0 ? true : false,
        attatchmentList: attatchmentList
    }
}

/***
 *  最热最新评论
 *  targetDOM : 处理目标DOM位置,类型：对象
 *  refId : 资源id
 *  sortType : 1(最新) 2(最热)
 *  src : 类型：字符。分支来源分两类：瀑布与非瀑布。默认非瀑布
 * */
function hotReply(targetDOM, webParams, src) { //最热评论
    var url = "/mcall/customer/review/json_list/", params = {};
    if (src == "waterfall") {
        params = {useFlag: 1, logoUseFlag: 3, logoUseFlag: 3, refId: webParams.refId, sortType: 2, reviewType: webParams.relationType, pageIndex: 1, pageSize: 5, reviewStatus: 1};
        waterfallPage(url, params, targetDOM, webParams, "hotReply");
    } else {
        params = {useFlag: 1, logoUseFlag: 3, refId: webParams.refId, sortType: 2, reviewType: webParams.relationType, pageIndex: 1, pageSize: 10, reviewStatus: 1};
        DataController(comm.ajax(url, params), targetDOM, webParams, "hotReply");
    }
}

function newReply(targetDOM, webParams, src, where, pageSizeChange) { //最新评论
    var targetDOM = $("#EQ_newReplyList"), params = {};
    var url = "/mcall/customer/review/json_list/";
    if (src == "waterfall") {
        params = {useFlag: 1, logoUseFlag: 3, refId: webParams.refId, sortType: 1, reviewType: webParams.relationType, pageIndex: 1, pageSize: 5, reviewStatus: 1};
        waterfallPage(url, params, targetDOM, webParams, "newReply");
    } else {    //终端页
        params = {useFlag: 1, logoUseFlag: 3, refId: webParams.refId, sortType: 1, reviewType: webParams.relationType, pageIndex: 1, pageSize: 10, reviewStatus: 1};
        if (pageSizeChange != undefined) params.pageSize = 10;
        DataController(comm.ajax(url, params), targetDOM, webParams, "newReply", where);
    }
}

/**
 * 数据集中处理
 * dataJson : json数据
 * targetDOM : 目标处理位置
 * 其中需要注意，接入relation.js作社交处理
 * */

hotNumSingleton = 0, newNumSingleton = 0, hotRunStatus = false, newRunStatus = false;
function DataController(dataJson, targetDOM, webParams, replySrc, where) {
    if ($("#replyAnchor").length > 0 && replySrc == "newReply" && $("#replyAnchor").attr("lock") == "on" && where != "refresh") {
        return false;
    }
    ;

    //在终端页是否显示查看更多评论 最新＋最热或是最新＝10条就可以显示，否则隐掉
    if ($("#replyAnchor").length > 0) { //终端页识别，如果是终端页开始计数
        if (replySrc == "hotReply") {
            hotRunStatus = true;
            if (!isEmptyObject(dataJson)) hotNumSingleton = dataJson.data_list.length;
        } else if (replySrc == "newReply" && $("#replyAnchor").attr("lock") != "on") {
            newRunStatus = true;
            if (!isEmptyObject(dataJson)) newNumSingleton = dataJson.data_list.length;
        }
        //if(hotRunStatus && newRunStatus)
        //if(hotNumSingleton+newNumSingleton<10) //$(".all_comment_but").hide();
    }

    if (isEmptyObject(dataJson) && replySrc == "hotReply") { //当最热无数据时作处理
        if ($("#hotReply").length > 0) {  //终端页处理
            $("#hotReply").hide();
            //如果最热评论无记录，最新评论请求10条记录去加载 去重新请求newReply()方法
            newReply(targetDOM, webParams, "noWaterfall", where, "pageSizeChange"); //最后个参数后加用来改变pageSize记录数
        } else {
            $("#EQ_hotReplyList").html("<div class=\"no_comment\">暂时还没有最热评论哦！</div>")
            $(".EQ_Flag").hide();
        }
    }

    if (isEmptyObject(dataJson) && replySrc == "newReply") { //当最新无数据时作处理
        if ($("#replyAnchor").length > 0 && $("#notDataTips").length == 0) { //终端页处理
            $("#appRefReply>.c_text_input").prepend("<div id=\"notDataTips\" class=\"no_comment\">暂时还没有评论哦！</div>");
        }
    }

    if (comm.isEmptyObject(dataJson)) return false;
    var temp, identity = Math.floor(Math.random() * new Date().getTime());

    if (where == "refresh") {
        //如果最新中存在数据就根据最新中的数据补差值
        var newLen = $("#newReply").find("li").length;
        var gap = 10 - newLen;
        params = {useFlag: 1, logoUseFlag: 3, refId: webParams.refId, sortType: 1, reviewType: webParams.relationType, pageIndex: 1, pageSize: gap, reviewStatus: 1};
        var dataJson = comm.ajax("/mcall/customer/review/json_list/", params);

        if (gap == dataJson.data_list.length) //$(".all_comment_but").show();
            targetDOM.empty();
    }

    $.each(dataJson.data_list, function (i, el) { //事实是当有最新最热时冲突

        var kv = adapter(el);
        kv.identity = identity++; //强行介入
        temp = template(kv, replySrc);
        targetDOM.append(temp);
        var relationHtml = $(temp).find(".EQ_" + replySrc + "_" + kv.identity) //EQ_listRelation_
            .relation({
                type: 3,
                cid: kv.customerId,
                parentId: kv.parentId,
                refId: webParams.refId, //页面资源id
                reviewId: kv.reviewId,//赞回复id
                reviewType: webParams.praiseReviewType, //赞回复类型
                relationType: webParams.relationType,
                listIsChat: kv.isChildrenReply,
                listPraiseTotal: kv.upNum,
                isList: true
            });

        //$(".EQ_"+replySrc+"_"+kv.identity).remove();
        $(".EQ_listCurrParent_" + replySrc + "_" + kv.identity).append(relationHtml);
    })

    //外围if用来控制下终端页中 最新二次提交后的数据堆叠
    if ($("#replyAnchor").length > 0 && replySrc == "newReply") $("#replyAnchor").attr("lock", "on"); //锁

}

//引入scrollpagination.js 作瀑布流处理
function waterfallPage(url, paramJson, targetDOM, webParams, replySrc) {
    targetDOM.empty();

    var scrollpage = 1;
    paramJson.pageIndex = function () {
        return scrollpage++;
    };
    targetDOM.scrollPagination({
        'contentPage': url,
        'contentData': paramJson,
        'scrollTarget': $(window),
        'heightOffset': 0,
        'beforeLoad': function () {
        },
        'afterLoad': function (elementsLoaded) {
        },
        'loader': function (D) {
            if (!D.responseObject.responseStatus) {
                if ($("#hotReply").length == 0) {
                    $("#EQ_hotReplyList").html("<div class=\"no_comment\">暂时还没有最热评论哦！</div>")
                    $(".EQ_Flag").hide();
                }
                return false;
            }

            var data = D.responseObject.responseData;
            if (comm.isEmptyObject(data)) {
                targetDOM.siblings(".EQ_Flag").html(comm.TITLE_TEXT.END);
                targetDOM.attr('scrollPagination', 'disabled');
                return false;
            } else {
                if (data.data_list.length < paramJson.pageSize) {
                    targetDOM.siblings(".EQ_Flag").html(comm.TITLE_TEXT.END);
                    targetDOM.attr('scrollPagination', 'disabled');
                } else {
                    targetDOM.siblings("#EQ_Flag").html(comm.TITLE_TEXT.LOAD);
                }
            }
            DataController(data, targetDOM, webParams, replySrc);
        }
    });
};

;
(function ($) {
    $.getUrlParam = function (name) {
        var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
        var r = window.location.search.substr(1).match(reg);
        if (r != null)
            return unescape(r[2]);
        return null;
    }
})(jQuery);



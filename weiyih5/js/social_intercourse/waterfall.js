$(function(){
    //用于让右侧悬浮向上下消失
    if($('#dialogCheck').length>0){
        var screenMoiety = $(window).height()/3;
        $(window).on("scroll",function(){
            if($("#videoMp4Src").length>0){  //视频时
                var arrowStopRegion = $("#replyAnchor").offset().top;
                var scrollPosition = $(window).scrollTop();
                if(scrollPosition>arrowStopRegion){
                    $(".floatArr").show();
                }else{
                    $(".floatArr").hide();
                }
            }else{ //其它页
                var arrowStopRegion = $("#EQ_fiexdRelation").offset().top;
                var scrollPosition = screenMoiety+$(window).scrollTop();
                if(scrollPosition>arrowStopRegion){
                    $(".floatArr").show();
                }else{
                    $(".floatArr").hide();
                }
            }
        });
        //向上向下结构输出
        if($(".floatArr").length===0){ //向上向下     ///kkkkkkk修改pageINDEX-1 显示  pageIndex-1>0 &&
            $("body").append(floatArr()).find(".up-arr").on("tap",function(){ //正向
                //置到回复处
                var top = $("#EQ_newReplyList").offset().top-$($(".more_xx_title")[1]).height();
                window.scrollTo(0, top);
            }).siblings(".reply-arr").on("tap",function(){
                $("#anchor").trigger("tap");
            }).siblings(".down-arr").off("tap").on("tap",function(){ // 反向
                window.scrollTo(0,$(document).height());
            });
        }
    }else{


            var webParams = {
                refId : $("#resourceId").val(),
                relationType : $("#relationType").val(),
                replyUp : false         //是否置顶回复
            };

             //评论图片事件绑定
            $("body").on("vclick",".commentImgs li",function(){
                $(this).picShowComment({open:$(this).index()});
                return false;
            });

            hotReply($("#EQ_hotReplyList"),webParams);
            allReply($("#EQ_newReplyList"),webParams);

            //用于让右侧悬浮向上下消失
            var screenMoiety = $(window).height()/3;
            $(window).on("scroll",function(){
                if($("#videoMp4Src").length>0){  //视频时
                    var arrowStopRegion = $("#replyAnchor").offset().top;
                    var scrollPosition = $(window).scrollTop();
                    if(scrollPosition>arrowStopRegion){
                        $(".floatArr").show();
                    }else{
                        $(".floatArr").hide();
                    }
                }else{ //其它页
                    var arrowStopRegion = $("#EQ_fiexdRelation").offset().top;
                    var scrollPosition = screenMoiety+$(window).scrollTop();
                    if(scrollPosition>arrowStopRegion){
                        $(".floatArr").show();
                    }else{
                        $(".floatArr").hide();
                    }
                }
            });

            //向上向下结构输出
            if($(".floatArr").length===0){ //向上向下     ///kkkkkkk修改pageINDEX-1 显示  pageIndex-1>0 &&
                $("body").append(floatArr()).find(".up-arr").on("tap",function(){ //正向
                    //清除向上划动时的提示 显示向下划动提示
                    $("#upTips").remove();
                    $("#EQ_Flag").show();
                    //解锁正向 锁定反向
                    $("#EQ_newReplyList").attr('scrollPagination', 'enabled');
                    $("#EQ_newReplyList").attr('reverseScrollPagination', 'disabled');

                    //置到回复处
                    var top = $("#EQ_newReplyList").offset().top-$($(".more_xx_title")[1]).height();
                    window.scrollTo(0, top);

                    //重新刷新
                    $("#EQ_newReplyList").empty(); // 清空
                    var webParams = {
                        refId : $("#resourceId").val(),
                        relationType : $("#relationType").val(),
                        replyUp : true
                    };
                    allReply($("#EQ_newReplyList"),webParams);

                }).siblings(".reply-arr").on("tap",function(){
                    $("#anchor").trigger("tap");
                }).siblings(".down-arr").off("tap").on("tap",function(){ // 反向
                    //解锁反向 锁定正向
                    $("#EQ_newReplyList").attr('reverseScrollPagination', 'enabled');
                    $("#EQ_newReplyList").attr('scrollPagination', 'disabled');
                    //
                    var kk = $("#EQ_Flag").clone();
                    ////境加向上划动时的提示 隐藏向下划动提示
                    if($("#upTips").length===0){
                        $("#EQ_newReplyList").before(kk.find(".no_comment").attr("id","upTips").text("上拉加载更多"));
                        $("#EQ_Flag").hide();
                    }

                    //清空
                    var url = "/mcall/customer/review/json_list/";
                    var params = {
                        scene:2,
                        attUseFlag:3,
                        logoUseFlag:3,
                        dataFlag:1,
                        refId: $("#resourceId").val(),
                        sortType:1,
                        reviewType:$("#relationType").val(),
                        pageIndex:1,
                        pageSize:20,
                        reverse:1, //倒序
                        reviewStatus:1};

                    reverseWaterfallPage(url,params,$("#EQ_newReplyList"),$(window).scrollTop());

                    upLoadData(url,params,targetDOM,true);       //true为是否初始化时
                    var count = 1;
                    params.pageIndex = function(){
                        return count++;
                    }

                    window.onscroll = function(){
                        if(window.pageYOffset<targetDOM.offset().top){
                            upLoadData(url,params,targetDOM,false);
                        }
                    }
                    window.scrollTo(0,$(document).height());
                });
            }

    }

});

function hotReply(targetDOM,webParams){ //热门评论
    var url = "/mcall/customer/review/json_list/",params={};
    params = {
        scene:2,
        logoUseFlag:3,
        attUseFlag:3,
        dataFlag:1,
        refId:webParams.refId,
        sortType:2,
        reviewType:webParams.relationType,
        pageIndex:1,
        pageSize:5,
        reviewStatus:1};

    $.ajax({
        url : url,
        type : "post",
        data : params,
        success : function(data){
              if(!data.responseObject.responseStatus){$("#hotReply").hide(); return false;}
                  else{
                    var html="";
                    $.each(data.responseObject.responseData.data_list,function(i,el){
                        //循环追加数据
                        var kv = adapter(el);
                        html = template(kv,"hotReply");
                        targetDOM.append(html);

                        var temp = $(html).find(".EQ_allReply_"+kv.reviewId)
                            .relation({
                                type:3,
                                cid : kv.customerId,
                                parentId : kv.parentId,
                                refId : $("#resourceId").val(), //页面资源id
                                reviewId : kv.reviewId,//赞回复id
                                reviewType : $("#relationType").val(), //赞回复类型
                                relationType : $("#relationType").val(),
                                listIsChat:kv.isChildrenReply,
                                listPraiseTotal:kv.upNum,
                                isList : true
                            });
                        $(".EQ_allReply_"+kv.reviewId).append(temp);   //$(temp).html()
                    })

                  }
        }
    })
}

function allReply(targetDOM,webParams){ //全部评论
    var url = "/mcall/customer/review/json_list/",params={};
        params = {
            scene:2,
            logoUseFlag:3,
            attUseFlag:3,
            dataFlag:1,
            refId:webParams.refId,
            sortType:1,
            reviewType:webParams.relationType,
            pageIndex:1,
            pageSize:20,
            reviewStatus:1};

        waterfallPage(url,params,targetDOM,webParams);
}

//模版
function template(el,replySrc){ //标识防冲突
    var authedHtml = "";
    if(el.isVerify) authedHtml = "<div class=\"vip_img_who\"><img src=\"//img50.allinmd.cn/personal_v2/vip@2x.png\"></div>";//"<div class=\"authed\"><img src=\"//img50.allinmd.cn/v3/video-detail/authed.png\" alt=\"\"/></div>";
     var imgListHtml = "", imgList = "";

    if(el.attachmentList.length>0){

        var className = "";
        switch (el.attachmentList.length){
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
        $.each(el.attachmentList, function (index,obj) {
            imgList += '<li class="' + className + '"><img src="'+ obj.attUrl +'" attWidth="'+ obj.originalAttWidth +'" attHeight="'+ obj.originalAttHeight +'" title="'+ el.reviewContent +'" /></li>';
        });
        imgListHtml = '  <div class="comm_detail"><ul class="commentImgs">' + imgList + '<div class="clear"></div></ul></div>';

    }
    return "<li>"+
        "<div class=\"hot_c_l\"><a href=\"/allin/personal/app/#/index?cid="+el.customerId+"\" data-ajax=\"false\"><img src=\""+el.logoUrl+"\" /></a>"+
        authedHtml+
        "</div>"+
        "<div class=\"hot_c_r EQ_listCurrParent_"+replySrc+"_"+el.reviewId+"\" >"+
        "<div class=\"hot_c_name\"><a href=\"/allin/personal/app/#/index?cid="+el.customerId+"\" data-ajax=\"false\">"+el.nickname+"</a></div>" +
        "<div class=\"hot_c_time\">"+el.publishTime+"</div><div class=\"clear\"></div>"+
        "<div class=\"hot_c_text\">"+el.reviewContent+"</div>"+   imgListHtml +
        "<div class=\"hot_c_look EQ_"+replySrc+"_"+el.reviewId+"\" data-cid='"+el.customerId+"'></div>"+
        "</div>"+
        "<div class=\"clear\"></div>"+
        "</li>";

}

        //function floatArr(){ //悬浮箭头
        //    return "<div class=\"floatArr\">" +
        //        "<div class=\"up-arr\">评论顶部</div>"+
        //        "<div class=\"reply-arr\">评论</div>"+
        //        "<div class=\"down-arr\">评论底部</div>"+
        //        "</div>";
        //}

//适配
function adapter(kv){
    var nickname = kv.customer_auth.lastName+kv.customer_auth.firstName;
     var  attachmentList = []  ;
    if(typeof kv.customer_review_insite_attachment != "undefined" && kv.customer_review_insite_attachment.length>0 && kv.customer_review.reviewStatus!=3){
        attachmentList =  kv.customer_review_insite_attachment;
    }

    return {
        logoUrl : isValExist(kv.customer_att.logoUrl)?kv.customer_att.logoUrl:"//img00.allinmd.cn/default/customer/35_35.jpg",//默认头像地址
        isVerify : kv.customer_auth.state!=-1?true:false,
        nickname : isValExist(nickname)?nickname:"匿名用户",
        upNum : isValExist(kv.customer_review.upNum)?kv.customer_review.upNum:0,
        refId : kv.customer_review.refId, //当前页的资源ID
        reviewId : kv.customer_review.id,
        parentId : kv.customer_review.id,
        customerId : kv.customer_review.customerId,
        publishTime : diffDay_one(kv.customer_review.publishTime,local_time()),
        reviewContent : htmlToString(nConverBr(kv.customer_review.reviewContent)).replace(/&lt;br\/&gt;/g,'<br/>'),
        isChildrenReply : (kv.customer_review.parentId>0 || kv.customer_review.reviewNum>0)?true:false,
        attachmentList:attachmentList
    }
}

function DataController(data,paramJson,pageIndex,targetDOM,webParams){
    var html = "";
    $.each(data,function(i,el){
        var kv = adapter(el);
        html = template(kv,"allReply");
        targetDOM.append(html);
        targetDOM.find(".commentImgs img").each(function () {
            if($(this).parent().hasClass("li-one")){
                $(this).on("load", function () {
                    DrawImage(this,175,175);
                })
            }
            if($(this).parent().hasClass("li-four")){
                $(this).on("load", function () {
                    DrawImage(this,120,120);
                })
            }
            if($(this).parent().hasClass("li-nine")){
                $(this).on("load", function () {
                    DrawImage(this,85,85);
                })
            }
        });
        var temp = $(html).find(".EQ_allReply_"+kv.reviewId) //EQ_listRelation_
            .relation({
                type:3,
                cid : kv.customerId,
                parentId : kv.parentId,
                refId : $("#resourceId").val(), //页面资源id
                reviewId : kv.reviewId,//赞回复id
                reviewType : $("#relationType").val(), //赞回复类型
                relationType : $("#relationType").val(),
                listIsChat:kv.isChildrenReply,
                listPraiseTotal:kv.upNum,
                isList : true
            });
        $(".EQ_allReply_"+kv.reviewId).html(temp);

    });
    //如果是触发正向时 置到回复顶端
    if(webParams.replyUp){
        var top = targetDOM.offset().top-$($(".more_xx_title")[1]).height();
        window.scrollTo(0, top);
        webParams.replyUp = false;
    }

    //条件符合时显示
    if(pageIndex-1>0){$(".floatArr").show();}

}

//引入scrollpagination_reverse.js 作正向处理
function reverseWaterfallPage(url,paramJson,targetDOM,placeTop){  //正向
    targetDOM.empty();

    var scrollpage=1;
    paramJson.pageIndex = function(){
        return scrollpage++;
    };
    var placeTop = placeTop;
    targetDOM.reverseScrollPagination({
        'contentPage' : url,
        'contentData' : paramJson,
        'scrollTarget' : $(window),
        'heightOffset' : 0,
        'beforeLoad' : function() {
        },
        'afterLoad' : function(elementsLoaded) {
        },
        'loader' : function(data) {

            if(!data.responseObject.responseStatus) {
                $("#upTips").remove();
                $("#EQ_Flag").show().find(".no_comment").text("没有数据了！");
                targetDOM.attr('reverseScrollPagination', 'disabled');
                return false;
            }
//
//            /**
//             * 1.点击评论按钮，有时候反应慢或不出现回复输入框                                  V
//             2.点击评论按钮，在有的手机上没有呼出键盘，有的手机上呼出键盘挡住了输入框。            V
//             3.评论底部，向上加载时，新加载的评论不是平滑的出现，会让用户不知道刚才看到哪里了       Ｖ
//             4.懒加载一次应该20条，现在不够20条                                              V
//             5.查看对话中，回复评论，会锁住屏幕                                              V
//             6.回复输入框，需支持回车换行，现在输入了回车，在显示时没有换行                       V
//             7.发布成功后，动效显示该评论去了页尾，页面应该继续留在原处浏览。（等待和陈丽沟通确认）  v
//             * **/
//
            var data = data.responseObject.responseData;
            if ($.isEmptyObject(data)) {
                $("#upTips").remove();
                $("#EQ_Flag").show().find(".no_comment").text("没有数据了！");
                targetDOM.attr('reverseScrollPagination', 'disabled');
                return false;
            }else{
                if(data.data_list.length<paramJson.pageSize){
                    $("#upTips").remove();
                    $("#EQ_Flag").show().find(".no_comment").text("没有数据了！");
                    targetDOM.attr('reverseScrollPagination', 'disabled');
                }
            }

            var html="",forHeight=0;
            for(var i=data.data_list.length-1;i>-1;i--){
                var kv = adapter(data.data_list[i]);

                //追加结构
                html = template(kv,"allReply");
                if($(".EQ_listCurrParent_allReply_"+kv.reviewId).length==0){
                    targetDOM.prepend(html);
                };

                //防止连续点击追加
                if($(".EQ_allReply_"+kv.reviewId).length==1){
                    var temp = $(html).find(".EQ_allReply_"+kv.reviewId)
                        .relation({
                            type:3,
                            cid : kv.customerId,
                            parentId : kv.parentId,
                            refId : $("#resourceId").val(), //页面资源id
                            reviewId : kv.reviewId,//赞回复id
                            reviewType : $("#relationType").val(), //赞回复类型
                            relationType : $("#relationType").val(),
                            listIsChat:kv.isChildrenReply,
                            listPraiseTotal:kv.upNum,
                            isList : true
                        });

                    $(".EQ_allReply_"+kv.reviewId).append(temp);   //$(temp).html()
                }


                //计录这次循环数据的总高度
                forHeight += targetDOM.find("li:eq(0)").height();//统计滚动完的数据总高度
            };

            //条件符合时显示
            if(scrollpage>1){$(".floatArr").show();}

            $.each(data.data_list,function(i,el){
                //循环追加数据
                var kv = adapter(el);
                html = template(kv,"allReply");
                targetDOM.prepend(html);

                var temp = $(html).find(".EQ_allReply_"+kv.reviewId) //EQ_listRelation_
                    .relation({
                        type:3,
                        cid : kv.customerId,
                        parentId : kv.parentId,
                        refId : $("#resourceId").val(), //页面资源id
                        reviewId : kv.reviewId,//赞回复id
                        reviewType : $("#relationType").val(), //赞回复类型
                        relationType : $("#preferReviewType").val(),
                        listIsChat:kv.isChildrenReply,
                        listPraiseTotal:kv.upNum,
                        isList : true
                    });
                $(".EQ_allReply_"+kv.reviewId).append($(temp).html());
            })

            //debugger;
            //var top = targetDOM.offset().top-$($(".more_xx_title")[1]).height()+$(window).height();
            var top = 0;

            var upCountHeight = $(document).height()-targetDOM.height();
            if(scrollpage==2){
               top = $(document).height();
            }else{
               top = upCountHeight+forHeight;//文档高度＋加载数据高度
            }

            window.scrollTo(0, top); //placeTop
        }
    });
};

//引入scrollpagination.js 作瀑布流处理
function waterfallPage(url,paramJson,targetDOM,webParams){  //正向
    targetDOM.empty();

    var scrollpage=1;
    paramJson.pageIndex = function(){
        return scrollpage++;
    };

    targetDOM.scrollPagination({
        'contentPage' : url,
        'contentData' : paramJson,
        'scrollTarget' : $(window),
        'heightOffset' : 0,
        'beforeLoad' : function() {
        },
        'afterLoad' : function(elementsLoaded) {
        },
        'loader' : function(data) {

            if(!data.responseObject.responseStatus || $.isEmptyObject(data)) {
                targetDOM.attr('scrollPagination', 'disabled');
                if(targetDOM.find("li").length == 0){
                    targetDOM.siblings("#EQ_Flag").html("<div class=\"no_comment\">暂时还没有评论哦！</div>")
                }else{
                    targetDOM.siblings("#EQ_Flag").html("<div class=\"no_comment\">没有更多了~</div>");
                }
                return false;
            }
            var data = data.responseObject.responseData;
            if ($.isEmptyObject(data)) {
                targetDOM.siblings("#EQ_Flag").html("<div class=\"no_comment\">没有更多了~</div>");
                targetDOM.attr('scrollPagination', 'disabled');
                return false;
            }else{
                if(data.data_list.length<paramJson.pageSize){
                    targetDOM.siblings("#EQ_Flag").html("<div class=\"no_comment\">没有更多了~</div>");
                    targetDOM.attr('scrollPagination', 'disabled');
                }else{
                    targetDOM.siblings("#EQ_Flag").html("<div class=\"no_comment\">正在加载，请稍候</div>");
                }
            }
            DataController(data.data_list,paramJson,scrollpage,targetDOM,webParams);
        }
    });
};


function upLoadData(url,params,targetDOM,isInit){   //反向 用于上拉时加载数据
    $.ajax({
        url : url,
        type : "post",
        data : params,
        success : function(data){
            if(!data.responseObject.responseStatus){return false;}
            else{
                var html="";
                $.each(data.responseObject.responseData.data_list,function(i,el){
                    //循环追加数据
                    html += template(adapter(el),"allReply");
                })
                targetDOM.prepend(html);
            }
            if(isInit){window.scrollTo(0,$(document).height());} //初始倒序时 置到文档底端
        },
        timeout:5000,
        error:function(){
            popup("oops~看起来你断网了");
        }
    })
}



function floatArr(){ //悬浮箭头
    return "<div class=\"floatArr\">" +
            "<div class=\"up-arr\">评论顶部</div>"+
            "<div class=\"reply-arr\">评论</div>"+
            "<div class=\"down-arr\">评论底部</div>"+
        "</div>";
}
function nConverBr(text){
    return text.split("\n").join("<br>");
}
function isValExist(obj){
    if($.isEmptyObject(obj) || obj.length == 0){
        return false;
    }
    return true;
}
